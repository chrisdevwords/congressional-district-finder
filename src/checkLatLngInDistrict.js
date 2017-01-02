
import getDistrictShape from './github/unitedstates/getDistrictShape';
import isLatLngInMultiPolygon from './geolib/isLatLngInMultiPolygon';

/**
 * Retrieves an array of Congressional districts based on zip
 * by scraping house.gov's district finder.
 * @see http://ziplook.house.gov/htbin/findrep
 * @param {string} zip -    A 5 digit zip code.
 *                          Prefix 4 digit zip codes w/ "0".
 * @returns {Promise}
 *      Rejects with a 404 if no district codes are found.
 *      Resolves with an array of hyphen delimited district codes.
 *      ex: ['AL-1','AL-2']
 */
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
