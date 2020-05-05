const commands = require("probot-commands");
const exec = util.promisify(require('child_process').exec);
const got = require("got");
const util = require('util');

require('dotenv').config()

const gotOpts =  { 
  username: process.env.GITHUB_USER,
  password: process.env.GITHUB_PASSWORD,
  responseType: 'json',
  resolveBodyOnly: true
};

module.exports = app => {
  console.log("App loaded");
  commands(app, "rebase", async (context, command) => {

    const remote = `https://${process.env.GITHUB_USER}:${process.env.GITHUB_PASSWORD}@github.com/${context.payload.repository.full_name}`;

    const params = context.issue({ body: "🎉 Rebase Complete!" });
    
    // TODO: HAAACK There's some breaking octokit changes in the pipe. Will be resolved in probot v10 
    const comment = { ...params, issue_number: params.number };
    delete comment.number;
       
    const response = await got(context.payload.issue.pull_request.url, gotOpts).json();

    const head = response.head.ref;
    const base = response.base.ref;

    try {
      await exec(`./bin/rebase.sh -u ${remote} -h ${head} -b ${base}`);
    } catch (err) {
      if (err.code === 2) {
        comment.body = "😢 Auto-rebase unsuccessful."
      } else if (err.code === 1) {
        comment.body = "😄 Nothing to do!"
      }
    };

    return context.github.issues.createComment(comment);
  });
};
