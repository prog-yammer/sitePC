export function zoomIn(element: HTMLElement, duration: number = 300, onFinished?: () => void) {
    element.classList.add(`zoomIn-${duration}`);
    element.style.opacity = '';
    element.style.display = '';
    setTimeout(() => {
        element.style.opacity = '';
        element.classList.remove(`zoomIn-${duration}`);
        if (onFinished) {
            onFinished();
        }
    }, duration - 10)
}

export function zoomOut(element: HTMLElement, duration: number = 300, onFinished?: () => void) {
    element.classList.add(`zoomOut-${duration}`);
    element.style.opacity = '';
    setTimeout(() => {
        element.style.display = 'none';
        element.classList.remove(`zoomOut-${duration}`);
        if (onFinished) {
            onFinished();
        }
    }, duration - 10)
}

export function groupZoomIn(elements: HTMLElement[], duration: number = 300, onFinished?: () => void) {
    for (const element of elements) {
        zoomIn(element, duration);
    }
    if (onFinished) {
        setTimeout(() => {
            onFinished();
        }, duration - 10)
    }
}

export function groupZoomOut(elements: HTMLElement[], duration: number = 300, onFinished?: () => void) {
    for (const element of elements) {
        zoomOut(element, duration);
    }
    if (onFinished) {
        setTimeout(() => {
            onFinished();
        }, duration - 10)
    }
}
