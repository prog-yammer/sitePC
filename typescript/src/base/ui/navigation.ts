const SWITCH_OPEN_CLASS = 'nav-switch--open';
const NAV_ACTIVE_CLASS = 'nav--active';


export class Navigation {
    constructor(switchElement: HTMLElement, menuElement: HTMLElement) {
        this._switchElement = switchElement;
        this._menuElement = menuElement;
        this._links = this._menuElement.querySelectorAll('a')!;


        this._isOpen = this._switchElement.classList.contains(SWITCH_OPEN_CLASS);
        this._switchElement.addEventListener('click', () => {
            this.toggle();
        })
    }

    toggle() {
        this._isOpen = this._switchElement.classList.toggle(SWITCH_OPEN_CLASS)

        if (this._isOpen) {
            this._menuElement.classList.add(NAV_ACTIVE_CLASS);
        } else {
            this._menuElement.classList.remove(NAV_ACTIVE_CLASS);
        }
    }

    open(): void {
        if (!this._isOpen) {
            this.toggle();
        }
    }

    close(update: boolean = false): void {
        if (this._isOpen) {
            this.toggle();
            if (update) {
                setTimeout(this._updateState, 400, this._links);
            }
        }

        if (update) {
            this._updateState(this._links);
        }
    }

    private _updateState(links: NodeListOf<HTMLAnchorElement>): void {
        links.forEach((item) => {
            if (item.href == window.location.href) {
                item.classList.add('nav__link--active');
            } else {
                item.classList.remove('nav__link--active');
            }
        })
    }

    private _isOpen: boolean;
    private readonly _links: NodeListOf<HTMLAnchorElement>;
    private readonly _switchElement: HTMLElement;
    private readonly _menuElement: HTMLElement;
}
