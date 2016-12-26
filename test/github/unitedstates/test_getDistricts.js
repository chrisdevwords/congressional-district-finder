
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise';
import sinon from 'sinon';

import mock from '../../mock/github/unitedstates/districts/2016.json';
import getDistricts from '../../../src/github/unitedstates/getDistricts';

const { describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

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
});

