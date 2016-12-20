
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise';
import sinon from 'sinon';

import mockWV3 from './mock/github/unitedstates/districts/WV-3.json';
import mockHI2 from './mock/github/unitedstates/districts/HI-2.json';
import mockNY12 from './mock/github/unitedstates/districts/NY-12.json';
import mockOH2 from './mock/github/unitedstates/districts/OH-2.json';

import getDistrictShape, {
    parseDistrictShape
}  from '../src/github/unitedstates/getDistrictShape';


const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

describe('#getDistrict', () => {

    context('with a valid district', () => {

        beforeEach((done) => {
            sinon
                .stub(request, 'get')
                .returns(Promise.resolve(mockOH2));
            done();
        });

        afterEach((done) => {
            request.get.restore();
            done();
        });

        it ('returns an array of objects with latitude and longitude', (done) => {
            getDistrictShape('OH-2')
                .then((result) => {
                    expect(result.polygons).to.be.an('array');
                    done();
                })
                .catch(done);
        });

        it('returns the district name and code', (done) => {
            getDistrictShape('OH-2')
                .then((result) => {
                    expect(result.name).to.eq('Ohio 2nd');
                    expect(result.districtCode).to.eq('OH-02');
                    done();
                })
                .catch(done);
        });
    });

    context('with an invalid district', () => {

        it ('throws an error', (done) => {
            getDistrictShape('PA-22')
                .then(() => {
                    done(Error('Promise should not resolve'));
                })
                .catch(err => {
                    expect(err.statusCode).to.eq(404);
                    done();
                })
                .catch(done);
        });
    });
});

describe('#parseDistrict', () => {

    it('extracts the name from shape json', (done) => {
        const result = parseDistrictShape(mockNY12);
        expect(result.name).to.equal('New York 12th');
        done();
    });

    it('extracts the districtCode from shape json', (done) => {
        const result = parseDistrictShape(mockWV3);
        expect(result.districtCode).to.equal('WV-03');
        done();
    });

    it('extracts the polygons from shape json', (done) => {
        const result = parseDistrictShape(mockHI2);
        expect(result.polygons).to.be.an('array');
        done();
    });
});
