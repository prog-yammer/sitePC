import {Navigation} from "./ui/navigation";
import {Header} from "./ui/header";
import {BackgroundImagesController} from "./ui/background_images_controller";
import {fadeIn, fadeOut} from "./animations/fade";
import {RequestResponse} from "./network/request_response";
import {ProgressBar} from "./utils/progress_bar";
import {InternalLinkController} from "./network/internal_link_controller";
import {executeOnReady} from "./utils/dom";
import {noticeError, noticeSuccess, noticeWarning} from "./utils/notice";


executeOnReady(async () => {

const header = new Header(document.querySelector('header')!);
const navigation = new Navigation(document.querySelector('.nav-switch')!, document.querySelector('nav')!);

const backgroundImagesController = new BackgroundImagesController(document.querySelector('.background-images')!);
const internalLinkController = new InternalLinkController(navigation);

});


function getPageLoadTime(): number {
    const navigationEntries = performance.getEntriesByType('navigation');
    const navigationEntry = navigationEntries[0] as PerformanceNavigationTiming;
    return navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime;
}

window.addEventListener('load', () => {
    const loadTime = getPageLoadTime();
    noticeSuccess(`${Math.round(loadTime)} мс`);
});
