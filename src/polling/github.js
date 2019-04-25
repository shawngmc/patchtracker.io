const octokit = require('@octokit/rest')()
octokit.paginate('GET /repos/:owner/:repo/releases', { owner: 'nodejs', repo: 'node' })
  .then(releases => {
    console.log(releases.length);
  })