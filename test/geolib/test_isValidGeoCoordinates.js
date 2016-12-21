

import mocha from 'mocha';
import chai from 'chai';

import isValidGeoCoordinates from '../../src/geolib/isValidGeoCoordinates';


chai.config.includeStack = true;

const { expect } = chai;
const { describe, it } = mocha;

describe('#isValidGeoCoordinates', () => {

    context('with an array of float coordinates from geoJSON', () => {

        it('correctly returns true', (done) => {
            const latLng = [
                -170.162186000000133,
                52.663187
            ];
            expect(isValidGeoCoordinates(latLng))
                .to.eq(true);
            done();
        });
    });

    context('with an array of string coordinates from geoJSON', () => {

        it('correctly returns true', (done) => {
            const latLng = [
                '-170.190133000000145',
                '52.862832'
            ];
            expect(isValidGeoCoordinates(latLng))
                .to.eq(true);
            done();
        });
    });

    context('with an array not matching the required format', () => {

        it('returns false', (done) => {
            const badArray = [1, [2], "foo", true];
            expect(isValidGeoCoordinates(badArray))
                .to.eq(false);
            done();
        });
    });
});