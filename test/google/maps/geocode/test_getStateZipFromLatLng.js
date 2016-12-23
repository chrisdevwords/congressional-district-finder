
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise';
import sinon from 'sinon';

import getStateZipFromLatLng, {
    parseLatLngJSON
}  from '../../../../src/google/maps/geocode/getStateZipFromLatLng';


const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

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

    context('with a successful result', () => {
        it.skip('can extract a state id', (done) => {
            done(Error('Test not complete'));
        });
        it.skip('can extract a zip code', (done) => {
            done(Error('Test not complete'));
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
