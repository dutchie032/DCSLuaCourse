const testCases = {
    "test1": {

        label: `Write a function named "isEven" that takes 1 number and returns true if 'even' and otherwise false`,
        code: `local function isEven(number)
    -- write your code here
end`,
        test:
            `
#user_code#

if isEven == nil then
io.stderr:write("No function named 'isEven was found'")
return
end

local result = isEven(1)
io.write((result == false and "#success#" or "#fail#") .. " input: 1 " .. " result: " .. tostring(result) .. "<br/>")

local result = isEven(2)
io.write((result == true and "#success#" or "#fail#") .. " input: 2 " .. " result: " .. tostring(result) .. "<br/>" )

local result = isEven(11)
io.write((result == false and "#success#" or "#fail#") .. " input: 11 " .. " result: " .. tostring(result) .. "<br/>")

local result = isEven(42)
io.write((result == true and "#success#" or "#fail#") .. " input: 42 " .. " result: " .. tostring(result) .. "<br/>")

local result = isEven(10002)
io.write((result == true and "#success#" or "#fail#") .. " input: 10002 " .. " result: " .. tostring(result) .. "<br/>")
`
    },

    "test2": {
        
    }


}