
import request from 'request-promise-native';


export const endpoint = district =>
    `https://theunitedstates.io/districts/cds/2016/${district}/shape.geojson`;

export const UNEXPECTED_DISTRICT_JSON = 'Unexpected JSON.';
export const DISTRICT_NOT_FOUND = district =>
    `District: "${district}" not found.`;

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
        .catch((err) => {
            const { statusCode } = err;
            if (statusCode === 404) {
                // eslint-disable-next-line babel/new-cap
                const error = new Error(DISTRICT_NOT_FOUND(district));
                error.statusCode = 404;
                throw error;
            }
            throw err;
        })
        .then(parseDistrictShape);
}
