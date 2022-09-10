
var base = document.querySelector('#gsft_main') ? document.querySelector('#gsft_main').contentWindow : window
var rows = base.document.querySelectorAll('[id^="row_x_dteem_cost_mgmt_business_case_cost_estimate_"]')

let RATE = 89.1

for (row of rows) {
    let current_hours = row.children[3].innerText
    let current_cost =  row.children[5].innerText.replace(',', '').replace('$', '')
    let target_cost = current_hours * RATE

    console.log(current_hours, current_cost, target_cost, current_cost == target_cost)
}