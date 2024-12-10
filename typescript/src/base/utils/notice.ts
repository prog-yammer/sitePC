import {fadeIn, fadeOut} from "../animations/fade";

function notice(text: string, mode: string): void {
    const div = document.createElement('div');
    div.style.display = 'none';
    div.classList.add('toast');
    div.classList.add(`toast-${mode}`);
    div.innerHTML = `<div class="toast__icon"></div><p class="toast__text">${text}</p></div>`;

    document.querySelector('.notices')!.appendChild(div);
    fadeIn(div, 300);
    setTimeout(() => {
        fadeOut(div, 300, () => {
            document.querySelector('.notices')!.removeChild(div);
        });
    }, 2500);
}

export function noticeSuccess(text: string): void {
    notice(text, 'success');
}

export function noticeWarning(text: string): void {
    notice(text, 'warning');
}

export function noticeError(text: string): void {
    notice(text, 'error');
}
