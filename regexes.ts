
// 匹配：一或多个连字符或下划线
export const regex_delimiters_g = /[/_-]+/g

// 匹配：一或多个连字符+字母
export const regex_hyphensLowercase_g = /-+([a-zA-Z0-9])/g

// 匹配：一或多个连字符
export const regex_hyphens_g = /-+/g

// 匹配：路径分割器（正、反斜杠)
export const regex_pathSeparator_g = /[/\\]/g

/**
 * 匹配并捕获一级路径[1]和目录名[2]
 * @type {RegExp}
 */
export const regexPath1stDir = /^(\/([^/?#]*))/

/**
 * 创建一个匹配路径前缀的正则
 * @param {Array[String]} pathPrefixArr 路径前缀数组
 * @returns {RegExp}
 */
export function createPathPrefixRegex (pathPrefixArr: string[]) {
  return new RegExp(`^(${pathPrefixArr.join('|')})`)
}

/**
 * 创建一个匹配路径的正则
 * @param {Array[String]} pathPrefixArr 路径前缀数组
 * @returns {RegExp}
 */
export function createPathRegex (pathPrefixArr: string[]) {
  return new RegExp(`^(${pathPrefixArr.join('|')})(?=[?#]|$)`)
}
