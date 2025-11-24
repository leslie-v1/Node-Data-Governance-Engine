// src/app.js (ES module)
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';



const app = express();

// Essential Middleware
app.use(cors());
app.use(express.json()); // parse JSON bodies
app.use(morgan('dev')); // logging

// TODO: Mount your main router here later
import routes from '../src/routes/APIs/central.routes.js'
app.use('/api', routes);

// Simple default route for health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Node Data Governance Engine API is operational.' });
});





export default app;