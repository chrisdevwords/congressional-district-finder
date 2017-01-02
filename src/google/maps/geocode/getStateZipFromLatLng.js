
import request from 'request-promise-native';
import isValidGeoCoordinates from '../../../geolib/isValidGeoCoordinates';
import parseJSON from './parseJSON';

export const endpoint = (lat, lng) =>
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}`;

export const NO_RESULTS_FOUND = (lat, lng) =>
    `No results found for latitude: "${lat}", longitude: "${lng}"`;

export const INVALID_REQUEST = (lat, lng) =>
    `Invalid parameters for latitude: "${lat}", longitude: "${lng}".`;


/**
 * Uses the Google Maps Geocode endpoint to determine country,
 * state and zip for a pair of latitude and longitude coordinates.
 * @see https://maps.googleapis.com/maps/api/geocode/json
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise}
 *     Rejects w/ a 404 if coordinates fail to match a location.
 *     Rejects w/ a 400 if the coordinates are invalid.
 *     Resolves w/ the following:
 *          country {string}
 *          st {string} - Postal abbreviation if location is in US.
 *          zip {string} - 5 character zip code if location is in the US.
 */
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
