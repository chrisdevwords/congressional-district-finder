
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

import getStateZipFromLatLng, {
    parseLatLngJSON,
    NO_RESULTS_FOUND,
    INVALID_REQUEST,
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
                    .returns(Promise.resolve(mock6085));
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            it('can extract a state id', (done) => {
                getStateZipFromLatLng(41.730308, -72.898088)
                    .then((result) => {
                        expect(result.state).to.eq('CT');
                        done();
                    })
                    .catch(done);
            });

            it('can extract a zip code', (done) => {
                getStateZipFromLatLng(41.730308, -72.898088)
                    .then(({ zip }) => {
                        expect(zip).to.eq('06085');
                        done();
                    })
                    .catch(done);
            });

            it('can extract a country', (done) => {
                getStateZipFromLatLng(41.730308, -72.898088)
                    .then(({ country }) => {
                        expect(country).to.eq('US');
                        done();
                    })
                    .catch(done);
            });
        });

        context('with a lat,lng that yields no results', () => {

            beforeEach((done) => {
                sinon
                    .stub(request, 'get')
                    .returns(Promise.resolve(mock404));
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            it('rejects with a 404 and message', (done) => {

                const lat = 78.2162792;
                const lng = -171.869262;

                getStateZipFromLatLng(lat, lng)
                    .then(() => {
                        done(Error('Promise should be rejected.'));
                    })
                    .catch(({ statusCode, message }) => {
                        expect(statusCode).to.eq(404);
                        expect(message).to.eq(NO_RESULTS_FOUND(lat, lng));
                        done();
                    })
                    .catch(done);
            });
        });

        context('with an invalid lat,lng', () => {

            let stub;

            beforeEach((done) => {
                stub = sinon
                    .spy(request, 'get');
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            it('rejects with an invalid lat,lng error without making a request', (done) => {
                getStateZipFromLatLng('foo', 'bar')
                    .then(() => {
                        done(Error('Promise should be rejected.'));
                    })
                    .catch(() => {
                        expect(stub.callCount).to.eq(0);
                        done();
                    })
                    .catch(done);
            });

            it('rejects with an invalid lat,lng error with the correct status code', (done) => {
                getStateZipFromLatLng('foo', 'bar')
                    .then(() => {
                        done(Error('Promise should be rejected.'));
                    })
                    .catch(({ statusCode }) => {
                        expect(statusCode).to.eq(400);
                        done();
                    })
                    .catch(done);
            });

            it('rejects with an invalid lat,lng error with an informative message', (done) => {
                getStateZipFromLatLng('foo', 'bar')
                    .then(() => {
                        done(Error('Promise should be rejected.'));
                    })
                    .catch(({ message }) => {
                        expect(message).to.eq(INVALID_REQUEST('foo', 'bar'));
                        done();
                    })
                    .catch(done);
            });
        });

        context('with an error response other than 404', () => {

            let stub;

            const lat = 1;
            const lng = 1;

            beforeEach((done) => {
                stub = sinon
                    .stub(request, 'get')
                    .returns(Promise.resolve(mockError));
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            it('handles the error', (done) =>{
                getStateZipFromLatLng(lat, lng)
                    .then(() => {
                        done(Error('Promise should be rejected.'));
                    })
                    .catch(({ statusCode }) => {
                        expect(statusCode).to.eq(400);
                        done();
                    })
                    .catch(done);
            });

            it('rejects with an error message', (done) =>{
                getStateZipFromLatLng(lat, lng)
                    .then(() => {
                        done(Error('Promise should be rejected.'));
                    })
                    .catch(({ message }) => {
                        expect(message).to.eq(INVALID_REQUEST(lat, lng));
                        done();
                    })
                    .catch(done);
            });

            it('only makes one request', (done) => {

                getStateZipFromLatLng(lat, lng)
                    .then(() => {
                        done(Error('Promise should be rejected.'));
                    })
                    .catch(() => {
                        expect(stub.callCount).to.eq(1);
                        done();
                    })
                    .catch(done);
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
    });
});
