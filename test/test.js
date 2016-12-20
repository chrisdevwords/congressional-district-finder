
import { beforeEach, afterEach, describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import request from 'request-promise';
import sinon from 'sinon';

import mock from './mock/github/unitedstates/districts/2016.json';
import getDistricts from '../src/github/unitedstates/getDistricts';
import getDistrictsByState, { NO_DISTRICTS_FOUND } from '../src/github/unitedstates/getDistrictsByState';

chai.use(chaiAsPromised);
chai.config.includeStack = true;

describe('#getDistricts', () => {
    beforeEach(done => {
        sinon
            .stub(request, 'get')
            .returns(Promise.resolve({body: mock}));
        done();
    });

    afterEach((done) => {
        request.get.restore();
        done();
    });

    it('returns a list of all congressional districts', () => {
        return (expect(getDistricts()))
            .to.eventually
            .be.an('array')
            .and.have.length.of(435)
            .and.include('CA-22');
    });
});

describe('#getDistrictsByState', () => {

    beforeEach((done) => {
        sinon
            .stub(request, 'get')
            .returns(Promise.resolve({body: mock}));
        done();
    });

    afterEach((done) => {
        request.get.restore();
        done();
    });

    context('with a valid state', () => {
        it('returns a list of districts',  () => {
            return expect(getDistrictsByState('NY'))
                .to.eventually
                .be.an('array')
                .and.have.length.of(27)
                .and.include('NY-1');
        });
    });

    context('with an invalid state', ()=> {
        it('throws an error', (done) => {
            getDistrictsByState('FOO')
                .catch(err => {
                   expect(err.message).to.equal(NO_DISTRICTS_FOUND);
                   done();
                }).catch(done);
        });
    });
});
