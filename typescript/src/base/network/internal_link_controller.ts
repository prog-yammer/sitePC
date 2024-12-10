import {RequestResponse} from "./request_response";
import {fadeIn, fadeOut} from "../animations/fade";
import {Navigation} from "../ui/navigation";

interface HtmlInfo {
    title: string;
    main: string;
}

export class InternalLinkController {
    constructor(navigation: Navigation) {
        this._navigation = navigation;
        this._request = new RequestResponse(true);

        window.onpopstate = (e: PopStateEvent) => {
            this.go(window.location.href, false)
        }
        this.update();
    }

    update() {
        document.querySelectorAll('a')!.forEach(link => {
            link.removeEventListener('click', this._link_handler);
            link.addEventListener('click', this._link_handler);
        })
    }

    go(href: string, pushState: boolean = true) {
        const url = new URL(href);
        if (url.host != window.location.host) {
            return;
        }

        if (pushState && url.href == window.location.href) {
            window.scroll({
                top: 0,
                left: 0,
                behavior: 'smooth',
            });
            return;
        }

        this._request.fetch(href)
            .then(data => {
                if (data == null) {
                    return
                }
                this._navigation.close(true);
                if (pushState) {
                    history.pushState({}, '', href);
                }

                document.querySelector('title')!.text = data.title;
                document.querySelector('.header__title')!.textContent = data.title;

                const mainElement = document.querySelector('main')!;
                fadeOut(mainElement, 100, () => {
                    mainElement.innerHTML = data.main;
                    window.scroll({left: 0, top: 0});

                    const scriptTags = mainElement.getElementsByTagName('script');
                    Array.from(scriptTags).forEach(oldScriptTag => {
                      const newScriptTag = document.createElement('script');
                      if (oldScriptTag.src) {
                          newScriptTag.src = oldScriptTag.src;
                      } else {
                          newScriptTag.textContent = oldScriptTag.textContent;
                      }
                      document.body.appendChild(newScriptTag);
                      newScriptTag.onload = () => document.body.removeChild(newScriptTag);
                    })

                    this.update();
                    fadeIn(mainElement, 100);
                });
            });
    }

    private _link_handler: (event: MouseEvent) => void = (event: MouseEvent) => {
        const link = event.currentTarget as HTMLAnchorElement;
        const url = new URL(link.href);
        if (url.host == window.location.host) {
            event.preventDefault();
        }

        this.go(link.href)
    }

    private readonly _navigation: Navigation;
    private readonly _request: RequestResponse<HtmlInfo>;
}