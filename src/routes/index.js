// src/routes/index.js

import { Router } from 'express';
const router = Router();

// Import all feature-specific routers
import authRoutes from './auth.route';
import dataRoutes from './data.route';
import requestRoutes from './request.route';
import auditRoutes from './audit.route'; // Example

// Define an array of routes with their base paths
const defaultRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/vault',
        route: dataRoutes,
    },
    {
        path: '/requests',
        route: requestRoutes,
    },
    {
        path: '/audit',
        route: auditRoutes,
    },
];

// Loop through the array and mount each router
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

// Export the aggregated router
export default router;