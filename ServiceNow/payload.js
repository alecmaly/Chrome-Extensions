// sysparm_ck=3703ef9b979ddd1422e4f5faf253af8b74eafef3d3022c4d66c5e08e35dbdffca9dd7276&sys_target=x_dteem_cost_mgmt_business_case_cost_estimate&sys_uniqueValue=17e5762c8728c910bf24cb3c8bbb35b5&sys_action=42df02e20a0a0b340080e61b551f2909&x_dteem_cost_mgmt_business_case_cost_estimate.dte_hours=5


// UPDATE THIS VARIABLE
// Group name contains string in arr
let GROUPS = ['Security Mgmt', "Security Management"]

let GROUP_STRINGS = GROUPS   // groups to highlight yellow and add input field
let GROUP_STRINGS_TO_CLOSE = GROUPS  // demand groups to set: Close Confirmed
let FILTER_STRING = 'assignment_groupLIKE' + GROUP_STRINGS_TO_CLOSE.join('^ORassignment_groupLIKE') // "assignment_groupLIKESecurity Mgmt"  // filter string for demands (should match GROUP_STRINGS_TO_CLOSE)
let HOURLY_RATE = 89.10

/*********************
// Functions
*********************/

function MarkDemandsComplete() {
    var base = document.querySelector('#gsft_main') ? document.querySelector('#gsft_main').contentWindow : window

    // groups to close
    let rows = base.document.querySelector('[aria-label="Demand Tasks related list"]').querySelector('.list2_body').querySelectorAll('tr')
    rows = Array.from(rows).filter(ele => {
        for (let s of GROUP_STRINGS_TO_CLOSE) {
            if (ele.innerText.includes(s))
                return true
        }
        return false
     })

     for (let row of rows) {
        // get demand_sys_id from url
        url = row.querySelector('a.linked').href
        let url_obj = new URL(row.querySelector('a.linked.formlink').href);
        let urlParams = new URLSearchParams(url_obj.search);
        // const demand_sys_id = urlParams.get('sys_id')

        // set to closed
        // <value>3</value>
        // sysparm_processor=com.glide.ui_list_edit.AJAXListEdit&sysparm_want_session_messages=true&sysparm_type=set_value&sysparm_table=dmn_demand_task&sysparm_omit_links=&sysparm_xml=%3crecord_update%20table%3d%22dmn_demand_task%22%20field%3d%22parent%22%20query%3d%22parent%3d4d66f66c8728c910bf24cb3c8bbb3536%5eORDERBYparent.ref_dmn_demand.u_begin_fiscal_year%22%3e%3crecord%20sys_id%3d%2289c3e84f1bd89910430376ec0a4bcb5a%22%20operation%3d%22update%22%3e%3cfield%20name%3d%22state%22%20modified%3d%22true%22%20value_set%3d%22true%22%20dsp_set%3d%22false%22%3e%3cvalue%3e3%3c%2fvalue%3e%3c%2ffield%3e%3c%2frecord%3e%3c%2frecord_update%3e
        let parent_sys_id = base.document.querySelector('#sys_uniqueValue').value // from url
        let demand_sys_id = urlParams.get('sys_id') // from url
        let value = 3 // 3 = Closed Compelte | 1 = Open
        let x_usertoken = base.document.querySelector('#sysparm_ck').value

        fetch("https://dteenergyprod.service-now.com/xmlhttp.do", {
            "headers": {
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "x-usertoken": x_usertoken
            },
            "body": `sysparm_processor=com.glide.ui_list_edit.AJAXListEdit&sysparm_want_session_messages=true&sysparm_type=set_value&sysparm_table=dmn_demand_task&sysparm_omit_links=&sysparm_xml=%3crecord_update%20table%3d%22dmn_demand_task%22%20field%3d%22parent%22%20query%3d%22parent%3d${parent_sys_id}%5eORDERBYparent.ref_dmn_demand.u_begin_fiscal_year%22%3e%3crecord%20sys_id%3d%22${demand_sys_id}%22%20operation%3d%22update%22%3e%3cfield%20name%3d%22state%22%20modified%3d%22true%22%20value_set%3d%22true%22%20dsp_set%3d%22false%22%3e%3cvalue%3e${value}%3c%2fvalue%3e%3c%2ffield%3e%3c%2frecord%3e%3c%2frecord_update%3e`,
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        });
     }
}

async function RefreshIPSEstimate() {
    var base = document.querySelector('#gsft_main') ? document.querySelector('#gsft_main').contentWindow : window
    
    // return if ips estimate page is not found
    if (!base.document.querySelector('[aria-label="IPS Estimate Toolbar"]'))
        return

    var prev_btn = base.document.querySelector('[aria-label="IPS Estimate Toolbar"]').querySelector('[aria-label="Previous page"]')
    var next_btn = base.document.querySelector('[aria-label="IPS Estimate Toolbar"]').querySelector('[aria-label="Next page"]')

    var curr_num = base.document.querySelector('[aria-label="IPS Estimate Toolbar"]').querySelector('[aria-label="Skip to row"]').value

    if (curr_num == 1) {
        // on first page
        next_btn.click()

        // wait for prev button to not be disabled
        while(prev_btn.disabled) {
            await new Promise(r => setTimeout(r, 50));
        }

        prev_btn.click()
    } else {
        prev_btn.click()

        // wait for next button to not be disabled
        while(next_btn.disabled) {
            await new Promise(r => setTimeout(r, 50));
        }

        next_btn.click()
    }
}

/*********************
// Step 1: Filter Demands
// ** REQUIRED FOR CLOSING THEM OUT
*********************/
// var js = document.createElement("script");
// js.src = "https://dteenergyprod.service-now.com/scripts/doctype/js_includes_doctype.jsx";
// document.head.appendChild(js);

// var base = document.querySelector('#gsft_main') ? document.querySelector('#gsft_main').contentWindow : window
// base.runFilter

async function FilterDemands() {
    var base = document.querySelector('#gsft_main') ? document.querySelector('#gsft_main').contentWindow : window

    // click filters btn to invoke filter javascript to be dynamically loaded
    var selector = '.filter_row_condition'
    // var selector = '[id^="sys_display.dmn_demand_task.assignment_group."]'
    var filter_row = base.document.querySelector(selector)
    var btn = base.document.querySelector('[id="dmn_demand.dmn_demand_task.parent_filter_toggle_image"]')
    if (filter_row || !btn) { 
        // if filter row has been found, this function already ran... return
        base.runFilter('dmn_demand.dmn_demand_task.parent', 'dmn_demand.dmn_demand_task.parent')
        return
    } else {
        // click button to show filter row
        btn.click()
    }

    // wait for elements to load
    while(!base.document.querySelector(selector)) {
        await new Promise(r => setTimeout(r, 500));
    }

    // hook getFilter function to always return the filter we want + run filter
    // getFilter('dmn_demand.dmn_demand_task.parent')
    base.orig_f = base.getFilter
    base.getFilter = (str) => {
        if (str == 'dmn_demand.dmn_demand_task.parent')
            // update filter here for whatever you want to filter for
            return FILTER_STRING
        base.orig_f(str)
    }
    base.runFilter('dmn_demand.dmn_demand_task.parent', 'dmn_demand.dmn_demand_task.parent')
}
// FilterDemands()

/*********************
// Step 2: Configure IPS Estimate Page
*********************/

async function ConfigureIPSEstimatePage() {
    var base = document.querySelector('#gsft_main') ? document.querySelector('#gsft_main').contentWindow : window
    const UUID = 'd1c810bc-41fe-4fec-8c23-1dc89840f5b3'
    // check if any buttons exist and quit if so (don't add multiple input boxes)
    if(base.document.querySelector(`#${UUID}`) || !base.document.querySelector('[aria-label="IPS Estimate related list"]'))
        return

    let rows = base.document.querySelector('[aria-label="IPS Estimate related list"]').querySelector('.list2_body').querySelectorAll('tr')
    rows = Array.from(rows).filter(ele => {
        for (let s of GROUP_STRINGS) {
            if (ele.innerText.includes(s))
                return true
        }
        return false
    })

    for (let row of rows) {
        // set background as yellow
        row.children[2].style.backgroundColor = 'yellow'

        // add textinput that will update value on submission
        let input = base.document.createElement('input')
        input.id = UUID  // unique identifier
        input.onchange = async (ele) => {
            // console.log(ele.target)
            let x_usertoken = base.document.querySelector('#sysparm_ck').value
            let sysparm_ck = base.document.querySelector('#sysparm_ck').value
            let hours = ele.target.value
            let total_cost = hours * HOURLY_RATE

            // get sys_id from url
            url = row.querySelector('a.linked').href
            let url_obj = new URL(ele.target.parentElement.querySelector('a.linked').href);
            let urlParams = new URLSearchParams(url_obj.search);
            const sys_id = urlParams.get('sys_id')

            // update hours
            console.log(sys_id, ele.target.value)
            await fetch("https://dteenergyprod.service-now.com/x_dteem_cost_mgmt_business_case_cost_estimate.do", {
                "headers": {
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "x-usertoken": x_usertoken
                },
                "body": `sysparm_ck=${sysparm_ck}&sys_target=x_dteem_cost_mgmt_business_case_cost_estimate&sys_uniqueValue=${sys_id}&sys_action=42df02e20a0a0b340080e61b551f2909&x_dteem_cost_mgmt_business_case_cost_estimate.dte_hours=${hours}&x_dteem_cost_mgmt_business_case_cost_estimate.capital=100`, // &x_dteem_cost_mgmt_business_case_cost_estimate.total_cost.currency_type=USD&x_dteem_cost_mgmt_business_case_cost_estimate.total_cost=USD%3B${total_cost}
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(() => {
                RefreshIPSEstimate()
                
                // update total cost
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
            })
            // mark demands as complete
            MarkDemandsComplete()

            // refresh IPSEstimate page
            // await RefreshIPSEstimate()

            // reload page
            // location.reload()

            ele.preventDefault()
        }
        input.type = 'number'
        // row.insertBefore(input, row.children[0])
        row.children[2].insertBefore(input, row.children[2].children[0])

    }
}

/*********************
// MAIN LOOP
*********************/
setInterval(async () => {
    await FilterDemands()
    await ConfigureIPSEstimatePage()
}, 1500)








