
import request from 'request-promise-native';
import isValidGeoCoordinates from '../../../geolib/isValidGeoCoordinates';
import parseJSON from './parseJSON';

export const endpoint = (lat, lng) =>
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}`;

export const NO_RESULTS_FOUND = (lat, lng) =>
    `No results found for latitude: "${lat}", longitude: "${lng}"`;

export const INVALID_REQUEST = (lat, lng) =>
    `Invalid parameters for latitude: "${lat}", longitude: "${lng}".`;


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
        .then(parseJSON);
}
