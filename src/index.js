
import getDistricts from './github/unitedstates/getDistricts';
import getDistrictsByState from './github/unitedstates/getDistrictsByState';
import checkLatLngInState from './checkLatLngInState';
import checkLatLngInDistrict from './checkLatLngInDistrict';
import checkLatLngInDistricts from './checkLatLngInDistricts';
import getStateZipFromLatLng
    from './google/maps/geocode/getStateZipFromLatLng';
import getDistrictsInZip from './house/gov/getDistrictsInZip';
import getDistrictByLatLng from './getDistrictByLatLng';


export {
    /**
     * Fetches a list of all congressional districts
     * from JSON hosted by github.com/unitedstates.
     * Subject to rate limits without custom headers.
     * @see https://github.com/unitedstates/districts
     * @see https://developer.github.com/v3/rate_limit/
     * @param {object} customHeaders - If you wish to increase rate limits,
     *                                 pass your github auth credentials,
     *                                 an eTag or Last-Modified header.
     * @returns {Promise} - Resolves with the following:
     *                          districts {object} - an Array of districts.
     *                           Ex: ["AL-1","AL-2",...,"WY-0"]
     *                          headers {object} - The response headers from
     *                           github, including etag and last-modified.
     *                      Rejects with a 304 (at no rate limit penalty) if
     *                           etag or last-modified header is not expired.
     */
    getDistricts,
    /**
     * Fetches a list of all congressional district codes
     * based on state abbreviation (ST) from github.com/unitedstates.
     * Subject to rates limits.
     * @see https://github.com/unitedstates/districts
     * @see https://developer.github.com/v3/rate_limit/
     * @param  {string} st - Postal code abbreviation for US state. Ex: AL.
     * @returns {Promise} - Resolves with an array of district IDs.
     *                      Ex: ["AL-1","AL-2",...,"AL-7"]
     */
    getDistrictsByState,
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
    checkLatLngInState,
    /**
     * Uses the Google Maps Geocode endpoint to determine country,
     * state and zip for a pair of latitude and longitude coordinates.
     * @see https://maps.googleapis.com/maps/api/geocode/json
     * @param {number} latitude
     * @param {number} longitude
     * @returns {Promise}
     *     Rejects w/ a 404 if coordinates fail to match a location.
     *     Rejects w/ a 400 if the coordinates are invalid.
     *     Resolves w/ the following:
     *          country {string}
     *          st {string} - Postal abbreviation if location is in US.
     *          zip {string} - 5 character zip code if location is in the US.
     */
    getStateZipFromLatLng,
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
    getDistrictsInZip,
    /**
     * Fetches GeoJSON boundaries for a US Congressional District and
     * verifies that a latitude and longitude are within those boundaries.
     * GeoJSON data for district boundaries hosted by github.com/unitedstates.
     * @see https://github.com/unitedstates/districts
     * @param {number} latitude
     * @param {number} longitude
     * @param  {string} st - Postal code abbreviation for US state. Ex: AL
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
    checkLatLngInDistrict,
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
    checkLatLngInDistricts,
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
    getDistrictByLatLng
};
