const NAV_DARK_CLASS = 'header--dark';


export class Header {
    constructor(headerElement: HTMLElement) {
        this._headerElement = headerElement;

        window.addEventListener("scroll", () => {
            if (window.scrollY === 0) {
                this._headerElement.classList.remove(NAV_DARK_CLASS);
            } else {
                this._headerElement.classList.add(NAV_DARK_CLASS);
            }
        });
    }

    private _headerElement: HTMLElement;
}