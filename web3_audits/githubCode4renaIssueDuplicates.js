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

let btn_filter = document.createElement('button')
btn_filter.innerText = "Filter"
btn_filter.onclick = () => {
    document.querySelector('#js-issues-search').value = 'is:issue is:open label:"primary issue","satisfactory","sponsor acknowledged","selected for report" label:"2 (Med Risk)","3 (High Risk)" -label:"sponsor disputed"'
    document.querySelector('#js-issues-search').parentNode.submit()
}
anchor.insertBefore(btn_filter, anchor.children[0])


// anchor.appendChild(btn)


