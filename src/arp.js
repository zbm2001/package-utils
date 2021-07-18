require('../../lib/utils/shelljs')

let strRegexLANIPv4PartFirst2 = '192\\.168\\.'
let strRegexLANIPv4Part = '(?:\\d|[1-9]\\d|1\\d{2}|[1-2](?:[0-4]\\d|5[0-5]))'
let strRegexLANIPv4LastPart = '(?:[1-9]|[1-9]\\d|1\\d{2}|[1-2](?:[0-4]\\d|5[0-5]))'
let strRegexLANIPv4 = strRegexLANIPv4PartFirst2 + strRegexLANIPv4Part + '\\.' + strRegexLANIPv4LastPart
let regexLANIPv4GM = new RegExp('(?:\\s+\\((' + strRegexLANIPv4 + ')\\)\\s+|\\s+(' + strRegexLANIPv4 + ')\\s+)', 'gm')

/**
 * arp -a
 * mac
 * localhost (192.168.1.1) at 1c:ab:34:66:eb:cd on en0 ifscope [ethernet]
 * ...
 * localhost (192.168.1.32) at 64:b0:a6:a9:cf:5c on en1 ifscope [ethernet]
 * localhost (192.168.1.35) at dc:41:5f:f:37:ec on en0 ifscope [ethernet]
 * localhost (192.168.1.39) at 44:6d:57:fe:5f:82 on en0 ifscope [ethernet]
 * localhost (192.168.1.39) at 44:6d:57:fe:5f:82 on en1 ifscope [ethernet]
 * localhost (192.168.1.43) at 38:c9:86:59:a7:4b on en0 ifscope permanent [ethernet]
 * localhost (192.168.1.47) at cc:8:8d:aa:97:a7 on en0 ifscope [ethernet]
 * localhost (192.168.1.47) at cc:8:8d:aa:97:a7 on en1 ifscope [ethernet]
 * localhost (192.168.1.49) at 0:ec:a:db:cc:df on en0 ifscope [ethernet]
 * ...
 * ? (224.0.0.251) at 1:0:5e:0:0:fb on en0 ifscope permanent [ethernet]
 * ? (224.0.0.251) at 1:0:5e:0:0:fb on en1 ifscope permanent [ethernet]
 * ? (239.255.255.250) at 1:0:5e:7f:ff:fa on en0 ifscope permanent [ethernet]
 * ? (239.255.255.250) at 1:0:5e:7f:ff:fa on en1 ifscope permanent [ethernet]
 *
 * linux
 * ? (10.253.115.247) at 3c:8c:40:4e:dd:46 [ether] on eth0
 * ? (116.62.75.247) at 3c:8c:40:4e:dd:46 [ether] on eth1
 *
 * windows
 * 接口: 192.168.1.91 --- 0xb
 *   Internet 地址         物理地址              类型
 *   192.168.1.1           1c-ab-34-66-eb-cd     动态
 *   ...
 *   192.168.1.90          b0-e2-35-78-b9-1b     动态
 *   192.168.1.95          b8-fc-9a-00-fb-7f     动态
 *   ...
 *   192.168.1.255         ff-ff-ff-ff-ff-ff     静态
 *   224.0.0.2             01-00-5e-00-00-02     静态
 *   224.0.0.22            01-00-5e-00-00-16     静态
 *   224.0.0.251           01-00-5e-00-00-fb     静态
 *   224.0.0.252           01-00-5e-00-00-fc     静态
 *   229.255.255.250       01-00-5e-7f-ff-fa     静态
 *   238.238.238.238       01-00-5e-6e-ee-ee     静态
 *   239.253.0.1           01-00-5e-7d-00-01     静态
 *   239.255.255.250       01-00-5e-7f-ff-fa     静态
 *   255.255.255.255       ff-ff-ff-ff-ff-ff     静态
 *
 */
function getLANIPv4List () {
  let execResult = exec2('arp -a')
  if (execResult.code) return null
  let stdout = execResult.stdout
  let arr = []
  let lastMatchCapture = ''
  while (regexLANIPv4GM.test(stdout)) {
    let matchCapture = RegExp.$1 || RegExp.$2
    lastMatchCapture !== matchCapture && arr.push(matchCapture)
  }
  return arr
}

module.exports = {
  getLANIPv4List,
  strRegexLANIPv4PartFirst2,
  strRegexLANIPv4Part,
  strRegexLANIPv4LastPart,
  strRegexLANIPv4
}
