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

    function getFindingsForUser(username) {
        let findings = []
        // Array.from(container.querySelectorAll('a')).filter(ele => {
        //     return ele.innerText == username
        Array.from(container.querySelectorAll('em')).filter(ele => {
            return ele.innerText.includes(username)
        }).forEach(finding => {
            try {
                // let title = finding.parentElement.parentElement.previousSibling.previousSibling.innerText
                // let href = `${reportUrl}#${finding.parentElement.parentElement.previousSibling.previousSibling.children[0].href.split('#')[1]}`
                // let foundByCount = finding.parentElement.querySelectorAll('a').length

                let title = finding.parentElement.previousSibling.previousSibling.innerText
                let href = `${reportUrl}#${finding.parentElement.previousSibling.previousSibling.children[0].href.split('#')[1]}`
                let foundByCount = finding.innerText.replace('Submitted by ', '').replace(', also found by', '').replace('and ', '').split(' ').length

                if (title.trim().startsWith('['))
                    findings.push({
                        title: title,
                        href: href,
                        foundByCount: foundByCount
                    })
            } catch {
                console.log("Error on: ", finding)
            }
        })
        return findings
    }

    await waitForElementToDisplay('.leaderboard-handle__name')

    let reportUrl = document.querySelector('a[href*="/reports/"]').href
    let html = await fetch(reportUrl).then(resp => {
        return resp.text()
    })
    let container = document.createElement('div')
    container.innerHTML = html

    let competetors = document.querySelectorAll('.leaderboard__competitor')

    Array.from(competetors).slice(0, 20).forEach(competator => {
        try {
            let username = competator.querySelector('.leaderboard-handle__name') ? competator.querySelector('.leaderboard-handle__name').innerText : competator.querySelector('.team-name').querySelector('span').innerText
            let findings = getFindingsForUser(username)
            for (let finding of findings) {
                competator.parentElement.insertAdjacentHTML("beforebegin", `<a target="_blank" href='${finding.href}'>(${finding.foundByCount}) ${finding.title}</a><br>`)
            }
        } catch {}
    })
})();