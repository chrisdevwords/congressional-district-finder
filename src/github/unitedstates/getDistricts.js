
import request from 'request-promise-native';


export const ENDPOINT = 'https://api.github.com/repos/unitedstates/' +
    'districts/contents/cds/2016';

export function parseDistricts({ body, headers }) {

    const districts = [...body].map(directory => directory.name);

    return {
        headers,
        districts
    }
}

export const DEFAULT_HEADERS = {
    'User-Agent': 'congressional-district-finder'
};

/**
 * Fetches a list of all congressional districts
 * from JSON hosted by github.com/unitedstates.
 * Subject to rate limits without custom headers.
 * @see https://github.com/unitedstates/districts
 * @see https://developer.github.com/v3/rate_limit/
 * @param {object} customHeaders - If you wish to increase rate limits,
 *                                 pass your github auth credentials,
 *                                 an eTag or Last-Modified header.
 * @returns {Promise} - Resolves with the following:
 *                          districts {object} - an Array of districts.
 *                           Ex: ["AL-1","AL-2",...,"WY-0"]
 *                          headers {object} - The response headers from
 *                           github, including etag and last-modified.
 *                      Rejects with a 304 (at no rate limit penalty) if
 *                           etag or last-modified header is not expired.
 */
export default function getDistricts(customHeaders) {

    const headers = Object.assign(
        {},
        DEFAULT_HEADERS,
        customHeaders
    );

    const options = {
        uri: ENDPOINT,
        resolveWithFullResponse: true,
        json: true,
        headers
    };

    return request
        .get(options)
        .then(parseDistricts);
}
