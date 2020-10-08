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
              console.log( "Tag name: " + tag.name);
            })
        })
  }

async function updateProduct(productData, versions) {
    let pollingConfig = productData.polling;
    return octokit.paginate('GET /repos/:owner/:repo/tags', { owner: pollingConfig.owner, repo: pollingConfig.project })
        .then(tags => {
            return Promise.each(tags, function(tag) {
                console.log("Evaluating " + productData.name + " tag " + tag.name);
                return Promise.each(pollingConfig.regexMap, function (regexSet) {
                    var regex = RegExp(regexSet.regex.test);
                    if (regex.test(tag.name)) {
                        let version = tag.name.replace(regex, regexSet.regex.parse);
                        let versionChainName = regexSet.version;
                        console.log("Found version " + version + "...");

                        if (!versions) {
                            versions = {};
                        }

                        if (!versions.version_chains) {
                            versions.version_chains = []
                        }

                        let versionChain = _.find(versions.version_chains, {'title': versionChainName});
                        if (!versionChain) {
                            versionChain = {};
                            versionChain.title = versionChainName;
                            versionChain.versions = [];
                            versions.version_chains.push(versionChain);
                        }

                        if (!_.find(versionChain.versions, {'version': version})) {
                            console.log("Adding version " + version + "...");
                            return octokit.repos.getCommit({ owner: pollingConfig.owner, repo: pollingConfig.project, commit_sha: tag.commit.sha})
                                .then(commit => {
                                    let verObj = {};
                                    verObj.version = version;
                                    verObj.url = "https://github.com/" + pollingConfig.owner + "/" + pollingConfig.repo + "/releases/tag/" + tag.name;
                                    verObj.publishedDate = commit.data.commit.committer.date;
                                    versionChain.versions.push(verObj);
                                    return Promise.delay(500);
                                });
                        }
                    }
                });
            })
            .then(function() {
                return versions;
            });
        })
}

module.exports = {
    updateProduct: updateProduct,
    listTags: listTags
}