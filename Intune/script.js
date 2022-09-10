console.log("Loaded..")


// fetch
const constantMock = window.fetch;
window.fetch = function () {
    return new Promise((resolve, reject) => {
        constantMock.apply(this, arguments)
            .then((response) => {
                if (response) {
                    response.clone().json() //the response body is a readablestream, which can only be read once. That's why we make a clone here and work with the clone
                        .then((json) => {
                            console.log(json);
                            //Do whatever you want with the json
                            resolve(response);
                        })
                        .catch((error) => {
                            console.log(error);
                            reject(response);
                        })
                } else {
                    console.log(arguments);
                    console.log('Undefined Response!');
                    reject(response);
                }
            })
            .catch((error) => {
                console.log(error);
                reject(response);
            })
    })
}




// xhr

//modify 'responseText' of 'example2.txt'
xhook.after(function (request, response) {
    console.log("hooked request")
    if (request.url.match(/.*/)) {
        console.log(response.text)
        // response.text = response.text.replace(/[aeiou]/g, 'z');
    }
});
