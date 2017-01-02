
import mocha from 'mocha';
import chai from 'chai';

import parseJSON from '../../../../src/google/maps/geocode/parseJSON';

import mock11211 from '../../../mock/google/maps/geocode/11211.json';
import mockCanada from '../../../mock/google/maps/geocode/canada.json';
import mockTeritory from '../../../mock/google/maps/geocode/SanJuan.json';
import mock6085 from '../../../mock/google/maps/geocode/06085.json';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;


config.includeStack = true;

describe('#parseJSON', () => {

    context('with a successful US result', () => {

        it('can extract the country', (done) => {
            const result = parseJSON(mock11211);
            expect(result.country).to.eq('US');
            done();
        });

        it('can extract a state id', (done) => {
            const result = parseJSON(mock11211);
            expect(result.state).to.eq('NY');
            done();
        });

        it('can extract a zip code', (done) => {
            const result = parseJSON(mock6085);
            expect(result.zip).to.eq("06085");
            done();
        });

        it('can extract the lat, lng', (done) => {
            const { location } = parseJSON(mock11211);
            expect(location.lat).to.eq(40.718119);
            expect(location.lng).to.eq(-73.95625799999999);
            done();
        });
    });

    context('with a result outside the US', () => {
        it('can extract the country', (done) => {
            const result = parseJSON(mockCanada);
            expect(result.country).to.eq('CA');
            done();
        });

        it('can extract the lat, lng', (done) => {
            const { location } = parseJSON(mockCanada);
            expect(location.lat).to.eq(62.3809285);
            expect(location.lng).to.eq(-140.87577);
            done();
        });
    });

    context('with a result in a US Territory', () => {
        it('can extract the country', (done) => {
            const result = parseJSON(mockTeritory);
            expect(result.country).to.eq('PR');
            done();
        });

        it('can extract the lat, lng', (done) => {
            const { location } = parseJSON(mockTeritory);
            expect(location.lat).to.eq(18.3849);
            expect(location.lng).to.eq(-66.1276702);
            done();
        });
    });
});
