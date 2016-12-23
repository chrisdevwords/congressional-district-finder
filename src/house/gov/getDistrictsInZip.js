
import request from 'request-promise';


export const INVALID_ZIP = zip =>
    `Invalid zip code: "${zip}".`;

export const NO_RESULTS_ZIP = zip =>
    `No results for zip code: "${zip}".`;

export const INVALID_DISTRICT_CODE_STRING = val =>
    `District code substring: "${val}" is an invalid format.`;

export const endpoint = zip =>
    `http://ziplook.house.gov/htbin/findrep?ZIP=${zip}`;

export function parseDistrictCode(val) {

    if (!val) {
        throw new Error(INVALID_DISTRICT_CODE_STRING(val));
    }

    const num = val.match(/\d+/g);
    const st = val.substring(1, 3);

    if (!num || !st ||
        st.length !== 2 ||
        num.length !== 1 ||
        isNaN(num[0]) ||
        num[0].length > 2
    ) {
        throw new Error(INVALID_DISTRICT_CODE_STRING(val));
    }

    return `${st}-${Number(num)}`;
}

export function scrapePage(body) {
    const startStr = 'districts=[';
    const start = body.indexOf(startStr) + startStr.length;
    const end = body.indexOf('];', start);
    const data = body.substring(start, end).split(',');
    return data
        .map(parseDistrictCode);
}

export default function getDistrictsInZip(zip) {
    return request
        .get({ uri: endpoint(zip) })
        .then(scrapePage);
}
