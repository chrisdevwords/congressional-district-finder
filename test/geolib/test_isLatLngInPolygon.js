
import mocha from 'mocha';
import chai from 'chai';

import flattenMultiPolygon from '../../src/github/unitedstates/flattenMultiPolygon';
import isLatLngInPolygon from '../../src/geolib/isLatLngInPolygon';

import mockNY12 from '../mock/github/unitedstates/districts/NY-12.json';

chai.config.includeStack = true;

const { expect } = chai;
const { describe, it } = mocha;

describe('#isLatLngInPolygon', () => {

    context('with a district polygon parsed from geoJSON', () => {

        const { geometry } = mockNY12;
        const { coordinates } = geometry;
        const districtShape = flattenMultiPolygon(coordinates)[0];

        it('correctly returns true', (done) => {
            const latitude = 40.718031;
            const longitude = -73.9583047;
            expect(isLatLngInPolygon(latitude, longitude, districtShape))
                .to.eq(true);
            done();
        });

        it('correctly returns false', (done) => {
            const latitude = 40.711185;
            const longitude = -73.9636098;
            expect(isLatLngInPolygon(latitude, longitude, districtShape))
                .to.eq(false);
            done();
        });
    });
});