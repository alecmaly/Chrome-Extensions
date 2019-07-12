// Download Images button



window.onload = () => { 
    // need to wait until loaded
    waitForElementToDisplay('.team-properties-container', 1000);



    function waitForElementToDisplay(selector, time) {
        if(document.querySelector(selector)!=null) {
            if(document.querySelector('#downloadImagesButton') == null) {
                var btn = document.createElement('button');
                btn.id = 'downloadImagesButton';
                btn.innerText = 'Download Images';
                btn.style.borderRadius = '5px';
                btn.style.backgroundColor = 'lightgoldenrodyellow';
                btn.style.fontWeight = '600';
                btn.onclick = async () => {
                    window.downloaded_images = [];
                    window.failures = [];

                    const downloadImagesFunction = async function() {
                      // download images function
                      var images = document.querySelectorAll('[itemtype="http://schema.skype.com/AMSImage"][src^="blob:"]');

                      await asyncForEach(Array.from(images), async image => {
                          // image has not been downloaded yet
                            let img_name = image.attributes['target-src'].value.split('/')[5]
                            if (!window.downloaded_images.includes(img_name)) {
                              if (!image.src.includes('blob:')) {
                                console.log(image);
                                window.failures.push(image);
                              }
                              downloadImage(image.src, img_name);
                              await sleep(200); // time to download image
                              window.downloaded_images.push(img_name);
                              console.log(window.downloaded_images.length);

                            }


                      });

                      setTimeout(downloadImagesFunction, 200)
                    }
                    downloadImagesFunction();
                };
                document.querySelector('.team-properties-container').appendChild(btn);
            }
        }
        setTimeout(function() {
            waitForElementToDisplay(selector, time);
        }, time);
    }


    function downloadImage(uri, name) {// create anchor tag and download
      let link = document.createElement('a');
      link.href = uri;
      link.download = name + '.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }





    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

}



