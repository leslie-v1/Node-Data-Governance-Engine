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
        const { email, password, orgName, role, username } = req.body;

        // 1. Basic Input Validation
        if (!email || !password || !orgName || !username || password.length < 8) {
            return res.status(400).send({ 
                message: 'Missing required fields (email, password, orgName, username) or password is too short (min 8 chars).' 
            });
        }

        const userRole = (role && role.toUpperCase() === 'ADMIN') ? 'ADMIN' : 'USER';

        const { token, user: newUser } = await authService.registerUser(email, password, orgName, userRole, username);

        // 3. Send Success Response
        return res.status(201).send({
            message: `User registered successfully for Organization: ${orgName}.`,
            token,
            user: newUser, // User object without the passwordHash
        });

    } catch (error) {
        // 4. Handle Specific Errors (e.g., duplicate unique fields)
        if (error.code === 'P2002') { // Prisma error for unique constraint violation
            const target = error.meta?.target;
            let message = 'Conflict: ';
            if (target?.includes('username')) {
                message += 'A user with this username already exists.';
            } else if (target?.includes('email')) {
                message += 'A user with this email already exists.';
            } else if (target?.includes('name')) {
                message += 'An organization with this name already exists.';
            } else {
                message += 'Unique constraint violation.';
            }
            return res.status(409).send({
                message
            });
        }

        // Pass to the central error handler middleware
        next(error);
    }
}

/**
 * Handles user login endpoint.
 * Responsible for input validation and delegating authentication/token issuance to the Service.
 * * @param {object} req -
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
        // call service and validate shape
        const result = await authService.loginUser(email, password);

        if (!result) {
            console.error('authService.loginUser returned falsy:', result);
            return res.status(500).send({ message: 'Authentication service failure.' });
        }

        // if the service returns { token, user } use those, otherwise adapt as needed
        const token = result.token ?? result.accessToken ?? null;
        const user = result.user ?? result.userData ?? null;

        if (!token || !user) {
            console.error('Unexpected login result shape:', result);
            return res.status(500).send({ message: 'Authentication did not return required data.' });
        }

        // 3. Send Success Response
        return res.status(200).send({
            message: 'Login successful.',
            token: token,
            user: user, // User details including role and orgId
        });

    } catch (error) {
        if (error.message === 'Invalid credentials') {
            return res.status(401).send({ message: 'Authentication failed. Invalid email or password.' });
        }
        
      
        next(error);
    }
}

export default {
    register,
    login,
};
