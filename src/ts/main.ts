/// <reference path ="../../node_modules/@types/jquery/JQuery.d.ts"/>

let importValue: string = ""
let pagamentValue: string = "0"
let canModifyImport: boolean = true    // this variable controlls wether we can modify the import value or not

type CaixaItem = {
    value: number,
    quantity: number
};
const caixa: CaixaItem[] = [] // this variable stores the number of each coin and bill in the caixa

// called when import button is pressed
function importInput(e: Event): void {
    if (!canModifyImport) {
        alert("No es pot modificar l'import, el pagament está en procés.")
        return;
    }
    let input = (e.target as HTMLInputElement).textContent || ""

    let parsedInput: string = parseValueString(importValue, input);
    if (parsedInput == "") {
        return;
    }

    importValue = parsedInput;
    updateImportDisplay();
    return;
}

// called when pagament is added to the total payed
function pagamentInput(e: Event): void {
    if (!canModifyImport) {
        canModifyImport = false;
        $(".importContainer button").prop("disabled", true)
    }

    let inputValue = $((e.currentTarget as HTMLInputElement)).data("value")
    pagamentValue = (parseInt(pagamentValue) + parseInt(inputValue)).toString()
    updatePagamentDisplay()
    if (calculateCanvi() >= 0) {
        updateCanviDisplay()
        calculateCanviCaixa()
        updateCaixaInputValues()
        $(".pagamentContainer button").prop("disabled", true)
    }
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

function calculateCanvi() {
    // we grab the importValue and pagamentValue and parse them to numbers
    let importValueNumber = Number(importValue) * 100 || 0
    let pagamentValueNumber = Number(pagamentValue) || 0
    return (pagamentValueNumber - importValueNumber)
}

function calculateCanviCaixa() {
    let changeValue = calculateCanvi()
    let tempCaixa: CaixaItem[] = JSON.parse(JSON.stringify(caixa))
    let changeItems: number[] = []

    tempCaixa.forEach((caixaItem) => {
        while (changeValue >= caixaItem.value && caixaItem.quantity > 0) {
            changeValue -= caixaItem.value
            caixaItem.quantity -= 1
            changeItems.push(caixaItem.value)
        }
    })
    if (changeValue > 0) {
        alert("No hi ha prou canvi en caixa")
        return
    }
    updateCaixaChangeItems(changeItems)
    displayChangeItems(changeItems)
}

function getClosestCaixaItemFromNumber(value: number) {
    let closest: CaixaItem = { value: 0, quantity: 0 }
    for (let i = 0; i < caixa.length; i++) {
        console.log("Checking " + caixa[i].value + " <= " + value)
        if (caixa[i].value <= value && caixa[i].quantity > 0) {
            console.log("Closest is " + caixa[i].value)
            closest = caixa[i]
            break;
        }
    }

    if (closest) {
        return closest
    }
    return { value: 0, quantity: 0 }
}

// this function grabs the importValue and formats it to display as a number with € symbol behind
function updateImportDisplay() {
    let importValueNumber = Number(importValue) || 0
    let importValueFormatted = importValueNumber.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
    $(".importContainer input").val(importValueFormatted)
    $(".canviSection p:nth-of-type(1) span").text(importValueFormatted)
}

// this function grabs the pagamentValue and formats it to display as a number with € symbol behind
function updatePagamentDisplay() {
    let pagamentValueNumber = Number(pagamentValue) / 100 || 0
    let pagamentValueFormatted = pagamentValueNumber.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
    $(".pagamentContainer input").val(pagamentValueFormatted)
    $(".canviSection p:nth-of-type(2) span").text(pagamentValueFormatted)
}

function updateCanviDisplay() {
    let canviValue = calculateCanvi() / 100
    let canviValueFormatted = canviValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
    $(".canviSection p:nth-of-type(3) span").text(canviValueFormatted)
}

// this function grabs values from stored caixa and updates the values in the user interface (input fields)
function updateCaixaInputValues() {
    caixa.forEach((item) => {
        $(".caixaContainer label input[name=" + item.value + "]").val(item.quantity)
    })
}

function updateCaixaChangeItems(items: number[]) {
    items.forEach((item) => {
        caixa.find((caixaItem) => {
            if (caixaItem.value == item) {
                caixaItem.quantity -= 1
            }
        })
    })
}

function displayChangeItems(items: number[]) {
    items.forEach((item) => {
        $(".canviContainer").append("<img src='img/v" + item + ".png' alt=''>")
    })
}

// this function grabs the values from the caixa and stores them to later use them to calculate the change
function initCaixa() {
    $(".caixaContainer label input").each(function (index) {
        let name = $(this).attr("name")
        let value = $(this).val()
        caixa.push({ value: Number(name), quantity: Number(value) })
    })

    caixa.sort((a, b) => {
        return b.value - a.value
    })
}

















initCaixa();

$(".importContainer button").on("click", importInput)
$(".pagamentContainer button").on("click", pagamentInput)
