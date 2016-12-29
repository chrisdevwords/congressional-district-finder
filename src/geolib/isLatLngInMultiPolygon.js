
import isLatLngInPolygon from './isLatLngInPolygon';
import flattenMultiPolygon from './flattenMultiPolygon';

function isLatLngInMultiPolygon(lat, lng, multiPolygon) {
    return !!flattenMultiPolygon(multiPolygon)
        .find(
            polygon =>
                isLatLngInPolygon(lat, lng, polygon)
        );
}

export default isLatLngInMultiPolygon;
