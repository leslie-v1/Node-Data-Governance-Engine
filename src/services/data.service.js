import prisma from '../prisma/prisma.client.js';

/**
 * Creates a new metadata record for a data asset in the DataVault.
 * In a real-world scenario, the actual file would be uploaded to S3/Cloud Storage, 
 * and the 'contentPath' (or a similar field) would store the pointer/URL.
 * * @param {string} name - Name of the data asset.
 * @param {string} description - Description of the asset.
 * @param {string} category - Category tag for the asset.
 * @param {string} orgId - ID of the organization that owns the asset.
 * @param {string} ownerId - ID of the user who uploaded the asset.
 * @returns {object} The created DataVault record.
 */
async function createDataAsset(name, description, category, orgId, ownerId) {
    // NOTE: For demonstration, we'll use a placeholder for the actual content path.
    const placeholderPath = `/data-vault/${orgId}/${Date.now()}`;

    const newAsset = await prisma.dataVault.create({
        data: {
            name,
            description,
            category: category || 'UNCATEGORIZED',
            contentPath: placeholderPath, 
            organization: { connect: { id: orgId } }, // Link to the owning organization
            uploader: { connect: { id: ownerId } },   // Link to the uploading user
        },
    });

    return newAsset;
}

/**
 * Retrieves all data assets owned by a specific organization.
 * * @param {string} orgId - The ID of the organization to filter by.
 * @returns {Array<object>} A list of DataVault metadata objects.
 */
async function getAssetsByOrganization(orgId) {
    // 1. Database operation (Retrieving multiple assets)
    const assets = await prisma.dataVault.findMany({
        where: {
            orgId: orgId, 
        },
        // Optionally include the uploader's name or organization details
        include: {
            uploader: {
                select: { email: true, id: true },
            },
        },
    });

    return assets;
}

/**
 * Retrieves the metadata details for a single data asset, ensuring it belongs to the specified organization.
 * * @param {string} dataId - The ID of the specific data asset.
 * @param {string} orgId - The ID of the organization that must own the asset (security check).
 * @returns {object | null} The DataVault metadata object, or null if not found/not owned.
 */
async function getAssetDetails(dataId, orgId) {
    const asset = await prisma.dataVault.findUnique({
        where: {
            id: dataId,
            orgId: orgId,
        },
    });

    return asset;
}


export default {
    createDataAsset,
    getAssetsByOrganization,
    getAssetDetails,
};
