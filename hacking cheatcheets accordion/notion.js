/* sidebar 
  1) Put table of contents on page
  2) Create <div></div>
    width: 15em;
    overflow-y: scroll;
    position: relative;
    height: 100%;
  3) Remove table of contents + move UNDER new div (step 2)
  

*/



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
    // font-size: 15px;
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
  var headings = document.querySelectorAll('[class*="notion-sub_header-block"]')
  headings.forEach(heading => { 
    heading.className = 'accordion' 
    
    
    var newElem = document.createElement('div')
    newElem.classList = 'panel';
    try {
      do {
        newElem.appendChild(heading.nextSibling)
      } while (!heading.nextSibling.className.includes('notion-sub_header-block') && !heading.nextSibling.className.includes('notion-header-block'))
    } catch {}
    heading.parentNode.insertBefore(newElem, heading.nextSibling)
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

  var attach_ele = document.querySelectorAll('[class*="notion-sidebar-switcher"]')[0].parentNode


  var button = document.createElement('button')
  button.id = 'my_custom_button'
  button.textContent = 'Open All'
  button.onclick = () => openAll()
  attach_ele.appendChild(button)

  var button = document.createElement('button')
  button.textContent = 'Close All'
  button.onclick = () => closeAll()
  attach_ele.appendChild(button) 


}

// SetAccordian()
function moveTableOfContentsToSideNav() {

  let checkExist = setInterval(function() {
    if (document.querySelector('.notion-table_of_contents-block')) {
      let table_of_contents = document.querySelector('.notion-table_of_contents-block')
      table_of_contents.style.overflowY = 'scroll'
      table_of_contents.id = 'myNav'
      
      let help_button = document.querySelector('.notion-help-button')
      // table_of_contents.parentNode.removeChild(table_of_contents)
      help_button.parentElement.insertBefore(table_of_contents, help_button)

      
      clearInterval(checkExist);
    }
 }, 250); // check every 100ms

  

}






function start() {
  console.log('get_options called')
  chrome.storage.sync.get({
    notionAccordionEnabled: true,
    notionTableOfContentsEnabled: true  
      
  }, function(items) {
      console.log(items)
      
      if (items.notionTableOfContentsEnabled) {
        console.log('moving table of contents')
        moveTableOfContentsToSideNav()
      }
        


      if (items.notionAccordionEnabled) {
        // set interval to refresh page
        setInterval(() => {
          if (document.querySelectorAll('#my_custom_button').length == 0) {
            SetAccordion()
          }
        }, 1000);
      }
     


  });
}


start()
