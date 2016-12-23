

import fs from 'fs';
import PATH from 'path';
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise';
import sinon from 'sinon';

import getDistrictsInZip, {
    scrapePage,
    parseDistrictCode,
    INVALID_DISTRICT_CODE_STRING,
    INVALID_ZIP,
    NO_RESULTS_ZIP,
}  from '../../../src/house/gov/getDistrictsInZip';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;


const openMock = (options) => {

    const id = options.uri.split('=').pop();
    const ROOT = '../../';
    const filePath = PATH.resolve(__dirname, ROOT, `mock/gov/house/${id}.html`);
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (error, data) => {
            if(error) {
                reject(error);
            } else {
                resolve(data.toString());
            }
        });
    });
};

describe('house.gov pagescraper', () =>{

    describe('#getDistrictsInZip', () => {

        context('with a valid zip code', () => {

            beforeEach((done) => {
                sinon
                    .stub(request, 'get', openMock);
                done();

            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            it('can parse a single district', (done) => {
                getDistrictsInZip(15101)
                    .then((data)=> {
                        expect(data[0]).to.eq('PA-12');
                        expect(data.length).to.eq(1);
                        done();
                    }).catch(done);
            });

            it('can parse multiple districts', (done) => {
                getDistrictsInZip(92373)
                    .then((data)=> {
                        expect(data).to.be.an('array');
                        expect(data.length).to.eq(4);
                        expect(data[0]).to.eq('CA-8');
                        expect(data[3]).to.eq('CA-41');
                        done();
                    }).catch(done);
            });
        });

        context('with an invalid zip code', () => {

            beforeEach((done) => {
                sinon
                    .stub(request, 'get', openMock);
                done();
            });

            afterEach((done) => {
                request.get.restore();
                done();
            });

            it.skip('rejects with an invalid zipcode error without making a request', (done) => {
                // valdiate zip code with regex
                // check before making http request
                // spy on request and verify it's not called
                done(Error('Test not complete'));
            });

            it.skip('rejects with an invalid zipcode error', (done) => {
                done(Error('Test not complete'));
            });

            it.skip('rejects with a no districts found error', (done) => {
                done(Error('Test not complete'));
            });
        });
    });

    describe('#scrapePage', () => {

        context('with a successful result', () => {
            it.skip('can extract a single district code', (done) => {
                done(Error('Test not complete'));
            });
            it.skip('can extract multiple district codes', (done) => {
                done(Error('Test not complete'));
            });
        });

        context('with a unsuccessful result', () => {
            it.skip('can parse a no results message', (done) => {
                done(Error('Test not complete'));
            });
            it.skip('can parse an invalid zip code error', (done) => {
                done(Error('Test not complete'));
            });
        });
    });

    describe('#parseDistrictCode', () => {
        it('can parse a single digit code', (done) => {
            expect(parseDistrictCode('"NY09"'))
                .to.eq('NY-9');
            done();
        });

        it('can parse a double digit code', (done) => {
            expect(parseDistrictCode('"TX11"'))
                .to.eq('TX-11');
            done();
        });

        it('throws an informative error if expected js code changes', (done) => {
            const jsChange = " new DistrictCodes(11211)";
            expect(() => {
                parseDistrictCode(jsChange)
            }).to.throw(INVALID_DISTRICT_CODE_STRING(jsChange));
            done();
        });

        it('throws an informative error if expected js code changes', (done) => {
            const jsChange = "codes.pop()";
            expect(() => {
                parseDistrictCode(jsChange)
            }).to.throw(INVALID_DISTRICT_CODE_STRING(jsChange));
            done();
        });

        it('throws an informative error if passed an empty string ', (done) => {
            expect(() => {
                parseDistrictCode("")
            }).to.throw(INVALID_DISTRICT_CODE_STRING(""));
            done();
        });

        it('throws an informative error if passed undefined ', (done) => {
            expect(() => {
                parseDistrictCode()
            }).to.throw(INVALID_DISTRICT_CODE_STRING());
            done();
        });

        it('throws an informative error if passed null', (done) => {
            expect(() => {
                parseDistrictCode(null)
            }).to.throw(INVALID_DISTRICT_CODE_STRING(null));
            done();
        });
    });
});
