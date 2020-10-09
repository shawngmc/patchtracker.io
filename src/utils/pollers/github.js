const config = require('../config.js');
const versionParsers = require('../version/parsers.js');
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

async function updateProductVersions(pollConfig, productVersions) {
    console.log("Pulling GitHub project data...");
    let tags = await octokit.paginate('GET /repos/:owner/:repo/tags', { owner: pollConfig.owner, repo: pollConfig.project });

    for (const tag of tags) {
        console.log("Evaluating tag '" + tag.name + "'...");
        
        let verObj = versionParsers.parse(tag.name, pollConfig);
        if (verObj != null) {
            console.log("Found version " + verObj.version + "...");

            if (!_.find(productVersions, { 'version': verObj.version })) {
                console.log("Adding version " + verObj.version + "...");
                let commit = await octokit.repos.getCommit({ owner: pollConfig.owner, repo: pollConfig.project, commit_sha: tag.commit.sha })
                verObj.url = "https://github.com/" + pollConfig.owner + "/" + pollConfig.project + "/releases/tag/" + tag.name;
                verObj.publishedDate = commit.data.commit.committer.date;
                productVersions.push(verObj);
                // Add a small delay to prevent API lockout
                await Promise.delay(500);
            }
        } else {
            console.log("No valid version found!")
        }
    };

    return productVersions;
}

module.exports = {
    updateProductVersions: updateProductVersions,
    listTags: listTags
}