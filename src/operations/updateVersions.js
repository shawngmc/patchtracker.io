const fs = require('fs');

async function update(productDescriptor, productVersions) {
    if (!productVersions) {
        productVersions = {};
    }

    if (!productVersions.version_chains) {
        productVersions.version_chains = [];
    }

    for (const versionDescriptor of productDescriptor.polling) {
        if (!productVersions) {
            return null;
        }
        productVersions = await pollForVersion(productDescriptor.name, versionDescriptor, productVersions);
    };

    return productVersions;
}


async function pollForVersion(name, versionDescriptor, productVersions) {
    console.log("Polling for versions " + versionDescriptor.version + " of " + name);
    let pollingMethod = versionDescriptor.method.toLowerCase();
    let pollingEnginePath = __dirname + "/../utils/pollers/" + pollingMethod + ".js";
    let pollingEngineExists = fs.existsSync(pollingEnginePath);
    if (pollingEngineExists) {
        const pollingEngine = require(pollingEnginePath);
        productVersions = await pollingEngine.updateProductVersionChain(name, versionDescriptor, productVersions);
    } else {
        throw new Error("Unknown Product Polling Method: " + pollingMethod)
    }
    return productVersions;
}

module.exports = update;