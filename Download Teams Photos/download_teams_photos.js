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
                btn.onclick = () => {
                    var images = document.querySelectorAll('[itemtype="http://schema.skype.com/AMSImage"]');
                    //downloadImage(images[0].src);
                    Array.from(images).forEach(async image => {
                        await downloadImage(image.src);
                    });
                };
                document.querySelector('.team-properties-container').appendChild(btn);
            }
        }
        setTimeout(function() {
            waitForElementToDisplay(selector, time);
        }, time);
    }



    function downloadImage(uri) {
        // create anchor tag and download
        var link = document.createElement('a');
        link.href = uri;
        link.download = uri.split('/')[uri.split('/').length - 1] + '.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}



