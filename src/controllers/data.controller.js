

import dataService from '../services/data.service.js';

/**
 * Placeholder function for the Data Controller root.
 * (Often used for basic health check or documentation endpoint for this feature)
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export async function index(req, res) {
  res.json({ message: 'Data controller root (placeholder)' });
}

/**
 * Retrieves a list of all data assets belonging to the user's organization.
 * * @param {object} req - Express request object (expects req.user)
 * @param {object} res - Express response object
 */
export async function listVaults(req, res, next) {
    try {
        // Only need the organization ID, which is attached by authMiddleware
        const orgId = req.user.orgId; 

        // Delegate retrieval logic to the Service Layer
        const assets = await dataService.getAssetsByOrganization(orgId);

        // Send response
        return res.status(200).send({
            message: `Found ${assets.length} data assets for this organization.`,
            assets,
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Handles the creation (upload) of a new data asset into the Data Vault.
 * This route MUST be protected by authMiddleware and adminMiddleware.
 * * @param {object} req - Express request object (expects req.user, req.body)
 * @param {object} res - Express response object
 */
export async function uploadData(req, res, next) {
    try {
        // 1. Extract necessary data from the request
        const { name, description, category } = req.body;
        
        // Data is always owned by the organization of the user who uploads it
        const orgId = req.user.orgId; 
        const ownerId = req.user.id;

        // 2. Simple validation (Detailed validation should be in a separate validation layer)
        if (!name || !description) {
            return res.status(400).send({ message: 'Missing required fields: name and description.' });
        }

        // 3. Delegate business logic to the Service Layer
        const newAsset = await dataService.createDataAsset(
            name, 
            description, 
            category, 
            orgId, 
            ownerId
        );

        // 4. Send success response
        return res.status(201).send({
            message: 'Data asset successfully uploaded and secured in the vault.',
            asset: newAsset,
        });

    } catch (error) {
        // Pass to the central error handler
        next(error);
    }
}


/**
 * Retrieves details for a specific data asset by its ID.
 * NOTE: This is NOT the actual data file, just the metadata.
 * * @param {object} req - Express request object (expects req.user, req.params.dataId)
 * @param {object} res - Express response object
 */
export async function getDataAssetDetails(req, res, next) {
    try {
        const { dataId } = req.params;
        const orgId = req.user.orgId;

        // Delegate retrieval logic to the Service Layer, 
        // which must ensure the asset belongs to the user's organization (Authorization)
        const asset = await dataService.getAssetDetails(dataId, orgId);

        if (!asset) {
            return res.status(404).send({ message: 'Data asset not found or not owned by your organization.' });
        }

        // Send response
        return res.status(200).send({
            message: 'Data asset metadata retrieved.',
            asset,
        });

    } catch (error) {
        next(error);
    }
}


// Export all functions as named exports and provide a default object for convenience
export default {
    index,
    listVaults,
    uploadData,
    getDataAssetDetails,
    // Note: The actual 'download data' logic will be in the request/consent workflow
};
