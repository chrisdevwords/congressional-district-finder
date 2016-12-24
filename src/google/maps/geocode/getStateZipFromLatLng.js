
import request from 'request-promise';

const endpoint = (lat, lng) =>
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}`;

export function parseLatLngJSON({ results }) {

    const [first] = results;
    const components = first && first.address_components;

    if (components) {

        let state;
        let zip;

        const country = components.find(component =>
            component.types.includes('country')
        );

        if (country.short_name === 'US') {
            components.find((component) => {
                if (component.types.includes('administrative_area_level_1')) {
                    state = component.short_name;
                    return true;
                }
                return false;
            });

            components.find((component) => {
                if (component.types.includes('postal_code')) {
                    zip = component.short_name;
                    return true;
                }
                return false;
            });
        }

        return {
            zip,
            state,
            country: country && country.short_name
        }
    }

    return { };
}

export default function getStateZipFromLatLng(lat, lng) {
    return request
        .get({
            json: true,
            uri: endpoint(lat, lng)
        })
        .then(parseLatLngJSON);
}
