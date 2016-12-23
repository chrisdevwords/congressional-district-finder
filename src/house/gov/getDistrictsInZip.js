
import request from 'request-promise';


export const endpoint = zip =>
    `http://ziplook.house.gov/htbin/findrep?ZIP=${zip}`;

export function parseDistrictCode(val) {
    return val;
}

export function parsePage(body) {
    // todo matching district codes are in an array in inline js
    //console.log(body);
    return body;
}

export default function getDistrictsInZip(zip) {
    return request
        .get({ uri: endpoint(zip) })
        .then(parsePage);
}
