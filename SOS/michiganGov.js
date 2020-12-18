// runs on https://www.michigan.gov/



var port = chrome.runtime.connect({
  name: "knockknock"
});

port.onMessage.addListener(function (msg) {
  console.log(msg.locationDates)

  let arr = msg.locationDates[0]
  arr = arr.sort((a,b) => { return new Date(a.date) - new Date(b.date)})
  let text_output = '\nSOONEST APPOINTMENTS ARE ON TOP.\nProceed to make an appointment at these locations.\n\n' + arr.map(ele => { return ele.location + ' :  '  + ele.date }).join('\n')
  alert(text_output)
  arr.forEach(obj => { try { document.querySelector('som-bol').shadowRoot.querySelector('[href*="' + decodeURIComponent(obj.location) + '"]').innerText = "Make Appointment (" + obj.date + ")" } catch {} } )

  if (document.querySelector('#myOutput')) {
    document.querySelector('#myOutput').innerText = text_output
  } else {

    let ele = document.createElement('div')
    ele.id = 'myOutput'
    ele.innerText = text_output
  
    document.querySelector('.page-header').appendChild(ele)
  
  }


  // soonest
  let soonestLoc = document.querySelector('som-bol').shadowRoot.querySelector('[href*="' + decodeURIComponent(arr[0].location) + '"]').parentNode.parentNode.parentNode.parentNode
  soonestLoc.style.backgroundColor = 'yellow'
  soonestLoc.scrollIntoView({block: "center"})
});





let button = document.createElement('button')
button.textContent = 'Find soonest appointments'
button.onclick = () => {
  let arr = Array.from(document.querySelector('som-bol').shadowRoot.querySelectorAll('[href*="https://sosmakeanappointment.as.me/schedule.php?location="]')).map(ele => {
    return ele.href.split('=')[1]
  })


  port.postMessage({
    locations: arr,
    timeout: 1
  });

  alert("Please wait for the response, this may take a minute")

}

document.querySelector('.page-header').appendChild(button)
