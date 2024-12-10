import {fadeOut} from "../animations/fade";

const BACKGROUND_IMAGE_ACTIVE_CLASS = "background-image--active";
const BACKGROUND_IMAGE_ANIMATE_CLASS = "background-image--animate";
const FADE_DURATION = 300;

export class BackgroundImagesController {
    readonly count: number;

    constructor(imagesElement: HTMLElement, duration: number = 9000) {
        this._imageElements = imagesElement.querySelectorAll('img');
        this.count = this._imageElements.length;

        setInterval(this._slideShow, duration - FADE_DURATION);
    }

    private _slideShow: () => void = () => {
        const nextImageIndex = (this._activeImageIndex + 1) % this.count;

        const curImage = this._imageElements[this._activeImageIndex];
        const nextImage = this._imageElements[nextImageIndex];

        nextImage.classList.add(BACKGROUND_IMAGE_ANIMATE_CLASS);

        curImage.style.opacity = '0';
        nextImage.style.opacity = '1';

        this._activeImageIndex = nextImageIndex;

        setTimeout(() => {
            nextImage.classList.add(BACKGROUND_IMAGE_ACTIVE_CLASS);
            curImage.classList.remove(BACKGROUND_IMAGE_ACTIVE_CLASS);
            curImage.classList.remove(BACKGROUND_IMAGE_ANIMATE_CLASS);
        }, FADE_DURATION)
    }

    private _imageElements: NodeListOf<HTMLImageElement>;
    private _activeImageIndex: number = 0;
}