// get locations
// Run on this page: 
// https://www.michigan.gov/sos/0,4670,7-127-5647_15036_83621_83648---,00.html

var copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

var str = Array.from(document.querySelector('som-bol').shadowRoot.querySelectorAll('[href*="https://sosmakeanappointment.as.me/schedule.php?location="]')).reduce((acc, link) => {
  return acc + '"' + link.href.split('=')[1] + '",'
}, '[') + ']'
copyToClipboard(str)



// search earliest appointment
// run on this page:  
// https://sosmakeanappointment.as.me/schedule.php?location=Ann%20Arbor%20-%20North%20Maple%20Road
var results = []

var locations = ["Ypsilanti", "Belleville", "Ann%20Arbor%20-%20North%20Maple%20Road", "Canton", "Westland", "Inkster", "Livonia", "Redford", "Brownstown", "Taylor", "Novi", "Chelsea", "Trenton"]

let interval = 500
locations.forEach(async (loc, index) => {
  setTimeout(async () => {

    // let loc = 'Ypsilanti'

    // get cal id
    let url1 = 'https://sosmakeanappointment.as.me/schedule.php?location=' + loc
    let data = await fetch(url1).then(resp => {
      return resp.text()
    })
    let calID = data.match(/typeToCalendars.*\n.*?,/g)[0].split('[')[3].split(',')[0]


    // get appointment details
    let url = 'https://sosmakeanappointment.as.me/schedule.php?action=showCalendar&fulldate=1&owner=17667501&template=monthly&location=' + loc
    results.push(fetch(url, {
      "headers": {
        "accept": "*/*",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      "body": "type=10091274&calendar=" + calID + "&skip=true&options%5Bqty%5D=1&options%5BnumDays%5D=5&ignoreAppointment=&appointmentType=&calendarID=",
      "method": "POST",
    }).then(resp => {
      return resp.text()
    }).then(html =>{

      let ele = document.createElement('div')
      ele.innerHTML = html
      
      return {
        location: loc,
        date: ele.querySelector('.scheduleday.activeday').getAttribute('day')
      }

    }))

    // document.body.removeChild(tmp)
  }, interval * index);

})



function loop()
{
    if ( results.length != locations.length ) {
      let ret = Promise.all(results).then(values => { console.log(values) })
      console.log(ret)
    }
    else
      window.setTimeout("loop();",100);
    
} 

// document.body.appendChild(ele)


// location: loc,
//   date: ele.querySelector('.scheduleday.activeday').getAttribute('day')
// }




// fill out form
