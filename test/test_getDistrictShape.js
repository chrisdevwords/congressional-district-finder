
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise';
import sinon from 'sinon';

import getDistrictShape, {
    parseDistrictShape
}  from '../src/github/unitedstates/getDistrictShape';

import mockWV3 from './mock/github/unitedstates/districts/WV-3.json';
import mockHI2 from './mock/github/unitedstates/districts/HI-2.json';
import mockNY12 from './mock/github/unitedstates/districts/NY-12.json';
import mockOH2 from './mock/github/unitedstates/districts/OH-2.json';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;

describe('#getDistrictShape', () => {

    context('with a valid district id', () => {

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

        it ('returns an array of multipolygon coordinates', (done) => {
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

    context('with an invalid district id', () => {

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

        it('throws an error', (done) => {
            getDistrictShape('PA-22')
                .then(() => {
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

describe('#parseDistrictShape', () => {

    it('parses the name from shape json', (done) => {
        const result = parseDistrictShape(mockNY12);
        expect(result.name)
            .to.equal('New York 12th');
        done();
    });

    it('parses the districtCode from shape json', (done) => {
        const result = parseDistrictShape(mockWV3);
        expect(result.districtCode)
            .to.equal('WV-03');
        done();
    });

    it('parses the polygons from shape json', (done) => {
        const result = parseDistrictShape(mockHI2);
        expect(result.polygons)
            .to.be.an('array');
        done();
    });
});
