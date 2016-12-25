
import getDistrictShape from './github/unitedstates/getDistrictShape';
import isLatLngInMultiPolygon from './geolib/isLatLngInMultiPolygon';


function checkLatLngInDistrict(lat, lng, districtId) {
    return getDistrictShape(districtId)
        .then((district) => {

            const { polygons } = district;
            const isMatched = isLatLngInMultiPolygon(lat, lng, polygons);
            return {
                isMatched,
                districtId,
                district,
                latitude: lat,
                longitude: lng
            };
        });
}

export default checkLatLngInDistrict;
