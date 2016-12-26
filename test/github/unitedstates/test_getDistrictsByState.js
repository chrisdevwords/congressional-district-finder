
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise';
import sinon from 'sinon';

import mock from '../../mock/github/unitedstates/districts/2016.json';
import getDistrictsByState, { NO_DISTRICTS_FOUND } from '../../../src/github/unitedstates/getDistrictsByState';

const { describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

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
        it('returns a list of districts',  (done) => {
            getDistrictsByState('NY')
                .then((districts) => {
                    expect(districts)
                        .to.be.an('array')
                        .and.have.length.of(27)
                        .and.include('NY-1');
                    done();
                })
                .catch(done);
        });
    });

    context('with an invalid state', ()=> {
        it('throws an error', (done) => {
            getDistrictsByState('FOO')
                .catch(err => {
                   expect(err.message).to.equal(NO_DISTRICTS_FOUND);
                   done();
                })
                .catch(done);
        });
    });
});
