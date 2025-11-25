import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config.js';

function authMiddleware(req, res, next) {
    // 1. Check for the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Access denied. No token provided or token format is invalid.' });
    }

    // 2. Extract the token
    const token = authHeader.split(' ')[1];

    try {
        // 3. Verify the token using the secret key
        const decoded = jwt.verify(token, JWT_SECRET);

        
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            organizationId: decoded.organizationId,
        };
        
        
        next();
    } catch (error) {
        // Handle token expiration or invalid signature
        if (error.name === 'TokenExpiredError') {
             return res.status(401).send({ message: 'Access denied. Token has expired.' });
        }
        return res.status(401).send({ message: 'Access denied. Invalid token.' });
    }
}

export default authMiddleware;