
import request from 'request-promise';
import isValidGeoCoordinates from '../../../geolib/isValidGeoCoordinates';

export const endpoint = (lat, lng) =>
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}`;

export const NO_RESULTS_FOUND = (lat, lng) =>
    `No results found for latitude: "${lat}", longitude: "${lng}"`;

export const INVALID_REQUEST = (lat, lng) =>
    `Invalid parameters for latitude: "${lat}", longitude: "${lng}".`;

export function parseLatLngJSON({ results }) {

    const [first] = results;
    const components = first && first.address_components;

    if (components) {

        let state;
        let zip;

        const country = components.find(({ types }) =>
            types && types.includes('country')
        );

        if (country && country.short_name === 'US') {
            components.find((component) => {
                if (component.types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                    return true;
                }
                return false;
            });

            components.find(({types, short_name}) => {
                if (types.includes('postal_code')) {
                    zip = short_name;
                    return true;
                }
                return false;
            });
        }

        return {
            zip,
            state,
            country: country && country.short_name
        }
    }

    return { };
}

export default function getStateZipFromLatLng(lat, lng) {

    if (!isValidGeoCoordinates([lng, lat])) {
        return Promise.reject({
            statusCode: 400,
            // eslint-disable-next-line babel/new-cap
            message: INVALID_REQUEST(lat, lng)
        });
    }

    return request
        .get({
            json: true,
            uri: endpoint(lat, lng)
        })
        .then((data) => {
            const { status } = data;
            switch (status) {
                case 'ZERO_RESULTS':
                    return Promise.reject({
                        statusCode: 404,
                        // eslint-disable-next-line babel/new-cap
                        message: NO_RESULTS_FOUND(lat, lng)
                    });
                case 'INVALID_REQUEST':
                    return Promise.reject({
                        statusCode: 400,
                        // eslint-disable-next-line babel/new-cap
                        message: INVALID_REQUEST(lat, lng)
                    });
                case 'OK':
                default :
                    return data;

            }
        })
        .then(parseLatLngJSON);
}
