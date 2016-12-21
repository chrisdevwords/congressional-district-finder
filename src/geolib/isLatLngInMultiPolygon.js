
import isLatLngInPolygon from './isLatLngInPolygon';


function isLatLngInMultiPolygon(lat, lng, multiPolygon) {
    return !!multiPolygon
        .find(
            polygon =>
                isLatLngInPolygon(lat, lng, polygon)
        );
}

export default isLatLngInMultiPolygon;
