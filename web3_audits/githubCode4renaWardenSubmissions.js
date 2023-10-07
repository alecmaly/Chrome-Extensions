// let reports = Array.from(document.querySelectorAll('div[id*="-Analysis.md"]'))

async function GetReports() {
    window.base_url = window.location.href.slice(0, window.location.href.indexOf("/data") + 5) + "/"
    
    let resp_reports = await fetch(base_url, { credentials: 'include', headers: { 'Accept': 'application/json' } }).then(resp => { return resp.text() }).then(text => { return text })
    window.reports = JSON.parse(resp_reports).payload.tree.items
} 

GetReports()

function OpenWardensReports(username) {
    reports
        .filter(r => { return r.name.startsWith(`${username}-`) && r.name.endsWith('.json')  })
        .forEach(r => {
            window.open(base_url.replace("/tree/main/data", "") + "issues/" + r.name.replace(`${username}-`, "").replace(".json", ""), "_blank")
        })
}

async function GetWardenStats() {
    let promises = []
    
    analysis_reports = reports.filter(r => { return r.name.endsWith("-Analysis.md") })
    analysis_reports.forEach(report => {
        let url = base_url + report.name
        
        let p = fetch(url, { credentials: 'include', headers: { 'Accept': 'application/json' } }).then(resp => { return resp.text() }).then(text => { return text })
        promises.push(p)
    })
    
    user_timespent = []
    await Promise.allSettled(promises)
        .then((results) => {
                // debugger
                results.forEach((result) => {
                if (result.status === 'fulfilled') {
                    // get name
                    // (?<=/data/)0xSmartContract(?=-Analysis.md)
                    let name_matches = result.value.match(/(?<=\/data\/).*?(?=-Analysis.md)/g)
    
                    // get hours
                    let timespent_matches = result.value.match(/\d+ hours/g)
    
                    if (timespent_matches && timespent_matches.length > 0 && name_matches.length > 0) {
                        user_timespent.push({'username': name_matches[0], 'timespent': timespent_matches.slice(-1)[0]})
                    }
                } else if (result.status === 'rejected') {
                    console.log(`Promise rejected with reason: ${result.reason}`);
                }
            });
        });
    
    
    
    
    // get counts of reports for each user
    user_timespent.forEach(obj => {
        let user_reports = reports.filter(r => { return r.name.startsWith(`${obj.username}-`) && r.name.endsWith(".json") })
        obj.submissions_count = user_reports.length
    })
    
    
    
    

    let warden_stats = user_timespent
            .sort((a, b) => { return parseInt(a.timespent.split(' ')[0]) - parseInt(b.timespent.split(' ')[0]) })
            // .map((x) => { 
            //     return `${x.username.padEnd(20, " ")}${String(x.submissions_count).padEnd(5, " ")}${x.timespent}<br>`
            // })
    
    
    let total_hours = user_timespent.reduce((acc, x) => { return acc + parseInt(x.timespent.split(" ")[0])}, 0)
    
    // output to screen
    let stats_output_container = document.querySelector('#warden-stats-output')
    stats_output_container.innerHTML = ''
    for (let warden of warden_stats) {        
        let btn = document.createElement('button')
        btn.innerText = "open"
        btn.onclick = () => { OpenWardensReports(warden.username) }
        stats_output_container.appendChild(btn)

        stats_output_container.insertAdjacentHTML('beforeend', 
            ` ${warden.username.padEnd(20, " ")}${String(warden.submissions_count).padEnd(5, " ")}${warden.timespent}<br>`.replaceAll(" ", "&nbsp;")        
        )
    }

    stats_output_container.insertAdjacentHTML('beforeend', `Total Hours: ${total_hours}`)
}






// output to window
let anchor = document.querySelector('#repo-content-turbo-frame')

let pre = document.createElement('pre')
pre.style.paddingLeft = "5px"
pre.id = "warden-stats-output"
anchor.insertBefore(pre, anchor.children[0])

anchor.insertBefore(document.createElement("br"), anchor.children[0])

let btn = document.createElement('button')
btn.innerText = "Open Warden's Findings"
btn.onclick = () => {
    let username = document.querySelector('#search-warden').value
    OpenWardensReports(username.trim())
}
anchor.insertBefore(btn, anchor.children[0])


let input = document.createElement('input')
input.id = 'search-warden'
input.value = "Kek"
anchor.insertBefore(input, anchor.children[0])


let btn_getWardenStats = document.createElement('button')
btn_getWardenStats.innerText = "Get Warden Stats"
btn_getWardenStats.onclick = (evt) => {
    GetWardenStats()
    evt.target.disabled = true
}
anchor.insertBefore(btn_getWardenStats, anchor.children[0])

