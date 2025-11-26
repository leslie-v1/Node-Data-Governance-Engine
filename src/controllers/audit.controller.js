import auditService from '../services/audit.service.js';

/**
 * Placeholder function for the Audit Controller root.
 * (A simple endpoint for health checks or documentation).
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export async function index(req, res) {
  res.json({ message: 'Audit controller root (placeholder)' });
}

/**
 * Retrieves audit logs for the user's organization. 
 * This endpoint MUST be restricted to ADMIN roles.
 * * @param {object} req - Express request object (expects req.user, optional req.query.limit/page)
 * @param {object} res - Express response object
 */
export async function listAudits(req, res, next) {
    try {
        // 1. Authorization enforced by middleware (req.user is guaranteed to be an ADMIN)
        const orgId = req.user.orgId;
        const { limit = 50, page = 1 } = req.query; // Paging parameters

        // 2. Delegate filtering and retrieval logic to the Service Layer
        const logs = await auditService.getLogsByOrganization(orgId, parseInt(limit), parseInt(page));

        // 3. Send success response
        return res.status(200).send({
            message: `Retrieved ${logs.length} audit logs for organization ${orgId}.`,
            audits: logs, // Renamed 'logs' key to 'audits' for consistency with function name
        });

    } catch (error) {
        // Pass to the central error handler
        next(error);
    }
}

export default { index, listAudits };