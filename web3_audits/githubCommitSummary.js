// github commits

/*
    improvements
    - add filter paths option to filter out folders w/ "test" in the name
    - # files added, changed, removed. 
    - highlight interesting filetypes
*/


function getExtensionCounts(filenames) {
    let extensions = {};
    for (const filename of filenames) {
      const extension = filename.toLowerCase().split('.').slice(-1)[0]
      extensions[extension] = (extensions[extension] || 0) + 1;
    }
    return extensions
}


setInterval(() => {
    let GUID = "6204de06-5993-412f-a475-e467a1328bc0"

    console.log("here", )
    if (document.getElementById(GUID)) 
        return

    let commits = document.querySelectorAll('.js-commits-list-item')

    commits.forEach(async commit => {
    
        let link = commit.querySelector('[aria-label="View commit details"]').href
    
        let html = await fetch(link).then(resp => { return resp.text() }).then(html => { return html })
        let e = document.createElement('div')
        e.innerHTML = html
        
        let items_updated = e.querySelectorAll('a.Link--primary.Truncate-text')
        let filenames = Array.from(items_updated).map(ele => { return ele.innerText }).filter(path => {
            return !path.toLowerCase().includes('test')            
        })
        // let extensions = Array.from(items_updated).map(ele => { return ele.innerText.split('.').slice(-1)[0] })
            
        let extension_counts = getExtensionCounts(filenames)
    
        let d = document.createElement('div')
        d.id = GUID
        d.innerText = JSON.stringify(extension_counts)
        
        commit.insertAdjacentElement('afterend', d)        
    })
}, 1000)
