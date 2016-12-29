
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

import getDistricts, {
    DEFAULT_HEADERS
} from '../../../src/github/unitedstates/getDistricts';

import mock from '../../mock/github/unitedstates/districts/2016.json';


const { describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

describe('#getDistricts', () => {


    context('by default', () => {

        let calledOptions

        beforeEach(done => {
            sinon
                .stub(request, 'get', (options) => {
                    calledOptions = options;
                    return Promise.resolve({ body: mock });
                });
            done();
        });

        afterEach((done) => {
            calledOptions = null;
            request.get.restore();
            done();
        });

        it('returns a list of all congressional districts', (done) => {
            getDistricts()
                .then((districts) => {
                    expect(districts).be.an('array')
                        .and.have.length.of(435)
                        .and.include('CA-22');
                    done();
                })
                .catch(done);
        });

        it('passes a default user agent in the headers', (done) => {
            getDistricts()
                .then(() => {
                    const { headers } = calledOptions;
                    expect(headers['User-Agent'])
                        .to.eq(DEFAULT_HEADERS['User-Agent']);
                    done();
                })
                .catch(done);
        });

    });

    context('when passed a custom user-agent', () => {

        let calledOptions

        beforeEach(done => {
            sinon
                .stub(request, 'get', (options) => {
                    console.log('request.get')
                    calledOptions = options;
                    return Promise.resolve({ body: mock });
                });
            done();
        });

        afterEach((done) => {
            calledOptions = null;
            request.get.restore();
            done();
        });

        it('it overrides the default in the headers', (done) => {
            getDistricts({ 'User-Agent': 'my-other-app'})
                .then(() => {
                    expect(calledOptions.headers['User-Agent'])
                        .to.eq('my-other-app');
                    done();
                })
                .catch(done);
        });
    });
});
