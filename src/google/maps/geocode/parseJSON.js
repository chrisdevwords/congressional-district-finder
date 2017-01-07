

export default function parseJSON({ results }) {

    const [{ address_components, geometry }] = results;
    // eslint-disable-next-line camelcase
    const components = address_components;
    const { location } = geometry;

    let state;
    let zip;
    let country;

    components.find(({ short_name, types }) => {
        if (types && types.includes('country')) {
            // eslint-disable-next-line camelcase
            country = short_name;
            return true;
        }
        return false;
    });

    if (country && country === 'US') {
        components.find(({ types, short_name }) => {
            if (types.includes('administrative_area_level_1')) {
                // eslint-disable-next-line camelcase
                state = short_name;
                return true;
            }
            return false;
        });

        components.find(({ types, short_name }) => {
            if (types.includes('postal_code')) {
                // eslint-disable-next-line camelcase
                zip = short_name;
                return true;
            }
            return false;
        });
    }

    return {
        zip,
        state,
        location,
        country
    };
}
