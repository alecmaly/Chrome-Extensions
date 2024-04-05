let files = document.querySelectorAll('b')
let file = files[files.length - 1]

for (let file of files) {
    let codeblock = file.nextElementSibling
    let lines = Array.from(codeblock.querySelectorAll('span')).filter(line => { return line.innerText !== '' && !line.innerText.startsWith('//') })


    let neutral_count = Array.from(lines).filter(line => line.classList.contains('neutral')).length
    let unexecuted_count = Array.from(lines).filter(line => line.classList.contains('unexecuted')).length
    let executed_count = Array.from(lines).filter(line => line.classList.contains('executed')).length


    // create new gradent to show proportion of counts based on the percentage of executed lines where neutral is yellow, unexecuted is red, and executed is green
    let total_count = neutral_count + unexecuted_count + executed_count
    let neutral_percent = neutral_count / total_count
    let unexecuted_percent = unexecuted_count / total_count
    let executed_percent = executed_count / total_count

    let gradient_ele = document.createElement('div')
    gradient_ele.style.width = '10em'
    gradient_ele.style.height = '1em'
    gradient_ele.style.display = 'inline-block'
    gradient_ele.style.background = `linear-gradient(to right, gold ${neutral_percent * 100}%, red ${neutral_percent * 100}% ${neutral_percent * 100 + unexecuted_percent * 100}%, #afa ${neutral_percent * 100 + unexecuted_percent * 100}%)`

    file.insertAdjacentElement('beforebegin', gradient_ele)

    let show_hide_btn = document.createElement('button')
    show_hide_btn.innerText = 'Show/Hide'
    show_hide_btn.style.marginLeft = '1em'
    show_hide_btn.style.marginRight = '1em'
    show_hide_btn.onclick = () => {
        codeblock.style.display = codeblock.style.display === 'none' ? 'block' : 'none'
    }

    file.insertAdjacentElement('beforebegin', show_hide_btn)

    codeblock.style.display = 'none'
}



// navbar at top, show/expand all codeblocks
let navbar = document.createElement('div')
//make sticky
navbar.innerText = 'Navbar '
navbar.style.position = 'sticky'
navbar.style.top = '0'
navbar.style.zIndex = '1000'
navbar.style.background = '#eee'
navbar.style.width = '100%'
navbar.style.padding = '5px'
navbar.style.borderBottom = '1px solid black'
navbar.style.marginBottom = '.5em'


var showing_all = false
let show_all_btn = document.createElement('button')
show_all_btn.innerText = 'Show/Hide All'
show_all_btn.onclick = () => {
    showing_all = !showing_all
    let codeblocks = document.querySelectorAll('code')
    for (let codeblock of codeblocks) {
        codeblock.style.display = showing_all ? 'block' : 'none'
    }
}

navbar.appendChild(show_all_btn)
document.body.insertBefore(navbar, document.body.firstChild)



