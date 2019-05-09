const updateVersions = require('../polling/updateversions.js');
const Promise = require("bluebird");
const fs = Promise.promisifyAll(require('fs'));
const _ = require('lodash');

let pFiles = fs.readdirSync('./products/');
let productFiles = _.filter(pFiles, function(pFile) {
    return pFile.toLowerCase().endsWith(".json");
})

Promise.each(productFiles, function(productFile) {
    return fs.readFileAsync('./products/' + productFile, 'utf-8')
        .then(function(rawProduct) {
            var product = JSON.parse(rawProduct);
            console.log("Checking product " + product.name + "...")
            return updateVersions(product)
        })
        .then(function(updatedData) {
            fs.writeFileSync('./products/' + productFile, JSON.stringify(updatedData, null, 2));
        }).delay(1000);
}).then(function() {
    console.log("Done!");
})
