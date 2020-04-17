const commands = require('probot-commands')

module.exports = app => {
  console.log('App loaded')
  // Type `/label foo, bar` in a comment box for an Issue or Pull Request
  commands(app, 'rebase', (context, command) => {
    // const labels = command.arguments.split(/, */)
    console.log(context.payload.comment);
    const params = context.issue({ comment_id: context.payload.comment.id, body: context.payload.comment.body, reaction: '+1'})

    // Post a comment on the issue
    return context.github.issues.updateComment(params)
  })
}