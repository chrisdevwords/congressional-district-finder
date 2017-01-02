
import checkLatLngInDistrict from './checkLatLngInDistrict';

export const COORDINATES_NOT_IN_DISTRICTS = (lat, lng, districts) =>
    `Coordinates: "${lat},${lng}" could not be found in ` +
    `provided districts: ${districts}.`;

export const NO_DISTRICTS_PROVIDED = (lat, lng) =>
    `No districts provided for coordinates: "${lat},${lng}".`;

/**
 * Fetches GeoJSON boundaries for a series of US Congressional Districts
 * until a latitude and longitude match the GeoJSON of a provided district.
 * GeoJSON data for district boundaries hosted by github.com/unitedstates.
 * @see https://github.com/unitedstates/districts
 * @param {number} latitude
 * @param {number} longitude
 * @param  {array} districts - An array of postal code abbreviation
 *                             for US states Ex: AL
 * @returns {Promise}
 *      Rejects w/ a 404 statusCode if no districts match provided lat,lng.
 *      Resolves w/ the following:
 *          isMatched {boolean} - Do the lat,lng reside in the state?
 *          districtId {string} - Hyphen-delimited code for district.
 *                                Ex: AL-1.
 *          district {object} - Information about the district
 *                              from github/unitedstates
 *          district.name {string} - The display name of the district.
 *                                   EX: "Alabama's 1st"
 *          district.districtCode {string} - 5 character, hyphen delmited
 *                                           code for the district.
 *                                           Ex: "AL-01"
 *          district.polygons - {array} An array of "shapes"
 *                                      of lat, lng coordinates that
 *                                      define the district's boundaries.
 *          latitude {number} - Latitude provided.
 *          longitude {number} - Longitude provided.
 */
function checkLatLngInDistricts(lat, lng, districts) {

    if (!districts || !districts.length) {
        return Promise.reject({
            statusCode: 422,
            // eslint-disable-next-line babel/new-cap
            message: NO_DISTRICTS_PROVIDED(lat, lng)
        });
    }

    const toCheck = districts.concat();
    const _checkNextDistrict = () =>
        checkLatLngInDistrict(lat, lng, toCheck.shift())
            .then((result) => {
                if (result.isMatched) {
                    return Promise.resolve(result);
                }
                if (toCheck.length) {
                    return _checkNextDistrict();
                }
                return Promise.reject({
                    statusCode: 422,
                    // eslint-disable-next-line babel/new-cap
                    message: COORDINATES_NOT_IN_DISTRICTS(lat, lng, districts)
                });
            });

    return _checkNextDistrict();
}

export default checkLatLngInDistricts;
