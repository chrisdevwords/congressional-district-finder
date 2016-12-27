import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

import { INVALID_COORDINATES } from '../src/geolib/GeolibError';
import checkLatLngInDistrict from '../src/checkLatLngInDistrict';

import mockNY12 from './mock/github/unitedstates/districts/NY-12.json';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

describe('#checkLatLngInDistrict', () => {

    beforeEach((done) => {
        sinon
            .stub(request, 'get')
            .returns(Promise.resolve(mockNY12));
        done();
    });

    afterEach((done) => {
        request.get.restore();
        done();
    });

    context('when checking a lat,lng in a district', () => {

        const latitude = 40.718031;
        const longitude = -73.9583047;

        it('resolves a promise saying it matches', (done) => {
            checkLatLngInDistrict(latitude, longitude, 'NY-12')
                .then(({ isMatched }) => {
                    expect(isMatched).to.eq(true);
                    done();
                })
                .catch(done);
        });

        it('resolves a promise with the districtCode', (done) => {
            checkLatLngInDistrict(latitude, longitude, 'NY-12')
                .then(({ district }) => {
                    expect(district.districtCode).to.eq('NY-12');
                    done();
                })
                .catch(done);
        });

        it('resolves a promise with the district name', (done) => {
            checkLatLngInDistrict(latitude, longitude, 'NY-12')
                .then(({ district }) => {
                    expect(district.name).to.eq('New York 12th');
                    done();
                })
                .catch(done);
        });

    });

    context('when checking a lat,lng not in a district', () => {

        const latitude = 42.6526;
        const longitude = -73.7562;

        it('resolves a promise saying it doesn\'t match', (done) => {
            checkLatLngInDistrict(latitude, longitude, 'NY-12')
                .then(({ isMatched }) => {
                    expect(isMatched).to.eq(false);
                    done();
                })
                .catch(done);
        });
    });

    context('when checking a lat,lng against an invalid district', () => {

        const latitude = 42.6526;
        const longitude = -73.7562;

        it('rejects a promise with a 404', (done) => {

            request.get.restore();

            sinon
                .stub(request, 'get')
                .returns(Promise.reject({ statusCode: 404}));

            checkLatLngInDistrict(latitude, longitude, 'PA-22')
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

    context('when checking an invalid lat,lng against a district', () => {

        const latitude = 'foo';
        const longitude = 'baz';

        it('rejects a promise with an invalid coordinates error', (done) => {
            checkLatLngInDistrict(latitude, longitude, 'NY-12')
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
