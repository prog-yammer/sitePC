import {ProgressBar} from '../utils/progress_bar';
import {noticeError} from "../utils/notice";


export class RequestResponse<ExpectedDataT> {
    constructor(useProgressBar: boolean = true, method: string = 'POST') {
        this._method = method;

        if (useProgressBar) {
            this._progressBar = new ProgressBar();
        }
        this._abortController = new AbortController()
    }

    async fetchData(url: string, data: any): Promise<ExpectedDataT | null> {
        try {
            const response = await fetch(url, {
                method: this._method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: (data ? JSON.stringify(data) : null),
                signal: this._abortController.signal,
            });

            if (!response.ok || !response.body) {
                throw new Error(`HTTP error! status: ${response.status}`); // TODO
            }

            this._progressBar?.start();

            const contentLength = response.headers.get('Content-Length');
            const total = contentLength ? parseInt(contentLength, 10) : 0;

            const reader = response.body.getReader();
            let receivedLength = 0;
            const chunks: Uint8Array[] = [];

            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                chunks.push(value);
                receivedLength += value.length;

                if (total) {
                    const percentComplete = (receivedLength / total) * 100;
                    this._progressBar?.setProgress(percentComplete);
                } else {
                    // TODO
                }
            }

            const fullData = new Uint8Array(receivedLength);
            let position = 0;
            for (const chunk of chunks) {
                fullData.set(chunk, position);
                position += chunk.length;
            }

            const jsonString = new TextDecoder("utf-8").decode(fullData);
            return JSON.parse(jsonString);

        } catch (error: any) {
            this._progressBar?.stop();
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
            } else {
                console.error('Error:', error);
                noticeError('Что-то пошло не так');
            }
            return null;
        }
    }

    async fetch(url: string): Promise<ExpectedDataT | null> {
        return await this.fetchData(url, null);
    }

    cancel() {
        if (this._abortController) {
            this._abortController.abort();
        }
    }

    private readonly _progressBar?: ProgressBar;

    private readonly _method: string;
    private readonly _abortController: AbortController;
}