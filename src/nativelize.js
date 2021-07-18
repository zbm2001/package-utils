function Nativelize (methods, any, protoInvade) {
  if (!(this instanceof Nativelize)) return new Nativelize(methods, any, protoInvade)
  this._methods = methods
  this._protoInvade = !!protoInvade
  methods.nativelize = () => this.nativelize(any)
  methods.unnativelize = () => this.unnativelize(any)
}

Object.assign(Nativelize.prototype, {
  _nativelized: false,
  _methods: null,
  _protoInvade: false,
  _protoMethods: null,
  /**
   * 原生对象化
   */
  nativelize (any) {
    if (this._nativelized) return
    this._nativelized = true
    Object.assign(any, this._methods)
    if (!this._protoInvade) return
    if (this._protoMethods) {
      Object.assign(any.prototype, this._protoMethods)
    } else {
      this._protoMethods = {}
      Object.entries(this._methods).forEach(([name, method]) => {
        any.prototype[name] = this._protoMethods[name] = function (...args) {
          return method(this, ...args)
        }
      })
    }
  },

  /**
   * 去原生对象化
   */
  unnativelize (any) {
    if (!this._nativelized) return
    this._nativelized = false
    Object.entries(this._methods).forEach(([name, method]) => {
      if (any[name] === method) delete any[name]
    })
    if (!this._protoInvade) return
    Object.entries(this._protoMethods).forEach(([name, method]) => {
      if (any.prototype[name] === method) delete any.prototype[name]
    })
  }
})

module.exports = Nativelize
