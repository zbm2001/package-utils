const Nativelize = require('./nativelize')

const referenceMap = Object.assign(Object.create(null), {
  object: !0,
  function: !0
})

const primitiveMap = Object.assign(Object.create(null), {
  string: !0,
  number: !0,
  boolean: !0,
  undefined: !0
})

function assignFilter (filter, target, ...overriders) {
  if (filter) {
    switch (typeof filter) {
      case 'string':
        overriders.forEach(overrider => {
          // 覆盖属性值为原始值的属性
          target !== overrider && Object.entries(overrider).forEach(([k, v]) => {
            if (typeof v === filter) target[k] = v
          })
        })
        return target
      case 'function':
        overriders.forEach(overrider => {
          // 覆盖属性值为原始值的属性
          target !== overrider && Object.entries(overrider).forEach(([k, v]) => {
            if (filter([k, v], target, overrider)) target[k] = v
          })
        })
        return target
      default:
        overriders.forEach(overrider => {
          // 覆盖属性值为原始值的属性
          target !== overrider && Object.entries(overrider).forEach(([k, v]) => {
            if (filter[typeof v]) target[k] = v
          })
        })
        return target
    }
  } else {
    return Object.assign(target, ...overriders)
  }
}

module.exports = {
  referenceMap,
  primitiveMap,
  assignFilter,

  /**
   * 分配值为字符串类型的属性
   * @param {Object} target 被分配属性的对象
   * @param {Array} overriders 分配属性的源对象
   */
  assignStringValue (target, ...overriders) {
    return assignFilter('string', target, ...overriders)
  },

  /**
   * 分配值为函数类型的属性
   * @param {Object} target 被分配属性的对象
   * @param {Array} overriders 分配属性的源对象
   */
  assignFunctionValue (target, ...overriders) {
    return assignFilter('function', target, ...overriders)
  },

  /**
   * 分配值为引用类型的属性
   * @param {Object} target 被分配属性的对象
   * @param {Array} overriders 分配属性的源对象
   */
  assignReferenceValue (target, ...overriders) {
    return assignFilter(referenceMap, target, ...overriders)
  },

  /**
   * 分配值为原始类型的属性
   * @param {Object} target 被分配属性的对象
   * @param {Array} overriders 分配属性的源对象
   */
  assignPrimitiveValue (target, ...overriders) {
    return assignFilter(primitiveMap, target, ...overriders)
  }
}

Nativelize(module.exports, Object)
