import {fadeOut} from "../animations/fade";

export class ProgressBar {
    constructor() {
        this._progress = 0;
        this._element = document.querySelector('.progress-bar')!;
    }

    start(): void {
        this._progress = 0;
        this._element.style.display = 'block';
    }

    setProgress(progress: number): void {
        if (progress < this._progress) {
            return;
        }

        this._progress = progress;
        this._element.style.width = `${progress}%`;
        if (progress >= 100) {
            setTimeout(() => {
                fadeOut(this._element, 300, () => {
                    this.stop();
                });
            }, 100)
        }
    }

    stop(): void {
        this._progress = 0;
        this._element.removeAttribute('style');
    }

    private readonly _element: HTMLElement;
    private _progress: number;
}