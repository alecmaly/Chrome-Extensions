(async () => {
    function waitForElementToDisplay(selector) {
        return new Promise(resolve => {
            const intervalId = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(intervalId);
                    resolve(element);
                }
            }, 100);
        });
    }
    // solodit

    await waitForElementToDisplay('.items-start')

    
    let header = document.querySelector('header')
    let anchor = document.querySelector('.items-start')
    anchor.parentElement.style.minHeight = '95vh'

    let btn = document.createElement('button')
    btn.innerText = "Show/Hide"
    btn.onclick = (e) => {
        anchor.style.display = anchor.style.display == 'none' ? 'flex' : 'none'
        header.style.display = header.style.display == 'none' ? 'flex' : 'none'
        
    }
    anchor.parentNode.insertBefore(btn, anchor)

})()