
import request from 'request-promise-native';
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

    let state;
    let zip;
    let country;

    components.find(({ short_name, types }) => {
        if (types && types.includes('country')) {
            // eslint-disable-next-line camelcase
            country = short_name;
            return true;
        }
        return false;
    });


    if (country && country === 'US') {
        components.find(({ types, short_name }) => {
            if (types.includes('administrative_area_level_1')) {
                // eslint-disable-next-line camelcase
                state = short_name;
                return true;
            }
            return false;
        });

        components.find(({ types, short_name }) => {
            if (types.includes('postal_code')) {
                // eslint-disable-next-line camelcase
                zip = short_name;
                return true;
            }
            return false;
        });
    }

    return {
        zip,
        state,
        country
    }
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

                case 'OK':
                    return data;

                case 'ZERO_RESULTS':
                    return Promise.reject({
                        statusCode: 404,
                        // eslint-disable-next-line babel/new-cap
                        message: NO_RESULTS_FOUND(lat, lng)
                    });

                default :
                    return Promise.reject({
                        statusCode: 400,
                        // eslint-disable-next-line babel/new-cap
                        message: INVALID_REQUEST(lat, lng)
                    });
            }
        })
        .then(parseLatLngJSON);
}
