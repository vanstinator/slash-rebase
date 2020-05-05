const commands = require("probot-commands");
const got = require("got");
const util = require('util');
const enqueue = require('enqueue');

const exec = util.promisify(require('child_process').exec);

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
  commands(app, "rebase", async (context, command) => {

    const remote = `https://${process.env.GITHUB_USER}:${process.env.GITHUB_TOKEN}@github.com/${context.payload.repository.full_name}`;
    
    // TODO: HAAACK There's some breaking octokit changes in the pipe. Will be resolved in probot v10 
    const params = context.issue();
    const comment = { ...params, issue_number: params.number };
    delete comment.number;

    const response = await got(context.payload.issue.pull_request.url, gotOpts).json();

    const head = response.head.ref;
    const base = response.base.ref;

    try {
      const { stdout, stderr } = await exec(`./bin/rebase.sh -r ${remote} -h ${head} -b ${base} -n ${process.env.GITHUB_FULL_NAME} -e ${process.env.GITHUB_EMAIL}`);
      console.log('stdout:', stdout);
      console.error('stderr:', stderr);
    } catch (err) {
      console.error(err);
      if (err.code === 2) {
        comment.body = "😢 Auto-rebase unsuccessful."
      } else if (err.code === 1) {
        comment.body = "😄 Nothing to do!"
      }

      return context.github.issues.createComment(comment);
    };

    return context.github.reactions.createForIssueComment({ ...comment, comment_id: context.payload.comment.id, content: 'hooray' });
  });
});
