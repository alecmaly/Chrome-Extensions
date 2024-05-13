function levenshteinDistance(a, b) {
    const matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b[i - 1] === a[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Function to find the closest match
function findClosestMatch(targetString, stringArray) {
    let closestMatch = null;
    let smallestDistance = Infinity;

    for (let str of stringArray) {
        const distance = levenshteinDistance(targetString, str);
        if (distance < smallestDistance) {
            smallestDistance = distance;
            closestMatch = str;
        }
    }

    return closestMatch;
}


// MAIN


chrome.runtime.sendMessage({action: "getPrograms", url: "https://immunefi.com/boost/"}, function(response) {
    // start get programs
    let programs_html = response;

    let el = document.createElement('html')
    el.innerHTML = programs_html

    let programs = Array.from(el.querySelector('ul').querySelectorAll('li')).filter(row => { return row.innerText.includes('View results') })
    let programs_map = {}
    programs = programs.forEach(row => { 
        let name = row.querySelector('.font-medium').innerText.replace("Boost | ", "")
        let result_url = "https://immunefi.com" + row.querySelector('[href]').getAttribute('href')
        
        programs_map[name] = result_url
    })
    // end get programs

    let programNames = Object.keys(programs_map)

    // current page program
    const pathname = window.location.pathname; // Gets the path
    const segments = pathname.split('/');      // Splits the path into segments
    const currentPage = segments.pop() || segments.pop();  // Gets the last non-empty segment
    
    let programName = decodeURIComponent(currentPage)

    const closestMatch = findClosestMatch(programName, programNames);

    console.log(closestMatch)
    // get leaderboard
    chrome.runtime.sendMessage({action: "getLeaderboard", url: programs_map[closestMatch]}, function(responseLeaderboard) {
        // start get leaderboard
        let leaderboard_html = responseLeaderboard;

        let elLeaderboard = document.createElement('html')
        elLeaderboard.innerHTML = leaderboard_html

        let user_earnings_map = {}
        Array.from(elLeaderboard.querySelector('tbody').querySelectorAll('tr')).forEach(row => { 
            let name = row.children[0].innerText.replace(/^\d+(\s|\n)/, "")  // remove prefix number and space/newline
            let earnings = row.children[1].innerText
            user_earnings_map[name] = earnings  
        })

        // end get leaderboard
        console.log(user_earnings_map)


        document.querySelector('table').insertAdjacentHTML('beforebegin', `<a target="_blank" href="${programs_map[closestMatch]}">Immunefi link</a>`)

        // append to GitHub page
        let report_eles = Array.from(document.querySelector('table').querySelectorAll('.Link--primary[href]')).filter(e => e.offsetParent)

        Array.from(report_eles).forEach(async (report_ele) => {
            console.log()
            let url = report_ele.getAttribute('href')
            // let url = "https://github.com/immunefi-team/Bounty_Boosts/blob/main/DeGate/Report%2026431.md"
            let html = await fetch(url).then(resp => { return resp.text() })

            let el = document.createElement('html')
            el.innerHTML = html

            let regex = /by @([^\s]+)\s/
            let submitter_name = regex.exec(html)[1]
            // lookup to map

            let severity = /sev.{0,20}(low|med|high|crit)\s/ig.exec(html) || ""
            if (severity) {
                severity = `[${severity[1]}] `
            }

            let injected_str = `${severity}${submitter_name} (${user_earnings_map[submitter_name]})`

            report_ele.innerText = `${injected_str} - ${report_ele.innerText}`
            report_ele.onclick = (evt) => { evt.preventDefault(); window.open(url, '_blank') }
        })
    })
});
