// looks up related contest page for each report on the reports page https://code4rena.com/reports
(async () => {
    let findings = document.querySelector('.report-toc').querySelectorAll("a[href]")

    for (let finding of findings) {
        try {
            let finding_id = finding.href.split("#")[1]
            
            let finding_ele = document.querySelector(`#${finding_id}`)
            if (finding_ele.nextElementSibling.innerText.startsWith("Submitted by ")) {
                let submitted_by_wardens_count = finding_ele.nextElementSibling.innerText.split(",").length
                finding.innerText = `(${submitted_by_wardens_count}) ${finding.innerText}`
                finding_ele.innerText = `(${submitted_by_wardens_count}) ${finding_ele.innerText}`
            }
        } catch {}
    }
    
})()


