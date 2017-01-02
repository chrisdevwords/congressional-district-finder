
import checkLatLngInDistrict from './checkLatLngInDistrict';

export const COORDINATES_NOT_IN_DISTRICTS = (lat, lng, districts) =>
    `Coordinates: "${lat},${lng}" could not be found in ` +
    `provided districts: ${districts}.`;

export const NO_DISTRICTS_PROVIDED = (lat, lng) =>
    `No districts provided for coordinates: "${lat},${lng}".`;

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
