export function executeOnReady(fn: () => void) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}
(window as any).executeOnReady = executeOnReady;
