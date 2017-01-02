
import getDistricts from './getDistricts';


export const NO_DISTRICTS_FOUND = 'No districts found.';

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
export default function getDistrictsByState(st) {
    const ST = st.toUpperCase();
    return getDistricts()
        .then(({ districts }) =>
            districts.filter(
                district =>
                    district.indexOf(ST) === 0
            )
        )
        .then((districts) => {
            if (!districts.length) {
                return Promise.reject(
                    new Error(NO_DISTRICTS_FOUND)
                );
            }
            return districts;
        });
}
