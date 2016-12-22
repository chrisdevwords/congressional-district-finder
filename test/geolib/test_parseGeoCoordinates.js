

import mocha from 'mocha';
import chai from 'chai';

import parseGeoCoordinates from '../../src/geolib/parseGeoCoordinates';
import { INVALID_COORDINATES } from '../../src/geolib/GeolibError';

chai.config.includeStack = true;

const { expect } = chai;
const { describe, it } = mocha;

describe('#parseGeoCoordinates', () => {

    context('with an array of coordinates from geoJSON', () => {
        it('correctly formats an object for geolib', (done) => {
            const input = [-84.568445, 39.222258];
            const parsed = parseGeoCoordinates(input);
            expect(parsed.latitude)
                .to.eq(input[1]);
            expect(parsed.longitude)
                .to.eq(input[0]);
            done();
        });
    });

    context('with an array not matching the required structure', () => {
        it('throws an error', (done) => {
            const coordinates = [
                [
                    [
                        [-170.175664, 52.851715],
                        [-170.190133000000145, 52.862832]
                    ],
                    [
                        -170.16351500000016,
                        52.843551
                    ],
                ]
            ];
            expect(()=> {parseGeoCoordinates(coordinates)})
                .to.throw(INVALID_COORDINATES);
            done();
        });
    });

    context('with a comma delimited string', ()=> {
        it('correctly parses a lat,lng object', (done) => {
            const input = '-170.152789,52.835824';
            const coordinates = input.split(',');
            const parsed = parseGeoCoordinates(coordinates);
            expect(parsed.latitude).to.eq(52.835824);
            expect(parsed.longitude).to.eq(-170.152789);
            done();
        });
    });

    context('with a malformed string', ()=> {
        it('throws an error', ()=> {
            const input = '@-170.152789,52.835824/';
            const coordinates = input.split(',');
            expect(() => {parseGeoCoordinates(coordinates)})
                .to.throw(INVALID_COORDINATES);
        });
    });
});