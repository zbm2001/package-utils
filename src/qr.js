const QRCode = require('qrcode-svg')

/**
 * 补全请求对象的属性
 * @param {String} url
 * @param {String} qrStr
 * @returns {String} svg
 */
function url2QRCodeSvg (url, qrStr) {
  const qrOptions = {
    content: url,
    padding: 0,
    width: 256,
    height: 256,
    color: '#000000',
    background: '#ffffff',
    ecl: 'M'
  }
  qrStr && qrStr.split(',').forEach((param) => {
    if (param.length > 3) {
      let index = param.indexOf('=')
      if (index > 0 && index < param.length - 1) {
        let key = param.slice(0, index)
        if (qrOptions.hasOwnProperty(key)) {
          let value = param.slice(index + 1)
          switch (typeof qrOptions[key]) {
            case 'string':
              qrOptions[key] = value
              return
            case 'number':
              qrOptions[key] = Number(value)
              return
          }
        }
      }
    }
  })
  // 颜色值的首字符自动补全 # 号
  qrOptions.color[0] !== '#' && (qrOptions.color = '#' + qrOptions.color)
  qrOptions.background[0] !== '#' && (qrOptions.background = '#' + qrOptions.background)
  return new QRCode(qrOptions).svg()
}

module.exports = {
  url2QRCodeSvg
}
