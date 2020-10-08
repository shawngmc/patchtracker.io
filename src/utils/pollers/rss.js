const _ = require('lodash');
const Parser = require('rss-parser');

async function updateProduct(productData, versions) {
    if (!versions) {
        versions = {};
    }

    if (!versions.version_chains) {
        versions.version_chains = []
    }

    let parser = new Parser();
    let pollingConfig = productData.polling;

    // Get the RSS file
    let feed = await parser.parseURL(pollingConfig.feedURL);

    feed.items.forEach(item => {
        console.log("Evaluating post title " + item.title + "...");
        pollingConfig.regexMap.forEach(regexSet => {
            var regex = RegExp(regexSet.regex.test);
            if (regex.test(item.title)) {
                let version = item.title.replace(regex, regexSet.regex.parse);
                let versionChainName = regexSet.version;
                console.log("Found version " + version + "...");

                let versionChain = _.find(versions.version_chains, { 'title': versionChainName });
                if (!versionChain) {
                    versionChain = {};
                    versionChain.title = versionChainName;
                    versionChain.versions = [];
                    versions.version_chains.push(versionChain);
                }

                if (!_.find(versionChain.versions, { 'version': version })) {
                    console.log("Adding version " + version + "...");
                    let verObj = {
                        version: version,
                        url: item.url,
                        publishedDate: item.pubDate
                    }
                    versionChain.versions.push(verObj);
                }
            };
        });
    });
    return versions;
}

module.exports = {
    updateProduct: updateProduct
}