const commands = require("probot-commands");

module.exports = app => {
  console.log("App loaded");
  // Type `/label foo, bar` in a comment box for an Issue or Pull Request
  commands(app, "rebase", async (context, command) => {
    // const labels = command.arguments.split(/, */)
    const params = context.issue({ body: "Rebased this branch successfully!" });
    
    console.log(context.github)
    
    const git_token = await context.github.actions.getSecret({
      owner: "vanstinator",
      repo: "bot-test",
      name: "git-token"
    });
    // Post a comment on the issue
    return context.github.issues.createComment(params);
  });
};
