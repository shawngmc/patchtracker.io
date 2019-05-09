const octokit = require('@octokit/rest')({
    auth: '453c4b0064eb3e8ce759c224bf5a0e860c1ba384'
})

async function githubUpdate(productData) {
    let pollingConfig = productData.polling;
    return octokit.paginate('GET /repos/:owner/:repo/releases', { owner: pollingConfig.owner, repo: pollingConfig.project })
        .then(releases => {
            releases.forEach(function (release) {
                console.log("Evaluating " + productData.name + " tag " + release.tag_name);
                pollingConfig.regexMap.forEach(function (regexSet) {
                    var regex = RegExp(regexSet.regex.test);
                    let tag = release.tag_name;
                    if (regex.test(tag)) {
                        let version = tag.replace(regex, regexSet.regex.parse);
                        let versionChain = regexSet.version;

                        productData.version_chains.forEach(function (existingVersionChain) {
                            if (existingVersionChain.title === versionChain) {
                                let match = false;
                                existingVersionChain.versions.forEach(function (existingVersion) {
                                    if (existingVersion.version === version) {
                                        match = true;
                                    }
                                })
                                if (!match) {
                                    console.log("Adding version " + version + "...");
                                    let verObj = {};
                                    verObj.version = version;
                                    verObj.url = release.url;
                                    verObj.publishedDate = release.published_at;
                                    existingVersionChain.versions.push(verObj);
                                }
                            }
                        })

                    }
                })
            })
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