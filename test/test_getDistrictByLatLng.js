

import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

import { INVALID_REQUEST } from '../src/google/maps/geocode/getStateZipFromLatLng';
import getDistrictByLatLng, {
    OUTSIDE_US,
} from '../src/getDistrictByLatLng';

const { describe, it, beforeEach, afterEach } = mocha;
const { expect, config } = chai;

config.includeStack = true;


describe('#getDistrictByLatLng', () => {

    context('with latitude and longitude', () => {
        it('can find a district in Westerville, OH', (done) => {

            const lat = 40.128072;
            const lng = -82.9184697;

            getDistrictByLatLng(lat, lng)
                .then(({ district }) => {
                    expect(district.districtCode)
                        .to.eq('OH-12');
                    done();
                }).catch(done);
        });

        it('can find a district in Alaska', (done) => {

            const lat = 64.5011;
            const lng = -165.4064;

            getDistrictByLatLng(lat, lng)
                .then(({ district, districtId }) => {
                    expect(districtId)
                        .to.eq('AK-0');
                    expect(district.districtCode)
                        .to.eq('AK-AL');
                    done();
                }).catch(done);
        });
    });

    context('with a latititude and longitude outside the US', () => {

        let spy;
        const lat = 31.6538179;
        const lng = -106.5890206;

        beforeEach((done) => {
            spy = sinon.spy(request, 'get');
            done();
        });

        afterEach((done) => {
            request.get.restore();
            done();
        });

        it('rejects the promise with a helpful error', (done) => {
            getDistrictByLatLng(lat, lng)
                .then(() => {
                    done(Error('Promise should be rejected.'))
                })
                .catch(({ statusCode, message }) => {
                    expect(statusCode).to.eq(404);
                    expect(message).to.eq(OUTSIDE_US(lat, lng, 'MX'));
                    done();
                })
                .catch(done);
        });

        it('only makes a single http request', (done) => {
            getDistrictByLatLng(lat, lng)
                .then(() => {
                    done(Error('Promise should be rejected.'))
                })
                .catch(() => {
                    expect(spy.callCount).to.eq(1);
                    done();
                })
                .catch(done);
        });
    });

    context('with invalid lat lng coordinates', () => {

        let spy;

        beforeEach((done) => {
            spy = sinon.spy(request, 'get');
            done();
        });

        afterEach((done) => {
            request.get.restore();
            done();
        });


        it('throws an informative error', (done) => {
            getDistrictByLatLng(null, null)
                .then(() => {
                    done(Error('Promise should be rejected.'))
                })
                .catch(({ message, statusCode }) => {
                    expect(statusCode).to.eq(400);
                    expect(message).to.eq(INVALID_REQUEST(null, null));
                    done();
                })
                .catch(done);
        });

        it('doesn\'t make any http requests', (done) => {
            getDistrictByLatLng()
                .then(() => {
                    done(Error('Promise should be rejected.'))
                })
                .catch(() => {
                    expect(spy.callCount).to.eq(0);
                    done();
                })
                .catch(done);
        });
    });
});