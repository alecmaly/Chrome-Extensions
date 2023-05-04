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

    await waitForElementToDisplay('.contest-tile.completed')
        
    let competitions = document.querySelectorAll('.contest-tile.completed')

    competitions.forEach(async competition => {
        let viewCompetitionBtn = competition.querySelector('.contest-tile__button-wrapper > .contest-tile__button')
        let url = viewCompetitionBtn.href

        let btn = document.createElement('button')
        btn.innerText = "Check"
        btn.style.color = "aqua"
        btn.onclick = async function (e) {
            let html = await fetch(url).then(resp => {
                return resp.text()
            })

            let container = document.createElement('div')
            container.innerHTML = html

            let startDate = container.querySelector('.contest-page__grid-value')

            e.target.innerText = `Check (${startDate.innerText}): ${html.includes("View Report")}`
        }

        viewCompetitionBtn.parentElement.appendChild(btn)
    })
})()