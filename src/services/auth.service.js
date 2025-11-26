import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

import prisma from '../prisma/prisma.client.js';

import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/config.js';

const SALT_ROUNDS = 10;

/**
 * Creates a JSON Web Token (JWT) for the authenticated user.
 * @param {object} user - The user object containing id, email, role, and organizationId.
 * @returns {string} The signed JWT token.
 */
function createToken(user) {
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
    };

    return jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}


/**
 * Registers a new user, hashes the password, and manages organization assignment.
 * @param {string} email - User email
 * @param {string} password - Raw password
 * @param {string} orgName - Name of the organization
 * @param {string} role - The user's intended role
 * @param {string} username - The username
 * @returns {object} { token, user } - The JWT token and user object (without password hash)
 */
async function registerUser(email, password, orgName, role, username) {
    // 1. Hash the password securely
    const passwordHash = await hash(password, SALT_ROUNDS);

    // Use a transaction to ensure data integrity
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
                username,
                email,
                password: passwordHash,
                role: role,
                organizationId: organization.id,
            },
        });

        // 4. Generate JWT token for the new user
        const token = createToken(newUser);

        // Remove password hash before returning the user object
        const { password: _, ...userWithoutHash } = newUser;

        return { token, user: userWithoutHash };
    });
    return result;
}

/**
 * Authenticates a user with email and password credentials.
 * @param {string} email 
 * @param {string} password 
 * @returns {object} { token, user }
 * @throws {Error} 
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
    const isValidPassword = await compare(password, user.password);

    if (!isValidPassword) {
        throw new Error('Invalid credentials');
    }

    // 3. Generate the JWT
    const token = createToken(user);
    
    // 4. Prepare user object for response (remove sensitive info)
    const { password: _, ...userWithoutHash } = user;

    return { 
        token, 
        user: userWithoutHash 
    };
}


export default {
    registerUser,
    loginUser,
};
