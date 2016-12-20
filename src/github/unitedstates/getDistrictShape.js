
import request from 'request-promise';
//import parseGeoJSON from './parseGeoJSON';

export const endpoint = (district) =>
    `https://theunitedstates.io/districts/cds/2016/${district}/shape.geojson`;

export function parseDistrictShape(data) {
    const {
        geometry = {},
        properties = { Code: '', District: '' }
    } = data;
    const polygons = geometry.coordinates; //todo parseGeoJSON(geometry);
    const districtCode = properties.Code;
    const name = properties.District;
    return { districtCode, name, polygons }
}

export default function getDistrictShape(district) {

    const options = {
        uri: endpoint(district),
        json: true
    };

    return request
        .get(options)
        .then(parseDistrictShape)
        .catch((err) => {
            //console.log( 'error', err.statusCode || err.cause && err.cause.code, Object.keys(err));
            return Promise.reject(err);
        });
}