# Refactor DB Connection to Latest Prisma

## Tasks
- [ ] Update package.json to Prisma 7.0.1 and @prisma/client 7.0.1
- [ ] Fix prisma.config.ts schema path to './src/prisma/schema.prisma'
- [ ] Update import paths in JS files to '../prisma/prisma.client.js'
  - [ ] backend/src/controllers/request.controller.js
  - [ ] backend/src/services/auth.service.js
  - [ ] backend/src/services/test.service.js
  - [ ] backend/src/services/data.service.js
  - [ ] backend/src/controllers/audit.controller.js
- [ ] Fix test.service.js import to only import prisma
- [ ] Run npm install to update dependencies
- [ ] Run npx prisma generate
- [ ] Test the application to ensure DB connection works
