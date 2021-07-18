const os = require('os')

// console.log('os.networkInterfaces()', os.networkInterfaces())
/*
 * os.networkInterfaces()
 * 本地服务器 windows 7
 * { WLAN:
 *    [ { address: 'fe80::c8d2:16fb:65bd:8b7e',
 *      netmask: 'ffff:ffff:ffff:ffff::',
 *      family: 'IPv6',
 *      mac: 'a4:34:d9:48:5a:e4',
 *      scopeid: 12,
 *      internal: false,
 *      cidr: 'fe80::c8d2:16fb:65bd:8b7e/64' },
 *      { address: '192.168.1.3',
 *        netmask: '255.255.255.0',
 *        family: 'IPv4',
 *        mac: 'a4:34:d9:48:5a:e4',
 *        internal: false,
 *        cidr: '192.168.1.3/24' } ],
 *   'Loopback Pseudo-Interface 1':
 *    [ { address: '::1',
 *      netmask: 'ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff',
 *      family: 'IPv6',
 *      mac: '00:00:00:00:00:00',
 *      scopeid: 0,
 *      internal: true,
 *      cidr: '::1/128' },
 *      { address: '127.0.0.1',
 *        netmask: '255.0.0.0',
 *        family: 'IPv4',
 *        mac: '00:00:00:00:00:00',
 *        internal: true,
 *        cidr: '127.0.0.1/8' } ],
 *   '本地连接* 12':
 *    [ { address: '2001:0:9d38:6ab8:286c:11a7:3f57:fefc',
 *      netmask: 'ffff:ffff:ffff:ffff::',
 *      family: 'IPv6',
 *      mac: '00:00:00:00:00:00',
 *      scopeid: 0,
 *      internal: false,
 *      cidr: '2001:0:9d38:6ab8:286c:11a7:3f57:fefc/64' },
 *      { address: 'fe80::286c:11a7:3f57:fefc',
 *        netmask: 'ffff:ffff:ffff:ffff::',
 *        family: 'IPv6',
 *        mac: '00:00:00:00:00:00',
 *        scopeid: 17,
 *        internal: false,
 *        cidr: 'fe80::286c:11a7:3f57:fefc/64' } ] }
 *
 * 测试服务器
 * { lo:
 *    [ { address: '127.0.0.1',
 *         netmask: '255.0.0.0',
 *         family: 'IPv4',
 *         mac: '00:00:00:00:00:00',
 *         internal: true } ],
 *    eth0:
 *     [ { address: '172.17.160.219',
 *         netmask: '255.255.240.0',
 *         family: 'IPv4',
 *         mac: '00:00:00:00:00:00',
 *         internal: false } ] }
 *
 * 云负载均衡服务器
 * { lo:
 *    [ { address: '127.0.0.1',
 *        netmask: '255.0.0.0',
 *        family: 'IPv4',
 *        mac: '00:00:00:00:00:00',
 *        internal: true } ],
 *   eth0:
 *    [ { address: '10.253.115.220',
 *        netmask: '255.255.252.0',
 *        family: 'IPv4',
 *        mac: '00:00:00:00:00:00',
 *        internal: false } ],
 *   eth1:
 *    [ { address: '116.62.74.16',
 *        netmask: '255.255.252.0',
 *        family: 'IPv4',
 *        mac: '00:00:00:00:00:00',
 *        internal: false } ] }
*/
exports.getNetworkInfo = function getNetworkInfo () {
  return os.networkInterfaces()
}

exports.getLANIPv4Address = function getLANIPv4Address () {
  let network = os.networkInterfaces()
  let address = '127.0.0.1'
  Object.values(network).some(eth => {
    return eth.some(item => {
      if (!item.internal && item.family === 'IPv4' && item.address.indexOf('10.') !== 0) {
        address = item.address
        return true
      }
    })
  })
  return address
}
