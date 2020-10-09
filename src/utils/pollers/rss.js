const _ = require('lodash');
const Parser = require('rss-parser');
const versionParsers = require('../version/parsers.js');

async function updateProductVersions(pollConfig, productVersions) {
    console.log("Pulling RSS project data...");

    let parser = new Parser();

    // Get the RSS file
    let feed = await parser.parseURL(pollConfig.feedURL);

    for (const item of feed.items) {
        console.log("Evaluating post '" + item.title + "'...");
        
        let verObj = versionParsers.parse(item.title, pollConfig);
        if (verObj != null) {
            console.log("Found version " + verObj.version + "...");

            if (!_.find(productVersions, { 'version': verObj.version })) {
                console.log("Adding version " + verObj.version + "...");
                verObj.url = item.link;
                verObj.publishedDate = item.pubDate;
                productVersions.push(verObj);
            }
        } else {
            console.log("No valid version found!")
        }
    }
    return productVersions;
}

module.exports = {
    updateProductVersions: updateProductVersions
}