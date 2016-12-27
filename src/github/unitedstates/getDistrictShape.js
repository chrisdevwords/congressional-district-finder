
import request from 'request-promise-native';
import flattenMultiPolygon from './flattenMultiPolygon';

export const endpoint = district =>
    `https://theunitedstates.io/districts/cds/2016/${district}/shape.geojson`;

export function parseDistrictShape(data) {
    const {
        geometry = {},
        properties = { Code: '', District: '' }
    } = data;
    const { coordinates } = geometry;
    const polygons = flattenMultiPolygon(coordinates);
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
        .then(parseDistrictShape);
}
