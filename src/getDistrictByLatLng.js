
import { getDistrictsInZip } from 'house-gov-page-scraper';
import getStateZipFromLatLng from
    './google/maps/geocode/getStateZipFromLatLng';
import checkLatLngInDistricts from './checkLatLngInDistricts';


export const OUTSIDE_US = (lat, lng, country) =>
    `The specified latitude: "${lat}" and ` +
    `longitude: "${lng}" are for the country: ${country}. ` +
    'To Find a Congressional District, please provide coordinates in the US.';


function getDistrictByLatLng(latitude, longitude) {

    return getStateZipFromLatLng(latitude, longitude)
        .then((data) => {
            const { country } = data;
            if (country !== 'US') {
                return Promise.reject({
                    statusCode: 404,
                    // eslint-disable-next-line babel/new-cap
                    message: OUTSIDE_US(latitude, longitude, country)
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
