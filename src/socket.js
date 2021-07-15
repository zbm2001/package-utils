import EventEmitter from '@zbm1/eventemitter'

const SOCKET_EVENT_TYPES = ['open', 'message', 'error', 'close']
const SOCKET_EVENT_NAMES = ['onopen', 'onmessage', 'onerror', 'onclose']

export default function Socket (url) {
  this.init(url)
}

EventEmitter.inherito(Socket, {
  socket: null,

  /**
   * web socket 初始化并创建连接
   * @param {Object} options 需要监听的事件集合
   */
  init (url) {
    this.url = url
  },

  /**
   * web socket 创建连接
   * @param {Object} options 需要监听的事件集合
   */
  createSocket (options) {
    // console.log('socket && socket.readyState', socket && socket.readyState)
    if (this.socket && this.socket.readyState === 1) {
      this.socketOff()
    } else {
      this.closeSocket()
      this.socket = new WebSocket(this.url)
    }
    this.socketOn(options)
  },

  socketOprateListeners (add, options) {
    if (options && typeof options === 'object') {
      let method = (add ? 'add' : 'remove') + 'EventListener'
      SOCKET_EVENT_TYPES.forEach(type => {
        options[type] && this.socket[method](type, options[type], false)
      })
    }
  },

  /**
   * web socket 添加事件监听
   * @param {Object} options 需要添加监听的事件集合
   */
  socketAddListeners (options) {
    this.socketOprateListeners(this.socket, true, options)
  },

  /**
   * web socket 取消事件监听
   * @param {Object} socket webSocket 对象
   * @param {Object} options 需要取消监听的事件集合
   */
  socketRemoveListeners (options) {
    this.socketOprateListeners(this.socket, false, options)
  },

  /**
   * web socket 添加事件监听
   * @param {Boolean} add 指定添加或删除事件
   * @param {Array|Object|Function} names 需要添加或删除监听的事件名数组、事件名和事件函数的键值集合、事件函数
   * @param {Function} [fn] 需要添加或删除监听的事件函数
   */
  socketOnOff (add, names, fn) {
    if (names) {
      switch (typeof names) {
        case 'string':
          if (add) {
            if (typeof fn === 'function') {
              names.split(/\s+/).forEach(name => {
                if (SOCKET_EVENT_NAMES.includes(name)) {
                  this.socket[name] = fn
                }
              })
            }
          } else if (typeof fn === 'function') {
            names.split(/\s+/).forEach(name => {
              if (SOCKET_EVENT_NAMES.includes(name)) {
                if (this.socket[name] === fn) {
                  this.socket[name] = null
                }
              }
            })
          } else {
            names.split(/\s+/).forEach(name => {
              if (SOCKET_EVENT_NAMES.includes(name)) {
                this.socket[name] = null
              }
            })
          }
          break
        case 'function':
          if (add) {
            SOCKET_EVENT_NAMES.forEach(name => {
              this.socket[name] = names
            })
          } else {
            SOCKET_EVENT_NAMES.forEach(name => {
              if (this.socket[name] === names) {
                this.socket[name] = null
              }
            })
          }
          break
        case 'object':
          if (Array.isArray(names)) {
            if (add) {
              if (typeof fn === 'function') {
                names.forEach(name => {
                  if (SOCKET_EVENT_NAMES.includes(name)) {
                    this.socket[name] = fn
                  }
                })
              }
            } else if (typeof fn === 'function') {
              names.forEach(name => {
                if (SOCKET_EVENT_NAMES.includes(name)) {
                  if (this.socket[name] === fn) {
                    this.socket[name] = null
                  }
                }
              })
            } else {
              names.forEach(name => {
                if (SOCKET_EVENT_NAMES.includes(name)) {
                  this.socket[name] = null
                }
              })
            }
          } else if (add) {
            SOCKET_EVENT_NAMES.forEach(name => {
              if (typeof names[name] === 'function') {
                this.socket[name] = names[name]
              }
            })
          } else {
            SOCKET_EVENT_NAMES.forEach(name => {
              if (!names[name]) {
                this.socket[name] = null
              } else if (typeof names[name] === 'function' && this.socket[name] === names[name]) {
                this.socket[name] = null
              }
            })
          }
          break
      }
    } else if (add) {
      if (typeof fn === 'function') {
        SOCKET_EVENT_NAMES.forEach(name => {
          this.socket[name] = fn
        })
      }
    } else if (typeof fn === 'function') {
      SOCKET_EVENT_NAMES.forEach(name => {
        if (this.socket[name] === fn) {
          this.socket[name] = null
        }
      })
    } else {
      SOCKET_EVENT_NAMES.forEach(name => {
        this.socket[name] = null
      })
    }
  },

  /**
   * web socket 添加事件监听
   * @param {Array|Object|Function} names 需要添加监听的事件名数组、事件名和事件函数的键值集合、事件函数
   * @param {Function} [fn] 需要添加监听的事件函数
   */
  socketOn (names, fn) {
    this.socketOnOff(true, names, fn)
  },

  /**
   * web socket 删除事件监听
   * @param {Array|Object|Function} names 需要删除监听的事件名数组、事件名和事件函数的键值集合、事件函数
   * @param {Function} [fn] 需要删除监听的事件函数
   */
  socketOff (names, fn) {
    this.socketOnOff(false, names, fn)
  },

  /**
   * web socket 发送消息
   * @param {String} jsonStr 发送数据反序列化后的字符串
   * @return {boolean} 发送是否成功
   */
  socketSend (jsonStr) {
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(jsonStr)
      return true
    }
    return false
  },

  /**
   * web socket 关闭并取消事件监听
   */
  closeSocket () {
    if (this.socket) {
      this.socket.close()
      // this.socketOff()
      // delete this.socket
    }
  },

  /**
   * web socket 关闭并取消事件监听
   */
  clearSocket () {
    if (this.socket) {
      this.socketOff()
      delete this.socket
    }
  }

}, {
  SOCKET_EVENT_TYPES,
  SOCKET_EVENT_NAMES
})
