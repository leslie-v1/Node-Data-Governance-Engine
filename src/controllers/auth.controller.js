
import authService from '../services/auth.service.js'

/**
 * Handles user registration (Sign Up) endpoint.
 * Responsible for input validation and delegating creation logic to the Service.
 * * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function register(req, res, next) {
    try {
        const { email, password, orgName, role } = req.body;

        // 1. Basic Input Validation
        if (!email || !password || !orgName || password.length < 8) {
            return res.status(400).send({ 
                message: 'Missing required fields (email, password, orgName) or password is too short (min 8 chars).' 
            });
        }

        // 2. Delegate Business Logic to the Service Layer
        // The service handles password hashing, database insertion, and organization management.
        const userRole = (role && role.toUpperCase() === 'VIEWER') ? 'VIEWER' : 'ADMIN';

        const newUser = await authService.registerUser(email, password, orgName, userRole);

        // 3. Send Success Response (User is created, but no token is given on register)
        return res.status(201).send({
            message: `User registered successfully for Organization: ${orgName}.`,
            user: newUser, // User object without the passwordHash
        });

    } catch (error) {
        // 4. Handle Specific Errors (e.g., duplicate unique fields)
        if (error.code === 'P2002') { // Prisma error for unique constraint violation
            return res.status(409).send({ 
                message: 'Conflict: A user with this email or an organization with this name already exists.' 
            });
        }
        
        // Pass to the central error handler middleware
        next(error); 
    }
}

/**
 * Handles user login endpoint.
 * Responsible for input validation and delegating authentication/token issuance to the Service.
 * * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // 1. Basic Input Validation
        if (!email || !password) {
            return res.status(400).send({ 
                message: 'Email and password are required for login.' 
            });
        }

        // 2. Delegate Authentication and Token Generation to the Service
        // The service handles password comparison and JWT signing.
        const { token, user } = await authService.loginUser(email, password);

        // 3. Send Success Response
        return res.status(200).send({
            message: 'Login successful.',
            token: token,
            user: user, // User details including role and orgId
        });

    } catch (error) {
        // 4. Handle Service-Generated Authentication Errors
        // The service might throw a specific error if credentials fail.
        if (error.message === 'Invalid credentials') {
            return res.status(401).send({ message: 'Authentication failed. Invalid email or password.' });
        }
        
        // Pass to the central error handler middleware
        next(error);
    }
}

export default {
    register,
    login,
};
