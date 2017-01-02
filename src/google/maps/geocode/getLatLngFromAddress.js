
import request from 'request-promise-native';
import parseJSON from './parseJSON';


export const endpoint = address =>
    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}`;

export const NO_RESULTS_FOUND = address =>
    `No results found for address: "${address}"`;

export const INVALID_REQUEST = address =>
    `Invalid parameters for address: "${address}".`;


export default function getLatLngFromAddress(address) {

    return request
        .get({
            json: true,
            uri: endpoint(address)
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
                        message: NO_RESULTS_FOUND(address)
                    });

                default :
                    return Promise.reject({
                        statusCode: 400,
                        // eslint-disable-next-line babel/new-cap
                        message: INVALID_REQUEST(address)
                    });
            }
        })
        .then(parseJSON);
}
