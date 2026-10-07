# HomeConnect — Smart Rental Marketplace

A modern full-stack rental marketplace with dedicated **Tenant, Owner and Admin dashboards**.

## Highlights

- Responsive modern UI with React + Vite + Tailwind CSS
- Property search, budget/type/furnishing filters
- Saved/favourite properties stored in the browser
- Property detail and visit-request modal
- Visit date + optional message to the owner
- Owner portfolio, listing creation and booking management
- Admin analytics and owner verification queue
- JWT-based authentication and role-based API protection
- Local JSON database for easy college-project setup

## Demo accounts

| Role | Email | Password |
|---|---|---|
| Tenant | renter@homeconnect.com | renter123 |
| Owner | owner@homeconnect.com | owner123 |
| Admin | admin@homeconnect.com | admin123 |

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:3000**.

For a production build:

```bash
npm run build
npm start
```

The local database is created automatically at `backend/db.json` on first run.
