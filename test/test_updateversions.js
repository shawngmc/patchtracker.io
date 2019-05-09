const updateversions = require('../src/polling/updateversions.js');
const fs = require('fs');

var nodeProductRaw = fs.readFileSync('./products/node.json', 'utf-8');
var nodeProduct = JSON.parse(nodeProductRaw);
var updatedData = updateversions(nodeProduct)
    .then(function(updatedData) {
        console.log(JSON.stringify(updatedData, null, 2));
    });
