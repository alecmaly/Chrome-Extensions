async function CheckTravelTime(addr1, addr2) {
    // function expects encodeURIComponent addr1 + addr2
    try {
        let uri = `https://www.google.com/maps/dir/${encodeURIComponent(addr1)}/${encodeURIComponent(addr2)}`

        var html = await fetch(uri).then(resp => { return resp.text() })
        // var html = await fetch().then(resp => { return resp.text() })
        
        // make html queryable
        let el = document.querySelector('div')
        el.innerHTML = html

        // extract hours / minutes for route
        let distance_str = html.match(/(?<=")[^""]*?\d (hr|min)/g)[1]  // picked a random index (MAGIC VALUE), try other indexes if 
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

function GetAddressesFromUrl() {
    let addresses_from_url = window.location.pathname
        .replace(/\/maps\/?(dir\/)?/, '')
        .split(/[@\?]/g)[0] // remove parameters
        .split('/')
        .map(addr => { return decodeURIComponent(addr).replace(/\+/g, " ").trim() })
        .join('\n')
        
    return addresses_from_url ? addresses_from_url : `Belle Isle Aquarium, Detroit, MI, USA
    Michigan Central Station, Detroit, MI, USA
    The RiverWalk, Detroit, MI, USA
    Motown Museum, Detroit, MI, USA
    Heidelberg Project, Detroit, MI, USA
    The Fisher Building, Detroit, MI, USA`.replace(/\n\s*/g,'\n')
}

function SetGlobalStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        #select-location {
            -ms-overflow-style: none; /* for Internet Explorer, Edge */
            scrollbar-width: none; /* for Firefox */
            overflow-y: scroll; 
        }
        
        #select-location::-webkit-scrollbar {
            display: none; /* for Chrome, Safari, and Opera */
        }
        `;
    document.head.appendChild(style);
}

function SyncLocationColumnsFrom(mirrorFrom) {
    let select_location = document.querySelector('#select-location')
    let all_destinations = document.querySelector('#all-destinations')

    switch (mirrorFrom) {
        case 'select-location':
            // sync scroll
            all_destinations.scrollTo(0, select_location.scrollTop)
        break;
        case 'all-destinations':
            // sync height
            select_location.style.height = all_destinations.clientHeight + 'px'
            // sync scroll
            select_location.scrollTo(0, all_destinations.scrollTop)
        break;
        
    }
}

function BuildStartLocationIndexDOM() {
    let linebreak = document.createElement('br')
    window.startDestinationIndex = window.startDestinationIndex || 0
    let select_location = document.querySelector('#select-location')
    let addresses = document.querySelector('#all-destinations').value.split('\n') 
    select_location.innerHTML = ''

    for (let i = 0; i < addresses.length; i++) {
        let ele = document.createElement('span')
        ele.id = `destination-index-${i}`
        ele.innerHTML = `${i}.<br>`
        ele.value = i
        ele.style.borderRadius = '25px'
        ele.style.cursor = "pointer"
        ele.style.backgroundColor = window.startDestinationIndex == i ? 'royalblue' : 'inherit'
        ele.onmousedown = (evt) => {
            let clicked_index = evt.target.value
            // reset colors
            Array.from(document.querySelector('#select-location').children).forEach((ele, i) => { i <= clicked_index ? ele.style.backgroundColor = 'royalblue' :  ele.style.backgroundColor = 'inherit' })
            window.startDestinationIndex = clicked_index
            // BuildStartLocationIndexDOM()
        }
        select_location.appendChild(ele)
    }

    for (let i = 0; i <=3; i++)
        select_location.appendChild(linebreak)
}
// BuildStartLocationIndexDOM()

async function main() {
    SetGlobalStyles()
    // document.body.appendChild(btn)
    // attach to screen, may break when HTML changes.
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
        window.location.href = "https://www.google.com/maps/dir/" + document.querySelector('#all-destinations').value
            .split('\n')
            .filter(addr => { return addr.trim() != '' })
            .map(addr => { return encodeURIComponent(addr).trim() })
            .join('/')
    }
    container.appendChild(btn)


    // btn: Optimize & Go
    var btn = GenerateButton()
    btn.innerText = "Optimize & Go"
    btn.id = "optimize-and-go"
    btn.onclick = async () => {
        let OptimizeAndGoButton = document.querySelector('#optimize-and-go')
        
        if (window.optimizationRunning) {
            // cancel button clicked! 
            // update GUI state & return immediately if optimization is running
            window.optimizationRunning = false
            document.querySelector('#route-optimizer-output').innerText = ''
            OptimizeAndGoButton.innerText = "Optimize & Go" // update button
            return
        } else {
            // start optimization, update button to a cancel button
            OptimizeAndGoButton.innerText = "Cancel" // update button
            OptimizeAndGoButton.style.backgroundColor = 'indianred'
            window.optimizationRunning = true
        }

        try {
            route = []
            document.querySelector('#route-optimizer-output').innerText = `Starting route optimization, this may take a while...`
            
            // collect addresses 
            let addresses = document.querySelector('#all-destinations').value 
                                .split('\n')
                                .map(addr => { return addr.trim() })
                                .filter(addr => { return addr != '' })


            // TODO: Optimization / QOL Enhancnement - normalize to valid addresses??

            route = addresses.slice(0, window.startDestinationIndex + 1)
            addressesToRoute = addresses.slice(window.startDestinationIndex + 1)
            

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
                

                if (!window.optimizationRunning) return // return if scan was cancelled
                console.log(`Stops left to analyze: ${addressesToRoute.length}`)
                document.querySelector('#route-optimizer-output').innerText = `Stops left to analyze: ${addressesToRoute.length}`
            }


            console.log('route is:', "https://www.google.com/maps/dir/" + route.map(addr => { return encodeURIComponent(addr).trim() }).join('/')    )
            
            // navigate to location
            window.location.href = "https://www.google.com/maps/dir/" + route.map(addr => { return encodeURIComponent(addr).trim() }).join('/')
        } catch {
            window.optimizationRunning = false
        }
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
    var linebreak = document.createElement('br')
    container.appendChild(linebreak)

    // add linebreak
    let msg_span = document.createElement('span')
    msg_span.style.color = 'royalblue'
    msg_span.style.fontWeight = "600"
    msg_span.style.paddingLeft = '5px'
    msg_span.innerText = "** Optimization starts AFTER selected addresss. Selected addresses = FROZEN **"
    container.appendChild(msg_span)

    // add linebreak
    linebreak = document.createElement('br')
    container.appendChild(linebreak)

    // container for locations
    var container_locations = document.createElement('div')
    container_locations.style.display = 'flex'
    container.appendChild(container_locations)

    // select location
    var select_location = document.createElement('div')
    select_location.id = "select-location"
    select_location.style.flex = .5
    select_location.style.textAlign = "center"
    select_location.style.paddingTop = '10px'
    select_location.style.overflowY = 'scroll'
    select_location.onscroll = (evt) => { console.log(evt); SyncLocationColumnsFrom('select-location') }
    container_locations.appendChild(select_location)

    // create textarea input
    var input = document.createElement('textarea')
    input.style.flex = 10
    input.id = "all-destinations"
    input.style.padding = "10px"
    input.style.height = "500px"
    input.style.width = "750px"
    input.style.border = "1px solid black"
    input.placeholder = "Input addresses here, one line at a time.."
    let addresses_from_url = GetAddressesFromUrl()
    input.value = addresses_from_url
    input.onkeyup = () => { BuildStartLocationIndexDOM() }
    input.onscroll = () => { SyncLocationColumnsFrom('all-destinations') }
    input.onmouseup = () => { SyncLocationColumnsFrom('all-destinations') }

    container_locations.appendChild(input)


    // btn: Route Optimizer
    var btn = GenerateButton()
    btn.style.marginLeft = "75px"
    btn.innerText = "Route Optimizer"

    btn.onclick = (evt) => {
        let addresses_from_url = GetAddressesFromUrl()
        document.querySelector('#all-destinations').value = addresses_from_url

        let ele = document.querySelector('#route-optimizer-container')
        // // move window to mouse
        // ele.style.left = `${evt.clientX}px`
        // ele.style.top = `${evt.clientY}px`
        ele.style.left = `25px`
        ele.style.top = `25px`

        ele.style.display == 'none' ? ele.style.display = 'block' : ele.style.display = 'none' 

        BuildStartLocationIndexDOM()
    }

    anchor.appendChild(btn) 
}

main()




