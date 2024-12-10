import {zoomIn} from "../../base/animations/zoom";
import {fadeIn, fadeOut} from "../../base/animations/fade";
import {noticeSuccess, noticeWarning} from "../../base/utils/notice";
import {RequestResponse} from "../../base/network/request_response";

export interface ModalOptions {
    id: number;
    name: string;
    description: string;
    price: string;
}

interface InputParams {
    id: number;
    nickname: string;
    coupon: string;
    pay_method: string;
}

interface Result {
    available: boolean;
    price: number;
    sale: string;
    bill: string;
}

export class ModalController {
    constructor(modalElement: HTMLElement) {
        this._modalElement = modalElement;
        this._request = new RequestResponse();
        this._dialogElement = this._modalElement.querySelector('.dialog')!;

        this._nicknameInput = this._dialogElement.querySelector('input[name="nickname"]')! as HTMLInputElement;
        this._couponInput = this._dialogElement.querySelector('input[name="coupon"]')! as HTMLInputElement;
        this._priceElement = this._dialogElement.querySelector('.cost__value > span')!;
        this._saleElement = this._dialogElement.querySelector('.cost__sale')!;

        this._methodsElement = this._dialogElement.querySelector('.dialog__methods')!;

        this._purchaseButton = this._dialogElement.querySelector('.purchase-button')!;
        this._buttonSpan = this._purchaseButton.querySelector('span')!;

        this._init();
    }

    open(options: ModalOptions) {
        this._options = options;

        if (localStorage.getItem('nickname')) {
            this._nicknameInput.value = localStorage.getItem('nickname')!;
            this._load();
            (this._dialogElement.querySelector('#nickname')! as HTMLElement).style.display = 'block';
        }

        this._dialogElement.querySelector('.product__info > .dialog__header')!.textContent = options.name;
        this._dialogElement.querySelector('.product__description > span')!.textContent = options.description;
        this._priceElement.textContent = options.price;
        fadeIn(this._modalElement, 100);
    }

    close() {
        fadeOut(this._modalElement, 100, () => {
            this._modalElement.style.display = 'none';
            (this._dialogElement.querySelector('.dialog__product') as HTMLElement).style.transform = '';
            this._methodsElement.style.transform = '';
        });
    }

    private _init() {
        this._modalElement.addEventListener('click', (event) => {
            if (!this._dialogElement.contains(event.target as HTMLElement)) {
                this.close();
            }
        })


        let inputTimeout: NodeJS.Timeout;

        this._dialogElement.querySelectorAll('.form__element').forEach(el => {
            const input = el.querySelector('input')! as HTMLInputElement;
            const clear_btn = el.querySelector('.input__clear') as HTMLElement;
            clear_btn.addEventListener('click', () => {
                input.value = '';
                clear_btn.style.display = '';
                if (clear_btn.id == 'nickname') {
                    this._clearButton();
                } else {
                    this._clearSale();
                }
            });

            input.addEventListener('input', (event) => {
                const target = event.target as HTMLInputElement;
                target.value = target.value.replace(/\s/g, '');
                if (target.value === '') {
                    if (clear_btn.id == 'nickname') {
                        this._clearButton();
                    } else {
                        this._clearSale();
                    }
                    clear_btn.style.display = '';
                } else {
                    clear_btn.style.display = 'block';
                }

                // timeout
                if (inputTimeout) {
                    this._stopLoad();
                    clearTimeout(inputTimeout);
                }

                if (this._nicknameInput.value.length >= 1) {
                    inputTimeout = setTimeout(() => {
                        this._load();
                    }, 2000);
                }
            })
        });


        this._purchaseButton.addEventListener('click', (event) => {
            if (this._isLoad || this._purchaseButton.disabled) {
                return;
            }

            const nickname = this._nicknameInput.value;
            if (nickname === '') {
                noticeWarning('Введите никнейм');
                this._nicknameInput.focus();
                return;
            }

            this._slide();
        })

        this._dialogElement.querySelector('.dialog__back-button')!.addEventListener('click', (event) => {
            this._slide();
        })

        this._dialogElement.querySelectorAll('.method-button')!.forEach(el => {
            el.addEventListener('click', (event) => {
                const target = event.target as HTMLElement;
                const inputParams = this._get_input_params();

                inputParams.pay_method = target.getAttribute('data-type')!;
                this._request.fetchData('/shop/api/get_bill', inputParams)
                    .then(data => {
                        if (data == null) {
                            return;
                        }

                        alert(data.bill);
                    })
            })
        })
    }

    private _clearButton() {
        this._buttonSpan.innerHTML = 'Купить';
        this._purchaseButton.disabled = false;
    }

    private _clearSale() {
        this._saleElement.textContent = '';
        this._priceElement.textContent = this._options!.price;
    }

    private _slide() {
        if (this._methodsElement.style.transform == '') {
            (this._dialogElement.querySelector('.dialog__product') as HTMLElement).style.transform = 'translateX(-100%)';
            this._methodsElement.style.transform = 'translateX(-100%)';
        } else {
            (this._dialogElement.querySelector('.dialog__product') as HTMLElement).style.transform = '';
            this._methodsElement.style.transform = '';
        }
    }

    private _load() {
        if (this._isLoad) {
            return;
        }

        this._purchaseButton.classList.add('purchase-button--load');
        this._purchaseButton.disabled = false;

        this._lastText = this._buttonSpan.textContent!;
        this._buttonSpan.innerHTML = '<img src="/static/icons/loading.gif">';

        const inputParams = this._get_input_params();
        this._request.fetchData('/shop/api/get_price', inputParams)
            .then(data => {
                this._stopLoad(false);
                if (data == null) {
                    return;
                }

                localStorage.setItem('nickname', this._nicknameInput.value);
                if (!data.available) {
                    this._purchaseButton.disabled = true;
                    this._buttonSpan.innerHTML = 'Товар недоступен';
                    noticeWarning('Товар недоступен');
                    return;
                }

                if (data.sale) {
                    this._saleElement.textContent = `Скидочка: ${data.sale}`;
                } else {
                    this._saleElement.textContent = ``;
                }

                this._priceElement.textContent = String(data.price);
                this._clearButton();
                noticeSuccess('Товар доступен');
            });

        this._isLoad = true;
    }

    private _stopLoad(cancel: boolean = true) {
        if (!this._isLoad) {
            return;
        }

        this._purchaseButton.classList.add('purchase-button--postload');
        this._buttonSpan.innerHTML = this._lastText;
        setTimeout(() => {
            this._purchaseButton.classList.remove('purchase-button--postload');
            this._purchaseButton.classList.remove('purchase-button--load');
            this._isLoad = false;
        }, 500)

        if (cancel) {
            this._request.cancel();
        }
    }

    private _get_input_params(): InputParams {
        return {
            id: this._options!.id,
            nickname: this._nicknameInput.value,
            coupon: this._couponInput.value,
            pay_method: '',
        }
    }

    private _options?: ModalOptions;
    private _isLoad = false;
    private _lastText: string = '';

    private readonly _request: RequestResponse<Result>;

    private readonly _nicknameInput: HTMLInputElement;
    private readonly _couponInput: HTMLInputElement;

    private readonly _priceElement: HTMLElement;
    private readonly _saleElement: HTMLElement;
    private readonly _methodsElement: HTMLElement;

    private readonly _purchaseButton: HTMLButtonElement;
    private readonly _buttonSpan: HTMLSpanElement;

    private readonly _modalElement: HTMLElement;
    private readonly _dialogElement: HTMLElement;
}
