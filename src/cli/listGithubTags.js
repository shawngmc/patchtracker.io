const octokit = require('@octokit/rest')({
    auth: '453c4b0064eb3e8ce759c224bf5a0e860c1ba384'
  })
  const prompts = require('prompts');
  
  async function listGithubTags(owner, project) {
    return octokit.paginate('GET /repos/:owner/:repo/tags', { owner: owner, repo: project })
        .then(tags => {
            tags.forEach(function (tag) {
              console.log( "Tag name: " + tag.name);
            })
        })
  }


  listGithubTags("containous", "traefik");