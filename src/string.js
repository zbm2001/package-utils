const Nativelize = require('./nativelize')

const {
  regex_lowercase,
  regex_hyphenLowercase_g,
  regex_hyphensLowercase_g,
  regex_uppercase_g,
  regex_hyphenUppercase_g,
  regex_pathSeparators_g
} = require('./regexes')

module.exports = {
  /**
   * 转换为驼峰标记法，"-" + 小写字母转换为大写字母
   * @param {Boolean} hyphenUnDeduplication 连字符重复时，不做合并转换删除
   */
  upperFirst (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  /**
   * 转换为驼峰标记法，"-" + 小写字母转换为大写字母
   * @param {string} str
   * @param {Boolean} hyphenUnDeduplication 连字符重复时，不做合并转换删除
   */
  camelcase (str, hyphenUnDeduplication = false) {
    return hyphenUnDeduplication
      ? str.replace(regex_hyphenLowercase_g, (m) => m.charAt(1).toUpperCase())
      : str.replace(regex_hyphensLowercase_g, (m, $1) => $1.toUpperCase())
  },

  /**
   * 转换为反驼峰标记法，大写字母转换为 "-" + 小写字母
   * @param {string} str
   * @param {Boolean} hyphenUnDeduplication 连字符后为大写字母时，不做合并转换删除
   */
  reverseCamelcase (str, hyphenUnDeduplication = false) {
    return hyphenUnDeduplication
      ? str.replace(regex_uppercase_g, (m, $1) => ('-' + $1.toLowerCase()))
      : str.replace(regex_hyphenUppercase_g, (m) => ('-' + m.toLowerCase()))
  },

  /**
   * 替换路径分隔符
   * @param {string} str
   * @param {String} replacement 指定用来替换的字符
   */
  replacePathSep (str, replacement = '$') {
    return str.replace(regex_pathSeparators_g, (m) => replacement)
  }
}

Nativelize(module.exports, String, true)
