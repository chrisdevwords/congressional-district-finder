
import request from 'request-promise-native';


export const endpoint = district =>
    `https://theunitedstates.io/districts/cds/2016/${district}/shape.geojson`;

export const UNEXPECTED_DISTRICT_JSON = 'Unexpected JSON.';

export function parseDistrictShape({ geometry, properties }) {

    if (!geometry || !properties) {
        throw new Error(UNEXPECTED_DISTRICT_JSON);
    }

    const { coordinates } = geometry;
    const districtCode = properties.Code;
    const name = properties.District;

    return {
        districtCode,
        name,
        polygons: coordinates
    }
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
