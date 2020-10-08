const fs = require('fs');

async function updateData(productData) {
    let pollingMethod = productData.polling.method.toLowerCase();
    let pollingEnginePath = __dirname + "/../utils/pollers/" + pollingMethod + ".js";
    let pollingEngineExists = fs.existsSync(pollingEnginePath);
    if (pollingEngineExists) {
        const pollingEngine = require(pollingEnginePath);
        productData = await pollingEngine.updateProduct(productData);
    } else {
        throw new Error("Unknown Product Polling Method: " + pollingMethod)
    }
    return productData;
}

module.exports = updateData;