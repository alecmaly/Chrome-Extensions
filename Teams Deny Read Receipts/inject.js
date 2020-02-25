(function() {
  var origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
       if (arguments[1].includes('consumptionhorizon'))
           arguments[1] = arguments[1].slice(-1)
      origOpen.apply(this, arguments);
  };
})();
