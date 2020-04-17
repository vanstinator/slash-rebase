const commands = require('probot-commands')

module.exports = app => {
  console.log('App loaded')
  // Type `/label foo, bar` in a comment box for an Issue or Pull Request
  commands(app, 'rebase', (context, command) => {
    // const labels = command.arguments.split(/, */)
    console.log(context)
    const params = context.issue({body: 'Rebased this branch successfully!'})

    // Post a comment on the issue
    return context.github.issues.createComment(params)
  })
}