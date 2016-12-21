
import isValidGeoCoordinates from './isValidGeoCoordinates';
import { INVALID_COORDINATES } from './GeolibError';


export default function parseGeoCoordinates(coordinates) {

    if (!isValidGeoCoordinates(coordinates)) {
        throw new Error(INVALID_COORDINATES);
    }

    return {
        latitude: Number(coordinates[1]),
        longitude: Number(coordinates[0])
    };
}
