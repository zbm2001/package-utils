
import globalThis from "./globalThis"

/**
 * namespace set or get value
 * @param {string|any} root
 * @param {string|any} sNamespace
 * @return {any}
 */
export default function namespace (root?: string | any, sNamespace?: string | any, variable?: any) : any {
  // 变量判断转化
  if (typeof root === 'string') {
    variable = sNamespace
    sNamespace = root
    root = globalThis
  }

  // 若未定义根对象或命名空间，返回未定义
  if (!root || typeof sNamespace !== 'string') {
    return
  }

  let namespaces = sNamespace.split('.')
  let i = -1
  let l = namespaces.length - 1

  // 若未定义，则为获取命名空间值
  if (typeof variable === 'undefined') {
    while (++i < l) {
      root = root[namespaces[i]]
      if (!root) {
        return
      }
    }
    return root[namespaces[l]]
  }

  // 若已定义，则为创建并返回命名空间值
  while (++i < l) {
    root = root[namespaces[i]] || (root[namespaces[i]] = {})
  }
  return (root[namespaces[l]] = variable)
}
