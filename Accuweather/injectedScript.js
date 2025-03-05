// data flows from injectedScript -> content.js -> background.js -> content.js -> injectedScript.js

function setLocation(lat, long) {
    createBanner('Centering map to ' + long + ', ' + lat)

    window.mapContainers.cityRadar.setCenter([long, lat], 1000)
    window.mapContainers.cityRadar.addPopup("", [long, lat]);
}

function createBanner(text) {
    let banner = document.createElement('div')
    banner.innerHTML = text
    banner.style.position = 'fixed'
    banner.style.top = '30%'
    banner.style.left = '0'
    banner.style.width = '100%'
    banner.style.backgroundColor = 'royalblue'
    banner.style.color = 'white'
    banner.style.textAlign = 'center'
    banner.style.padding = '10px'
    banner.style.zIndex = '9999'
    document.body.appendChild(banner)
    setTimeout(() => {
        banner.remove()
    }, 2000)

}

window.addEventListener('extensionResponse', (event) => {
    let response = event.detail
    // console.log("Received response from background script:", response);
    if (response) {
        // send message to background script
        // extract coord from <meta> tag
        let e = document.createElement('div')
        e.innerHTML = response
        let metaTags = e.querySelectorAll('meta')
        let uri = Array.from(metaTags).filter(e => { return e.content.includes('maps.google.com') })[0].content
        let u = new URL(uri)
        let center = u.searchParams.get('center')

        let coords = center.split(',')
        let long = coords[1]
        let lat = coords[0]

        setLocation(lat, long)
    }
});


function sendDataToExtension(data) {
    window.dispatchEvent(new CustomEvent('myCustomEvent', { detail: data }));
}


function processInput() {
    // clear markers
    let val = document.querySelector('#refocus-search').value
 
    // Example usage:
    sendDataToExtension(val);
}

let map_container = document.querySelector('.page-content')
let map = document.querySelector('#cityRadar-container-legacy')

// create current location button
let currentLocationBtn = document.createElement('button')
currentLocationBtn.innerHTML = '📍'
currentLocationBtn.onclick = function() {
    navigator.geolocation.getCurrentPosition(function(position) {
        let long = position.coords.longitude
        let lat = position.coords.latitude
        setLocation(lat, long)
    });
}
map_container.insertBefore(currentLocationBtn, map)

// create input box
let input = document.createElement('input')
input.id = 'refocus-search'
input.type = 'text'
input.placeholder = 'Refocus search term...'
input.style.width = "60%"
input.style.margin = "5px"
input.onkeyup = function(e) {
    // if enter key pressed
    if (e.keyCode === 13) {
        processInput()
    }
}
map_container.insertBefore(input, map)

// create submit button
let btn = document.createElement('button')
btn.innerHTML = 'Create Marker'
btn.onclick = function() {
    processInput()
}
map_container.insertBefore(btn, map)




// check if lat and long are in the url and set default location
let url = new URL(window.location.href)
let lat = url.searchParams.get('lat')
let long = url.searchParams.get('long')
let q = url.searchParams.get('q')
if (lat && long) {
    setLocation(lat, long)
}
if (q) {
    sendDataToExtension(q)
}










