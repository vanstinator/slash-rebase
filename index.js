const commands = require("probot-commands");
const git = require('simple-git/promise');

module.exports = app => {
  console.log("App loaded");
  // Type `/label foo, bar` in a comment box for an Issue or Pull Request
  commands(app, "rebase", async (context, command) => {
    // const labels = command.arguments.split(/, */)
    const params = context.issue({ body: "Rebased this branch successfully!" });
    
    console.log(context.github)
    
    // Start doing stuff
    await git.clonse(`https://github.com/vanstinator/bot-test`)
    
    // Post a comment on the issue
    return context.github.issues.createComment(params);
  });
};
