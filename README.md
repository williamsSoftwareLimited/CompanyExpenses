# CompanyExpenses

A concise Company Expenses starter with:
- **Expo React Native mobile app** (`/mobile`)
- **PHP + MySQL backend endpoint** (`/backend`)

## Mobile (Expo)

```bash
cd /home/runner/work/CompanyExpenses/CompanyExpenses/mobile
npm install
npm run test
npm run web
```

## Backend (PHP)

Serve the backend folder with PHP and call:

`/backend/public/expense-summary.php?company_id=1`

### SQL setup

Run the SQL scripts in `/backend/database`:

1. `schema.sql` (creates tables)
2. `seed.sql` (adds demo company and expenses)

### Expense API for frontend support

- `GET /backend/public/expenses.php` - list all expenses
- `GET /backend/public/expenses.php?company_id=1` - list expenses for a company
- `GET /backend/public/expenses.php?id=1` - fetch a single expense
- `POST /backend/public/expenses.php` - create expense (JSON: `company_id`, `title`, `amount`, optional `vat_amount`, `description`, `receipt`)
- `PUT /backend/public/expenses.php?id=1` - update expense fields
- `DELETE /backend/public/expenses.php?id=1` - delete expense

Environment variables used by `backend/config/db.php`:
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
