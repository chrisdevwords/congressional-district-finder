
import request from 'request-promise';
import flattenMultiPolygon from './flattenMultiPolygon';

export const endpoint = st =>
    `https://theunitedstates.io/districts/states/${st}/shape.geojson`;

export function parseStateShape({ coordinates }) {
    const polygons = flattenMultiPolygon(coordinates);
    return { polygons }
}

export default function getStateShape(st) {
    const options = {
        uri: endpoint(st),
        json: true
    };
    return request.get(options)
        .then(parseStateShape);
}
