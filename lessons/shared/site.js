
/**
 * Update the iframe
 */


// function updateIframe() {

//     // Create new iframe
//     let clone = result.cloneNode();
//     result.replaceWith(clone);
//     result = clone;

//     // Render
//     result.contentWindow.document.open();
//     result.contentWindow.document.writeln(
//         `${html.value}
//         <style>${css.value}</style>
//         <script type="module">${js.value}<\/script>`
//     );
//     result.contentWindow.document.close();
// }

let debounce;
function inputHandler(event) {

    // Clone text into pre immediately
    let code = event.target.previousElementSibling.firstChild;
    if (!code) return;
    code.textContent = event.target.value;

    // Highlight the syntax
    Prism.highlightElement(code);

    // Debounce the rendering for performance reasons
    clearTimeout(debounce);

    // Set update to happen when typing stops
    //debounce = setTimeout(updateIframe, 500);

}

function loadCodeblocks() {

    const div_list = document.querySelectorAll(".code-block")
    const div_array = [...div_list]

    function addCodeBlockElements(element) {

        const elements = `<label class="assignment"></label>
        <div class="editor">
            <pre class="lang-lua"><code></code></code></pre>
            <textarea spellcheck="false" autocorrect="off" autocapitalize="off" translate="no"></textarea>
            <div class="box output">
                    <span class="stout">Output: </span>
                    <span class="executiontime push-right"></span>
            </div>
        </div>
        <div class="row" style="margin-left: auto;">
            <div class="button" onclick="testScript(this)">
                <span><i class="bi bi-play"></i> Test</span>
            </div>
            <div class="button" style="margin-left: 2em;" onclick="resetCode(this)">
                <span><i class="bi bi-arrow-clockwise"></i> Reset</span>
            </div>
        </div>
`
        element.innerHTML = elements
    }

    div_array.forEach(element => {

        const id = element.id
        if (testCases[id] !== undefined) {

            addCodeBlockElements(element)

            const data = testCases[id]
            const codeBlock = element.querySelector("textarea")
            codeBlock.value = data.code

            const label = element.querySelector("label")
            label.innerText = data.label

        }
    });
}

function toggleClass(element, className) {

    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}

function configureCollapsibles() {
    const div_list = document.querySelectorAll(".collapsible")
    const div_array = [...div_list]

    div_array.forEach((element) => {
        
        const label = element.querySelector(".label")

        if (element.classList.contains("collapsed")){
            label.innerHTML = label.innerHTML + ' <span><i class="bi bi-chevron-right"></i></span>'
        } else {
            label.innerHTML = label.innerHTML + ' <span><i class="bi bi-chevron-down"></i></span>'
        }

        label.addEventListener("click", (e) => {
            const collapsible = e.target.closest(".collapsible")
            toggleClass(collapsible, "collapsed")

            const bi = collapsible.querySelector(".bi")
            toggleClass(bi, "bi-chevron-right")
            toggleClass(bi, "bi-chevron-down")

        })
    })
}

function addSiteHeader(){
    fetch("../_shared/sitemenu.html")
    .then(res => res.text())
    .then((text) => {
        const element = document.querySelector("#sitemenu")
        element.innerHTML = text
    })
}

function loadTooltips() {
    
    const div_list = document.querySelectorAll(".tooltip")
    const div_array = [...div_list]

    div_array.forEach((element) => { 

        

    })

}

Prism.hooks.add("complete", (context) => {

    const element = context.element
    if(element.classList.contains("static-render")){
        const html = context.element.innerHTML.replaceAll("\\r\\n", "<br>")
        element.innerHTML = html
    }
})


addEventListener("DOMContentLoaded", (event) => {

    addSiteHeader()

    function addTabListener(element) {
        element.addEventListener("keydown", (e) => {
            if (e.key == "Tab") {
                e.preventDefault();
                const textArea = e.currentTarget;
                textArea.setRangeText(
                    "\t",
                    textArea.selectionStart,
                    textArea.selectionEnd,
                    "end"
                );
                var event = new Event('input');
                element.dispatchEvent(event);
            }
        });
    }
    configureCollapsibles()
    loadCodeblocks()

    const div_list = document.querySelectorAll("textarea")
    const div_array = [...div_list]
    div_array.forEach(element => {

        addTabListener(element)

        element.addEventListener('input', inputHandler);

        //Trigger input event to sync pre-input
        var event = new Event('input');
        element.dispatchEvent(event);
    });
});

const isDisabled = {}
function disableButton(button) {

    isDisabled[button] = true
    button.classList.add("button-disabled");

}

function enableButton(button) {
    isDisabled[button] = false
    button.classList.remove("button-disabled");
}

function testScript(button) {

    if (isDisabled[button] === true) {
        return
    }

    const parrent = button.closest(".code-block")
    const textArea = parrent.querySelector("textarea")

    disableButton(button)

    const userCode = textArea.value

    const testId = parrent.id
    const luaCode = testCases[testId].test.replace("#user_code#", userCode)

    const json = {
        "name": "Lua",
        "title": "Lua Hello World!",
        "mode": "lua",
        "description": null,
        "extension": "lua",
        "languageType": "programming",
        "active": true,
        "properties": {
            "language": "lua",
            "docs": true,
            "tutorials": false,
            "cheatsheets": false,
            "files": [
                {
                    "name": "Main.lua",
                    "content": `${luaCode}`
                }
            ]
        },
        "visibility": "public"
    }

    fetch("https://cors.timrorije.com/https://onecompiler.com/api/code/exec", {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
            "Host": "onecompiler.com",
        }
    }).then((response) => {
        setTimeout(
            function () {
                enableButton(button)
            },
            2500
        )

        response.json().then((result) => {
            const outputBox = parrent.querySelector(".stout")

            if (result.exception !== null) {

                const exception = result.exception.substring(result.exception.lastIndexOf("lua5.4"), result.exception.length)

                outputBox.innerHTML = exception
            } else if (result.stderr !== null) {
                console.log(result.stderr)
                outputBox.innerHTML = `Error: ${result.stderr}`
            } else {
                var text = result.stdout
                text = text.replaceAll("#success#", '<i class="bi bi-check-circle" style="color:green;"></i>')
                text = text.replaceAll("#fail#", '<i class="bi bi-x-circle" style="color:red;"></i>')

                outputBox.innerHTML = `Output:<br/> ${text}`

            }

            const executionTimeBox = parrent.querySelector(".executiontime")
            executionTimeBox.innerHTML = `${result.executionTime} ms`
        })

    });
}

function resetCode(element) {

    const parrent = element.closest(".code-block")
    const textArea = parrent.querySelector("textarea")
    textArea.value = testCases[parrent.id].code

    const stout = parrent.querySelector(".stout")
    stout.innerHTML = ""

    const executionTime = parrent.querySelector(".executiontime")
    executionTime.innerHTML = ""

    var event = new Event('input');
    textArea.dispatchEvent(event);

}






