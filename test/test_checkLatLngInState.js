import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise';
import sinon from 'sinon';

import { INVALID_COORDINATES } from '../src/geolib/GeolibError';
import checkLatLngInState from '../src/checkLatLngInState';

import mockNY from './mock/github/unitedstates/states/NY.json';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

describe('#checkLatLngInState', () => {

    beforeEach((done) => {
        sinon
            .stub(request, 'get')
            .returns(Promise.resolve(mockNY));
        done();
    });

    afterEach((done) => {
        request.get.restore();
        done();
    });

    context('when checking a lat,lng in a state', () => {

        const latitude = 40.718031;
        const longitude = -73.9583047;

        it('resolves a promise saying it matches', (done) => {
            checkLatLngInState(latitude, longitude, 'NY')
                .then(({ isMatched }) => {
                    expect(isMatched).to.eq(true);
                    done();
                })
                .catch(done);
        });

    });

    context('when checking a lat,lng not in a state', () => {

        const latitude = 40.7357;
        const longitude = -74.1724;

        it('resolves a promise saying it doesn\'t match', (done) => {
            checkLatLngInState(latitude, longitude, 'NY')
                .then(({ isMatched }) => {
                    expect(isMatched).to.eq(false);
                    done();
                })
                .catch(done);
        });
    });

    context('when checking a lat,lng against an invalid state', () => {

        const latitude = 42.6526;
        const longitude = -73.7562;

        it('rejects a promise with a 404', (done) => {

            request.get.restore();

            sinon
                .stub(request, 'get')
                .returns(Promise.reject({ statusCode: 404}));

            checkLatLngInState(latitude, longitude, 'BC')
                .then(() => {
                    done(Error('Promise should be rejected.'));
                })
                .catch(({ statusCode }) => {
                    expect(statusCode).to.eq(404);
                    done();
                })
                .catch(done);
        });
    });

    context('when checking an invalid lat,lng against a state', () => {

        const latitude = 22;
        const longitude = 'catch';

        it('rejects a promise with an invalid coordinates error', (done) => {
            checkLatLngInState(latitude, longitude, 'NY')
                .then(() => {
                    done(Error('Promise should be rejected.'));
                })
                .catch(({ message }) => {
                    expect(message).to.eq(INVALID_COORDINATES);
                    done();
                })
                .catch(done);
        });
    });
});
