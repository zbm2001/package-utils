module.exports = {
  // 匹配：一个小写字母
  regex_lowercase: /[a-z]/,

  // 匹配：一个连字符 + 一个小写字母
  regex_hyphenLowercase_g: /-[a-z]/g,

  // 匹配：一或多个连字符 + 一个小写字母
  regex_hyphensLowercase_g: /-+([a-z])/g,

  // 匹配：一个大写字母
  regex_uppercase_g: /[A-Z]/g,

  // 匹配：一或多个连字符 + 一个大写字母
  regex_hyphenUppercase_g: /-+([A-Z])/g,

  // 匹配：一或多个连字符或下划线
  regex_delimiters_g: /[/_-]+/g,

  // 匹配：一或多个连字符 + 一个字母（或数字）
  regex_hyphensLowercaseD_g: /-+([a-zA-Z0-9])/g,

  // 匹配：一或多个连字符
  regex_hyphens_g: /-+/g,

  // 匹配：路径分割器（正、反斜杠)
  regex_pathSeparator_g: /[/\\]/g,

  /**
   * 匹配并捕获一级路径[1]和目录名[2]
   * @type {RegExp}
   */
  regexPath1stDir: /^(\/([^/?#]*))/,

  /**
   * 创建一个匹配路径前缀的正则
   * @param {Array[String]} pathPrefixArr 路径前缀数组
   * @returns {RegExp}
   */
  createPathPrefixRegex (pathPrefixArr) {
    return new RegExp(`^(${pathPrefixArr.join('|')})`)
  },

  /**
   * 创建一个匹配路径的正则
   * @param {Array[String]} pathPrefixArr 路径前缀数组
   * @returns {RegExp}
   */
  createPathRegex (pathPrefixArr) {
    return new RegExp(`^(${pathPrefixArr.join('|')})(?=[?#]|$)`)
  }
}
