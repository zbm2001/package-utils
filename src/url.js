/**
 * 获取app本地绝对路径（是否多页面应用判断）
 *
 * @param {String} url
 * @param {String|Object} key 为字符串时表示字段名，为对象时则表示字段键值表
 * @param {String|Boolean} value 当 key 为字符串时为字段值，key 为对象时则表示指定是否不做编码处理
 * @param {Boolean} unencode 不需要做编码处理
 * @return {String}
 */
function addUrlQuery (url, key, value, unencode) {
  if (typeof url !== 'string') {
    throw new TypeError('arguments[0] must be a string')
  }
  if (!key) {
    return url
  }
  let restUrl = url
  let searchIndex = url.indexOf('?')
  let hashIndex = url.indexOf('#')
  let search = ''
  let hash = ''
  if (hashIndex > -1) {
    hash = url.slice(hashIndex)
    if (searchIndex > -1) {
      search = url.slice(searchIndex, hashIndex)
      restUrl = url.slice(0, searchIndex)
    } else {
      restUrl = url.slice(0, hashIndex)
    }
  } else if (searchIndex > -1) {
    search = url.slice(searchIndex)
    restUrl = url.slice(0, searchIndex)
  }
  switch (typeof key) {
    case 'string':
      search += (search ? '&' : '?') + key + '=' + (unencode ? value : encodeURI(value))
      break
    case 'object':
      unencode = value
      let newSearch = Object.keys(key).map(unencode ? k => k + '=' + key[k] : k => k + '=' + encodeURI(key[k])).join('&')
      if (newSearch) {
        search += (search ? '&' : '?') + newSearch
      }
  }
  return restUrl + search + hash
}

module.exports = {
  addUrlQuery
}
