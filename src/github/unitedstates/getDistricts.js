
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
