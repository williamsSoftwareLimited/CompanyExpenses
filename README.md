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

Environment variables used by `backend/config/db.php`:
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASS`
