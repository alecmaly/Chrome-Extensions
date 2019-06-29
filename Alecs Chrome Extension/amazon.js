var removeSponsoredContent = setInterval(() => {
  document.querySelectorAll('.slot__ad, .AdHolder, .acs-private-brands-container-background').forEach((ele) => { ele.parentNode.removeChild(ele) });
}, 500);



