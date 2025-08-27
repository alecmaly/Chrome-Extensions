function getBody(doc) {
    let __RequestVerificationToken = encodeURIComponent(doc.querySelector('input[name="__RequestVerificationToken"]').value)
    let TargetTypeName = encodeURIComponent(doc.querySelector('input[id="TargetTypeName"]').value)
    let stepId = doc.querySelector('input[id="StepId"]').value
    let _formJourney = encodeURIComponent(doc.querySelector('input[id="formJourney"]').value)

    let key_arr = ['StepControls[0].FieldName', 'StepControls[0].TargetTypeName', 'StepControls[0].Model.ModelTypeName', 'StepControls[0].Model.ModelId', 'StepControls[0].StepControlId', 'StepControls[0].Step.StepId']
    let body = []
    for (let i = 0; i < 5; i++) {
        for (let key of key_arr) {
            k = key.replace('[0]', `[${i}]`)
            v = encodeURIComponent(doc.querySelector(`input[name="${k}"]`).value)
            
            body.push(`${encodeURIComponent(k)}=${v}`)
        }
    }
    body_str = body.join('&')
    return `__RequestVerificationToken=${__RequestVerificationToken}&TargetTypeName=${TargetTypeName}&StepId=${stepId}&formJourney=${_formJourney}&${body_str}`
}

window.data = {}
async function getFirstAppointments() {
    if (window.running) { return }
    window.running = true

    let MILES_THRESHOLD = parseInt(document.querySelector('#MILES_THRESHOLD').value)
    let active_locations = document.querySelectorAll('.Active-Unit') // look up disabled in case an appointment becomes available during refresh

    // collect all locations
    let promises = []
    let searched_locations = []
    for (let loc of active_locations) {
        let [loc_name, loc_address, loc_miles] = loc.innerText.split("\n")

        if (loc_miles) {
            loc_miles = parseInt(loc_miles.replace(" Miles", ""))
        }

        // if (!loc_miles || loc_miles > MILES_THRESHOLD) { console.log("Skipping"); continue }
        if (loc_miles > MILES_THRESHOLD) { console.log("Skipping"); continue }
        
        let data_id  = loc.getAttribute('data-id')

        searched_locations.push({name: loc_name, address: loc_address, miles: loc_miles, data_id: data_id})

        // fetch() params

        body_str = getBody(document)
        body_str += `&StepControls%5B3%5D.Model.Value=${data_id}`
        
        // END fetch() params
        
        promises.push(
            fetch("https://skiptheline.ncdot.gov/Webapp/Appointment/Index/a7ade79b-996d-4971-8766-97feb75254de", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded"
                },
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": body_str,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            })
                .then(resp => { return resp.text() })
        )
    }


    const handleResult = async (result, index) => {
        if (result.status === "fulfilled") {
            let loc = searched_locations[index]

            let html = result.value

            let startIndex = html.search("\\d{4}-\\d{2}-\\d{2}"); 

            if (startIndex == -1) { index++; return }
            let first_date = html.substring(startIndex, startIndex + 10)

            // fetch() params
            let el = document.createElement('div')
            el.innerHTML = html

            let stepControlTriggerId = el.querySelector('#StepControls_2__StepControlId').value
            let targetStepControlId = el.querySelector('#StepControls_3__StepControlId').value

            let body_str = getBody(el)
            body_str += `&StepControls%5B2%5D.Model.Value=${first_date}`
            
            let html_dates = await fetch(`https://skiptheline.ncdot.gov/Webapp/Appointment/AmendStep?stepControlTriggerId=${stepControlTriggerId}&targetStepControlId=${targetStepControlId}`, {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded"
                },
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": body_str,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            })
                .then(resp => { return resp.text() })
            
            let el_dates = document.createElement('div')
            el_dates.innerHTML = html_dates

            let times_str = Array.from(el_dates.querySelectorAll('option[data-datetime]')).filter(e => { return e.innerText !== "-" }).map(e => { return e.innerText }).join(", ")

            // END fetch() params
            
            window.data[loc.address] = {
                name: loc.name,
                address: loc.address,
                miles: loc.miles,
                first_date: first_date,
                data_id: loc.data_id,
                times_str: times_str
            }

            // console.log(`Promise ${index} fulfilled with value:`);
        } else {
            console.error(`Promise ${index} rejected with reason:`, result.reason);
        }
    };
    
    // Process each promise individually
    for (const [index, promise] of promises.entries()) {
        promise
            .then(value => handleResult({ status: "fulfilled", value }, index))
            .catch(reason => handleResult({ status: "rejected", reason }, index));
    }

    await Promise.allSettled(promises)
    

    window.running = false
}




// output
let title = document.querySelector('.step-title')
title.insertAdjacentHTML('afterend', "<div id='anchor'><div id='data-output'></div></div>")

let anchor = document.querySelector('#anchor')
let data_output = document.querySelector('#data-output')


let input = document.createElement('input')
input.id = 'MILES_THRESHOLD'
input.type = 'number'
input.value = "50"
anchor.appendChild(input)

let interval = setInterval(async () => { await getFirstAppointments() }, 1000 * 5)

let lastZip = null
let updateOutput = setInterval(async () => {
    debugger
    let currentZip = document.querySelector("#search-input").value
    if (currentZip !== lastZip) {
        console.log("Zip change, updating locations to track")
        lastZip = currentZip
        if (lastZip !== null) {
            window.data = {}
        }
    }

    let currentMiles = document.querySelector("#MILES_THRESHOLD").value
        // window.data = {}
    for (let key in window.data) {
        if (window.data[key].miles > currentMiles) {
            delete window.data[key]
        }
    }
    

    let sorted_results = Object.values(window.data)
                                // .sort((a, b) => { return new Date(b.first_date) - new Date(a.first_date) })
                                .sort((a, b) => {
                                    const dateComparison = new Date(a.first_date) - new Date(b.first_date);
                                    if (dateComparison !== 0) {
                                        return dateComparison;
                                    }
                                    return a.miles - b.miles;
                                });
                                

    data_output.innerHTML = ""
    for (let row of sorted_results) {
        if (row.first_date && row.times_str) {
            data_output.insertAdjacentHTML('beforeend', `${row.first_date} (${row.miles} miles) - (${row.times_str}) <span style='color:red; cursor: pointer' onclick='document.querySelector(\`[data-id="${row.data_id}"]\`).click()'>${row.name}</span> - <a target='_blank' href='https://www.google.com/maps?saddr=My+Location&daddr=${row.address}'>${row.address}</a><br>`)
        }
    }
}, 1000)