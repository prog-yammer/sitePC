import {ModalController, ModalOptions} from "../product/modal_controller";

export class ProductController {
    constructor(
        productTable: HTMLUListElement,
        modalController: ModalController,
    ) {
        this._modalController = modalController;

        this._init(productTable);
    }

    private _init(productTable: HTMLUListElement) {
        productTable.querySelectorAll('li')?.forEach(el => {
            const options: ModalOptions = {
                id: Number(el.getAttribute('data-item-id')!),
                name: el.querySelector('.card__name')!.textContent!,
                description: el.getAttribute('data-description')!,
                price: el.querySelector('.card__cost > span')!.textContent!,
            }

            el.addEventListener('click', () => {
                this._modalController.open(options);
            })
        })
    }

    private readonly _modalController: ModalController;
}
