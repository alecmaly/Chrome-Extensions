
var search_container = document.createElement('div')

var tag_input = document.createElement('input')
tag_input.placeholder = 'filter tags'
tag_input.onkeyup = (e) => {
    console.log(e.target.value)
    Array.from(document.querySelector('#tagFilter').children).forEach(ele => {
        ele.innerText
        if (ele.innerText.toLowerCase().includes(e.target.value.toLowerCase())) 
            ele.style.display = 'block'
        else
            ele.style.display = 'none'
    })
}

var event_input = document.createElement('input')
event_input.placeholder = 'filter events'
event_input.onkeyup = (e) => {
    console.log(e.target.value)
    Array.from(document.querySelector('#eventFilter').children).forEach(ele => {
        ele.innerText
        if (ele.innerText.toLowerCase().includes(e.target.value.toLowerCase())) 
            ele.style.display = 'block'
        else
            ele.style.display = 'none'
    })
}


document.querySelector('#tagFilter').parentNode.parentNode.appendChild(search_container)
search_container.appendChild(tag_input)
search_container.appendChild(event_input)



