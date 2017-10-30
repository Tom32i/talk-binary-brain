/**
 * HTTP Request
 */
class Request {
    /**
     * @param {String} url
     * @param {Function} success
     * @param {Function} error
     */
    constructor(url, success, error, timeout = 0) {
        this.success = success;
        this.error = error;
        this.request = new XMLHttpRequest();

        this.onReadyStateChange = this.onReadyStateChange.bind(this);
        this.onError = this.onError.bind(this);

        this.request.timeout = timeout;
        this.request.addEventListener('readystatechange', this.onReadyStateChange);
        this.request.addEventListener('error', this.onError);
        this.request.addEventListener('timeout', this.onError);
        this.request.open('GET', url, true);
        this.request.responseType = 'arraybuffer';
        this.request.send();
    }

    /**
     * On ready state change
     *
     * @param {Event} event
     */
    onReadyStateChange(event) {
        if (this.request.readyState === XMLHttpRequest.DONE) {
            if (this.request.status === 200) {
                this.onSuccess(this.request.response);
            } else {
                this.onError();
            }
        }
    }

    /**
     * On success
     *
     * @param {Object} content
     */
    onSuccess(content) {
        this.clear();
        this.success(content);
    }

    /**
     * On Error
     */
    onError(event) {
        this.clear();
        this.error();
    }

    /**
     * Clear the request
     */
    clear() {
        if (this.request) {
            this.request.removeEventListener('readystatechange', this.onReadyStateChange);
            this.request.removeEventListener('error', this.onError);
            this.request = null;
        }
    }
}

export default Request;
