function FilterResults(search_str) {
    // let search_str = "heehaa"

    let id = document.querySelector('.url_container').innerText.split('.')[0]
    let data =  JSON.parse(localStorage.getItem('app'))
    let requests = data.data.filter(ele => { return ele['full-id'] == id })
    let rows = document.querySelector('.requests_table').querySelectorAll('tr')
    
    // show only search
    for (let i = 1; i < rows.length; i++) {
        try {
            console.log("row", i, rows.length, rows[rows.length - i], JSON.stringify(requests[i + 1]).toLowerCase())
            if (!JSON.stringify(requests[i + 1]).toLowerCase().includes(search_str.toLowerCase()))
                rows[rows.length - i].style.display = 'none'
            else
                rows[rows.length - i].style.display = 'table'
        } catch (err) {
            console.log(i, err)
        }
    }
}

function ShowAll() {
    let rows = document.querySelector('.requests_table').querySelectorAll('tr')
    for (let row of rows)
        row.style.display = 'table'
}

// FilterResults('meowmix')



let input = document.createElement('input')
input.placeholder = "Search Text..."
input.style.height = '3em'
input.style.paddingLeft = '1em'
input.style.paddingRight = '1em'
input.onkeyup = (ele) => {
    FilterResults(ele.target.value)
}

document.querySelector('.left_section').insertBefore(input, document.querySelector('.left_section').children[0])