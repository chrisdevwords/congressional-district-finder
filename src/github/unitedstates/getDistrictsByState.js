
import getDistricts from './getDistricts';


export const NO_DISTRICTS_FOUND = 'No districts found.';

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
