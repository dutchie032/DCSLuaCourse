
/**
 * Update the iframe
 */

function updateIframe() {

    // Create new iframe
    let clone = result.cloneNode();
    result.replaceWith(clone);
    result = clone;

    // Render
    result.contentWindow.document.open();
    result.contentWindow.document.writeln(
        `${html.value}
        <style>${css.value}</style>
        <script type="module">${js.value}<\/script>`
    );
    result.contentWindow.document.close();
}

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
    debounce = setTimeout(updateIframe, 500);

}

const original_code = {}

addEventListener("DOMContentLoaded", (event) => {

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

    const div_list = document.querySelectorAll("textarea")
    const div_array = [...div_list]
    div_array.forEach(element => {

        addTabListener(element)

        element.addEventListener('input', inputHandler);

        original_code[element] = element.textContent
        
        console.log(element.id)

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

    const parrent = button.closest(".code_block")
    const textArea = parrent.querySelector("textarea")
    
    disableButton(button)

    const luaCode = textArea.value
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

    fetch("https://onecompiler.com/api/code/exec", {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin" : "*",
          "Host": "onecompiler.com",
        }
    }).then( (response) => {

    });
}

function resetCode(element){

    const parrent = element.closest(".code_block")
    const textArea = parrent.querySelector("textarea")
    textArea.value = original_code[textArea]

    var event = new Event('input');
    textArea.dispatchEvent(event);

}



