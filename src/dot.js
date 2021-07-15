const fs = require('fs')
// https://github.com/olado/doT/blob/master/doT.js
const dot = require('dot')

// const doT = {
//   name: 'doT',
//   version: '1.1.2',
//   templateSettings: {
//     evaluate: /\{\{([\s\S]+?(\}?)+)\}\}/g,
//     interpolate: /\{\{=([\s\S]+?)\}\}/g,
//     encode: /\{\{!([\s\S]+?)\}\}/g,
//     use: /\{\{#([\s\S]+?)\}\}/g,
//     useParams: /(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
//     define: /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
//     defineParams: /^\s*([\w$]+):([\s\S]+)/,
//     conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
//     iterate: /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
//     varname: 'it',
//     strip: true,
//     append: true,
//     selfcontained: false,
//     doNotSkipEncoded: false
//   },
//   template: undefined, //fn, compile template
//   compile: undefined, //fn, for express
//   log: true
// }

const templateSettings = Object.assign({}, dot.templateSettings)
// 指定是否清除换行符
templateSettings.strip = false
// 指定模板内根变量的名称
// templateSettings.varname = 'it'
const toString = Object.prototype.toString
// 模板分隔符替换为传统的：<% %>
Object.keys(templateSettings).filter((key) => {
  let value = templateSettings[key]
  if (value && value.global && toString.call(value) === '[object RegExp]') {
    value = value.source.replace(/\\{\\{/g, '<%').replace(/\\}\\}/g, '%>')
    if (value !== value.source) {
      templateSettings[key] = new RegExp(value, 'gm')
    }
    return true
  }
})

function readTemplate (path) {
  const templateStr = fs.readFileSync(path)
  if (templateStr) return templateStr
  console.warn('template file problems with ' + path);
}

function compileFromFile(path) {
  const templateStr = readTemplate(path)
  const templateFn = dot.template(templateStr, templateSettings)
  return templateFn
}

function compileFromToFile({from, data, to}) {
  const templateFn = dot.compileFromFile(from)
  dot.compileToFile(templateFn, to, data)
}

function compileFromStr(templateStr) {
  const templateFn = dot.template(templateStr, templateSettings)
  return templateFn
}

function compileStrToFile({templateStr, data, to}) {
  const templateFn = dot.template(templateStr, templateSettings)
  dot.compileToFile(templateFn, to, data)
}

function compileToFile(templateFn, path, data) {
  let content = templateFn(data)
  fs.writeFileSync(path, content)
}

function getTemplate (template) {
  if (fs.existsSync(template)) {
    template = fs.readFileSync(template, 'utf8')
  }
  return template
}

function compileToFn (template) {
  const templateStr = getTemplate(template)
  const templateFn = compileFromStr(templateStr)
  return templateFn
}

function compileToStr (template, data, def) {
  const templateFn = compileToFn(template)
  const str = templateFn(data, def)
  return str
}

module.exports = Object.assign(dot, {
  readTemplate,
  compileFromFile,
  compileFromToFile,
  compileFromStr,
  compileStrToFile,
  compileToFile,
  getTemplate,
  compileToFn,
  compileToStr
})
