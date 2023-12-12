// looks up related contest page for each report on the reports page https://code4rena.com/reports
(async () => {
    function waitForElementToDisplay(selector) {
        return new Promise(resolve => {
            const intervalId = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(intervalId);
                    resolve(element);
                }
            }, 100);
        });
    }

    await waitForElementToDisplay('.core-app-report__toc')

    // let TOC = document.querySelector('.report-toc')
    let TOC = document.querySelector('.core-app-report__toc')
    TOC.children[0].click()
    setTimeout(() => {
        // set timeout to wait for table of contents to load
        let findings = TOC.querySelectorAll("a[href]")

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
    }, 500)
})()


