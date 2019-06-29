window.onload = () => { 
  var obj = document.createElement('button');
  obj.innerHTML = 'CLIP COUPONS!!';
  obj.style.borderRadius = '15px';
  obj.style.height = '2em';
  obj.onclick = () => { document.querySelectorAll('.clip-btn').forEach((ele) => { ele.click() }) };
  document.querySelector('.navbar-inner').appendChild(obj);
  
  var obj = document.createElement('button');
  obj.innerHTML = 'UNCLIP COUPONS!!';
  obj.style.borderRadius = '15px';
  obj.style.height = '2em';
  obj.onclick = () => { document.querySelectorAll('.unclip-btn').forEach((ele) => { ele.click() }) };
  document.querySelector('.navbar-inner').appendChild(obj);
}





