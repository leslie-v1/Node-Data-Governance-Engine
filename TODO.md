# Refactoring Backend File Structure TODO

- [ ] Create new directories: src/models/, src/models/prisma/
- [ ] Move backend/prisma/schema.prisma to src/models/prisma/schema.prisma
- [ ] Create src/models/prisma.client.js with content from config/db.js
- [ ] Delete config/db.js
- [ ] Rename src/config/index.js to src/config/config.js
- [ ] Rename src/utils/index.js to src/utils/email.util.js
- [ ] Rename src/routes/index.js to src/routes/index.route.js
- [ ] Rename src/middlewares/ directory to src/middleware/
- [ ] Rename src/middleware/index.js to src/middleware/auth.middleware.js
- [ ] Create empty src/middleware/admin.middleware.js
- [ ] Create empty src/services/data.service.js
- [ ] Create empty src/services/request.service.js
- [ ] Create empty src/services/audit.service.js
- [ ] Find and update import paths in affected files (app.js, controllers, services, routes)
- [ ] Test the application for import errors
