
import getStateShape from './github/unitedstates/getStateShape';
import isLatLngInMultiPolygon from './geolib/isLatLngInMultiPolygon';


function checkLatLngInState(lat, lng, stateId) {
    return getStateShape(stateId)
        .then(({ polygons }) => {

            const isMatched = isLatLngInMultiPolygon(lat, lng, polygons);
            return {
                isMatched,
                stateId,
                latitude: lat,
                longitude: lng
            };
        });
}

export default checkLatLngInState;
