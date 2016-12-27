
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

import getStateShape, {
    parseStateShape
} from '../../../src/github/unitedstates/getStateShape';

import mockWV from '../../mock/github/unitedstates/states/WV.json';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

describe('#getStateShape', () => {

    context('result of a valid state code', () => {

        beforeEach((done) => {
            sinon
                .stub(request, 'get')
                .returns(Promise.resolve(mockWV));
            done();
        });

        afterEach((done) => {
            request.get.restore();
            done();
        });

        it('contains an array of coordinates', (done) => {
            getStateShape('WV')
                .then((result) => {
                    expect(result.polygons).to.be.an('array');
                    done();
                })
                .catch(done);
        });
    });

    context('with a invalid state code', () => {

        beforeEach((done) => {
            sinon
                .stub(request, 'get')
                .returns(Promise.reject({ statusCode: 404 }));
            done();
        });

        afterEach((done) => {
            request.get.restore();
            done();
        });

        it.skip('throws an error without making a request', (done) => {
            // need to cdache district ids from getDistricts
            // check list of district ids before making http request
            // spy on request and verify it's not called
            done(Error('Test not complete'));
        });

        it('handles a 404', (done) => {
            getStateShape('BC')
                .then(()=> {
                    done(Error('Promise should not resolve'));
                })
                .catch((err) => {
                    expect(err.statusCode)
                        .to.eq(404);
                    done();
                })
                .catch(done);
        });
    });
});

describe('#parseStateShape', () => {

    it('parses the polygons from shape json', (done) => {
        const { polygons } = parseStateShape(mockWV);
        expect(polygons).to.be.an('array');
        expect(polygons.length).to.eq(1);
        expect(polygons[0][0].length).to.eq(2);
        expect(polygons[0][0][0]).to.eq(-81.044288);
        expect(polygons[0][0][1]).to.eq(39.536612);
        done();
    });
});
