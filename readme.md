## Node-Data-Governance-Engine (CDE API)

A robust data exchange backend built with Node.js, Express and PostgreSQL. The CDE API implements an asynchronous consent-based workflow where data access is only granted after explicit approval by the owning organization's administrator. The design focuses on auditability, safety, and clear separation of responsibilities.

---

### Key highlights
- Mandatory consent: data is held until the owning org approves a request.
- Asynchronous lifecycle for requests: PENDING → APPROVED | REJECTED.
- Strong data integrity using PostgreSQL transactions and Prisma schema constraints.

---

## Tech stack
- Backend: Node.js, Express
- Database: PostgreSQL
- ORM: Prisma (type-safe queries & schema migrations)
- Auth: JWT + bcrypt
- Utilities: nodemailer for notifications (optional)

---

## Repository layout

```
Node-Data-Governance-Engine/
├── prisma/               # Prisma schema & migrations
├── src/                  # Application source code
│   ├── config/           # Env and config helpers
│   ├── controllers/      # HTTP handlers
│   ├── middlewares/      # Auth, RBAC, validation
│   ├── routes/           # Route definitions
│   ├── services/         # Core business logic (Prisma queries)
│   ├── utils/            # helpers (email, logging, etc.)
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry + bootstrap
├── .env                  # Environment variables (not committed)
└── package.json
```

---

## Quick start (local)

Prerequisites:
- Node.js (LTS)
- npm (or your preferred package manager)
- PostgreSQL running and accessible

1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/Node-Data-Governance-Engine.git
cd Node-Data-Governance-Engine/backend
```

2. Install dependencies

```bash
npm install
```

3. Create a Postgres database and set `DATABASE_URL` in `backend/.env`.

Example `.env` values (update with your credentials):

```env
# PostgreSQL example (replace values):
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/datashare?schema=public"
PORT=5000
JWT_SECRET="YOUR_ULTRA_SECURE_RANDOM_SECRET"
# Optional: MAIL_HOST, MAIL_USER, MAIL_PASS, etc.
```

4. Generate Prisma client and push schema

```bash
npx prisma generate
npx prisma db push
```

Notes:
- `prisma db push` will create tables according to `prisma/schema.prisma` without generating a migration history. If you prefer migrations, run `npx prisma migrate dev` and follow the prompts.

5. Start the server

```bash
npm run dev
# or
node index.js
```

The server will typically be available at http://localhost:5000 (or whatever `PORT` you configured).

---

## Environment variables

- DATABASE_URL — Postgres connection string (required for Prisma)
- PORT — server port (default: 5000)
- JWT_SECRET — secret for signing JWTs
- UPLOAD_DIR — directory used for file uploads (default: uploads)
- MAIL_* — optional mail config for notifications

---

## Important API endpoints

These are the common endpoints used by the frontend and clients. Confirm exact route names in `src/routes`.

- /.: GET /api/
- Auth: POST /api/auth/register, POST /api/auth/login
- Datasets: GET /api/datasets, POST /api/datasets
- Upload: POST /api/upload
- Requests: POST /api/requests, PUT /api/requests/:id/approve, GET /api/requests
- Vault (data retrieval): GET /api/vault/:dataId (access controlled by request approval)

---

## Prisma / Database notes

- The project uses Prisma as the ORM. The schema is at `prisma/schema.prisma`.
- After changing the Prisma schema, run `npx prisma generate` and either `npx prisma db push` (fast apply) or `npx prisma migrate dev` (create a migration).
- For production deployments, prefer migration-based workflows and a managed Postgres instance.

---


## Contributing

Contributions are welcome. Please open issues for bugs or feature requests and submit pull requests for code changes.

---