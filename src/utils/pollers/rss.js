const _ = require('lodash');
const Parser = require('rss-parser');
const semver = require('semver');

async function updateProductVersions(name, versionDescriptor, productVersions) {
    console.log("Pulling RSS project data...");

    let parser = new Parser();

    // Get the RSS file
    let feed = await parser.parseURL(versionDescriptor.feedURL);

    for (const item of feed.items) {
        console.log("Evaluating post '" + item.title + "'...");
        var regex = RegExp(versionDescriptor.regex);
        if (regex.test(item.title)) {
            let version = semver.coerce(item.title);
            if (version != null) {
                console.log("Found version " + version.version + "...");

                if (!_.find(productVersions, { 'version': version.version, 'prerelease': version.prerelease })) {
                    console.log("Adding version " + version + "...");
                    let verObj = {
                        version: version.version,
                        url: item.link,
                        publishedDate: item.pubDate,
                        major: version.major,
                        minor: version.minor,
                        patch: version.patch,
                        prerelease: version.prerelease
                    }
                    productVersions.push(verObj);
                }
            };
        };

    }
    return productVersions;
}

module.exports = {
    updateProductVersions: updateProductVersions
}