
import { beforeEach, afterEach, describe, it } from 'mocha';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import request from 'request-promise';
import sinon from 'sinon';

import mock from '../../mock/github/unitedstates/districts/2016.json';
import getDistricts from '../../../src/github/unitedstates/getDistricts';


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

