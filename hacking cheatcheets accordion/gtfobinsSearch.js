
var wrapper = document.querySelector('#bin-search-wrapper')


// add input to page
var ele = document.createElement('textarea')
ele.id = 'myinput'
ele.style.width = '100%'
ele.style.height = '150px'
ele.onkeyup = () => updateVisibility()

wrapper.appendChild(ele)



// on myinput change .. run func





function updateVisibility() {
  // get values to search for
  var programs = document.querySelector('#myinput').value.split('\n').map(val => { return val.split('/').splice(-1)[0] }).filter(val => { return val != ""})

  // hide if not in programs
  var rows = document.querySelectorAll('tr')
  Array.from(rows).forEach(row => {
    let row_program = row.innerText.split('\n').map(val => { return val.trim() }).filter(val => { return val != "" })[0]
    
    if (programs.includes(row_program) || programs.length == 0) 
      row.style.display = 'block'
    else 
      row.style.display = 'none'
  })
}




// color sudo
document.querySelectorAll('a').forEach(ele => { 
  if (ele.innerText == 'Sudo') 
    ele.style.backgroundColor = 'yellow' 
  if (ele.innerText == 'SUID') 
    ele.style.backgroundColor = 'lightgreen' 
  if (ele.innerText == 'Limited SUID') 
    ele.style.backgroundColor = 'orange' 
})


// overload global keydown function
document.addEventListener("keydown", function (event) {
  event.stopPropagation();
}, true);
