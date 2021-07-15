const regex_lowercase = /[a-z]/
const regex_hyphenLowercase_g = /-[a-z]/g
const regex_hyphensLowercase_g = /-+([a-z])/g
const regex_uppercase_g = /[A-Z]/g
const regex_hyphenUppercase_g = /-+([A-Z])/g
const regex_pathSeparators_g = /[\\/]+/g

const regexes = {
  regex_lowercase,
  regex_hyphenLowercase_g,
  regex_hyphensLowercase_g,
  regex_uppercase_g,
  regex_hyphenUppercase_g,
  regex_pathSeparators_g
}

const protoMethods = {
  /**
   * 转换为驼峰标记法，"-" + 小写字母转换为大写字母
   * @param {Boolean} hyphenUnDeduplication 连字符重复时，不做合并转换删除
   */
  camelcase (hyphenUnDeduplication = false) {
    return hyphenUnDeduplication
      ? this.replace(regex_hyphenLowercase_g, (m) => m.charAt(1).toUpperCase())
      : this.replace(regex_hyphensLowercase_g, (m, $1) => $1.toUpperCase())
  },
  /**
   * 转换为反驼峰标记法，大写字母转换为 "-" + 小写字母
   * @param {Boolean} hyphenUnDeduplication 连字符后为大写字母时，不做合并转换删除
   */
  reverseCamelcase (hyphenUnDeduplication = false) {
    return hyphenUnDeduplication
      ? this.replace(regex_uppercase_g, (m, $1) => ('-' + $1.toLowerCase()))
      : this.replace(regex_hyphenUppercase_g, (m) => ('-' + m.toLowerCase()))
  },
  /**
   * 替换路径分隔符
   * @param {String} replacement 指定用来替换的字符
   */
  replacePathSep (replacement = '$') {
    return this.replace(regex_pathSeparators_g, (m) => replacement)
  }
}

const staticMethods = {}
Object.keys(protoMethods).forEach(methodName => {
  staticMethods[methodName] = (str, ...args) => String(str)[methodName](...args)
})

Object.assign(String.prototype, {
  ...regexes,
  ...protoMethods
})

Object.assign(String, {
  ...regexes,
  ...staticMethods
})
