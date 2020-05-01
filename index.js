const commands = require("probot-commands");
const git = require("simple-git/promise")('/tmp');

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

    const comment = { ...params, issue_number: params.number };
    delete comment.number;
    
    // Start doing stuff
    // try {
    //   await git()
    //     .silent(true)
    //     .clone(remote)
    //     .checkout('develop');
    // } catch (e) {
    //   console.error(`Failed to clone ${remote}`);
    // }

    // Post a comment on the issue
    return context.github.issues.createComment(comment);
  });
};
