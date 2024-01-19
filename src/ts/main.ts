/// <reference path ="../../node_modules/@types/jquery/JQuery.d.ts"/>

(() => {
    let importValue: string = ""            // this variable stores the value of the import

    let pagamentItems: CaixaItem[] = []     // this variable stores the number of each coin and bill in the pagament
    let canReset: boolean = true            // this variable controlls wether we can modify the import value or not

    type CaixaItem = {                      // this type is used to store the number of each coin and bill in the caixa
        value: number,
        quantity: number
    };
    const caixa: CaixaItem[] = []           // this variable stores the number of each coin and bill in the caixa

    /**
     * This function is called when the import button is pressed.
     * It grabs the value of the button and controls wether to add a number, a comma or delete a number.
     * @param e Event that triggered the function
     * @returns 
     */
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

    /**
     * This function is called when the pagament button is pressed.
     * It grabs the value of the button and adds it to the pagamentItems array.
     * @param e Event that triggered the function
     */
    function pagamentInput(e: Event): void {

        let inputValue = $((e.currentTarget as HTMLInputElement)).data("value")

        caixa.forEach((item) => {
            if (item.value == inputValue) {
                let pagamentItem = pagamentItems.find((pagamentItem) => { return pagamentItem.value == inputValue; })
                if (pagamentItem) {
                    pagamentItem.quantity += 1
                } else {
                    pagamentItems.push({ value: item.value, quantity: 1 })
                }
            }
        })

        updatePagamentDisplay()
        if (calculateCanvi() >= 0) {
            updateCanviDisplay()
        }
    }
    /**
     * This function is called when the import value is modified.
     * @param value Current value of the number
     * @param input New that will modify the value (add a number/comma or delete a number/comma)
     * @returns Parsed value string
     */
    // this function grabs a value (displayed value) and parses it to check wether to add a number, a commma or delete a number.
    function parseValueString(value: string, input: string): string {
        let parsedInput: string = value;
        if (input == null) {
            return "";
        }

        // if input is "delete" we remove last character in case that length is superior to 0
        if (input == "⌫") {
            if (canReset) {
                resetState()
                return "";
            }
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

    /**
     * This function calculates the change to give to the client
     * @returns The value of the importValue minus the value of the pagamentValue (in cents)
     */
    function calculateCanvi(): number {
        // we grab the importValue and pagamentValue and parse them to numbers
        let importValueNumber = Number(importValue) * 100 || 0
        let pagamentValueNumber = getPagamentValue()
        return (pagamentValueNumber - importValueNumber)
    }

    /**
     * This function calculates the change to give to the client. 
     * It also updates the caixa array to reflect the change given and displays the change in the user interface.
     * In case that there is not enough change in the caixa, it displays an alert.
     * @returns void
     */
    function calculateCanviCaixa(): void {
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

    /**
     * This function grabs the importValue and formats it to display as a number with € symbol behind
     * @returns void
     */
    function updateImportDisplay(): void {
        let importValueNumber = Number(importValue) || 0
        let importValueFormatted = importValueNumber.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
        $(".importContainer input").val(importValueFormatted)
        $(".canviSection p:nth-of-type(1) span").text(importValueFormatted)
    }

    /**
     * This function grabs the pagamentItems array and calculates the value of the pagament
     * @returns The value of the pagamentItems array (in cents)
     */
    function getPagamentValue(): number {
        let pagamentValue = 0;
        pagamentItems.forEach((item) => {
            pagamentValue += item.value * item.quantity
        })
        return pagamentValue;
    }

    /**
     * This function grabs the pagamentValue and formats it to display as a number with € symbol behind
     * @returns void
     */
    function updatePagamentDisplay(): void {
        let pagamentValueNumber = getPagamentValue() / 100;
        let pagamentValueFormatted = pagamentValueNumber.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
        $(".pagamentContainer input").val(pagamentValueFormatted)
        $(".canviSection p:nth-of-type(2) span").text(pagamentValueFormatted)
    }

    /**
     * This function grabs the changeValue and formats it to display as a number with € symbol behind
     * @returns void
     */
    function updateCanviDisplay() {
        let canviValue = calculateCanvi() / 100
        let canviValueFormatted = canviValue.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
        $(".canviSection p:nth-of-type(3) span").text(canviValueFormatted)
    }

    /**
     * This function grabs values from stored caixa and updates the values in the user interface (input fields)
     * @returns void
     */
    function updateCaixaInputValues() {
        pagamentItems.forEach((item) => {
            let caixaItem = caixa.find((caixaItem) => {
                return caixaItem.value == item.value
            })
            if (caixaItem) {
                caixaItem.quantity += item.quantity
            }
        })
        caixa.forEach((item) => {
            $(".caixaContainer label input[name=" + item.value + "]").val(item.quantity)
        })
    }

    /**
     * This function updates the caixa array to reflect the change given
     * @param items Array of numbers that represent the change to give to the client
     * @returns void
     */
    function updateCaixaChangeItems(items: number[]): void {
        items.forEach((item) => {
            caixa.find((caixaItem) => {
                if (caixaItem.value == item) {
                    caixaItem.quantity -= 1
                }
            })
        })
    }

    /**
     * This function displays the change given to the client
     * @param items Array of numbers that represent the change to give to the client
     */
    function displayChangeItems(items: number[]): void {
        items.forEach((item) => {
            $(".canviContainer").append("<img src='img/v" + item + ".png' alt=''>")
        })
    }

    /**
     * This function is called when the payment button is pressed.
     * It calculates the change to give to the client and displays it in the user interface.
     * It also updates the caixa array to reflect the change given.
     * In case that there is not enough change in the caixa, it displays an alert.
     * It also disables the buttons in the user interface to prevent the user from modifying the values.
     * @returns void
     */
    function makePayment(): void {
        if (calculateCanvi() < 0) {
            alert("El pagament no es suficient")
            return
        }

        canReset = true
        calculateCanviCaixa()
        updateCaixaInputValues()

        disableImportButtons()
        disablePagamentButtons()
        disableCanviSectionButtons()
    }

    /**
     * This function resets the state of the application to the initial state
     * @returns void
     */
    function resetState(): void {
        importValue = ""
        pagamentItems = []
        canReset = false
        $(".canviContainer img").remove()
        updateImportDisplay()
        updatePagamentDisplay()
        updateCanviDisplay()
        enableImportButtons()
        enablePagamentButtons()
        enableCanviSectionButtons()
    }

    /**
     * This function grabs the values from the caixa and stores them to later use them to calculate the change
     * @returns void
     */
    function initCaixa(): void {
        $(".caixaContainer label input").each(function (index) {
            let name = $(this).attr("name")
            let value = $(this).val()
            caixa.push({ value: Number(name), quantity: Number(value) })
        })

        caixa.sort((a, b) => {
            return b.value - a.value
        })
    }

    /**
     * This function disables the buttons in the import section
     * @returns void
     */
    function disableImportButtons(): void {
        $(".importContainer button").prop("disabled", true)
        $(".importContainer button").last().prop("disabled", false)
    }

    /**
     * This function disables the buttons in the pagament section
     * @returns void
     */
    function disablePagamentButtons(): void {
        $(".pagamentContainer button").prop("disabled", true)
    }

    /**
     * This function disables the buttons in the canvi section
     * @returns void
     */
    function disableCanviSectionButtons(): void {
        $(".canviSection button").prop("disabled", true)
    }

    /**
     * This function enables the buttons in the import section
     * @returns void
     */
    function enableImportButtons(): void {
        $(".importContainer button").prop("disabled", false)
    }

    /**
     * This function enables the buttons in the pagament section
     * @returns void
     */
    function enablePagamentButtons(): void {
        $(".pagamentContainer button").prop("disabled", false)
    }

    /**
     * This function enables the buttons in the canvi section
     * @returns void
     */
    function enableCanviSectionButtons(): void {
        $(".canviSection button").prop("disabled", false)
    }

    // we initialize the caixa
    initCaixa();

    // we add event listeners to the buttons
    $(".importContainer button").on("click", importInput)
    $(".pagamentContainer button").on("click", pagamentInput)
    $(".canviSection button").on("click", makePayment)
})();