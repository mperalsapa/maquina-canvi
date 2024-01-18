/// <reference path ="../../node_modules/@types/jquery/JQuery.d.ts"/>

let importValue: string = ""
let pagamentValue: string = ""

// called when import button is pressed
function importInput(e: Event): void {
    let input = (e.target as HTMLInputElement).textContent || ""

    let parsedInput: string = parseValueString(importValue, input);
    if (parsedInput == "") {
        return;
    }

    importValue = parsedInput;
    updateImportDisplay();
    return;
}

function pagamentInput(e: Event): void {

    let inputValue = $((e.currentTarget as HTMLInputElement)).data("value")
    console.log("Afegit al pagament: " + inputValue)
}


// this function grabs a value (displayed value) and parses it to check wether to add a number, a commma or delete a number.
function parseValueString(value: string, input: string): string {
    let parsedInput: string = value;
    if (input == null) {
        return "";
    }

    // if input is "delete" we remove last character in case that length is superior to 0
    if (input == "⌫") {
        // if import value has any character
        if (parsedInput.length > 1) {
            // lastly we check if the last character is a decimal, in which case we remove 2 characters
            if (parsedInput[parsedInput.length - 1] == ".") {
                parsedInput = parsedInput.slice(0, -2)
            } else {
                parsedInput = parsedInput.slice(0, -1)
            }
            return parsedInput;
        }

        return "0";
    }

    // if input is "comma", we add a dot to the parsedInput. In case that parsedInput already contains a dot, we do nothing
    if (input == ",") {
        if (parsedInput.indexOf(".") > 0) {
            return value;
        }
        parsedInput += "."

        return parsedInput;
    }

    // if input is a number an we do not have comma, we append the number to the parsedInput
    if (parsedInput.indexOf(".") == -1) {
        parsedInput += input
        return parsedInput;
    }

    let importDecimalValue = parsedInput.split(".")[1]
    // lastly we check if the parsedInput has 2 decimals. In that case, we do nothing
    if (importDecimalValue.length > 1) {
        return value;
    }

    // if none of the above, we just append the input to the parsedInput
    parsedInput += input
    return parsedInput;
}

function updateImportDisplay() {
    // we grab the importValue and format it to display as a number with € symbol behind
    let importValueNumber = Number(importValue) || 0
    let importValueFormatted = importValueNumber.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
    $(".importContainer input").val(importValueFormatted)
}


$(".importContainer button").on("click", importInput)
$(".pagamentContainer button").on("click", pagamentInput)
