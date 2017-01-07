
import { getDistrictsInZip } from 'house-gov-page-scraper';
import getLatLngFromAddress from './google/maps/geocode/getLatLngFromAddress';
import checkLatLngInDistricts from './checkLatLngInDistricts';


export const ADDRESS_OUTSIDE_US = (address, country) =>
    `The specified address: "${address}" ` +
    `appears to be from the country: ${country}. ` +
    'To Find a Congressional District, ' +
    'please provide coordinates in the US. ' +
    'More specific coordinates might also work.';

export const ADDRESS_MORE_SPECIFIC = address =>
    `The specified address: "${address}" ` +
    'appears to be too vague. Try including a street name and number.';

/**
 * Finds a Congressional District based on address.
 * @see https://github.com/unitedstates/districts
 * @see https://maps.googleapis.com/maps/api/geocode/json
 * @param {string} address
 * @returns {Promise}
 *      Rejects w/ a 404 if address is determined to be outside of the US.
 *      Rejects w/ a 400 if address is too vauge.
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
export default function getDistrictByAddress(address) {

    let lat;
    let lng;

    return getLatLngFromAddress(address)
        .then(({ country, zip, location }) => {

            if (country !== 'US') {
                return Promise.reject({
                    statusCode: 404,
                    // eslint-disable-next-line babel/new-cap
                    message: ADDRESS_OUTSIDE_US(address, country)
                });
            }

            if (!zip) {
                return Promise.reject({
                    statusCode: 400,
                    // eslint-disable-next-line babel/new-cap
                    message: ADDRESS_MORE_SPECIFIC(address)
                });
            }

            lat = location.lat;
            lng = location.lng;

            return getDistrictsInZip(zip);

        })
        .then(districts =>
            checkLatLngInDistricts(lat, lng, districts)
        );
}
