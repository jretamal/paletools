import extend from "../utils/extend";
import getWindow from "./window";

export default function http(url, method, body, options = null) {
    if (!url) throw new Error("Url must be specified");

    if (url.indexOf("http") === 0) {
        if (!isExternalRequestSupported()) new Promise(resolve => resolve());

        return externalHttp(url, method, body, options);
    }
    else {
        return fetch(`${services.Authentication.sessionUtas.url}/ut/game/fifa${APP_YEAR_SHORT}/${url}`, {
            method: method || 'GET',
            headers: {
                "X-UT-SID": services.Authentication.getUtasSession()["id"],
                "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : null
        }).then(response => response.json());
    }
}

export function isExternalRequestSupported() {
    return typeof GM_xmlhttpRequest !== "undefined";
}

function externalHttp(url, method, body, options) {
    return new Promise((resolve, reject) => {
        let request = extend({
            method: method,
            url: url,
            onload: response => resolve(response.responseText),
            onerror: response => reject(response),
            data: body
        }, options);


        GM_xmlhttpRequest(request);
    });
}