const _ = require('lodash');
const Parser = require('rss-parser');

async function updateProductVersionChain(name, versionDescriptor, productVersions) {
    let logContext = "[" + name + "-" + versionDescriptor.version + "] ";
    console.log(logContext + "Pulling GitHub project data...");

    let parser = new Parser();

    // Get the RSS file
    let feed = await parser.parseURL(versionDescriptor.feedURL);

    for (const item of feed.items) {
        console.log(logContext + "Evaluating post '" + item.title + "'...");
            var regex = RegExp(versionDescriptor.regex.test);
            if (regex.test(item.title)) {
                let version = item.title.replace(regex, versionDescriptor.regex.parse);
                let versionChainName = versionDescriptor.version;
                console.log(logContext + "Found version " + version + "...");

                let versionChain = _.find(productVersions.version_chains, { 'title': versionChainName });
                if (!versionChain) {
                    versionChain = {};
                    versionChain.title = versionChainName;
                    versionChain.versions = [];
                    productVersions.version_chains.push(versionChain);
                }

                if (!_.find(versionChain.versions, { 'version': version })) {
                    console.log(logContext + "Adding version " + version + "...");
                    let verObj = {
                        version: version,
                        url: item.url,
                        publishedDate: item.pubDate,
                        major: semver.major(version),
                        minor: semver.minor(version),
                        patch: semver.patch(version)
                    }
                    versionChain.versions.push(verObj);
                }
            };
    };

    return productVersions;
}

module.exports = {
    updateProductVersionChain: updateProductVersionChain
}