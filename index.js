const got = require("got");
const util = require('util');
const enqueue = require('enqueue');

const exec = util.promisify(require('child_process').exec);

const REBASE_LABEL = 'bot:rebase-plz';
const REBASE_FAILED = 'bot:rebase-failed';

require('dotenv').config()

// These are the defaults already. But lets specify them anyway.
const enqueueOpts = {
  concurrency: 1,

  // TODO this might be crazy. Will need to monitor memory on the server
  limit: Infinity
};

const gotOpts =  { 
  username: process.env.GITHUB_USER,
  password: process.env.GITHUB_TOKEN,
  responseType: 'json',
  resolveBodyOnly: true
};

module.exports = enqueue(app => {
  console.log("App loaded");
  app.on('pull_request.labeled', async context => {

    const rebaseLabel = context.payload.pull_request.labels.find(label => label.name === REBASE_LABEL);
    if (!rebaseLabel) {
      console.log('not a rebase label. bailing out...')
      return;
    }

    console.log(`Preparing to grab ${context.payload.repository.full_name}`)
    const remote = `https://${process.env.GITHUB_USER}:${process.env.GITHUB_TOKEN}@github.com/${context.payload.repository.full_name}`;
    
    // TODO: HAAACK There's some breaking octokit changes in the pipe. Will be resolved in probot v10 
    const params = context.issue();
    const issue = { ...params, issue_number: params.number };

    console.log(`Preparing to get details for ${context.payload.pull_request.url}`)
    const response = await got(context.payload.pull_request.url, gotOpts).json();

    const head = response.head.ref;
    const base = response.base.ref;

    try {
      const { stdout, stderr } = await exec(`./bin/rebase.sh -r ${remote} -h ${head} -b ${base} -n ${process.env.GITHUB_FULL_NAME} -e ${process.env.GITHUB_EMAIL}`);
      console.log('stdout:', stdout);
      console.error('stderr:', stderr);
    } catch (err) {
      console.error(err);
      if (err.code === 2) {
        return context.github.issues.addLabel({ ...issue, name: REBASE_FAILED })
      }
    };

    return context.github.issues.removeLabel({ ...issue, name: REBASE_LABEL })
  });
});
