// src/app.js (ES module)
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

const app = express();

// Essential Middleware
app.use(cors());
app.use(express.json()); // parse JSON bodies

// TODO: Mount your main router here later
// import routes from './routes/index.js'
// app.use('/api', routes);

// Simple default route for health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Node Data Governance Engine API is operational.' });
});



app.use('/api', routes); // <-- All feature routes are now accessible under /api

export default app;