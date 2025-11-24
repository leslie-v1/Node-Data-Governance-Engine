// src/server.js

import app from './app.js';
import config from './config/config.js';


//routes



const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🛡️ Server running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});

// TODO: Add database connection logic (Prisma) here later
// This will be crucial for checking DB connection health before listening.