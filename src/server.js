// src/server.js

import app from './app.js'; 
import config from  './config/config.js'; // You'll create this in src/config/index.js
import prisma from '../src/models/prisma/prisma.client.js';
import dataRoutes from '../src/routes/APIs/data.route.js'
import dataReqRoutes from '../src/routes/APIs/request.route.js'
import authRoutes from '../src/routes/APIs/auth.route.js'





//routes
app.use('/auth', authRoutes);
app.use('/data',dataRoutes); 
app.use('/request',dataReqRoutes); 




const PORT = config.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🛡️ Server running on port ${PORT}`);
  console.log(`Access the API at http://localhost:${PORT}`);
});

// TODO: Add database connection logic (Prisma) here later
// This will be crucial for checking DB connection health before listening.