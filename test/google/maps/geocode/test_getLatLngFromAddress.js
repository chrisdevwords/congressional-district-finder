
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

import getLatLngFromAddress, {
    NO_RESULTS_FOUND,
    INVALID_REQUEST,
}  from '../../../../src/google/maps/geocode/getLatLngFromAddress';

import mockUSAddress from '../../../mock/google/maps/geocode/piesnthighs.json';
import mockUSNeighborhood from '../../../mock/google/maps/geocode/sheepsheadbay.json';
import mockUSCity from '../../../mock/google/maps/geocode/saintlouis.json';
import mockCAAddress from '../../../mock/google/maps/geocode/windsorcasino.json';
import mock404 from '../../../mock/google/maps/geocode/noresults.json';
import mockError from '../../../mock/google/maps/geocode/invalid.json';


const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

describe('Google geocode helper', () => {
    describe('#getLatLngFromAddress', () => {

        context('with a street number, city and state in the US', () => {

            beforeEach((done) => {
                sinon
                    .stub(request, 'get')
                    .returns(Promise.resolve(mockUSAddress));
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            const address = '166 South 4th Street Brooklyn New York';

            it('can get the zip code', (done) => {
                getLatLngFromAddress(address)
                    .then(({ zip }) => {
                        expect(zip).to.eq('11211');
                        done();
                    })
                    .catch(done);
            });

            it('can get the geo coordinates', (done) => {
                getLatLngFromAddress(address)
                    .then(({ location }) => {
                        expect(location)
                            .to.be.an('object')
                            .and.to.have.keys('lat', 'lng');
                        done();
                    })
                    .catch(done);
            });
        });

        context('with the name of an american neighborhood', () => {

            beforeEach((done) => {
                sinon
                    .stub(request, 'get')
                    .returns(Promise.resolve(mockUSNeighborhood));
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            const address = 'Sheepshead Bay Brooklyn';

            it('can get the country', (done) => {
                getLatLngFromAddress(address)
                    .then(({ country }) => {
                        expect(country).to.eq('US');
                        done();
                    })
                    .catch(done);
            });

            it('can get the geo coordinates', (done) => {
                getLatLngFromAddress(address)
                    .then(({ location }) => {
                        expect(location)
                            .to.be.an('object')
                            .and.to.have.keys('lat', 'lng');
                        done();
                    })
                    .catch(done);
            });
        });

        context('with the name of an american city', () => {

            beforeEach((done) => {
                sinon
                    .stub(request, 'get')
                    .returns(Promise.resolve(mockUSCity));
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            const address = 'Saint Louis Missouri';

            it('can get the geo coordinates', (done) => {
                getLatLngFromAddress(address)
                    .then(({ location }) => {
                        expect(location)
                            .to.be.an('object')
                            .and.to.have.keys('lat', 'lng');
                        done();
                    })
                    .catch(done);
            });

            it('can get the country', (done) => {
                getLatLngFromAddress(address)
                    .then(({ country }) => {
                        expect(country).to.eq('US');
                        done();
                    })
                    .catch(done);
            });
        });

        context('with an address outside the country', (done) => {

            beforeEach((done) => {
                sinon
                    .stub(request, 'get')
                    .returns(Promise.resolve(mockCAAddress));
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            const address = '377 Riverside Drive Windsor Ontario';

            it('can get the country', (done) => {
                getLatLngFromAddress(address)
                    .then(({ country }) => {
                        expect(country).to.eq('CA');
                        done();
                    })
                    .catch(done);
            });

            it('can get the geo coordinates', (done) => {
                getLatLngFromAddress(address)
                    .then(({ location }) => {
                        expect(location)
                            .to.be.an('object')
                            .and.to.have.keys('lat', 'lng');
                        done();
                    })
                    .catch(done);
            });
        });

        context('with a string that yields no results', () => {

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

                const address = 'foo bar';

                getLatLngFromAddress(address)
                    .then(() => {
                        done(Error('Promise should be rejected.'));
                    })
                    .catch(({ statusCode, message }) => {
                        expect(statusCode).to.eq(404);
                        expect(message).to.eq(NO_RESULTS_FOUND(address));
                        done();
                    })
                    .catch(done);
            });
        });

        context('with a response indicating an invalid request', () => {

            beforeEach((done) => {
                sinon
                    .stub(request, 'get')
                    .returns(Promise.resolve(mockError));
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            it('rejects with a 400 and message', (done) => {

                getLatLngFromAddress()
                    .then(() => {
                        done(Error('Promise should be rejected.'));
                    })
                    .catch(({ statusCode, message }) => {
                        expect(statusCode).to.eq(400);
                        expect(message).to.eq(INVALID_REQUEST());
                        done();
                    })
                    .catch(done);
            });
        });

    });
});