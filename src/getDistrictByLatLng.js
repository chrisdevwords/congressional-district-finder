
import { getDistrictsInZip } from 'house-gov-page-scraper';
import getStateZipFromLatLng from
    './google/maps/geocode/getStateZipFromLatLng';
import checkLatLngInDistricts from './checkLatLngInDistricts';


export const COORDS_OUTSIDE_US = (lat, lng, country) =>
    `The specified latitude: "${lat}" and ` +
    `longitude: "${lng}" are for the country: ${country}. ` +
    'To Find a Congressional District, please provide coordinates in the US.';

/**
 * Finds a Congressional District based on latitude and longitude.
 * @see https://github.com/unitedstates/districts
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise}
 *      Rejects w/ a 404 if no districts match the provided lat lng or
 *      if the provided coordinates reside outside of the US.
 *      Rejects w/ a 400 if coordinates are invalid.
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
function getDistrictByLatLng(latitude, longitude) {

    return getStateZipFromLatLng(latitude, longitude)
        .then((data) => {
            const { country } = data;
            if (country !== 'US') {
                return Promise.reject({
                    statusCode: 404,
                    // eslint-disable-next-line babel/new-cap
                    message: COORDS_OUTSIDE_US(latitude, longitude, country)
                });
            }
            return data;
        })
        .then(({ zip }) => getDistrictsInZip(zip))
        .then(districts =>
            checkLatLngInDistricts(latitude, longitude, districts)
        );
}

export default getDistrictByLatLng;
