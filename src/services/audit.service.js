import  prisma  from "../prisma/prisma.client.js";

/**
 * Creates a new log entry for a significant action within the application.
 * This function acts as a centralized logging mechanism.
 * * @param {string} actionType - The type of action (e.g., 'USER_LOGIN', 'DATA_UPLOAD', 'REQUEST_APPROVED').
 * @param {string} userId - The ID of the user who performed the action.
 * @param {string | null} targetId - The ID of the primary object affected (e.g., DataVault ID, Request ID).
 * @param {object | null} details - Additional structured data about the event (e.g., IP address, old status, new status).
 * @returns {object} The created AuditLog record.
 */
async function logAction(actionType, userId, targetId = null, details = null) {
    try {
        const logEntry = await prisma.auditLog.create({
            data: {
                actionType,
                userId,
                targetId,
                details: details ? JSON.stringify(details) : null, // Store details as JSON string
                timestamp: new Date(),
            },
        });
        return logEntry;
    } catch (error) {
        console.error('CRITICAL AUDIT LOG FAILURE:', error.message);
        return null;
    }
}

export default {
    logAction,
};