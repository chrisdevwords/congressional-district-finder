
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise';
import sinon from 'sinon';

import getStateZipFromLatLng, {
    parseLatLngJSON
}  from '../../../../src/google/maps/geocode/getStateZipFromLatLng';

import mock11211 from '../../../mock/google/maps/geocode/11211.json';
import mock6085 from '../../../mock/google/maps/geocode/06085.json';
import mockCanada from '../../../mock/google/maps/geocode/canada.json';
import mockTeritory from '../../../mock/google/maps/geocode/SanJuan.json';
import mock404 from '../../../mock/google/maps/geocode/noresults.json';
import mockError from '../../../mock/google/maps/geocode/invalid.json';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

describe('Google geocode helper', () => {
    describe('#getStateZipFromLatLng', () => {

        context('with a valid lat,lng', () => {

            beforeEach((done) => {
                sinon
                    .stub(request, 'get')
                    .returns(Promise.resolve({}));
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            it.skip('can extract a state id', (done) => {
                done('Test not complete');
            });

            it.skip('can extract a zip code', (done) => {
                done('Test not complete');
            });
        });

        context('with an invalid lat,lng', () => {

            beforeEach((done) => {
                sinon
                    .stub(request, 'get')
                    .returns(Promise.resolve({ }));
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            it.skip('rejects with an invalid lat,lng error without making a request', (done) => {
                // verify lat,lng before making http request
                // spy on request and verify it's not called
                done(Error('Test not complete'));
            });

            it.skip('rejects with an invalid lat,lng error', (done) => {
                done(Error('Test not complete'));
            });

            it.skip('rejects with a no results message', (done) => {
                done(Error('Test not complete'));
            });
        });
    });

    describe('#parseLatLngJSON', () => {

        context('with a successful US result', () => {

            it('can extract the country', (done) => {
                const result = parseLatLngJSON(mock11211);
                expect(result.country).to.eq('US');
                done();
            });

            it('can extract a state id', (done) => {
                const result = parseLatLngJSON(mock11211);
                expect(result.state).to.eq('NY');
                done();
            });

            it('can extract a zip code', (done) => {
                const result = parseLatLngJSON(mock6085);
                expect(result.zip).to.eq("06085");
                done();
            });
        });

        context('with a result outside the US', () => {
            it('can extract the country', (done) => {
                const result = parseLatLngJSON(mockCanada);
                expect(result.country).to.eq('CA');
                done();
            });
        });

        context('with a result in a US Territory', () => {
            it('can extract the country', (done) => {
                const result = parseLatLngJSON(mockTeritory);
                expect(result.country).to.eq('PR');
                done();
            });
        });

        context('with an unsuccessful result', () => {
            it.skip('can parse a no results message', (done) => {
                done(Error('Test not complete'));
            });
            it.skip('throws an invalid lat,lng error', (done) => {
                done(Error('Test not complete'));
            });
        });
    });
});
