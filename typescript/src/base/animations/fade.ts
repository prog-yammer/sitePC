export function fadeIn(element: HTMLElement, duration: number = 300, onFinished?: () => void) {
    element.classList.add(`fade-in-${duration}`);
    element.style.opacity = '';
    element.style.display = '';
    setTimeout(() => {
        element.style.opacity = '';
        element.classList.remove(`fade-in-${duration}`);
        if (onFinished) {
            onFinished();
        }
    }, duration - 20)
}

export function fadeOut(element: HTMLElement, duration: number = 300, onFinished?: () => void) {
    element.classList.add(`fade-out-${duration}`);
    element.style.opacity = '';
    setTimeout(() => {
        element.style.opacity = '0';
        element.classList.remove(`fade-out-${duration}`);
        if (onFinished) {
            onFinished();
        }
    }, duration - 20)
}
