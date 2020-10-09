const fs = require('fs');
const Promise = require('bluebird');

async function update(productDescriptor, productVersions) {
    if (!productVersions) {
        productVersions = [];
    }

    for (const pollConfig of productDescriptor.polling) {
        let pollingMethod = pollConfig.method.toLowerCase();
        let pollingEnginePath = __dirname + "/../utils/pollers/" + pollingMethod + ".js";
        let pollingEngineExists = fs.existsSync(pollingEnginePath);
        if (pollingEngineExists) {
            const pollingEngine = require(pollingEnginePath);
            productVersions = await pollingEngine.updateProductVersions(pollConfig, productVersions);
        } else {
            throw new Error("Unknown Product Polling Method: " + pollingMethod)
        }
        await Promise.delay(1000);
    };

    return productVersions;
}
module.exports = update;