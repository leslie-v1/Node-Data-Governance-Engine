import express from 'express';
// 1. Import all feature routers
import authRoutes from './auth.route.js';
import dataRoutes from './data.route.js';
import requestRoutes from './request.route.js';
import auditRoutes from './audit.route.js';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoutes,
    },
    { 
        path: '/vault', 
        route: dataRoutes 
    },
    { 
        path: '/requests', 
        route: requestRoutes 
    },
    {
        path: '/audit',
        route: auditRoutes
    }
];

// Mount all feature routers onto the main Express router
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;