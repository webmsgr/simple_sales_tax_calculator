
class StringFormItem {
    #control: HTMLInputElement;
    #errorLabel: HTMLElement;
    #value: string; // contains the last "good" value
    #valid: boolean;
    constructor(control: HTMLInputElement, errorLabel: HTMLElement) {
        this.#control = control;
        this.#errorLabel = errorLabel;
        this.#value = '';
        this.#valid = false;
        this.#control.addEventListener('input', () => {
            this.validate();
        });
    }

    validate(): boolean {
        let val: string = this.#control.value;
        if (val === ''){
            this.#errorLabel.innerText = 'Please enter a value';
            this.#valid = false;
        } else {
            this.#errorLabel.innerText = '';
            this.#value = val;
            this.#valid = true;
        }
        return this.#valid;
    }

    get valid() {
        return this.validate();
    }

    get value() {
        this.validate();
        return this.#value;
    }
    set value(value: string) {
        this.#control.value = value;
        this.#value = value;
    }

}

class IntFormItem {
    #control: HTMLInputElement;
    #errorLabel: HTMLElement;
    #value: number; // contains the last "good" value
    #valid: boolean;
    constructor(control: HTMLInputElement, errorLabel: HTMLElement) {
        this.#control = control;
        this.#errorLabel = errorLabel;
        this.#value = 0;
        this.#valid = false;
        this.#control.addEventListener('input', () => {
            this.validate();
        });
    }

    validate(): boolean {
        let val: number = parseInt(this.#control.value);
        if (!is_number(this.#control.value) || val < 0 || this.#control.value.includes('.')) {
            this.#errorLabel.innerText = 'Please enter a valid number';
            this.#valid = false;
        } else {
            this.#errorLabel.innerText = '';
            this.#value = val;
            this.#valid = true;
        }
        return this.#valid;
    }

    get valid() {
        return this.validate();
    }

    get value() {
        this.validate();
        return this.#value;
    }
    set value(value: number) {
        this.#control.value = value.toString();
        this.#value = value;
    }
}

class DecimalFormItem {
    #control: HTMLInputElement;
    #errorLabel: HTMLElement;
    #value: number; // contains the last "good" value
    #valid: boolean;
    constructor(control: HTMLInputElement, errorLabel: HTMLElement) {
        this.#control = control;
        this.#errorLabel = errorLabel;
        this.#value = 0;
        this.#valid = false;
        this.#control.addEventListener('input', () => {
            this.validate();
        });
    }

    validate(): boolean {
        let val: number = parseFloat(this.#control.value);
        if (!is_number(this.#control.value) || val < 0){
            this.#errorLabel.innerText = 'Please enter a valid number';
            this.#valid = false;
        } else {
            this.#errorLabel.innerText = '';
            this.#value = val;
            this.#valid = true;
        }
        return this.#valid;
    }

    get valid() {
        return this.#valid;
    }

    get value() {
        this.validate();
        return this.#value;
    }
    set value(value: number) {
        this.#control.value = value.toString();
        this.#value = value;
    }
}


// javascript is weird
function is_number(val: string): boolean {
   if (isNaN(parseFloat(val))) {
        return false;
   }
   // parseFloat ignores trailing chars (why?????? javascript???)
    return val.match(/^\d+\.?\d*$/) != null;

}

function main() {
    let form: HTMLFormElement = document.querySelector('form')!; // we know the form exists
    let name: StringFormItem = new StringFormItem(document.querySelector('#name') as HTMLInputElement, document.querySelector('#nameError')!);
    let quantity: IntFormItem = new IntFormItem(document.querySelector('#quantity') as HTMLInputElement, document.querySelector('#quantityError')!);
    let price: DecimalFormItem = new DecimalFormItem(document.querySelector('#price') as HTMLInputElement, document.querySelector('#priceError')!);
    let tax: DecimalFormItem = new DecimalFormItem(document.querySelector('#tax') as HTMLInputElement, document.querySelector('#taxError')!);
    let result_box: HTMLElement = document.querySelector('#result')!;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        name.validate();
        quantity.validate();
        price.validate();
        tax.validate();
        if (!name.valid || !quantity.valid || !price.valid || !tax.valid) {
            result_box.textContent = 'Please fix the errors above';
            return;
        }
        let subtotal: number = quantity.value * price.value;
        let total: number = subtotal + (subtotal * (tax.value/100.0))
        let result_str: string = `'${name.value}' x ${quantity.value} @ $${price.value.toFixed(2)} = $${subtotal.toFixed(2)} + ${tax.value}% tax = ${total.toFixed(2)}`;
        result_box.textContent = result_str;
    });
}

main();