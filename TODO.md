# TODO: Secure Database Credentials in Sales-Admin Routes

- [x] Create .env.local with database credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
- [x] Update src/app/api/sales-admin/projects/route.ts to import and use the pool from src/lib/db.ts
- [x] Update src/app/api/sales-admin/remarks/route.ts to import and use the pool from src/lib/db.ts
- [x] Remove hardcoded fallbacks for sensitive data in the routes
