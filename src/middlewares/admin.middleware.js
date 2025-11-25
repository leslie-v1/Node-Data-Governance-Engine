function adminMiddleware(req, res, next) {
    // Check if user is authenticated and has admin role
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).send({ message: 'Access denied. Admin privileges required.' });
    }

    // User is admin, proceed to next middleware/route handler
    next();
}

export default adminMiddleware;
