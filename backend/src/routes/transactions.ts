import { Router, Request, Response } from 'express';
import { query } from '../db/pool.js';
import { authenticateToken, requireCanMutate } from '../middleware/auth.js';
import { transactionLimiter } from '../middleware/rateLimiter.js';
import { cacheService } from '../services/redis.js';

export const transactionsRouter = Router();

// Apply auth to all transaction routes
transactionsRouter.use(authenticateToken);
// Apply transaction rate limiter (100 req / hour)
transactionsRouter.use(transactionLimiter);

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get list of transactions (accessible to all roles, filtered by user unless admin)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 15
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [date, amount]
 *         default: date
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         default: DESC
 *     responses:
 *       200:
 *         description: Paginated transaction list
 */
transactionsRouter.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const {
      page = 1,
      limit = 15,
      type,
      categoryId,
      search,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'DESC',
      userId, // Admin can query a specific user's transactions
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(1000, Math.max(1, parseInt(limit as string, 10) || 15));
    const offset = (pageNum - 1) * limitNum;

    // Build parameterized query securely (preventing SQL injection)
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // RBAC: Standard user & read-only user can ONLY view their own transactions
    if (user.role !== 'admin') {
      conditions.push(`t.user_id = $${paramIndex++}`);
      values.push(user.id);
    } else if (userId) {
      conditions.push(`t.user_id = $${paramIndex++}`);
      values.push(parseInt(userId as string, 10));
    }

    if (type && (type === 'income' || type === 'expense')) {
      conditions.push(`t.type = $${paramIndex++}`);
      values.push(type);
    }

    if (categoryId) {
      conditions.push(`t.category_id = $${paramIndex++}`);
      values.push(parseInt(categoryId as string, 10));
    }

    if (startDate) {
      conditions.push(`t.date >= $${paramIndex++}`);
      values.push(startDate);
    }

    if (endDate) {
      conditions.push(`t.date <= $${paramIndex++}`);
      values.push(endDate);
    }

    if (search && typeof search === 'string') {
      conditions.push(`t.description ILIKE $${paramIndex++}`);
      values.push(`%${search.trim()}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Validate sort column and order against allowed whitelists
    const validSortCols: Record<string, string> = { date: 't.date', amount: 't.amount' };
    const sortCol = validSortCols[sortBy as string] || 't.date';
    const orderDirection = (sortOrder as string).toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Count query for total pagination
    const countSql = `SELECT COUNT(*) FROM transactions t ${whereClause};`;
    const countResult = await query(countSql, values);
    const total = parseInt(countResult.rows[0].count, 10);

    // Data query joining categories and users
    const dataSql = `
      SELECT 
        t.id,
        t.user_id,
        u.name as user_name,
        u.email as user_email,
        t.category_id,
        c.name as category_name,
        c.color as category_color,
        c.icon as category_icon,
        t.type,
        t.amount::FLOAT,
        TO_CHAR(t.date, 'YYYY-MM-DD') as date,
        t.description,
        t.created_at
      FROM transactions t
      JOIN users u ON t.user_id = u.id
      LEFT JOIN categories c ON t.category_id = c.id
      ${whereClause}
      ORDER BY ${sortCol} ${orderDirection}, t.id DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++};
    `;

    const dataValues = [...values, limitNum, offset];
    const dataResult = await query(dataSql, dataValues);

    res.json({
      data: dataResult.rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
      },
    });
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction (Restricted to admin and user roles)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, amount, date]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               category_id:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created
 *       403:
 *         description: Forbidden for read-only users
 */
transactionsRouter.post(
  '/',
  requireCanMutate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { type, amount, date, category_id, description, user_id } = req.body;

      if (!type || !amount || !date) {
        res.status(400).json({ error: 'Type, amount, and date are required.' });
        return;
      }

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        res.status(400).json({ error: 'Amount must be a positive number.' });
        return;
      }

      if (!['income', 'expense'].includes(type)) {
        res.status(400).json({ error: 'Type must be "income" or "expense".' });
        return;
      }

      // If admin specified user_id, use it, else default to current user's id
      const targetUserId = (req.user!.role === 'admin' && user_id) ? user_id : req.user!.id;

      const result = await query(
        `INSERT INTO transactions (user_id, category_id, type, amount, date, description)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, user_id, category_id, type, amount::FLOAT, TO_CHAR(date, 'YYYY-MM-DD') as date, description, created_at;`,
        [targetUserId, category_id || null, type, parsedAmount, date, description ? description.trim() : '']
      );

      // Invalidate Redis analytics cache for this user
      await cacheService.invalidateUserAnalytics(targetUserId);

      res.status(201).json({
        message: 'Transaction created successfully',
        data: result.rows[0],
      });
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      res.status(500).json({ error: 'Failed to create transaction' });
    }
  }
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update an existing transaction (Restricted to admin and user roles)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction updated
 *       403:
 *         description: Forbidden for read-only users or modifying another user's record
 */
transactionsRouter.put(
  '/:id',
  requireCanMutate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const transactionId = parseInt(req.params.id as string, 10);
      const { type, amount, date, category_id, description } = req.body;

      // Check transaction existence and ownership
      const existing = await query('SELECT user_id FROM transactions WHERE id = $1', [transactionId]);
      if (existing.rows.length === 0) {
        res.status(404).json({ error: 'Transaction not found.' });
        return;
      }

      const txOwnerId = existing.rows[0].user_id;
      if (req.user!.role !== 'admin' && txOwnerId !== req.user!.id) {
        res.status(403).json({ error: 'You do not have permission to edit this transaction.' });
        return;
      }

      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        res.status(400).json({ error: 'Amount must be a positive number.' });
        return;
      }

      const result = await query(
        `UPDATE transactions
         SET type = $1, amount = $2, date = $3, category_id = $4, description = $5, updated_at = NOW()
         WHERE id = $6
         RETURNING id, user_id, category_id, type, amount::FLOAT, TO_CHAR(date, 'YYYY-MM-DD') as date, description, updated_at;`,
        [type, parsedAmount, date, category_id || null, description ? description.trim() : '', transactionId]
      );

      // Invalidate Redis analytics cache for this user
      await cacheService.invalidateUserAnalytics(txOwnerId);

      res.json({
        message: 'Transaction updated successfully',
        data: result.rows[0],
      });
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      res.status(500).json({ error: 'Failed to update transaction' });
    }
  }
);

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction (Restricted to admin and user roles)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction deleted
 *       403:
 *         description: Forbidden for read-only users or deleting another user's record
 */
transactionsRouter.delete(
  '/:id',
  requireCanMutate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const transactionId = parseInt(req.params.id as string, 10);

      // Check ownership
      const existing = await query('SELECT user_id FROM transactions WHERE id = $1', [transactionId]);
      if (existing.rows.length === 0) {
        res.status(404).json({ error: 'Transaction not found.' });
        return;
      }

      const txOwnerId = existing.rows[0].user_id;
      if (req.user!.role !== 'admin' && txOwnerId !== req.user!.id) {
        res.status(403).json({ error: 'You do not have permission to delete this transaction.' });
        return;
      }

      await query('DELETE FROM transactions WHERE id = $1', [transactionId]);

      // Invalidate Redis analytics cache
      await cacheService.invalidateUserAnalytics(txOwnerId);

      res.json({ message: 'Transaction deleted successfully', id: transactionId });
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      res.status(500).json({ error: 'Failed to delete transaction' });
    }
  }
);
