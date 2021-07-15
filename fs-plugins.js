const fs = require('fs')
const path = require('path')

const regex_lastSlash = /[/\\][^/\\]+$/
const regex_backslash = /\\/g
const regex_imgFile = /\.(?:png|gif|jpe?g)$/
const regex_asyncVueFile = /Async[A-Z][a-zA-Z]*\.vue$/

/**
 * 递归创建目录
 * @param {String} path
 */
function mkdirs (dirPath) {
  if (!fs.existsSync(dirPath)) {
    mkdirs(path.dirname(dirPath))
    fs.mkdirSync(dirPath)
  }
}

/**
 * 获取一个文件夹目录下的所有子文件夹名
 * @param {String} dirPath
 * @return {Array}
 */
function getChildFolderNames (dirPath) {
  let fileList = fs.readdirSync(dirPath)
  let folders = fileList.filter(filename => {
    // 获取当前文件的绝对路径
    let pathname = path.join(dirPath, filename)
    // 根据文件路径获取文件信息，返回一个fs.Stats对象
    let stats = fs.statSync(pathname)
    let isDir = stats.isDirectory()
    return isDir
  })
  return folders
}

/**
 * 获取一个文件夹目录树下的所有子孙后代文件夹名
 * @param {String} dirPath
 * @return {Array}
 */
function getDirtreeFolders (dirPath) {
  return readdirtree(dirPath, ({isDir}) => !!isDir)
}

// /**
//  * 返回递归遍历一个文件夹目录下的所有文件和文件夹，并带入一个可传参的执行函数
//  * @param {String} dirPath
//  * @param {Function|Null} fn
//  */
// function getQueryFiles (dirPath, fn) {
//   return queryFiles(dirPath, fn, [])
// }

/**
 * 递归遍历一个文件夹目录下的所有文件和文件夹，返回它们的相关信息对象数组，同时带入一个可传参每个信息对象的执行函数
 * @param {String} dirPath
 * @param {Function|Null} fn
 * @return {Array}
 */
function getQueryFiles (dirPath, fn, depth, maxDepth) {
  const files = dirtree(dirPath, fn, depth, maxDepth)
  prebuildWrapFiles(files)
  return files
}

function getChildJsFiles (dirPath) {
  let files = getChildFiles(dirPath, '.js')
  return files
}

function getChildFiles (dirPath, suffix) {
  let files = getDirtreeFiles(dirPath, suffix, 0, 1)
  return files
}

function getDirtreeVueFiles (dirPath) {
  let files = getDirtreeFiles(dirPath, '.vue')
  return files
}

function getDirtreeFiles (dirPath, suffix, ...args) {
  let files = dirtree(dirPath, ({isFile, filename}) => {
    let index
    return isFile &&
      filename !== 'index.js' &&
      filename.charAt(0) !== '_' &&
      (index = filename.lastIndexOf(suffix)) > -1 &&
      (index + suffix.length) === filename.length
  }, ...args)
  prebuildWrapFiles(files)
  return files
}

function getDirtreeAsyncVueFiles (dirPath) {
  let files = dirtree(dirPath, ({isFile, filename}) => {
    return isFile && regex_asyncVueFile.test(filename)
  })
  prebuildWrapFiles(files)
  return files
}

function getDirtreeImgFiles (dirPath) {
  let files = dirtree(dirPath, ({isFile, filename}) => {
    return isFile && regex_imgFile.test(filename)
  })
  prebuildWrapFiles(files)
  return files
}

function prebuildWrapFiles (files) {
  files.forEach(fileInfo => {
    fileInfo.pathname = fileInfo.pathname.replace(regex_backslash, '/')
    fileInfo.dirPath = fileInfo.dirPath.replace(regex_backslash, '/')
    fileInfo.originDirPath = fileInfo.originDirPath.replace(regex_backslash, '/')
  })
  return files
}

/**
 * 递归遍历一个文件夹目录下的所有文件和文件夹，并带入一个可传参的执行函数
 * @param {String} dirPath
 * @param {Function|Null} fn
 */
function readdirtree (dirPath, fn, depth, maxDepth) {
  return dirtree(dirPath, fn, depth, maxDepth)
}

/**
 * 递归遍历一个文件夹目录下的所有文件和文件夹，并带入一个可传参的执行函数
 * @param {String} dirPath
 * @param {Function|Null} fn
 */
function dirtree (dirPath, fn, depth = 0, maxDepth = 30, currentDepth = 0, originDirPath = dirPath) {
  const arrFiles = []
  if (depth >= maxDepth || currentDepth >= maxDepth) return arrFiles
  let fileList = fs.readdirSync(dirPath)
  fileList.forEach(filename => {
    // 获取当前文件的绝对路径
    let pathname = path.join(dirPath, filename)
    // 根据文件路径获取文件信息，返回一个fs.Stats对象
    let stats = fs.statSync(pathname)
    let isFile = stats.isFile()
    let isDir = stats.isDirectory()
    let fileInfo = {
      filename, depth, maxDepth, currentDepth, pathname, originDirPath, dirPath, stats, isFile, isDir
    }
    let accept
    let dirAccept
    if (fn)  {
      let result = fn(fileInfo)
      if (result) {
        accept = result.accept
        if (isDir) dirAccept = result.dirAccept
      } else {
        accept = result
      }
    }
    // 若未被拒绝且大于起点目录层级
    if (accept !== false && currentDepth >= depth) arrFiles.push(fileInfo)
    // 若是文件夹且未被拒绝
    if (isDir && dirAccept !== false) {
      // 递归遍历该文件夹下面的文件
      arrFiles.push(...dirtree(pathname, fn, depth, maxDepth, currentDepth + 1, originDirPath))
    }
  })
  return arrFiles
}

/**
 * 删除文件夹，递归遍历一个文件夹目录下的所有文件和文件夹
 * @param {String} dirPath
 * @param {Function|Null} fn
 */
function rmfolder (dirPath) {
  let isDir = fs.statSync(dirPath).isDirectory()
  if (isDir) {
    getQueryFiles(dirPath).reverse().forEach(fileInfo => {
      fileInfo.isDir ? fs.rmdirSync(fileInfo.pathname) : fs.unlinkSync(fileInfo.pathname)
    })
    fs.rmdirSync(dirPath)
  } else {
    fs.unlinkSync(dirPath)
  }
}

/**
 * 通过文件名排序
 * @param {Array} files 文件数组
 */
function sortFilesByFilename (files) {
  files.sort((a, b) => {
    return a.filename > b.filename ? 1 : a.filename < b.filename ? -1 : 0
  })
  return files
}

/**
 * 通过文件路径名排序
 * @param {Array} files 文件数组
 */
function sortFilesByPathname (files) {
  files.sort((a, b) => {
    return a.pathname > b.pathname ? 1 : a.pathname < b.pathname ? -1 : 0
  })
  return files
}

module.exports = {
  mkdirs,
  rmfolder,
  getChildFolderNames,
  getDirtreeFolders,
  getQueryFiles,
  getChildFiles,
  getChildJsFiles,
  getDirtreeImgFiles,
  getDirtreeVueFiles,
  getDirtreeAsyncVueFiles,
  getDirtreeFiles,
  readdirtree,
  sortFilesByFilename,
  sortFilesByPathname
}
