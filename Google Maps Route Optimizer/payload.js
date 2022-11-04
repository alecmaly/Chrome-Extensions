// console.log(Array.from(document.querySelectorAll('a[href*="goo.gl"]')).map(ele=>{return ele.innerText + ', Michigan'}).join('\n'))



// 20064 Chesterbrook Drive, Macomb Township, Michigan
// 23626 Demley Drive, Clinton Township, Michigan
// 20795 Balinski Drive, Clinton Township, Michigan
// 42580 Shulock Drive, Clinton Township, Michigan
// 38114 Suburban, Clinton Township, Michigan
// 300 Esplanade St. Mount Clemens, Michigan
// 49279 Clinton Terrace Drive, Macomb Township, Michigan

// 42523 D’Harte Court, Clinton Township, Michigan
// 47971 Feral Drive, Macomb Township, Michigan
// 210 Riverside Drive, Mount Clemens, Michigan
// 241309 Rugosa Drive, Clinton Township, Michigan
// 41845 Merrimac Circle, Clinton Township, Michigan
// 19766 Woodward Ave., Clinton Township, Michigan
// 54 High St., Mount Clemens, Michigan
// 42316 Shulock Drive, Clinton Township, Michigan
// 23103 King Drive, Clinton Township, Michigan
// 814 Huntington St., Mount Clemens, Michigan
// 18072 N. Oak Drive, Clinton Township, Michigan
// 20844 Moyer Drive, Clinton Township, Michigan
// 42527 Kollmorgen, Clinton Township, Michigan
// 25208 Saint Christopher, Harrison Township, Michigan
// 23121 Katzman St., Clinton Township, Michigan
// 50457 Victoria Place, Macomb Township, Michigan
// 23654 Whitley, Clinton Township, Michigan
// 39015 Lakeshore Drive, Harrison Township, Michigan


async function CheckTravelTime(addr1, addr2) {
    // function expects encodeURIComponent addr1 + addr2
    try {
        // let uri = `https://www.google.com/maps/dir/20064+Chesterbrook+Dr,+Macomb,+MI+48044/39015+Lakeshore+Dr,+Harrison+Twp,+MI+48045/`    
        let uri = `https://www.google.com/maps/dir/${encodeURIComponent(addr1)}/${encodeURIComponent(addr2)}`

        var html = await fetch(uri).then(resp => { return resp.text() })
        // var html = await fetch().then(resp => { return resp.text() })
        
        // make html queryable
        let el = document.querySelector('div')
        el.innerHTML = html

        // extract hours / minutes for route
        let distance_str = html.match(/(?<=")[^""]*?\d (hr|min)/g)[1]  // picked a random index, hopefully it doesn't break?
        let minutes = distance_str.match(/(\d*) min/) ? parseInt(distance_str.match(/(\d*) min/)[1]) : 0
        let hours = distance_str.match(/(\d*) hr/) ? parseInt(distance_str.match(/(\d*) hr/)[1]) : 0

        let total_minutes = minutes + hours * 60
        console.log(`${distance_str} | ${total_minutes} total minutes | from ${addr1} - to -> ${addr2}`)
        return { from: addr1, to: addr2, total_minutes: total_minutes }
    } catch {
        return { from: addr1, to: addr2, total_minutes: null }
    }
}

function GenerateButton() {
    var btn = document.createElement('button')
    btn.style.backgroundColor = "grey"
    btn.style.borderRadius = "25px"
    btn.style.width = "125px"
    btn.style.padding = "5px"
    btn.style.margin = "5px"
    return btn
}

async function main() {
    let anchor = document.querySelector('#omnibox-singlebox')

    while(!anchor) {
        await new Promise(r => setTimeout(r, 500));
    }
    console.log("Found")

    // create container
    var container = document.createElement('div')
    container.id = "route-optimizer-container"
    container.style.backgroundColor = "lightgrey"
    container.style.borderRadius = "10px"
    container.style.position = "absolute"
    container.style.display = "none" // hide by default

    document.body.appendChild(container)


    // btn: Close
    var btn = GenerateButton()
    btn.innerText = "Close"
    btn.onclick = async () => {    
        // navigate to location
        document.querySelector('#route-optimizer-container').style.display = 'none'
    }
    container.appendChild(btn)


    // btn: Go
    var btn = GenerateButton()
    btn.innerText = "Go"
    btn.onclick = async () => {    
        // navigate to location
        window.location.href = "https://www.google.com/maps/dir/" + document.querySelector('#all-destinations').value.split('\n').map(addr => { return encodeURIComponent(addr) }).join('/')
    }
    container.appendChild(btn)


    // btn: Optimize & Go
    var btn = GenerateButton()
    btn.innerText = "Optimize & Go"
    btn.onclick = async () => {
        route = []
        let addresses = document.querySelector('#all-destinations').value  
        // normalize to valid addresses
        start_address = addresses.split('\n')[0]
        route.push(start_address)
        addressesToRoute = addresses.split('\n').slice(1)

        while (addressesToRoute.length > 0) {
            let shortest_path = null
            
            let promises = []
            for (let addr of addressesToRoute) {
                promises.push(CheckTravelTime(route.at(-1), addr))
            }
            
            let results = await Promise.all(promises)
            // find shortest path node by total_minutes
            shortest_path = results.sort((a, b) => { return parseInt(a.total_minutes) - parseInt(b.total_minutes) })[0] 
            console.log("Shortest Path Obj: ", shortest_path)

            // add shortest path to route
            route.push(shortest_path.to)
            addressesToRoute = addressesToRoute.filter(addr => { return addr != shortest_path.to })
            
            console.log(`Stops left to analyze: ${addressesToRoute.length}`)
            document.querySelector('#route-optimizer-output').innerText = `Stops left to analyze: ${addressesToRoute.length}`
        }


        console.log('route is:', "https://www.google.com/maps/dir/" + route.map(addr => { return encodeURIComponent(addr) }).join('/')    )
        
        // navigate to location
        window.location.href = "https://www.google.com/maps/dir/" + route.map(addr => { return encodeURIComponent(addr) }).join('/')
    }
    container.appendChild(btn)


    // span: output / status
    var span = document.createElement('span')
    span.id = 'route-optimizer-output'
    span.style.float = 'right'
    span.style.padding = '5px'
    span.style.margin = '5px'
    container.appendChild(span)



    // add linebreak
    let linebreak = document.createElement('br')
    container.appendChild(linebreak)

    // create textarea input
    let addresses_from_url = window.location.pathname
        .replace(/\/maps\/?(dir\/)?/, '')
        .split(/[@\?]/g)[0] // remove parameters
        .split('/')
        .map(addr => { return decodeURIComponent(addr).replace(/\+/g, " ").trim() })
        .join('\n')

        // window.location.pathname.replace(/\/maps\/?(dir\/)?/, '')

    var input = document.createElement('textarea')
    input.id = "all-destinations"
    input.style.padding = "10px"
    input.style.height = "500px"
    input.style.width = "750px"
    input.style.border = "1px solid black"
    input.placeholder = "Input addresses here, one line at a time.."
    input.value = addresses_from_url ? addresses_from_url : `23626 Demley Drive, Clinton Township, Michigan
20795 Balinski Drive, Clinton Township, Michigan
49279 Clinton Terrace Drive, Macomb Township, Michigan
42580 Shulock Drive, Clinton Township, Michigan
38114 Suburban, Clinton Township, Michigan
300 Esplanade St. Mount Clemens, Michigan
20064 Chesterbrook Drive, Macomb Township, Michigan`

    container.appendChild(input)





    // btn: Route Optimizer
    var btn = GenerateButton()
    btn.style.marginLeft = "75px"
    btn.innerText = "Route Optimizer"

    btn.onclick = (evt) => {
        let ele = document.querySelector('#route-optimizer-container')
        // // move window to mouse
        // ele.style.left = `${evt.clientX}px`
        // ele.style.top = `${evt.clientY}px`
        ele.style.left = `25px`
        ele.style.top = `25px`

        // window.location.href = "https://www.google.com/maps/dir/" + document.querySelector('#all-destinations').value.split('\n').map(addr => { return encodeURIComponent(addr) }).join('/')
        ele.style.display == 'none' ? ele.style.display = 'block' : ele.style.display = 'none' 
    }

    // document.body.appendChild(btn)
    // attach to screen, may break when ID changes.
    // document.querySelector('#omnibox-singlebox').appendChild(btn) 
    anchor.appendChild(btn) 
}

main()