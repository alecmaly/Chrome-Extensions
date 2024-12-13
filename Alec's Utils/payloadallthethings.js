
function SetAccordion() {
  // add css
  var css = `.accordion {
    background-color: #eee;
    color: #444;
    cursor: pointer;
    padding: 10px;
    width: 100%;
    border: none;
    text-align: left;
    outline: none;
    font-size: 15px;
    transition: 0.4s;
  }

  .active, .accordion:hover {
    background-color: #ccc;
  }

  .accordion:after {
    color: #777;
    font-weight: bold;
    float: right;
    margin-left: 5px;
  }


  .panel {
    padding: 0 18px;
    background-color: white;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
  }
  }`,
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');

  head.appendChild(style);

  style.type = 'text/css';
  if (style.styleSheet){
    // This is required for IE8 and below.
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }



  // add acordion button
  var headings = document.querySelectorAll('h2')


  headings.forEach(heading => { 
    if (!heading.innerText.includes('PayloadsAllTheThings')) {
      heading.className = 'accordion' 
    
    
      var newElem = document.createElement('div')
      newElem.classList = 'panel';
      try {
        do {
          newElem.appendChild(heading.nextElementSibling)
        } while (heading.nextElementSibling.tagName != 'H2')
      } catch {}
      heading.parentNode.insertBefore(newElem, heading.nextSibling)
    }

  })

  // Array.prototype.forEach.call(document.querySelectorAll('header, main, footer'), function(c){
  //   newElem.appendChild(c);
  // });


  var acc = document.getElementsByClassName("accordion");
  var i;

  for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } 
    });
  }


    


  var closeAll = () => document.querySelectorAll('.accordion').forEach(heading => { if (heading.className.includes(' active')) heading.click() }) 
  var openAll = () => document.querySelectorAll('.accordion').forEach(heading => { if (!heading.className.includes(' active')) heading.click() }) 

  var attach_ele = document.querySelectorAll('h1')[4]


  var button = document.createElement('button')
  button.textContent = 'Open All'
  button.onclick = () => openAll()
  attach_ele.appendChild(button)

  var button = document.createElement('button')
  button.textContent = 'Close All'
  button.onclick = () => closeAll()
  attach_ele.appendChild(button)


}








function get_options() {
  console.log('get_options called')
  chrome.storage.sync.get({
    hacktricksEnabled: true,
    payloadAllTheThingsEnabled: true
  }, function(items) {
      console.log(items.hacktricksEnabled)
     
      if (items.payloadAllTheThingsEnabled) {
        // set interval to refresh page
        setInterval(() => {
          if (document.querySelectorAll('.accordion').length == 0) {
            SetAccordion()
          }
        }, 1000);
      }
     


  });
}


get_options()

