// TODO:
// - Pull releases
// - List tag_name
// - Prompt for version chain names
// - Make version_chain and polling regex skeletons
// - Write object
const fs = require('fs');

const octokit = require('@octokit/rest')({
  auth: '453c4b0064eb3e8ce759c224bf5a0e860c1ba384'
})
const prompts = require('prompts');

async function listGithubTags(owner, project) {
  return octokit.paginate('GET /repos/:owner/:repo/releases', { owner: owner, repo: project })
      .then(releases => {
          releases.forEach(function (release) {
            console.log( "Tag name: " + release.tag_name);
          })
      })
}


 
let questions = [
  {
      type: 'text',
      name: 'name',
      message: 'What is the canonical name of the product?'
  },
  {
      type: 'text',
      name: 'homepage',
      message: 'What is the homepage of the product?'
  },
  {
      type: 'text',
      name: 'owner',
      message: 'Who is the github owner of the product?'
  },
  {
      type: 'text',
      name: 'project',
      message: 'What is the github project name of the product?'
  }
];


(async function(){
  let response = await prompts(questions);
  let baseProduct = {
    "name": response.name,
    "links": [
      {
        "title": "GitHub",
        "url": "https://github.com/" + response.owner + "/" + response.project 
      },
      {
        "title": "Homepage",
        "url": response.homepage
      }
    ],
    "polling": {
      "method": "github",
      "owner": response.owner,
      "project": response.project,
      "regexMap": []
    },
    "version_chains": []
  };
  
  fs.writeFileSync('./products/' + response.name.toLowerCase() + '.json', JSON.stringify(baseProduct, null, 2));
})();






// {
//     "name": "Node.js",
//     "links": [
//       {
//         "title": "GitHub",
//         "url": "https://github.com/nodejs/node"
//       },
//       {
//         "title": "Homepage",
//         "url": "https://nodejs.org"
//       }
//     ],
//     "polling": {
//       "method": "github",
//       "owner": "nodejs",
//       "project": "node",
//       "regexMap": [
//         {
//           "version": "12.x",
//           "regex": {
//             "test": "(v)(12).(\\d+).(\\d+)",
//             "parse": "$2.$3.$4"
//           }
//         },
//         {
//           "version": "11.x",
//           "regex": {
//             "test": "(v)(11).(\\d+).(\\d+)",
//             "parse": "$2.$3.$4"
//           }
//         },
//         {
//           "version": "10.x",
//           "regex": {
//             "test": "(v)(10).(\\d+).(\\d+)",
//             "parse": "$2.$3.$4"
//           }
//         },
//         {
//           "version": "9.x",
//           "regex": {
//             "test": "(v)(9).(\\d+).(\\d+)",
//             "parse": "$2.$3.$4"
//           }
//         },
//         {
//           "version": "8.x",
//           "regex": {
//             "test": "(v)(8).(\\d+).(\\d+)",
//             "parse": "$2.$3.$4"
//           }
//         },
//         {
//           "version": "7.x",
//           "regex": {
//             "test": "(v)(7).(\\d+).(\\d+)",
//             "parse": "$2.$3.$4"
//           }
//         },
//         {
//           "version": "6.x",
//           "regex": {
//             "test": "(v)(6).(\\d+).(\\d+)",
//             "parse": "$2.$3.$4"
//           }
//         },
//         {
//           "version": "5.x",
//           "regex": {
//             "test": "(v)(5).(\\d+).(\\d+)",
//             "parse": "$2.$3.$4"
//           }
//         },
//         {
//           "version": "4.x",
//           "regex": {
//             "test": "(v)(4).(\\d+).(\\d+)",
//             "parse": "$2.$3.$4"
//           }
//         }
//       ]
//     },
//     "version_chains": [
//       {
//         "title": "12.x",
//         "versions": [
//           {
//             "version": "12.0.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/16925447",
//             "publishedDate": "2019-04-23T15:52:16Z"
//           }
//         ]
//       },
//       {
//         "title": "11.x",
//         "versions": [
//           {
//             "version": "11.14.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/16712689",
//             "publishedDate": "2019-04-11T21:00:26Z"
//           },
//           {
//             "version": "11.13.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/16419924",
//             "publishedDate": "2019-03-28T19:36:18Z"
//           },
//           {
//             "version": "11.12.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/16150736",
//             "publishedDate": "2019-03-15T21:16:54Z"
//           },
//           {
//             "version": "11.11.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/15954356",
//             "publishedDate": "2019-03-06T19:44:17Z"
//           },
//           {
//             "version": "11.10.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/15572604",
//             "publishedDate": "2019-02-14T23:03:07Z"
//           },
//           {
//             "version": "11.9.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/15277675",
//             "publishedDate": "2019-01-30T22:13:59Z"
//           },
//           {
//             "version": "11.8.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/15250345",
//             "publishedDate": "2019-01-29T20:38:32Z"
//           },
//           {
//             "version": "11.7.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/15054766",
//             "publishedDate": "2019-01-18T13:52:57Z"
//           },
//           {
//             "version": "11.6.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14703821",
//             "publishedDate": "2018-12-26T16:35:28Z"
//           },
//           {
//             "version": "11.5.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14600057",
//             "publishedDate": "2018-12-18T19:26:31Z"
//           },
//           {
//             "version": "11.4.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14414819",
//             "publishedDate": "2018-12-07T18:26:56Z"
//           },
//           {
//             "version": "11.3.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14378280",
//             "publishedDate": "2018-12-06T04:51:29Z"
//           },
//           {
//             "version": "11.2.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14031840",
//             "publishedDate": "2018-11-15T21:24:53Z"
//           },
//           {
//             "version": "11.1.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/13796895",
//             "publishedDate": "2018-11-02T12:37:57Z"
//           },
//           {
//             "version": "11.0.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/13614902",
//             "publishedDate": "2018-10-23T18:22:21Z"
//           }
//         ]
//       },
//       {
//         "title": "10.x",
//         "versions": [
//           {
//             "version": "10.15.3",
//             "url": "https://api.github.com/repos/nodejs/node/releases/15926359",
//             "publishedDate": "2019-03-05T17:37:13Z"
//           },
//           {
//             "version": "10.15.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/15248315",
//             "publishedDate": "2019-01-29T19:02:00Z"
//           },
//           {
//             "version": "10.15.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14703815",
//             "publishedDate": "2018-12-26T16:35:03Z"
//           },
//           {
//             "version": "10.14.2",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14596990",
//             "publishedDate": "2018-12-18T16:48:10Z"
//           },
//           {
//             "version": "10.14.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14378303",
//             "publishedDate": "2018-12-06T04:54:06Z"
//           },
//           {
//             "version": "10.14.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14378299",
//             "publishedDate": "2018-12-06T04:53:22Z"
//           },
//           {
//             "version": "10.13.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/13800178",
//             "publishedDate": "2018-11-02T15:19:08Z"
//           },
//           {
//             "version": "10.12.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/13361377",
//             "publishedDate": "2018-10-10T21:32:13Z"
//           },
//           {
//             "version": "10.11.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/13000380",
//             "publishedDate": "2018-09-20T11:50:08Z"
//           },
//           {
//             "version": "10.10.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/12773858",
//             "publishedDate": "2018-09-06T22:07:51Z"
//           },
//           {
//             "version": "10.9.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/12426142",
//             "publishedDate": "2018-08-16T02:17:58Z"
//           },
//           {
//             "version": "10.8.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/12210786",
//             "publishedDate": "2018-08-01T19:14:03Z"
//           },
//           {
//             "version": "10.7.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11992919",
//             "publishedDate": "2018-07-18T18:36:23Z"
//           },
//           {
//             "version": "10.6.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11786656",
//             "publishedDate": "2018-07-05T06:32:59Z"
//           },
//           {
//             "version": "10.5.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11575391",
//             "publishedDate": "2018-06-20T19:25:45Z"
//           },
//           {
//             "version": "10.4.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11451485",
//             "publishedDate": "2018-06-13T00:25:10Z"
//           },
//           {
//             "version": "10.4.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11351027",
//             "publishedDate": "2018-06-06T14:38:58Z"
//           },
//           {
//             "version": "10.3.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11344623",
//             "publishedDate": "2018-06-06T08:36:13Z"
//           },
//           {
//             "version": "10.2.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11344619",
//             "publishedDate": "2018-06-06T08:35:52Z"
//           },
//           {
//             "version": "10.2.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11160366",
//             "publishedDate": "2018-05-24T15:30:05Z"
//           },
//           {
//             "version": "10.1.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11160335",
//             "publishedDate": "2018-05-24T15:29:11Z"
//           },
//           {
//             "version": "10.0.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11160278",
//             "publishedDate": "2018-05-24T15:27:41Z"
//           }
//         ]
//       },
//       {
//         "title": "9.x",
//         "versions": [
//           {
//             "version": "9.11.2",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11451480",
//             "publishedDate": "2018-06-13T00:24:36Z"
//           },
//           {
//             "version": "9.11.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10404032",
//             "publishedDate": "2018-04-05T07:17:37Z"
//           },
//           {
//             "version": "9.11.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10404023",
//             "publishedDate": "2018-04-05T07:17:08Z"
//           },
//           {
//             "version": "9.10.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10328575",
//             "publishedDate": "2018-03-30T03:45:14Z"
//           },
//           {
//             "version": "9.10.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10302663",
//             "publishedDate": "2018-03-28T16:38:05Z"
//           },
//           {
//             "version": "9.9.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10289508",
//             "publishedDate": "2018-03-27T23:14:36Z"
//           },
//           {
//             "version": "9.8.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10289506",
//             "publishedDate": "2018-03-27T23:14:14Z"
//           },
//           {
//             "version": "9.7.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/9967010",
//             "publishedDate": "2018-03-06T19:59:05Z"
//           },
//           {
//             "version": "9.7.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/9967003",
//             "publishedDate": "2018-03-06T19:58:46Z"
//           },
//           {
//             "version": "9.6.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/9966993",
//             "publishedDate": "2018-03-06T19:58:19Z"
//           },
//           {
//             "version": "9.6.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/9966989",
//             "publishedDate": "2018-03-06T19:57:57Z"
//           },
//           {
//             "version": "9.5.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/9478334",
//             "publishedDate": "2018-02-01T00:10:13Z"
//           },
//           {
//             "version": "9.4.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/9174180",
//             "publishedDate": "2018-01-10T23:24:01Z"
//           },
//           {
//             "version": "9.3.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8969711",
//             "publishedDate": "2017-12-19T21:19:45Z"
//           },
//           {
//             "version": "9.2.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8831391",
//             "publishedDate": "2017-12-08T16:12:25Z"
//           },
//           {
//             "version": "9.2.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8528679",
//             "publishedDate": "2017-11-15T15:30:59Z"
//           },
//           {
//             "version": "9.1.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8528665",
//             "publishedDate": "2017-11-15T15:30:09Z"
//           },
//           {
//             "version": "9.0.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8369613",
//             "publishedDate": "2017-11-03T05:08:48Z"
//           }
//         ]
//       },
//       {
//         "title": "8.x",
//         "versions": [
//           {
//             "version": "8.16.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/16859404",
//             "publishedDate": "2019-04-18T21:25:56Z"
//           },
//           {
//             "version": "8.15.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14703810",
//             "publishedDate": "2018-12-26T16:34:31Z"
//           },
//           {
//             "version": "8.14.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14597011",
//             "publishedDate": "2018-12-18T16:48:51Z"
//           },
//           {
//             "version": "8.14.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14378293",
//             "publishedDate": "2018-12-06T04:52:48Z"
//           },
//           {
//             "version": "8.13.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14104138",
//             "publishedDate": "2018-11-20T18:14:05Z"
//           },
//           {
//             "version": "8.12.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/12830121",
//             "publishedDate": "2018-09-11T05:46:41Z"
//           },
//           {
//             "version": "8.11.4",
//             "url": "https://api.github.com/repos/nodejs/node/releases/12426120",
//             "publishedDate": "2018-08-16T02:15:24Z"
//           },
//           {
//             "version": "8.11.3",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11451475",
//             "publishedDate": "2018-06-13T00:24:04Z"
//           },
//           {
//             "version": "8.11.2",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11160347",
//             "publishedDate": "2018-05-24T15:29:41Z"
//           },
//           {
//             "version": "8.11.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10328572",
//             "publishedDate": "2018-03-30T03:44:55Z"
//           },
//           {
//             "version": "8.11.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10302649",
//             "publishedDate": "2018-03-28T16:37:36Z"
//           },
//           {
//             "version": "8.10.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10289498",
//             "publishedDate": "2018-03-27T23:13:40Z"
//           },
//           {
//             "version": "8.9.4",
//             "url": "https://api.github.com/repos/nodejs/node/releases/9141033",
//             "publishedDate": "2018-01-08T06:36:14Z"
//           },
//           {
//             "version": "8.9.3",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8831370",
//             "publishedDate": "2017-12-08T16:11:14Z"
//           },
//           {
//             "version": "8.9.2",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8831347",
//             "publishedDate": "2017-12-08T16:09:37Z"
//           },
//           {
//             "version": "8.9.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8528653",
//             "publishedDate": "2017-11-15T15:29:36Z"
//           },
//           {
//             "version": "8.9.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8369612",
//             "publishedDate": "2017-11-03T05:08:16Z"
//           },
//           {
//             "version": "8.8.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8369609",
//             "publishedDate": "2017-11-03T05:07:45Z"
//           },
//           {
//             "version": "8.8.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8257341",
//             "publishedDate": "2017-10-25T15:49:45Z"
//           },
//           {
//             "version": "8.7.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8226910",
//             "publishedDate": "2017-10-23T19:54:09Z"
//           },
//           {
//             "version": "8.6.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8226895",
//             "publishedDate": "2017-10-23T19:53:12Z"
//           },
//           {
//             "version": "8.5.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8226886",
//             "publishedDate": "2017-10-23T19:52:42Z"
//           }
//         ]
//       },
//       {
//         "title": "7.x",
//         "versions": []
//       },
//       {
//         "title": "6.x",
//         "versions": [
//           {
//             "version": "6.17.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/16538934",
//             "publishedDate": "2019-04-03T20:00:57Z"
//           },
//           {
//             "version": "6.16.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14703803",
//             "publishedDate": "2018-12-26T16:34:04Z"
//           },
//           {
//             "version": "6.15.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14378311",
//             "publishedDate": "2018-12-06T04:55:10Z"
//           },
//           {
//             "version": "6.15.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/14378287",
//             "publishedDate": "2018-12-06T04:52:10Z"
//           },
//           {
//             "version": "6.14.4",
//             "url": "https://api.github.com/repos/nodejs/node/releases/12426106",
//             "publishedDate": "2018-08-16T02:12:43Z"
//           },
//           {
//             "version": "6.14.3",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11451465",
//             "publishedDate": "2018-06-13T00:23:10Z"
//           },
//           {
//             "version": "6.14.2",
//             "url": "https://api.github.com/repos/nodejs/node/releases/11160309",
//             "publishedDate": "2018-05-24T15:28:19Z"
//           },
//           {
//             "version": "6.14.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10328570",
//             "publishedDate": "2018-03-30T03:44:36Z"
//           },
//           {
//             "version": "6.14.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10302641",
//             "publishedDate": "2018-03-28T16:37:11Z"
//           },
//           {
//             "version": "6.13.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/9967220",
//             "publishedDate": "2018-03-06T20:11:09Z"
//           },
//           {
//             "version": "6.13.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/9758498",
//             "publishedDate": "2018-02-20T20:56:53Z"
//           },
//           {
//             "version": "6.12.3",
//             "url": "https://api.github.com/repos/nodejs/node/releases/9141029",
//             "publishedDate": "2018-01-08T06:35:23Z"
//           },
//           {
//             "version": "6.12.2",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8831360",
//             "publishedDate": "2017-12-08T16:10:42Z"
//           },
//           {
//             "version": "6.12.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8831338",
//             "publishedDate": "2017-12-08T16:08:54Z"
//           },
//           {
//             "version": "6.12.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8528643",
//             "publishedDate": "2017-11-15T15:29:04Z"
//           },
//           {
//             "version": "6.11.5",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8257324",
//             "publishedDate": "2017-10-25T15:49:04Z"
//           },
//           {
//             "version": "6.11.4",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8226903",
//             "publishedDate": "2017-10-23T19:53:42Z"
//           },
//           {
//             "version": "6.11.3",
//             "url": "https://api.github.com/repos/nodejs/node/releases/7643422",
//             "publishedDate": "2017-09-05T19:57:06Z"
//           }
//         ]
//       },
//       {
//         "title": "5.x",
//         "versions": []
//       },
//       {
//         "title": "4.x",
//         "versions": [
//           {
//             "version": "4.9.1",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10328566",
//             "publishedDate": "2018-03-30T03:44:16Z"
//           },
//           {
//             "version": "4.9.0",
//             "url": "https://api.github.com/repos/nodejs/node/releases/10302633",
//             "publishedDate": "2018-03-28T16:36:44Z"
//           },
//           {
//             "version": "4.8.7",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8831354",
//             "publishedDate": "2017-12-08T16:10:08Z"
//           },
//           {
//             "version": "4.8.6",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8528626",
//             "publishedDate": "2017-11-15T15:28:28Z"
//           },
//           {
//             "version": "4.8.5",
//             "url": "https://api.github.com/repos/nodejs/node/releases/8257266",
//             "publishedDate": "2017-10-25T15:45:43Z"
//           }
//         ]
//       }
//     ]
//   }