# HomeConnect 2.0 — Setup & Execution Guide

## 1. Prerequisites

Install:

- Node.js 18 or newer (Node 20/22 LTS recommended)
- VS Code
- A modern browser such as Chrome or Edge

Check versions in Command Prompt:

```bash
node -v
npm -v
```

## 2. Open the project

Extract the ZIP and open the **HomeConnect-main** folder in VS Code.

The important folders are:

```text
HomeConnect-main/
├── backend/
│   └── server.ts
├── src/
│   ├── components/
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── frontend/
│   ├── index.html
│   ├── vite.config.ts
│   └── tsconfig.json
├── index.html
├── package.json
└── package-lock.json
```

## 3. Install dependencies

Open the VS Code terminal in the project root:

```bash
npm install
```

Wait until installation finishes.

## 4. Start the application

```bash
npm run dev
```

You should see:

```text
Server running on http://localhost:3000
```

Open:

**http://localhost:3000**

## 5. Demo accounts

### Tenant

Email: `renter@homeconnect.com`

Password: `renter123`

### Approved Owner

Email: `owner@homeconnect.com`

Password: `owner123`

### Admin

Email: `admin@homeconnect.com`

Password: `admin123`

### Pending Owner

Email: `owner2@homeconnect.com`

Password: `owner123`

Use the pending owner account to demonstrate the admin approval workflow.

## 6. Recommended demo flow for your project presentation

### Step A — Home page

Show:

- Hero section
- Search
- Property filters
- Property cards
- Favourite/heart button
- Property detail modal

### Step B — Tenant

Login as the tenant and show:

- Dashboard statistics
- Booking/visit history
- Property search
- Budget/type filters
- Saved properties
- Request a visit with a preferred date and message

### Step C — Owner

Login as the approved owner and show:

- Portfolio statistics
- Add property
- My properties
- Search listings
- Incoming visit requests
- Confirm / decline request

### Step D — Admin

Login as admin and show:

- User statistics
- Property statistics
- Booking statistics
- Activity bars
- Owner verification queue
- Approve pending owner

## 7. Production build

To create a production build:

```bash
npm run build
```

Then start the built application:

```bash
npm start
```

Open:

**http://localhost:3000**

## 8. Reset demo data

The application automatically creates `backend/db.json` on first run.

To reset all demo data, stop the server and run:

```bash
npm run clean
npm run dev
```

This removes the local database and the next startup recreates the seeded demo users, properties and booking.

## 9. Common problems

### Port 3000 already in use

Close the other application using port 3000, or change the `PORT` constant in `backend/server.ts` and use the same port in your browser.

### `npm` is not recognized

Install Node.js and restart VS Code.

### Blank page after changing files

Stop the server with `Ctrl + C`, then run:

```bash
npm run dev
```

### Login does not work after changing the database

Delete `backend/db.json` and restart the server to recreate the demo data.

## 10. Important note

This project intentionally uses a **local JSON database** so that it can be demonstrated easily without installing MongoDB. For a production deployment, replace the LocalDB class with MongoDB/PostgreSQL and store passwords using a proper password hashing algorithm.
