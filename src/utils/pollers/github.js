const config = require('../config.js');
const octokit = require('@octokit/rest')({
    auth: config.github.api_key
})
const Promise = require("bluebird");
const _ = require('lodash');
const semver = require('semver');

async function listTags(owner, project) {
    return octokit.paginate('GET /repos/:owner/:repo/tags', { owner: owner, repo: project })
        .then(tags => {
            tags.forEach(function (tag) {
                console.log("Tag name: " + tag.name);
            })
        })
}

async function updateProductVersions(name, versionDescriptor, productVersions) {
    console.log("Pulling GitHub project data...");
    let tags = await octokit.paginate('GET /repos/:owner/:repo/tags', { owner: versionDescriptor.owner, repo: versionDescriptor.project });

    for (const tag of tags) {
        console.log("Evaluating tag '" + tag.name + "'...");
        
        var regex = RegExp(versionDescriptor.regex);
        if (regex.test(tag.name)) {
            let version = semver.coerce(tag.name); 
            if (version != null) {
                console.log("Found version " + version.version + "...");

                if (!_.find(productVersions, { 'version': version.version, 'prerelease': version.prerelease })) {
                    console.log("Adding version " + version.version + "...");
                    let commit = await octokit.repos.getCommit({ owner: versionDescriptor.owner, repo: versionDescriptor.project, commit_sha: tag.commit.sha })
                    let verObj = {
                        version: version.version,
                        url: "https://github.com/" + versionDescriptor.owner + "/" + versionDescriptor.project + "/releases/tag/" + tag.name,
                        publishedDate: commit.data.commit.committer.date,
                        major: version.major,
                        minor: version.minor,
                        patch: version.patch,
                        prerelease: version.prerelease
                    }
                    productVersions.push(verObj);
                    // Add a small delay to prevent API lockout
                    await Promise.delay(500);
                }
            }
        }
    };

    return productVersions;
}

module.exports = {
    updateProductVersions: updateProductVersions,
    listTags: listTags
}