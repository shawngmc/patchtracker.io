const fs = require('fs');
const Promise = require('bluebird');

async function update(productDescriptor, productVersions) {
    if (!productVersions) {
        productVersions = [];
    }

    for (const versionDescriptor of productDescriptor.polling) {
        let pollingMethod = versionDescriptor.method.toLowerCase();
        let pollingEnginePath = __dirname + "/../utils/pollers/" + pollingMethod + ".js";
        let pollingEngineExists = fs.existsSync(pollingEnginePath);
        if (pollingEngineExists) {
            const pollingEngine = require(pollingEnginePath);
            productVersions = await pollingEngine.updateProductVersions(productDescriptor.name, versionDescriptor, productVersions);
        } else {
            throw new Error("Unknown Product Polling Method: " + pollingMethod)
        }
        await Promise.delay(500);
    };

    return productVersions;
}
module.exports = update;