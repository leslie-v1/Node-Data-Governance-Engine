// src/server.js

import app from './app.js'; 
import config from  '../src/config/index.js'; // You'll create this in src/config/index.js
import prisma from './config/db.js';

const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🛡️ Server running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});

// TODO: Add database connection logic (Prisma) here later
// This will be crucial for checking DB connection health before listening.