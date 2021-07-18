require('shelljs/global')

/**
 * 封装 exec 返回的结果，加入原命令字符串属性
 * @returns {Object}
 */
function exec2 (cmdStr) {
  let execResult = exec(cmdStr)
  execResult.cmdStr = cmdStr
  return execResult
}

global.exec2 = exec2

module.exports = {
  exec2
}
