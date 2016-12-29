
import mocha from 'mocha';
import chai from 'chai';

import flattenMultiPolygon from '../../src/geolib/flattenMultiPolygon';
import isLatLngInMultiPolygon from '../../src/geolib/isLatLngInMultiPolygon';

import mockHI2 from '../mock/github/unitedstates/districts/HI-2.json';
import mockAK from '../mock/github/unitedstates/states/AK.json';

const { expect } = chai;
const { describe, it } = mocha;

chai.config.includeStack = true;

describe('#isLatLngInMultiPolygon', () => {

    context('with a complex district polygon parsed from geoJSON', () => {

        const { geometry } = mockHI2;
        const { coordinates } = geometry;

        it('correctly returns true', (done) => {
            const molokai = { latitude: 21.1536, longitude: -157.0963 };
            const result = isLatLngInMultiPolygon(
                molokai.latitude,
                molokai.longitude,
                coordinates
            );
            expect(result).to.eq(true);
            done();
        });

        it('correctly returns false', (done) => {
            const honolulu = { latitude: 21.3896946, longitude: -158.1690712};
            const result = isLatLngInMultiPolygon(
                honolulu.latitude,
                honolulu.longitude,
                coordinates
            );
            expect(result).to.eq(false);
            done();
        });
    });

    context('with a complex state parsed from geoJSON', () => {

        const { coordinates } = mockAK;

        it('correctly returns true', (done) => {
            const anchorage = { latitude: 61.2181, longitude: -149.9003 };
            const result = isLatLngInMultiPolygon(
                anchorage.latitude,
                anchorage.longitude,
                coordinates
            );
            expect(result).to.eq(true);
            done();
        });

        it('correctly returns false', (done) => {
            const beaverCreekYukon = { latitude: 62.3838, longitude: -140.8753 };
            const result = isLatLngInMultiPolygon(
                beaverCreekYukon.latitude,
                beaverCreekYukon.longitude,
                coordinates
            );
            expect(result).to.eq(false);
            done();
        });
    });
});
