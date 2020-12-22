
var rows = Array.from(document.querySelectorAll('tr'))

// for each child
var row = rows[0]
rows.forEach(async row => {
  let url = row.children[0].children[0].href
  let html = await await fetch(url).then(resp => { return resp.text() }).then(text => { return text })
  
  let ele = document.createElement('div')
  ele.innerHTML = html
  
  // for each function
  let functions = Array.from(row.children[1].querySelectorAll('li'))
  
  functions.forEach(func => {
    let action = decodeURIComponent(func.querySelector('a').href.split('#')[1])
  
    let target = ele.querySelector('[id="' + action + '"]')
  
    let privs = findNextPrivsRequired(target)
  
    func.innerHTML = func.innerHTML.replace(func.innerText, func.innerText + ' : ' + privs)
  }) 
})

function findNextPrivsRequired(ele) {
  if (ele.textContent.includes('Privileges required')) 
    return ele.textContent.trim().split(":")[1]
  else 
    return findNextPrivsRequired(ele.nextSibling)  
}
