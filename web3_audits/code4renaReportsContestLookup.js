// looks up related contest page for each report on the reports page https://code4rena.com/reports
(async () => {

    /** get contests (external fetch) **/
    let resp = await fetch("https://code4rena.com/contests", { headers: { 'Rsc': 1 } }).then(resp => { return resp.text() }).then(text => { return text })
    let json = JSON.parse(resp.split("\n")[14].slice(2))
    let contests = json[3]['children'][3]['children'][3].contests


    /** get reports (on current page) **/
    let reports = document.querySelectorAll('.report-tile')


    function formatDate(date) {
        let d = new Date(date)
        let year = d.getFullYear();
        let month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so +1 is needed
        let day = d.getDate().toString().padStart(2, '0');
    
        return `${year}-${month}-${day}`;
    }


    for (let report of reports) {
        try {
            let start_date = report.querySelector(".report-tile__content").querySelector('p').innerText.split("-")[0].trim()
            let end_date = report.querySelector(".report-tile__content").querySelector('p').innerText.split("-")[1].trim()
            
            let contest = Array.from(contests).find(ele => { return ele.start_time.split("T")[0] === formatDate(start_date) && ele.end_time.split("T")[0] === formatDate(end_date) })

            let leaderboard = `<a href='https://code4rena.com/contests/${contest.slug}' target='_blank'>leaderboard</a>`

            report.querySelector('footer').insertAdjacentHTML('afterend', "<span>" + contest.amount.replace("$$", "$") + " " + leaderboard + "</span>")
        } catch (e) {
            console.error("ERR on", report.querySelector('.report-tile__project-name').innerText, e)

        }
    }
})()


