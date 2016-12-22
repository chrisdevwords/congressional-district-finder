
import geolib from 'geolib';
import parseGeoCoordinates from './parseGeoCoordinates';
import { INVALID_COORDINATES } from './GeolibError';
import isValidGeoCoordinates from './isValidGeoCoordinates';

export default function isLatLngInPolygon(latitude, longitude, polygon) {
    if (!isValidGeoCoordinates([longitude, latitude])) {
        throw new Error(INVALID_COORDINATES);
    }
    const parsedPolygon = polygon.map(parseGeoCoordinates);
    const { isPointInside } = geolib;
    return isPointInside({ latitude, longitude }, parsedPolygon);
}
