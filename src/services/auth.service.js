import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../models/prisma/prisma.client.js'; 
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/config.js';

const SALT_ROUNDS = 10;

// --- Private Utility Functions ---

/**
 * Creates a JSON Web Token (JWT) for the authenticated user.
 * @param {object} user - The user object containing id, email, role, and orgId.
 * @returns {string} The signed JWT token.
 */
function createToken(user) {
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        orgId: user.orgId,
    };

    return jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

// --- Public Service Functions ---

/**
 * Registers a new user, hashes the password, and manages organization assignment.
 * Automatically sets the first registered user as ADMIN for a new organization.
 * @param {string} email - User email
 * @param {string} password - Raw password
 * @param {string} orgName - Name of the organization
 * @param {string} role - The user's intended role
 * @returns {object} The newly created user object (without password hash)
 */
async function registerUser(email, password, orgName, role) {
    // 1. Hash the password securely
    const passwordHash = await hash(password, SALT_ROUNDS);

    // Use a transaction to ensure data integrity (user and org updates are atomic)
    const result = await prisma.$transaction(async (tx) => {
        // 2. Find or create the organization
        let organization = await tx.organization.findUnique({
            where: { name: orgName },
        });

        if (!organization) {
            organization = await tx.organization.create({
                data: { name: orgName },
            });
        }
        
        // 3. Create the user
        const newUser = await tx.user.create({
            data: {
                email,
                passwordHash,
                role: organization.adminUserId ? role : 'ADMIN', // Promote first user to ADMIN if no admin exists
                orgId: organization.id,
            },
        });

        // 4. Update the organization if this is the first ADMIN user
        if (!organization.adminUserId && newUser.role === 'ADMIN') {
             await tx.organization.update({
                where: { id: organization.id },
                data: { adminUserId: newUser.id },
            });
        }
        
        // Remove password hash before returning the user object
        const { passwordHash: _, ...userWithoutHash } = newUser;
        return userWithoutHash
    });
    return result;
}

/**
 * Authenticates a user by comparing the password hash and generates a JWT.
 * @param {string} email - User email
 * @param {string} password - Raw password
 * @returns {object} { token, user } - The JWT and user details
 * @throws {Error} if credentials fail
 */
async function loginUser(email, password) {
    // 1. Find the user by email, include org details
    const user = await prisma.user.findUnique({
        where: { email },
        include: { organization: true },
    });

    if (!user) {
        throw new Error('Invalid credentials');
    }

    // 2. Compare the raw password with the stored hash
    const isValidPassword = await compare(password, user.passwordHash);

    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }

    // 3. Generate the JWT
    const token = createToken(user);
    
    // 4. Prepare user object for response (remove sensitive info)
    const { passwordHash, ...userWithoutHash } = user;

    return { 
        token, 
        user: userWithoutHash 
    };
}


export default {
    registerUser,
    loginUser,
};
