window.addEventListener("load", myMain, false);

function myMain (evt) {
  // DO YOUR STUFF HERE.

  function checkForJS_Finish() {
    console.log("LOOPING")
    if (window.mapOptions) {
      clearInterval (jsInitChecktimer);
      // DO YOUR STUFF HERE.
      console.log("SETTING MAP OPTIONS")
      mapOptions['cityRadar'] = {"center":[-3.84310150146484,35.6411018371582],"zoom":5.0,"style":"mapbox://styles/accuweather-inc/cjknc24na2o5u2sqoy0t8ku8a","fadeDuration":0,"theme":"Default"};
    }
  }
  var jsInitChecktimer = setInterval(checkForJS_Finish, 10);
}