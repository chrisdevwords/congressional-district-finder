
import request from 'request-promise-native';


export const ENDPOINT = 'https://api.github.com/repos/unitedstates/' +
    'districts/contents/cds/2016';

export function parseDistricts({ body }) {
    return [...body].map(directory => directory.name);
}

export default function getDistricts() {

    const options = {
        uri: ENDPOINT,
        resolveWithFullResponse: true,
        json: true,
        headers: {
            'User-Agent': 'who-are-my-congressmen'
        }
    };

    return request
        .get(options)
        .then(parseDistricts);
}
