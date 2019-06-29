

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isElementInViewport (el) {
  //special bonus for those using jQuery
  if (typeof jQuery === "function" && el instanceof jQuery) {
      el = el[0];
  }
  var rect = el.getBoundingClientRect();
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
      rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
  );
}


async function moveObjectRandomly(ele) {
  //let ele = document.querySelector(qry);
  ele.style.position = 'relative';
  ele.style.top = ele.style.top || '0px';
  ele.style.left = ele.style.left || '0px';
  
  let counter = 0, x_dir = Math.round(Math.random()*2,2) - 1, y_dir = Math.round(Math.random()*2,2) - 1, repeat = 0;
  

  do {
    ele.style.top = Math.round(Number(ele.style.top.slice(0,-2)) + (Math.random()*y_dir), 2) + 'px';
    ele.style.left = Math.round(Number(ele.style.left.slice(0,-2)) + (Math.random()*x_dir), 2) + 'px';
    if (counter++ >= 5) { // was 50
      x_dir = Math.round(Math.random()*2,2) - 1;
      y_dir = Math.round(Math.random()*2,2) - 1;
      counter = 0;
      if (!isElementInViewport(ele)) 
        break;
    }
    await sleep(50);
    } while (true)
}



//NodeList.prototype.forEach = Array.prototype.forEach;

function moveChildNodes(ele) {
  var move_objects_selector = 'h3, h4, h5, span, a, p';
  if (ele.querySelector(move_objects_selector) === null) { if (isElementInViewport(ele)) moveObjectRandomly(ele); return; }
  let child_nodes = ele.querySelectorAll(move_objects_selector);
  for (let i = 0; i < child_nodes.length; i++)
    moveChildNodes(child_nodes[i]);
}



window.onload = () => {
  var parentObject = document.querySelector('body');
  moveChildNodes(parentObject);

  window.addEventListener('scroll', () => {var parentObject = document.querySelector('body'); moveChildNodes(parentObject)}, false);

}
  