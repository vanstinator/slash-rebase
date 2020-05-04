const commands = require("probot-commands");
const git = require("simple-git/promise");

const USER = "vanstinator";
const PASS = process.env.GITHUB_TOKEN;
const REPO = "github.com/vanstinator/bot-test";

const remote = `https://${USER}:${PASS}@${REPO}`;

module.exports = app => {
  console.log("App loaded");
  // Type `/label foo, bar` in a comment box for an Issue or Pull Request
  commands(app, "rebase", async (context, command) => {
    // const labels = command.arguments.split(/, */)
    const params = context.issue({ body: "Rebased this branch successfully!" });

    // There's some breaking octokit changes in the pipe. Will be resolved in probot v10 
    const comment = { ...params, issue_number: params.number };
    delete comment.number;
    
    // clone the repo if it doesn't already exist
    try {
      await git()
        .silent(true)
        .clone(remote);
    } catch (e) {
      console.log(`${REPO} already checked out`, e);
    }
    
    // force delete local develop and pull from remote
    
    // checkout the PR branch
    
    // rebase on develop
    
    // force push
    
    // checkout develop and delete local 

    // Post a comment on the issue
    return context.github.issues.createComment(comment);
  });
};
