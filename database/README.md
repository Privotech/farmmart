# FarmMart Database Files

This directory contains all SQL files for the FarmMart e-commerce platform.

## File Organization

| File                                 | Purpose                                                   |
| ------------------------------------ | --------------------------------------------------------- |
| **01_schema.sql**                    | Initial setup - creates database and all 6 tables         |
| **02_seed.sql**                      | Test data - sample users, animals, orders for development |
| **03_queries_users.sql**             | User CRUD operations                                      |
| **04_queries_animals.sql**           | Animal listing queries (search, filter, pagination)       |
| **05_queries_cart.sql**              | Shopping cart operations                                  |
| **06_queries_orders.sql**            | Order management and Paystack integration                 |
| **07_queries_inquiries_reviews.sql** | Messaging and ratings                                     |
| **08_queries_admin.sql**             | Admin dashboard stats and stored procedures               |
| **09_rollback.sql**                  | Reset database (use with caution!)                        |

## Quick Setup

```bash
# 1. Create database and tables
mysql -u root -p < database/01_schema.sql

# 2. Load sample data (optional)
mysql -u root -p farmmart < database/02_seed.sql

# 3. Configure .env.local with DB credentials
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=farmmart
```

For detailed setup instructions, see [DATABASE_SETUP.md](../DATABASE_SETUP.md)

## Database Schema

6 main tables:

- **users** — Buyers, sellers, admins
- **animals** — Livestock listings
- **cart** — Shopping cart items
- **orders** — Purchase orders with Paystack integration
- **inquiries** — Buyer-to-seller messages
- **reviews** — Animal ratings (1-5 stars)

## Accessing Data in Your App

Use the helpers in `src/lib/mysql.ts`:

```typescript
import { query, queryOne } from "@/lib/mysql";

// Multiple results
const animals = await query("SELECT * FROM animals WHERE status = ?", [
  "AVAILABLE",
]);

// Single result
const user = await queryOne("SELECT * FROM users WHERE id = ?", [userId]);
```

Or run custom SQL:

```typescript
import pool from "@/lib/mysql";
const [rows] = await pool.execute("SELECT * FROM animals LIMIT 10");
```

## ⚠️ Important Notes

- Never commit `.env.local` with database credentials
- Use **09_rollback.sql** only for full database resets
- All queries use parameterized input to prevent SQL injection
- Full-text search enabled on animals table
- Stored procedures handle Paystack webhook integration
