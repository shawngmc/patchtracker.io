const octokit = require('@octokit/rest')({
    auth: '453c4b0064eb3e8ce759c224bf5a0e860c1ba384'
})
const Promise = require("bluebird");

async function githubUpdate(productData) {
    let pollingConfig = productData.polling;
    return octokit.paginate('GET /repos/:owner/:repo/tags', { owner: pollingConfig.owner, repo: pollingConfig.project })
        .then(tags => {
            return Promise.each(tags, function(tag) {
                console.log("Evaluating " + productData.name + " tag " + tag.name);
                console.log(tag);
                return Promise.each(pollingConfig.regexMap, function (regexSet) {
                    var regex = RegExp(regexSet.regex.test);
                    if (regex.test(tag.name)) {
                        let version = tag.name.replace(regex, regexSet.regex.parse);
                        let versionChain = regexSet.version;

                        return Promise.each(productData.version_chains, function (existingVersionChain) {
                            if (existingVersionChain.title === versionChain) {
                                let match = false;
                                existingVersionChain.versions.forEach(function (existingVersion) {
                                    if (existingVersion.version === version) {
                                        match = true;
                                    }
                                })
                                if (!match) {
                                    console.log("Adding version " + version + "...");
                                    return octokit.repos.getCommit({ owner: pollingConfig.owner, repo: pollingConfig.project, commit_sha: tag.commit.sha})
                                        .then(commit => {
                                            console.log(commit);
                                            let verObj = {};
                                            verObj.version = version;
                                            verObj.url = "https://github.com/" + pollingConfig.owner + "/" + pollingConfig.repo + "/releases/tag/" + tag.name;
                                            verObj.publishedDate = commit.data.commit.committer.date;
                                            existingVersionChain.versions.push(verObj);
                                            return Promise.delay(500);
                                        });
                                }
                            }
                        });
                    }
                });
            })
            .then(function() {
                return productData;
            });
            // tags.forEach(function (tag) {
            //     console.log("Evaluating " + productData.name + " tag " + tag.name);
            //     console.log(tag);
            //     let commit = octokit.repos.getCommit({ owner: pollingConfig.owner, repo: pollingConfig.project, commit_sha: tag.commit.sha});
            //     pollingConfig.regexMap.forEach(function (regexSet) {
            //         var regex = RegExp(regexSet.regex.test);
            //         if (regex.test(tag.name)) {
            //             let version = tag.name.replace(regex, regexSet.regex.parse);
            //             let versionChain = regexSet.version;

            //             productData.version_chains.forEach(function (existingVersionChain) {
            //                 if (existingVersionChain.title === versionChain) {
            //                     let match = false;
            //                     existingVersionChain.versions.forEach(function (existingVersion) {
            //                         if (existingVersion.version === version) {
            //                             match = true;
            //                         }
            //                     })
            //                     if (!match) {
            //                         console.log("Adding version " + version + "...");
            //                         let commit = octokit.repos.gitCommit({ owner: pollingConfig.owner, repo: pollingConfig.project, commit: tag.commit.sha});
            //                         console.log(commit);
            //                         let verObj = {};
            //                         verObj.version = version;
            //                         verObj.url = tag.url;
            //                         verObj.publishedDate = tag.published_at;
            //                         existingVersionChain.versions.push(verObj);
            //                     }
            //                 }
            //             })

            //         }
            //     })
            // })
            return productData;
        })
}

async function updateData(productData) {
    if (productData.polling.method.toLowerCase() === "github") {
        productData = await githubUpdate(productData);
    }
    return productData;
}

module.exports = updateData;