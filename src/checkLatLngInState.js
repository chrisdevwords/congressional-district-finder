
import getStateShape from './github/unitedstates/getStateShape';
import isLatLngInMultiPolygon from './geolib/isLatLngInMultiPolygon';


/**
 * Fetches GeoJSON boundaries for a US State and
 * verifies that a latitude and longitude are within those boundaries
 * GeoJSON ata for state boundaries hosted by github.com/unitedstates.
 * @see https://github.com/unitedstates/districts
 * @param {number} latitude
 * @param {number} longitude
 * @param  {string} st - Postal code abbreviation for US state. Ex: AL.
 * @returns {Promise} - Resolves with the following:
 *      isMatched {boolean} - Do the lat, lng reside in the state?
 *      stateId {string} - Provided postal code for US state. Ex: AL
 *      latitude {number} - The latitude provided.
 *      longitude {number} - The longitude provided.
 */
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
