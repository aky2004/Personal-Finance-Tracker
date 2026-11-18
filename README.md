# Full Stack Personal Finance Tracker

A production-ready Full Stack Personal Finance Tracker built with **React 18+**, **Node.js with Express**, **PostgreSQL**, and **Redis Caching**, featuring Role-Based Access Control (RBAC), interactive Recharts visualizations, virtualized scrolling, and rate-limited RESTful APIs documented with Swagger/OpenAPI.

---

## 🌟 Key Highlights & Architecture

* **Frontend (`/frontend`)**:
  * **React 18+ & Vite & TypeScript**: Built with strict typing and clean modular architecture.
  * **Role-Based Access Control (RBAC)**: Dynamic conditional UI rendering for `admin`, `user`, and `read-only` roles (buttons and forms disabled for read-only viewers).
  * **React Hooks Implementation**:
    * `useContext`: Global Authentication (`AuthContext`) and Theme Management (`ThemeContext` for light/dark mode).
    * `useCallback`: Optimized form handlers and action callbacks, preventing unnecessary child re-renders.
    * `useMemo`: Memoized financial aggregations (totals, averages, net cashflow) and filtered transaction lists.
  * **Code Splitting & Lazy Loading**: Route-level code splitting using `React.lazy()` paired with `React.Suspense` fallbacks.
  * **Virtual Scrolling**: High-performance windowed scrolling for large transaction datasets.
  * **Data Visualizations (Recharts)**:
    1. **Pie Chart**: Category expense distribution.
    2. **Line Chart**: Monthly income, expense, and net savings trajectory.
    3. **Bar Chart**: Side-by-side comparison of income vs. expenses.

* **Backend (`/backend`)**:
  * **Node.js, Express & TypeScript**: Clean MVC route architecture.
  * **PostgreSQL Database**: Relational schema with foreign keys, checks, indexes, and parameterized queries (SQL Injection prevention).
  * **Redis Caching Layer (`ioredis`)**:
    * **Analytics Cache**: 15 minutes TTL (`CACHE_TTL.ANALYTICS = 900s`).
    * **Category Cache**: 1 hour TTL (`CACHE_TTL.CATEGORIES = 3600s`).
    * **Automated Cache Invalidation**: Automatic invalidation of user analytics caches whenever a transaction is added, edited, or deleted.
    * **Cache Telemetry**: `X-Cache: HIT / MISS` and `X-Response-Time` headers.
  * **Security & Hardening**:
    * JWT-based token authentication with claim verification.
    * Protection against XSS and security headers via `helmet` and input sanitization.
    * Parameterized SQL queries preventing SQL Injection.
  * **Rate Limiting (`express-rate-limit`)**:
    * Auth endpoints: `5 requests / 15 minutes`
    * Transaction endpoints: `100 requests / hour`
    * Analytics endpoints: `50 requests / hour`
  * **Interactive API Documentation**: Live Swagger/OpenAPI UI hosted at `/api/docs`.

---

## 📋 Role-Based Access Control (RBAC) Matrix

| Feature / Route | `admin` | `user` | `read-only` |
| :--- | :---: | :---: | :---: |
| **View Analytics & Dashboards** (`GET /api/analytics/*`) | ✅ Full Access | ✅ Own Data | ✅ Own Data |
| **View Transactions List** (`GET /api/transactions`) | ✅ All / Filtered | ✅ Own Data | ✅ Own Data |
| **Create Transactions** (`POST /api/transactions`) | ✅ Full Access | ✅ Own Data | ❌ **Forbidden (403)** |
| **Edit Transactions** (`PUT /api/transactions/:id`) | ✅ Full Access | ✅ Own Data | ❌ **Forbidden (403)** |
| **Delete Transactions** (`DELETE /api/transactions/:id`) | ✅ Full Access | ✅ Own Data | ❌ **Forbidden (403)** |
| **User Management Console** (`GET /api/users`) | ✅ Full Access | ❌ Forbidden | ❌ Forbidden |
| **Update User Roles** (`PATCH /api/users/:id/role`) | ✅ Full Access | ❌ Forbidden | ❌ Forbidden |
| **Frontend Form Controls** | Active | Active | **Disabled / Read-Only** |

---

## 🚀 Pre-Seeded Demo Credentials

The database comes pre-seeded with sample data and accounts for immediate evaluation:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@finance.com` | `AdminPassword123!` | Full privileges, access to User Management & global ledger |
| **Standard User** | `user@finance.com` | `UserPassword123!` | Full CRUD access over personal income/expenses & analytics |
| **Read-Only** | `readonly@finance.com` | `ReadOnlyPassword123!` | View-only access; add/edit/delete buttons are disabled |

> 💡 **Tip:** On the web login screen (`/login`), click any of the **One-Click Demo Role** buttons to instantly fill and sign in without typing!

---

## 🛠️ Local Development Setup

### 1. Prerequisites
* **Node.js**: v18+ (tested on Node v20/v22/v26)
* **PostgreSQL**: Running locally on port `5432`
* **Redis**: Running locally on port `6379`

### 2. Database & Redis Setup
Ensure your PostgreSQL server and Redis instances are running:
```bash
# Verify PostgreSQL
psql -h localhost -U postgres -c "SELECT 1;"

# Verify Redis
redis-cli ping
# Expected: PONG
```

Create the application database:
```bash
psql -h localhost -U postgres -c "CREATE DATABASE personal_finance;"
```

### 3. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables (or copy from .env.example)
cp .env.example .env

# Run database migrations and seed demo data
npm run db:seed

# Start the backend server
npm run dev # or npm run build && npm start
```
* Backend runs on: `http://localhost:5001`
* Interactive Swagger Docs: `http://localhost:5001/api/docs`
* Health Check endpoint: `http://localhost:5001/api/health`

### 4. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
* Frontend runs on: `http://localhost:5173`

---

## 📖 Interactive API Documentation (Swagger / OpenAPI)

Interactive OpenAPI 3.0 documentation is available directly in the browser:
👉 **[http://localhost:5001/api/docs](http://localhost:5001/api/docs)**

Key API Groups:
* `/api/auth`: User registration, login, and profile lookup (`/me`).
* `/api/categories`: Category listings (cached for 1h) and admin creation.
* `/api/transactions`: Paginated, searchable, categorized CRUD with RBAC enforcement.
* `/api/analytics`: Overview statistics, category distribution, and monthly trend history (cached for 15m).
* `/api/users`: Admin-only user directory and role modification.

---

## ⚡ Performance & Caching Effectiveness

Redis caching drastically reduces database query load and latency for high-frequency analytical calculations.

### Cache Telemetry Headers
Every cached response returns two telemetry headers:
* `X-Cache`: `HIT` (served directly from Redis) or `MISS` (computed from PostgreSQL).
* `X-Response-Time`: Latency in milliseconds.

### Benchmark Results
| Metric / Endpoint | Cold Cache (`MISS` - PostgreSQL) | Warm Cache (`HIT` - Redis) | Speedup Factor |
| :--- | :---: | :---: | :---: |
| **`/api/categories`** | ~4 - 8 ms | **< 1 ms** | **~8x faster** |
| **`/api/analytics/overview`** | ~5 - 12 ms | **< 1 ms** | **~10x faster** |
| **`/api/analytics/monthly-trends`** | ~8 - 15 ms | **< 1 ms** | **~12x faster** |

### Automated Cache Invalidation Lifecycle
1. User requests `/api/analytics/overview` $\rightarrow$ `X-Cache: MISS` (stored in Redis with a 15-minute TTL).
2. Subsequent requests $\rightarrow$ `X-Cache: HIT` (sub-millisecond response).
3. User adds or updates a transaction $\rightarrow$ Backend invalidates all `analytics:user:<id>:*` keys.
4. Next analytics request $\rightarrow$ `X-Cache: MISS` (recomputed with fresh data and re-cached).

---

## 🔒 Security Architecture

1. **SQL Injection Prevention**: All SQL queries across transactions, users, and analytics use parameterized queries (`$1, $2, ...`) with strict whitelisting for order clauses.
2. **XSS & HTTP Header Hardening**: Secured with `helmet` and strict Content-Type validation.
3. **Role-Based JWT Verification**: Token claims are verified on every privileged request. Read-only users attempting data mutations receive an explicit `403 Forbidden`.
4. **Endpoint Rate Limiting**: Enforced via `express-rate-limit` to prevent brute force attacks and resource exhaustion.

---

## 📂 Repository Structure

```
.
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── migrate.ts        # Database schema migrations
│   │   │   ├── pool.ts           # PostgreSQL connection pool
│   │   │   └── seed.ts           # Demo users & transaction seeding
│   │   ├── middleware/
│   │   │   ├── auth.ts           # JWT authentication & RBAC guards
│   │   │   └── rateLimiter.ts    # Rate limiting middleware
│   │   ├── routes/
│   │   │   ├── analytics.ts      # Analytics & dashboard endpoints
│   │   │   ├── auth.ts           # Register, login, /me
│   │   │   ├── categories.ts     # Category endpoints (1h cache)
│   │   │   ├── transactions.ts   # Transaction CRUD with RBAC
│   │   │   └── users.ts          # Admin user management
│   │   ├── services/
│   │   │   └── redis.ts          # Redis client & caching service
│   │   ├── server.ts             # Express app setup
│   │   └── swagger.ts            # OpenAPI 3.0 specification
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts         # Axios client with JWT interceptor
│   │   ├── components/
│   │   │   ├── Charts/           # CategoryPieChart, MonthlyTrendLineChart, IncomeExpenseBarChart
│   │   │   ├── Navbar.tsx        # Top navigation & user role badge
│   │   │   ├── Sidebar.tsx       # Navigation links & read-only alert
│   │   │   ├── ProtectedRoute.tsx# Role-based route guard
│   │   │   ├── TransactionModal.tsx # Add/Edit modal with useCallback
│   │   │   └── VirtualTransactionList.tsx # Virtual scrolling list
│   │   ├── context/
│   │   │   ├── AuthContext.tsx   # User authentication state (useContext)
│   │   │   └── ThemeContext.tsx  # Light/dark theme state (useContext)
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx # Overview KPIs, cache telemetry, charts
│   │   │   ├── TransactionsPage.tsx # Table / Virtual view, filters, pagination
│   │   │   ├── AdminUsersPage.tsx# Admin user console
│   │   │   ├── LoginPage.tsx     # One-click demo login & authentication
│   │   │   └── RegisterPage.tsx  # User registration
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript interfaces
│   │   ├── App.tsx               # React.lazy & Suspense route definitions
│   │   ├── index.css             # Tailwind base styles
│   │   └── main.tsx              # React DOM entry
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── techBridgeAssignment.pdf      # Original assignment brief
└── README.md                     # Comprehensive project documentation
```

---

## 📄 License
ISC
