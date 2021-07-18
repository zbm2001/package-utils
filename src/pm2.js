const cluster = require('cluster')
require('./shelljs')

const cmds = {
  pm2: 'npm run pm2',
  deleteAll: 'pm2 delete all',
  restartAll: 'pm2 restart all',
  reloadAll: 'pm2 reload all',
  delete: 'pm2 delete ',
  restart: 'pm2 restart ',
  reload: 'pm2 reload '
}

/**
 * pm2 启动
 * @returns {Object} .code: 0 命令正确执行，其他为错误
 */
function run () {
  return exec2(cmds.pm2)
}

/**
 * pm2 判断当前为主进程
 * @returns {Boolean}
 */
function isMaster () {
  if (cluster.isMaster) return true
  const env = process.env
  if (env.pm_id && parseInt(env.NODE_APP_INSTANCE) === 0) return true
  return false
}

/**
 * pm2 删除全部进程
 * @returns {Object} .code: 0 命令正确执行，其他为错误
 */
function deleteAll () {
  return exec2(cmds.deleteAll)
}

/**
 * pm2 重启所有应用
 * @returns {Object} .code: 0 命令正确执行，其他为错误
 */
function restartAll () {
  return exec2(cmds.restartAll)
}

/**
 * pm2 重启 cluster mode下的所有应用
 * @returns {Object} .code: 0 命令正确执行，其他为错误
 */
function reloadAll () {
  return exec2(cmds.reloadAll)
}

/**
 * pm2 删除指定进程
 * @param {String} id
 * @returns {Object} .code: 0 命令正确执行，其他为错误
 */
function deleteOf (id) {
  return exec2(id ? cmds.delete + id : cmds.deleteAll)
}

/**
 * pm2 重启指定应用
 * @param {String} id
 * @returns {Object} .code: 0 命令正确执行，其他为错误
 */
function restart (id) {
  return exec2(id ? cmds.restart + id : cmds.restartAll)
}

/**
 * pm2 重启 cluster mode下的指定应用
 * @param {String} id
 * @returns {Object} .code: 0 命令正确执行，其他为错误
 */
function reload (id) {
  return exec2(id ? cmds.reload + id : cmds.reloadAll)
}

module.exports = {
  cmds,
  run,
  isMaster,
  deleteAll,
  restartAll,
  reloadAll,
  deleteOf,
  restart,
  reload
}
