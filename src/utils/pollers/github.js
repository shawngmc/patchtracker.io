const config = require('../config.js');
const octokit = require('@octokit/rest')({
    auth: config.github.api_key
})
const Promise = require("bluebird");
const _ = require('lodash');

async function listTags(owner, project) {
    return octokit.paginate('GET /repos/:owner/:repo/tags', { owner: owner, repo: project })
        .then(tags => {
            tags.forEach(function (tag) {
                console.log("Tag name: " + tag.name);
            })
        })
}

async function updateProductVersionChain(name, versionDescriptor, productVersions) {
    let logContext = "[" + name + "-" + versionDescriptor.version + "]"
    console.log("Pulling GitHub project data...");
    let tags = await octokit.paginate('GET /repos/:owner/:repo/tags', { owner: versionDescriptor.owner, repo: versionDescriptor.project });

    for (const tag of tags) {
        console.log("Evaluating tag '" + tag.name + "'...");
        var regex = RegExp(versionDescriptor.regex.test);
        if (regex.test(tag.name)) {
            let version = tag.name.replace(regex, versionDescriptor.regex.parse);
            let versionChainName = versionDescriptor.version;
            console.log("Found version " + version + "...");

            let versionChain = _.find(productVersions.version_chains, { 'title': versionChainName });
            if (!versionChain) {
                versionChain = {};
                versionChain.title = versionChainName;
                versionChain.versions = [];
                productVersions.version_chains.push(versionChain);
            }

            if (!_.find(versionChain.versions, { 'version': version })) {
                console.log("Adding version " + version + "...");
                let commit = await octokit.repos.getCommit({ owner: versionDescriptor.owner, repo: versionDescriptor.project, commit_sha: tag.commit.sha })
                let verObj = {};
                verObj.version = version;
                verObj.url = "https://github.com/" + versionDescriptor.owner + "/" + versionDescriptor.project + "/releases/tag/" + tag.name;
                verObj.publishedDate = commit.data.commit.committer.date;
                versionChain.versions.push(verObj);
                // Add a small delay to prevent API lockout
                await Promise.delay(200);
            }
        }
    };

    return productVersions;
}

module.exports = {
    updateProductVersionChain: updateProductVersionChain,
    listTags: listTags
}