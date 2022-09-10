// let HOURLY_RATE = 89.1

var base = document.querySelector('#gsft_main') ? document.querySelector('#gsft_main').contentWindow : window
var rows = base.document.querySelectorAll('[id^="row_x_dteem_cost_mgmt_business_case_cost_estimate_"]')



// get sysparm_ck & x_usertoken
let html = await fetch(rows[0].querySelectorAll('td')[2].querySelector('a').href).then(resp => { return resp.text() })

let ele = document.createElement('div')
ele.innerHTML = html

let x_usertoken = window.g_ck //base.document.querySelector('#sysparm_ck').value
let sysparm_ck = ele.querySelector('input[name=sysparm_ck]').value // base.document.querySelector('#sysparm_ck').value


// update rows
for (row of rows) {
    let columns = row.querySelectorAll('td')
    let url = columns[2].querySelector('a').href
    let url_obj = new URL(url);
    let urlParams = new URLSearchParams(url_obj.search);
    let sys_id = urlParams.get('sys_id')

    let hours = parseInt(columns[3].innerText)
    let total_cost = hours * HOURLY_RATE

    fetch("https://dteenergyprod.service-now.com/x_dteem_cost_mgmt_business_case_cost_estimate.do", {
        "headers": {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-usertoken": x_usertoken
        },
        // sys_action=47fd7f4dc0a8000600a552278b5232ab
        // sys_action=42df02e20a0a0b340080e61b551f2909
        "body": `sysparm_ck=${sysparm_ck}&sys_target=x_dteem_cost_mgmt_business_case_cost_estimate&sys_uniqueValue=${sys_id}&sys_action=47fd7f4dc0a8000600a552278b5232ab&x_dteem_cost_mgmt_business_case_cost_estimate.total_cost=USD%3B${total_cost}`, // &x_dteem_cost_mgmt_business_case_cost_estimate.total_cost.currency_type=USD&x_dteem_cost_mgmt_business_case_cost_estimate.total_cost=USD%3B${total_cost}
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
}