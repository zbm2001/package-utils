
module.exports = {
  has (...args) {
    const argv = process.argv.slice()
    return args.length < 1 || (argv.length > 0 && args.every(arg => {
      return argv.some((a, i) => {
        if (a === arg) {
          argv.splice(i, 1)
          return true
        }
      })
    }))
  }
}
