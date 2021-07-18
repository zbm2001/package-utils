const ProgressBar = require('progress')

exports = module.exports = ProgressBar

exports.defaultOptions = {
  // clear: true, // 完成后清除进度条
  // renderThrottle: 0, // 渲染频度阀值（毫秒）
  actionName: 'downloading',
  complete: '=',
  incomplete: ' ',
  width: 20,
  total: 2 * 1024 * 1024
}

exports.createBar = function createBar (options) {
  options = Object.assign({}, exports.defaultOptions, options)
  let bar = new ProgressBar(`  ${options.actionName} [:bar] :rate/bps :percent :etas`, options)
  return bar
}
