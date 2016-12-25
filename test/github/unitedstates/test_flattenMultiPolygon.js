

import mocha from 'mocha';
import chai from 'chai';

import flattenMultiPolygon, {
    isValidGeoCoordinates,
} from '../../../src/github/unitedstates/flattenMultiPolygon';

import mockWY from '../../mock/github/unitedstates/states/WY.json';
import mockAK from '../../mock/github/unitedstates/states/AK.json';
import mockOH2 from '../../mock/github/unitedstates/districts/OH-2.json';
import mockHI2 from '../../mock/github/unitedstates/districts/HI-2.json';

const { describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

describe('#flattenMultiPolygon', () => {

    context('with a contiguous district ', () => {

        const { geometry } = mockOH2;
        const { coordinates } = geometry;
        const polygons = flattenMultiPolygon(coordinates);

        it('extracts an array with one polygon', (done) => {
            expect(polygons.length).to.eq(1);
            expect(polygons[0].length).to.eq(1085);
            done();
        });

        it('extracts an array with one polygon of lat,lng coordinates', (done) => {
            expect(polygons[0][1].length).to.eq(2);
            expect(polygons[0][666].length).to.eq(2);
            done();
        });
    });

    context('with a contiguous state', () => {

        const { coordinates } = mockWY;
        const polygons = flattenMultiPolygon(coordinates);

        it('extracts an array with one polygon', (done) => {
            expect(polygons.length).to.eq(1);
            expect(polygons[0].length).to.eq(289);
            expect(polygons[0][1].length).to.eq(2);
            expect(polygons[0][145].length).to.eq(2);
            done();
        });

        it('extracts a single polygon containing lat,lng coordinates', (done) => {
            expect(polygons[0][1].length).to.eq(2);
            expect(polygons[0][145].length).to.eq(2);
            done();
        });
    });

    context('with a multi-shape district ', () => {

        const { geometry } = mockHI2;
        const { coordinates } = geometry;
        const polygons = flattenMultiPolygon(coordinates);

        it('extracts an array of polygons', (done) => {
            expect(polygons.length).to.eq(9);
            expect(polygons[8].length).to.eq(53);

            done();
        });

        it('extracts an array of polygons, each containing lat,lng coordinates', (done) => {
            expect(polygons[0][1].length).to.eq(2);
            expect(polygons[4][1].length).to.eq(2);
            expect(polygons[8][33].length).to.eq(2);
            done();
        });
    });

    context('with a multi-shape state', () => {

        const { coordinates } = mockAK;
        const polygons = flattenMultiPolygon(coordinates);

        it('extracts an array of polygons', (done) => {
            expect(polygons.length).to.eq(50);
            expect(polygons[49].length).to.eq(39);
            done();
        });

        it('extracts an array of polygons, each containing lat,lng coordinates', (done) => {
            expect(polygons[0][1].length).to.eq(2);
            expect(polygons[4][12].length).to.eq(2);
            expect(polygons[49][33].length).to.eq(2);
            done();
        });
    });
});
