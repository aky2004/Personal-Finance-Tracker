import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import { authRouter } from './routes/auth.js';
import { categoriesRouter } from './routes/categories.js';
import { transactionsRouter } from './routes/transactions.js';
import { analyticsRouter } from './routes/analytics.js';
import { usersRouter } from './routes/users.js';
import { pool } from './db/pool.js';
import { redis } from './services/redis.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// 1. Security & Standard Middlewares
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Swagger UI to load scripts/styles locally
    crossOriginEmbedderPolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. Swagger / OpenAPI Interactive Documentation (MoneyMatter Obsidian Dark Theme)
const swaggerCustomCss = `
  /* MoneyMatter Obsidian Dark Theme for Swagger UI */
  body {
    background-color: #0b0908 !important;
    color: #f2efe9 !important;
    font-family: 'Manrope', system-ui, -apple-system, sans-serif !important;
  }
  .swagger-ui {
    background-color: #0b0908 !important;
    color: #f2efe9 !important;
  }
  .swagger-ui .topbar {
    background-color: #100e0c !important;
    border-bottom: 1px solid #24211d !important;
    padding: 14px 0 !important;
  }
  .swagger-ui .topbar .topbar-wrapper {
    max-width: 1200px !important;
    margin: 0 auto !important;
    padding: 0 24px !important;
  }
  .swagger-ui .topbar .topbar-wrapper a {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    text-decoration: none !important;
  }
  .swagger-ui .topbar .topbar-wrapper a::before {
    content: "M";
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #7355be, #9376de);
    color: #ffffff;
    font-weight: 900;
    font-size: 15px;
    border-radius: 9px;
    box-shadow: 0 4px 14px rgba(115, 85, 190, 0.4);
  }
  .swagger-ui .topbar .topbar-wrapper a::after {
    content: "MoneyMatter API Documentation";
    color: #ffffff;
    font-weight: 800;
    font-size: 16px;
    letter-spacing: -0.02em;
  }
  .swagger-ui .topbar .topbar-wrapper a img {
    display: none !important;
  }
  .swagger-ui .info {
    margin: 32px 0 !important;
  }
  .swagger-ui .info .title {
    color: #ffffff !important;
    font-weight: 900 !important;
    font-size: 32px !important;
    letter-spacing: -0.03em !important;
  }
  .swagger-ui .info p, .swagger-ui .info li {
    color: #8c857b !important;
    font-size: 13.5px !important;
    line-height: 1.6 !important;
  }
  .swagger-ui .scheme-container {
    background-color: #141210 !important;
    border: 1px solid #24211d !important;
    border-radius: 16px !important;
    box-shadow: none !important;
    padding: 16px 24px !important;
    margin-bottom: 28px !important;
  }
  .swagger-ui .opblock-tag {
    color: #ffffff !important;
    border-bottom: 1px solid #24211d !important;
    font-size: 17px !important;
    font-weight: 800 !important;
    padding: 16px 0 10px !important;
    margin-bottom: 14px !important;
  }
  .swagger-ui .opblock-tag small {
    color: #8c857b !important;
    font-size: 12px !important;
  }
  .swagger-ui .opblock {
    background-color: #141210 !important;
    border: 1px solid #24211d !important;
    border-radius: 14px !important;
    box-shadow: none !important;
    margin: 0 0 12px !important;
    overflow: hidden !important;
    transition: border-color 0.15s ease !important;
  }
  .swagger-ui .opblock:hover {
    border-color: #38332c !important;
  }
  .swagger-ui .opblock .opblock-summary {
    border-color: #24211d !important;
    padding: 12px 18px !important;
  }
  .swagger-ui .opblock .opblock-summary-method {
    border-radius: 8px !important;
    font-weight: 800 !important;
    font-size: 12px !important;
    font-family: 'JetBrains Mono', monospace !important;
    padding: 5px 12px !important;
    text-shadow: none !important;
  }
  .swagger-ui .opblock.opblock-post {
    border-color: #24211d !important;
    background: #141210 !important;
  }
  .swagger-ui .opblock.opblock-post .opblock-summary-method {
    background: #4cc38a !important;
    color: #0b0908 !important;
  }
  .swagger-ui .opblock.opblock-get {
    border-color: #24211d !important;
    background: #141210 !important;
  }
  .swagger-ui .opblock.opblock-get .opblock-summary-method {
    background: #7355be !important;
    color: #ffffff !important;
  }
  .swagger-ui .opblock.opblock-put {
    border-color: #24211d !important;
    background: #141210 !important;
  }
  .swagger-ui .opblock.opblock-put .opblock-summary-method {
    background: #f59e0b !important;
    color: #0b0908 !important;
  }
  .swagger-ui .opblock.opblock-delete {
    border-color: #24211d !important;
    background: #141210 !important;
  }
  .swagger-ui .opblock.opblock-delete .opblock-summary-method {
    background: #ef6a57 !important;
    color: #ffffff !important;
  }
  .swagger-ui .opblock.opblock-patch {
    border-color: #24211d !important;
    background: #141210 !important;
  }
  .swagger-ui .opblock.opblock-patch .opblock-summary-method {
    background: #9376de !important;
    color: #ffffff !important;
  }
  .swagger-ui .opblock .opblock-summary-path {
    color: #f2efe9 !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 13px !important;
    font-weight: 600 !important;
  }
  .swagger-ui .opblock .opblock-summary-description {
    color: #8c857b !important;
    font-size: 12px !important;
  }
  .swagger-ui .opblock-body {
    background-color: #100e0c !important;
  }
  .swagger-ui .opblock-section-header {
    background-color: #141210 !important;
    border-bottom: 1px solid #24211d !important;
    padding: 10px 18px !important;
  }
  .swagger-ui .opblock-section-header h4 {
    color: #f2efe9 !important;
    font-weight: 700 !important;
  }
  .swagger-ui table thead tr th, .swagger-ui table thead tr td {
    color: #8c857b !important;
    border-color: #24211d !important;
    font-size: 12px !important;
  }
  .swagger-ui .parameter__name {
    color: #f2efe9 !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 600 !important;
  }
  .swagger-ui .parameter__type {
    color: #9376de !important;
    font-family: 'JetBrains Mono', monospace !important;
  }
  .swagger-ui input[type=text], .swagger-ui select, .swagger-ui textarea {
    background-color: #1a1714 !important;
    color: #f2efe9 !important;
    border: 1px solid #24211d !important;
    border-radius: 10px !important;
    padding: 8px 12px !important;
  }
  .swagger-ui .btn {
    border-radius: 10px !important;
    font-weight: 700 !important;
    border: 1px solid #24211d !important;
    background: #1a1714 !important;
    color: #f2efe9 !important;
    box-shadow: none !important;
    padding: 7px 16px !important;
  }
  .swagger-ui .btn:hover {
    background: #24211d !important;
    border-color: #38332c !important;
  }
  .swagger-ui .btn.authorize {
    background: #7355be !important;
    color: #ffffff !important;
    border-color: #7355be !important;
  }
  .swagger-ui .btn.authorize:hover {
    background: #8365ce !important;
  }
  .swagger-ui .btn.execute {
    background: #7355be !important;
    color: #ffffff !important;
    border-color: #7355be !important;
  }
  .swagger-ui .btn.execute:hover {
    background: #8365ce !important;
  }
  .swagger-ui .responses-inner {
    background: #141210 !important;
    padding: 16px !important;
  }
  .swagger-ui .response-col_status {
    color: #4cc38a !important;
    font-family: 'JetBrains Mono', monospace !important;
    font-weight: 700 !important;
  }
  .swagger-ui .model-box {
    background: #141210 !important;
  }
  .swagger-ui section.models {
    border: 1px solid #24211d !important;
    border-radius: 16px !important;
    background: #141210 !important;
    margin: 30px 0 !important;
  }
  .swagger-ui section.models h4 {
    color: #f2efe9 !important;
    font-weight: 800 !important;
  }
  .swagger-ui .model-title {
    color: #f2efe9 !important;
  }
  .swagger-ui pre {
    background-color: #0e0c0a !important;
    border: 1px solid #24211d !important;
    border-radius: 10px !important;
    color: #f2efe9 !important;
  }
`;

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: swaggerCustomCss,
    customSiteTitle: 'MoneyMatter - Interactive API Documentation',
  })
);

// 3. Health check endpoint (verifies DB & Redis connectivity)
app.get('/api/health', async (_req: Request, res: Response) => {
  let dbStatus = 'healthy';
  let redisStatus = 'healthy';

  try {
    await pool.query('SELECT 1');
  } catch (err: any) {
    dbStatus = `unhealthy: ${err.message}`;
  }

  try {
    await redis.ping();
  } catch (err: any) {
    redisStatus = `unhealthy: ${err.message}`;
  }

  res.json({
    status: dbStatus === 'healthy' && redisStatus === 'healthy' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      redis: redisStatus,
    },
  });
});

// 4. API Routes
app.use('/api/auth', authRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/users', usersRouter);

// 5. Global 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// 6. Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Finance Tracker Backend running on http://localhost:${PORT}`);
  console.log(`Swagger OpenAPI Documentation: http://localhost:${PORT}/api/docs`);
});

export default app;
