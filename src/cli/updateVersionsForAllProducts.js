const updateVersions = require('../polling/updateversions.js');
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require('fs'));
const _ = require('lodash');
const YAML = require('yaml');
const { fdatasync } = require('fs');

let pFiles = fs.readdirSync(__dirname + '/../../products/');
let productFiles = _.filter(pFiles, function(pFile) {
    return pFile.toLowerCase().endsWith(".json");
})

Promise.each(productFiles, async function(productFile) {
    let rawProduct = await fs.readFileAsync(__dirname + '/../../products/' + productFile, 'utf-8')
    let product = JSON.parse(rawProduct);

    console.log("Reading known versions for " + product.id + "...");
    let versionFilePath = __dirname + '/../../versions/' + product.id + ".json";
    let versions = {};
    if (fs.existsSync(versionFilePath)) {
        try {
            let rawVersions = await fs.readFileAsync(versionFilePath, 'utf-8');
            versions = JSON.parse(rawVersions);
        } catch (e) {
            console.log("Could not read existing versions for " + product.id + "...");
        }
    } else {
        console.log("No existing versions for " + product.id + "...");
    }

    console.log("Pulling latest product data for " + product.id + "...");
    let updatedVersions = await updateVersions(product, versions);
    await fs.writeFileAsync(versionFilePath, JSON.stringify(updatedVersions, null, 2));
    await Promise.delay(500);
    console.log("Done!");
});
