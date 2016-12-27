
import { readFile } from 'fs';
import PATH from 'path';
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';


import checkLatLngInDistricts, {
    COORDINATES_NOT_IN_DISTRICTS,
    NO_DISTRICTS_PROVIDED
} from '../src/checkLatLngInDistricts';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;


const ROOT = './';
const openDistrictMock = (options) => {
    const id = options.uri.split('/').slice(-2, -1);
    const filePath = PATH.resolve(
        __dirname, ROOT, `mock/github/unitedstates/districts/${id}.json`
    );
    return new Promise((resolve, reject) => {
        readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(JSON.parse(data.toString()));
            }
        });
    });
};

describe('#checkLatLngInDistricts', () => {

    let stub;
    const lat = 40.718031;
    const lng = -73.9583047;

    beforeEach((done) => {
        stub = sinon
            .stub(request, 'get', openDistrictMock);
        done();
    });

    afterEach((done) => {
        request.get.restore();
        done();
    });

    context('with a lat lng residing in one district of an array', () => {

        it('finds the correct district', (done) =>{
            const districts = ['NY-7', 'NY-12'];
            checkLatLngInDistricts(lat, lng, districts)
                .then(({ district }) => {
                    expect(district.districtCode)
                        .to.eq('NY-12');
                    done();
                }).catch(done);
        });

        it('only makes the necessary http requests', (done) => {
            const districts = ['NY-8', 'NY-7', 'NY-12', 'NY-11', 'NY-13'];
            checkLatLngInDistricts(lat, lng, districts)
                .then(({ district }) => {
                    expect(district.districtCode)
                        .to.eq('NY-12');
                    expect(stub.callCount)
                        .to.eq(3);
                    done();
                })
                .catch(done);
        });

    });

    context('with a lat lng that doesn\'t reside in any of the provided districts', () => {

        it('throws an informative error', (done) => {
            const districts = ['NY-8', 'NY-7', 'NY-11', 'NY-13'];
            checkLatLngInDistricts(lat, lng, districts)
                .then(() => {
                    done(Error('Promise should be rejected.'))
                })
                .catch(({ statusCode, message }) => {
                    expect(statusCode)
                        .to.eq(422);
                    expect(message)
                        .to.eq(COORDINATES_NOT_IN_DISTRICTS(lat, lng, districts));
                    done();
                })
                .catch(done);
        });

        it('checks every single district', (done) => {
            const districts = ['NY-8', 'NY-7', 'NY-11', 'NY-13'];
            checkLatLngInDistricts(lat, lng, districts)
                .then(() => {
                   done(Error('Promise should be rejected.'))
                })
                .catch(() => {
                    expect(stub.callCount)
                        .to.eq(districts.length);
                    done();
                })
                .catch(done);
        });
    });

    context('with an empty array', ()=> {

        it('throws an informative error', (done) => {
            checkLatLngInDistricts(lat, lng, [])
                .then(() => {
                    done(Error('Promise should be rejected.'))
                })
                .catch(({ statusCode, message }) => {
                    expect(statusCode)
                        .to.eq(422);
                    expect(message)
                        .to.eq(NO_DISTRICTS_PROVIDED(lat, lng));
                    done();
                })
                .catch(done);
        });

        it('throws an error without making an http request', (done) => {
            checkLatLngInDistricts(lat, lng, [])
                .then(() => {
                    done(Error('Promise should be rejected.'))
                })
                .catch(() => {
                    expect(stub.callCount)
                        .to.eq(0);
                    done();
                })
                .catch(done);
        });
    })
});
