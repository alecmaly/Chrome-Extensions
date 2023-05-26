function GetDuplicates() {
    let links = document.querySelectorAll('a[id^="issue_"]')
    
    links.forEach(async link => {
        let html = await fetch(link.href).then(resp => { return resp.text() }).then(text => { return text })
        let el = document.createElement('div')
        el.innerHTML = html
    
        let len = el.querySelectorAll('a.Link--primary[href*="/issues/"]').length
        link.innerText = `(${len}) ${link.innerText}`
    })
}    


let anchor = document.querySelector('#repo-content-turbo-frame')
let btn = document.createElement('button')
btn.innerText = "Show Duplicates"
btn.onclick = () => {
    GetDuplicates()
    btn.disabled = true
}
anchor.insertBefore(btn, anchor.children[0])
// anchor.appendChild(btn)
