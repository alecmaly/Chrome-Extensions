window.onload = () => { 
  var obj = document.createElement('button');
  obj.innerHTML = 'CLIP COUPONS!!';
  obj.style.borderRadius = '15px';
  obj.style.height = '2em';
  obj.onclick = () => { document.querySelectorAll('.CouponBtn-text').forEach((ele) => { if(ele.textContent === 'Load to Card') ele.click() }) };
  document.querySelector('.CouponTabHeader').appendChild(obj);
  
  var obj = document.createElement('button');
  obj.innerHTML = 'CLIP COUPONS!!';
  obj.style.borderRadius = '15px';
  obj.style.height = '2em';
  obj.onclick = () => { document.querySelectorAll('.CouponBtn-text').forEach((ele) => { if(ele.textContent === 'Remove from Card') ele.click() }) };
  document.querySelector('.CouponTabHeader').appendChild(obj);
}





