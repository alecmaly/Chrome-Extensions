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

    function setStickyHeaders() {
        let files = Array.from(document.querySelectorAll('.file-header')).filter(row => { return row.checkVisibility() });
        let lastVisibleIndex = files.length - 1;
        
        function updateLastVisibleElement() {
            let files = Array.from(document.querySelectorAll('.file-header')).filter(row => { return row.checkVisibility() });
            let top_offset = document.querySelector('.pr-toolbar').getBoundingClientRect().bottom - document.querySelector('.pr-toolbar').getBoundingClientRect().top
    
            for (let i = files.length - 1; i >= 0; i--) {
                let rect = files[i].getBoundingClientRect();
                if (rect.top <= top_offset) { //  && rect.top < files[lastVisibleIndex].getBoundingClientRect().top
                    if (i === lastVisibleIndex)
                        break
                    
                    if (lastVisibleIndex >= 0) {
                        files[lastVisibleIndex].style.position = '';
                        files[lastVisibleIndex].style.top = '';
                    }
    
                    files[i].style.position = 'sticky';
                    files[i].style.top = `${top_offset}px`;
                    lastVisibleIndex = i;
                    break;
                }
            }
        }
        
        window.addEventListener('scroll', updateLastVisibleElement);
        window.addEventListener('resize', updateLastVisibleElement);
    }
    
    await waitForElementToDisplay('.pr-toolbar')
    setStickyHeaders()

    let pr_toolbar = document.querySelector('.pr-toolbar')


    let expand_btn = document.createElement('button')
    expand_btn.innerText = 'Expand All'
    expand_btn.id = 'expand_all'
    expand_btn.onclick = () => {
        document.querySelectorAll('[aria-expanded="false"]').forEach(btn => { btn.click() })
    }
    pr_toolbar.insertAdjacentElement('afterend', expand_btn)


    let collase_btn = document.createElement('button')
    collase_btn.innerText = 'Collapse All'
    collase_btn.id = 'collapse_all'
    collase_btn.onclick = () => {
        document.querySelectorAll('[aria-expanded="true"]').forEach(btn => { btn.click() })
    }
    pr_toolbar.insertAdjacentElement('afterend', collase_btn)



    let filter_input = document.createElement('input')
    filter_input.id = "filter_input"
    filter_input.style.width = '50em'
    filter_input.placeholder = 'filter regex'
    filter_input.value = "(script/|scripts/|interfaces/|mocks/|test/|cache/|audits/|artifacts/|lib/|node_modules/|misc/|deployments/|dev/)"
    pr_toolbar.insertAdjacentElement('afterend', filter_input)

    let keep_input = document.createElement('input')
    keep_input.id = "keep_input"
    keep_input.style.width = '20em'
    keep_input.placeholder = 'keep regex'
    keep_input.value = "(.sol|.go|.rs)"
    pr_toolbar.insertAdjacentElement('afterend', keep_input)

    let filter_btn = document.createElement('button')
    filter_btn.innerText = 'Apply Filters'
    filter_btn.id = 'apply_filters_btn'
    filter_btn.onclick = () => {
        let filter_regex_str = document.querySelector('#filter_input').value
        let keep_regex_str = document.querySelector('#keep_input').value

        let filepaths = document.querySelectorAll('.Link--primary.Truncate-text')

        console.log(filter_regex_str, keep_regex_str)
        for (let filepath of filepaths) {
            const flags = "i"
            const patternString = filter_regex_str;
            const filter_regex = new RegExp(patternString, flags);
            const filter_match = filter_regex.test(filepath.innerText);
            
            const keep_patternString = keep_regex_str;
            const keep_regex = new RegExp(keep_patternString, flags);
            const keep_match = keep_regex.test(filepath.innerText);


            console.log(filepath.innerText, filter_match, keep_match)

            filepath.parentElement.parentElement.parentElement.parentElement.style.display = !filter_match && keep_match ? 'block' : 'none'
        }
    }
    pr_toolbar.insertAdjacentElement('afterend', filter_btn)

    
    let clear_filter_btn = document.createElement('button')
    clear_filter_btn.id = 'clear_filters_btn'
    clear_filter_btn.innerText = 'Clear Filters'
    clear_filter_btn.onclick = () => {
        document.querySelectorAll('.Link--primary.Truncate-text').forEach(filepath => {
            filepath.parentElement.parentElement.parentElement.parentElement.style.display = 'block'
        })
    }
    pr_toolbar.insertAdjacentElement('afterend', clear_filter_btn)


    

    // scroll to ele
    const params = new URLSearchParams(window.location.search);
    const scroll_to_filename = params.get('scroll_to'); // gets 'value1'
    if (scroll_to_filename) {
        await waitForElementToDisplay(`[title='${scroll_to_filename}']`)
        let ele = document.querySelector(`[title='${scroll_to_filename}']`)
        ele.scrollIntoView()
        ele.style.backgroundColor = 'yellow'
    }





    // // click btns
    // setTimeout(() => {
    //     document.querySelector('#apply_filters_btn').click()
    //     document.querySelector('#collapse_all').click()
    // }, 1700)
    

})();