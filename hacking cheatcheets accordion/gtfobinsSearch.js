
var wrapper = document.querySelector('#bin-search-wrapper')


// add input to page
var ele = document.createElement('textarea')
ele.id = 'myinput'
ele.style.width = '100%'
ele.style.height = '150px'
ele.onkeyup = () => updateVisibility()

wrapper.appendChild(ele)



// on myinput change .. run func



function updateVisibility() {
  // get values to search for
  var programs = document.querySelector('#myinput').value.split('\n').map(val => { return val.split('/').splice(-1)[0].split('.')[0] }).filter(val => { return val != ""})

  // hide if not in programs
  var rows = document.querySelectorAll('tr')
  Array.from(rows).forEach(row => {
    let row_program = row.innerText.split('\n').map(val => { return val.trim() }).filter(val => { return val != "" })[0]
    
    /* update matched programs */
    // if (programs.includes(row_program) || programs.length == 0) 
    if (programs.filter(val => { return val.startsWith(row_program) }).length > 0 || programs.length == 0) {
      row.style.display = 'block'
        
      if (row.querySelector('#matches') == null) {
        // does not exist - create
        var ele = document.createElement('td')
        ele.id = 'matches'
        ele.innerText = "(" + programs.filter(val => { return val.startsWith(row_program) }).join(',') + ")"
        row.appendChild(ele)
      } else {
        row.querySelector('#matches').innerText = "(" + programs.filter(val => { return val.startsWith(row_program) }).join(',') + ")"
      }

    } else 
      row.style.display = 'none'
  })

  unique_binaries()
}


function unique_binaries() {
  var paths = `/usr/lib/x86_64-linux-gnu/lxc/lxc-user-nic
  /usr/lib/eject/dmcrypt-get-device
  /usr/lib/snapd/snap-confine
  /usr/lib/openssh/ssh-keysign
  /usr/lib/dbus-1.0/dbus-daemon-launch-helper
  /usr/lib/policykit-1/polkit-agent-helper-1
  /usr/bin/newuidmap
  /usr/bin/passwd
  /usr/bin/chsh
  /usr/bin/newgrp
  /usr/bin/gpasswd
  /usr/bin/newgidmap
  /usr/bin/pkexec
  /usr/bin/traceroute6.iputils
  /usr/bin/sudo
  /usr/bin/at
  /usr/bin/chfn
  /bin/fusermount
  /bin/umount
  /bin/mount
  /bin/ping
  /bin/su
  /usr/lib/vmware-tools/bin64/vmware-user-suid-wrapper
  /usr/lib/vmware-tools/bin32/vmware-user-suid-wrapper
  /usr/sbin/uuidd
  /usr/sbin/pppd
  /usr/bin/mtr
  /usr/bin/sudoedit
  /sbin/mount.nfs
  /bin/ping6
  /bin/nano
  /opt/gitlab/embedded/bin/ksu
  /snap/core/7270/bin/mount
  /snap/core/7270/bin/ping
  /snap/core/7270/bin/ping6
  /snap/core/7270/bin/su
  /snap/core/7270/bin/umount
  /snap/core/7270/usr/bin/chfn
  /snap/core/7270/usr/bin/chsh
  /snap/core/7270/usr/bin/gpasswd
  /snap/core/7270/usr/bin/newgrp
  /snap/core/7270/usr/bin/passwd
  /snap/core/7270/usr/bin/sudo
  /snap/core/7270/usr/lib/dbus-1.0/dbus-daemon-launch-helper
  /snap/core/7270/usr/lib/openssh/ssh-keysign
  /snap/core/7270/usr/lib/snapd/snap-confine
  /snap/core/7270/usr/sbin/pppd
  /snap/core/8689/bin/mount
  /snap/core/8689/bin/ping
  /snap/core/8689/bin/ping6
  /snap/core/8689/bin/su
  /snap/core/8689/bin/umount
  /snap/core/8689/usr/bin/chfn
  /snap/core/8689/usr/bin/chsh
  /snap/core/8689/usr/bin/gpasswd
  /snap/core/8689/usr/bin/newgrp
  /snap/core/8689/usr/bin/passwd
  /snap/core/8689/usr/bin/sudo
  /snap/core/8689/usr/lib/dbus-1.0/dbus-daemon-launch-helper
  /snap/core/8689/usr/lib/openssh/ssh-keysign
  /snap/core/8689/usr/lib/snapd/snap-confine
  /snap/core/8689/usr/sbin/pppd
  /usr/bin/mount
  /usr/bin/su
  /usr/bin/fusermount
  /usr/bin/umount
  /usr/libexec/amanda/calcsize
  /usr/libexec/amanda/planner
  /usr/libexec/amanda/runtar
  /usr/libexec/amanda/application/amgtar
  /usr/libexec/amanda/killpgrp
  /usr/libexec/amanda/dumper
  /usr/libexec/amanda/rundump
  /usr/lib/openssh/ssh-keysign
  /usr/lib/vmware-tools/bin32/vmware-user-suid-wrapper
  /usr/lib/vmware-tools/bin64/vmware-user-suid-wrapper
  /usr/lib/dbus-1.0/dbus-daemon-launch-helper
  /usr/lib/s-nail/s-nail-privsep
  /usr/lib/eject/dmcrypt-get-device
  /usr/bin/sudo
  /usr/bin/newgrp
  /usr/bin/chsh
  /usr/bin/passwd
  /usr/bin/chfn
  /usr/bin/gpasswd
  /usr/sbin/amservice
  /usr/sbin/amcheck
  /bin/mount
  /bin/ping
  /bin/fusermount
  /bin/su
  /bin/umount
  /bin/ping6
  /lib/dbus-1/dbus-daemon-launch-helper 
  /usr/bin/staprun 
  /usr/bin/chage 
  /usr/libexec/abrt-action-install-debuginfo-to-abrt-cache 
  /usr/sbin/usernetctl 
  /tmp/vmware-tools-distrib/lib/bin64/vmware-user-suid-wrapper 
  /tmp/vmware-tools-distrib/lib/bin32/vmware-user-suid-wrapper 
  /sbin/pam_timestamp_check 
  /sbin/unix_chkpwd`
  


  var common_base_paths = ['/bin/', '/usr/', '/sbin/', '/snap/']
  var unique_binary_for_searchsploit = []

  var binaries = paths.split('\n').map(path => { return path.split('/').splice(-1)[0].trim() })
    
  var my_paths = document.querySelector('#myinput').value
  
  var my_binaries = my_paths.split('\n').filter(line => { return line != '' })
  var unique_binaries = my_binaries.map(bin => {
    // is base common? 
    let isBaseUncommon = !common_base_paths.reduce((acc, base_path) => { return bin.startsWith(base_path) || acc }, false)
    let isUniqueBinary = !binaries.includes(bin.split('/').splice(-1)[0].trim())

    let val = ''
    if (isBaseUncommon || isUniqueBinary) 
      val += '<span style="color:red; font-weight:bold">' + bin + '</span>'
    else 
      val += '<span style="color: lightgrey">' + bin + '</span>'

    if (isBaseUncommon)
      val += ' (base is uncommon)'
      
    if (isUniqueBinary) {
      val += ' (possibly unique binary)'
      unique_binary_for_searchsploit.push(bin.split('/').splice(-1)[0].trim().replaceAll('-', ' '))
    }
    
    
    return val
  } )
  
  // print searchsploit cmd to console
  console.log(`printf '` + unique_binary_for_searchsploit.join('\\n') + `' |xargs -I{} sh -c "echo; printf 'SEARCHING: \"{}\"'; searchsploit {}" | grep -v "No Results"`)

  
  if (document.getElementById('unique_binaries')) {
    document.getElementById('unique_binaries').innerHTML = '<h1>Possible Unique Binaries</h1>' + unique_binaries.join('<br>') + '<br><br><h3>Searchsploit cmd to search for unique binaries:</h3>' + `printf '` + unique_binary_for_searchsploit.join('\\n') + `' |xargs -I{} sh -c "echo; printf 'SEARCHING: \\"{}\\"'; searchsploit {}" | grep -v "No Results"`
  } else {
    var ele = document.createElement('div')
    ele.id = 'unique_binaries'
    ele.innerHTML = '<h1>Possible Unique Binaries</h1>' + unique_binaries.join('<br>')
    document.querySelector('#bin-search-wrapper').appendChild(ele)
  }

}


// color sudo
document.querySelectorAll('a').forEach(ele => { 
  if (ele.innerText == 'Sudo') 
    ele.style.backgroundColor = 'yellow' 
  if (ele.innerText == 'SUID') 
    ele.style.backgroundColor = 'lightgreen' 
  if (ele.innerText == 'Limited SUID') 
    ele.style.backgroundColor = 'orange' 
})


// overload global keydown function
document.addEventListener("keydown", function (event) {
  event.stopPropagation();
}, true);
