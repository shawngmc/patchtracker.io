const updateVersions = require('../operations/updateVersions.js');
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require('fs'));
const _ = require('lodash');
const semver = require('semver');

let pFiles = fs.readdirSync(__dirname + '/../../products/current/');
let productFiles = _.filter(pFiles, function (pFile) {
    return pFile.toLowerCase().endsWith(".json");
})

Promise.each(productFiles, async function (productFile) {
    let rawProduct = await fs.readFileAsync(__dirname + '/../../products/current/' + productFile, 'utf-8')
    let product = JSON.parse(rawProduct);

    console.log("Reading known versions for " + product.id + "...");
    let versionFilePath = __dirname + '/../../versions/' + product.id + ".json";
    let versions = [];
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

    // Map version series
    let seriesMap = [];
    for (const set of product.series) {
        set.versions = [];
        seriesMap.push(set);
    }
    for (const versionDesc of versions) {
        let verObj = semver.parse(versionDesc.version);
        for (const set of seriesMap) {
            if (semver.satisfies(verObj, set.comparator)) {
                set.versions.push(versionDesc);
            }
        }
    }

    await fs.writeFileAsync(versionFilePath, JSON.stringify(updatedVersions, null, 2));
    await Promise.delay(1000);
});
console.log("Done!");
