

import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise';
import sinon from 'sinon';

import getDistrictsInZip, {
    parsePage
}  from '../../../src/house/gov/getDistrictsInZip';


const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

describe('#getDistrictsInZip', () => {

    context('with a valid zip code', () => {

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

        it.skip('can parse a single district', (done) => {
            done('Test not complete');
        });

        it.skip('can parse multiple districts', (done) => {
            done('Test not complete');
        });
    });

    context('with an invalid zip code', () => {

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

        it.skip('rejects with an invalid zipcode error without making a request', (done) => {
            // valdiate zip code with regex
            // check before making http request
            // spy on request and verify it's not called
            done(Error('Test not complete'));
        });

        it.skip('rejects with an invalid zipcode error', (done) => {
            done(Error('Test not complete'));
        });

        it.skip('rejects with a no districts found error', (done) => {
            done(Error('Test not complete'));
        });
    });
});

describe('#parsePage', () => {

    context('with a successful result', () => {
        it.skip('can extract a single district code', (done) => {
            done(Error('Test not complete'));
        });
        it.skip('can extract multiple district codes', (done) => {
            done(Error('Test not complete'));
        });
    });

    context('with a unsuccessful result', () => {
        it.skip('can parse a no results message', (done) => {
            done(Error('Test not complete'));
        });
        it.skip('can parse an invalid zip code error', (done) => {
            done(Error('Test not complete'));
        });
    });
});
