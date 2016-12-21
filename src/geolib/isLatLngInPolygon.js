
import geolib from 'geolib';
import parseGeoCoordinates from './parseGeoCoordinates';


export default function isLatLngInPolygon(latitude, longitude, polygon) {
    const parsedPolygon = polygon.map(parseGeoCoordinates);
    const { isPointInside } = geolib;
    return isPointInside({ latitude, longitude }, parsedPolygon);
}
