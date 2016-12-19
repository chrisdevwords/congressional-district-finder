
import request from 'request-promise';
export const ENDPOINT = 'https://api.github.com/repos/unitedstates/districts/contents/cds/2016';


export function parseDistricts({ body }) {
    const districts = [...body].map(directory => directory.name);
    return districts;
}

export default function getDistricts() {
    const options = {
        method: 'GET',
        uri: ENDPOINT,
        resolveWithFullResponse: true,
        json: true,
        headers: {
            'User-Agent': 'who-are-my-congressmen'
        }
    };
    return request.get(options)
        .then(parseDistricts)
}
