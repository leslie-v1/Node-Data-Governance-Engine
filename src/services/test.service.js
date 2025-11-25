import dataService from '../services/data.service.js';
import { prisma, connectDB } from '../models/prisma/prisma.client.js';

// --- Configuration ---
// These IDs must match existing records in your database for the test to pass.
// If your database is empty, you need to first create an Organization and a User 
// with these IDs manually or through the register endpoint.
const DUMMY_ORG_ID = "org_a1b2c3d4"; 
const DUMMY_USER_ID = "user_x5y6z7w8"; 


/**
 * Cleans up the test environment by deleting test records.
 */
async function cleanup() {
    console.log('\n--- CLEANUP ---');
    // Delete all assets created by the dummy organization
    await prisma.dataVault.deleteMany({
        where: { orgId: DUMMY_ORG_ID },
    });
    console.log(`🧹 Cleaned up DataVault assets belonging to ${DUMMY_ORG_ID}.`);
    // Note: We don't delete the user/org, assuming they exist permanently for tests.
}

/**
 * Main function to run the data service tests.
 */
async function runTests() {
    try {
        // Ensure database connection is established
        await connectDB();
        
        // --- Test Setup ---
        // Cleanup previous runs for idempotent testing
        await cleanup(); 

        console.log('\n--- 1. Testing createDataAsset ---');
        
        // 1. Create Data Asset 1
        const asset1 = await dataService.createDataAsset(
            'Q1 2024 Customer Demographics',
            'Anonymized survey data from Quarter 1, 2024.',
            'CUSTOMER',
            DUMMY_ORG_ID,
            DUMMY_USER_ID
        );
        console.log(`✅ Asset 1 Created (ID: ${asset1.id})`);
        console.log('   - Verify owner: ', asset1.orgId === DUMMY_ORG_ID ? 'PASS' : 'FAIL');
        
        // 2. Create Data Asset 2
        const asset2 = await dataService.createDataAsset(
            'Internal Financial Report Q3 2024',
            'Sensitive internal revenue figures for Q3.',
            'FINANCIAL',
            DUMMY_ORG_ID,
            DUMMY_USER_ID
        );
        console.log(`✅ Asset 2 Created (ID: ${asset2.id})`);


        console.log('\n--- 2. Testing getAssetsByOrganization ---');
        
        // 3. Retrieve all assets for the dummy organization
        const assetsList = await dataService.getAssetsByOrganization(DUMMY_ORG_ID);
        
        if (assetsList.length === 2) {
            console.log(`✅ Success: Found exactly 2 assets (Expected: 2, Found: ${assetsList.length})`);
        } else {
            console.error(`❌ Failure: Incorrect number of assets found. (Expected: 2, Found: ${assetsList.length})`);
        }
        
        // 4. Test inclusion of uploader details
        console.log(`   - Uploader email available: ${assetsList[0].uploader.email}`);


        console.log('\n--- 3. Testing getAssetDetails (Authorization Check) ---');
        
        // 5. Retrieve asset 1 using its ID and the correct OrgID (PASS)
        const retrievedAsset = await dataService.getAssetDetails(asset1.id, DUMMY_ORG_ID);
        if (retrievedAsset && retrievedAsset.id === asset1.id) {
            console.log(`✅ Success: Retrieved asset ${asset1.id} with correct organization scope.`);
        } else {
            console.error('❌ Failure: Could not retrieve asset with correct scope.');
        }

        // 6. Attempt to retrieve asset 1 using a DIFFERENT (incorrect) OrgID (FAIL)
        const BAD_ORG_ID = 'different_org_id';
        const unauthorizedAttempt = await dataService.getAssetDetails(asset1.id, BAD_ORG_ID);
        if (unauthorizedAttempt === null) {
            console.log(`✅ Success: Retrieval blocked for asset ${asset1.id} when using wrong organization ID.`);
        } else {
            console.error('❌ Failure: Retrieval succeeded even with wrong organization ID (Security Breach!).');
        }


    } catch (error) {
        console.error('\n--- TEST EXECUTION FAILED ---');
        console.error(error);
    } finally {
        // Ensure we disconnect from the database after all tests run
        await prisma.$disconnect();
    }
}

// Execute the test runner
runTests();