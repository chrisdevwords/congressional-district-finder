
import request from 'request-promise';

const endpoint = (lat, lng) =>
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}`

export function parseLatLngJSON(data) {
    console.log(data);
    return {};
}

export default function getStateZipFromLatLng(lat, lng) {
    return request
        .get({
            json: true,
            uri: endpoint(lat, lng)
        })
        .then(parseLatLngJSON);
}
