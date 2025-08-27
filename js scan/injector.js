// injector.js
(function () {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('script.js'); // load local script.js
    script.onload = () => script.remove(); // optional cleanup after loading
    (document.head || document.documentElement).appendChild(script);
  })();
  