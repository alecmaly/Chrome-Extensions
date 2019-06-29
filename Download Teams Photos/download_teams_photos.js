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



    // FUNCTION to download image
    function download(uri, original_uri) {
        // create anchor tag and download
        var link = document.createElement('a');
        link.href = uri;
        link.download = original_uri.split('/')[5] + '.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    function downloadImage(uri) {
        // fetch URI and create local blob uri from response
        fetch(uri, {"credentials":"omit","referrer":"https://www.chegg.com/homework-help/Fundamentals-of-Database-Systems-7th-edition-chapter-11-problem-3RQ-solution-9780133970777","referrerPolicy":"no-referrer-when-downgrade","body":null,"method":"GET","mode":"cors"})
            .then(response => { response.blob() })
            .then(image => {
            // Then create a local URL for that image and print it 
            outside = URL.createObjectURL(image)
            download(outside, uri);
            console.log('outside')
            }).catch(err => console.log(err))
    }
}



