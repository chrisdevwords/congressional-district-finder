
import request from 'request-promise-native';


export const endpoint = st =>
    `https://theunitedstates.io/districts/states/${st}/shape.geojson`;

export function parseStateShape({ coordinates }) {
    return { polygons: coordinates }
}

export default function getStateShape(st) {
    const options = {
        uri: endpoint(st),
        json: true
    };
    return request.get(options)
        .then(parseStateShape);
}
