const testCases = {
    "test1": {

        label: `given variables textA and textB write code that stores the combination in a variable named result
        make sure to add a space between the two`,
        code: `-- write your code here`,
        test:
            `

local textA = "This text combines nicely"
local textB = "with this text"
#user_code#

if result == nil then
io.stderr:write("No variable named 'result' was set")
return
end

local success = result == textA .. " " .. textB
io.write((success == true and "#success#" or "#fail#") .. " result: " .. tostring(result) .. "<br/>")

`
    },

    "test2": {
        
    }


}