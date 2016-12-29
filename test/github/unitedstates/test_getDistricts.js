
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
                .then(({ districts }) => {
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

        let calledOptions;

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

    context('when passed an etag in customOptions', () => {

        const eTag = '"36bac568759f240e06955cf597493555"';

        beforeEach(done => {
            sinon
                .stub(request, 'get', (options) => {
                    const { headers } = options;
                    return Promise.reject({
                        statusCode: 304,
                        response: {
                            headers: {
                                etag: headers['If-None-Match']
                            }
                        }
                    });
                });
            done();
        });

        afterEach((done) => {
            request.get.restore();
            done();
        });

        it('handles a 304', (done) => {
            getDistricts({ 'If-None-Match': eTag })
                .then(() => {
                    done(Error('Promise should be rejected'));
                })
                .catch(({ statusCode }) => {
                    expect(statusCode).to.eq(304);
                    done();
                })
                .catch(done);
        });

        it('passes the etag in the request headers', (done) => {
            getDistricts({ 'If-None-Match': eTag })
                .then(() => {
                    done(Error('Promise should be rejected'));
                })
                .catch(({ response }) => {
                    const { headers } = response;
                    expect(headers.etag).to.eq(eTag);
                    done();
                })
                .catch(done);
        });
    });

    context('when passed an invalid/expired eTag', () => {

        beforeEach(done => {
            sinon
                .stub(request, 'get', (options) => {
                    return Promise.resolve({
                        body: mock,
                        headers: {
                            etag: '"36bac568759f240e06955cf597493555"'
                        }
                    });
                });
            done();
        });

        afterEach((done) => {
            request.get.restore();
            done();
        });

        it('resolves a 200 w/ a new eTag', (done) => {
            const eTag = '"foo"';
            getDistricts({ 'If-None-Match': eTag })
                .then(({ districts, headers }) => {
                    expect(headers.etag)
                        .to.not.eq(eTag)
                        .and.to.not.eq(undefined);
                    expect(districts)
                        .to.be.an('array')
                        .and.have.length.of(435)
                        .and.include('NE-2');
                    done();
                })
                .catch(done);
        });
    });
});
