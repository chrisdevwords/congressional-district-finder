

import fs from 'fs';
import PATH from 'path';
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

import getDistrictsInZip, {
    endpoint,
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

            it('can parse the code for an at-large district', (done) => {
                getDistrictsInZip(99762)
                    .then((districts) => {
                        expect(districts.length).to.eq(1);
                        expect(districts[0]).to.eq('AK-0');
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

            it('rejects with an invalid zipcode error', (done) => {
                getDistrictsInZip('invalid')
                    .then(() => {
                        done(Error('Promise should be rejected'));
                    })
                    .catch(({ message }) => {
                        expect(message).to.eq(INVALID_ZIP('invalid'));
                        done();
                    })
                    .catch(done);
            });

            it.skip('rejects with an invalid zipcode error without making a request', (done) => {
                // valdiate zip code with regex
                // check before making http request
                // spy on request and verify it's not called
                done(Error('Test not complete'));
            });

            it('rejects with a 404 if no districts found', (done) => {
                const badZip = 99999;
                getDistrictsInZip(badZip)
                    .then(() => {
                        done(Error('Promise should be rejected'));
                    })
                    .catch(({ statusCode, message }) => {
                        expect(statusCode).to.eq(404);
                        expect(message).to.eq(NO_RESULTS_ZIP(badZip));
                        done();
                    })
                    .catch(done);
            });
        });
    });

    describe('#scrapePage', () => {

        context('with a successful result', () => {
            it('can extract a single district code', (done) => {
                openMock({ uri:endpoint(20013) })
                    .then((html) => {
                        const result = scrapePage(html, 20013);
                        expect(result[0]).to.eq('DC-0');
                        expect(result.length).to.eq(1);
                        done();
                    }).catch(done);
            });
            it('can extract multiple district codes', (done) => {
                openMock({ uri:endpoint(11211) })
                    .then((html) => {
                        const result = scrapePage(html, 11211);
                        expect(result[0]).to.eq('NY-7');
                        expect(result[1]).to.eq('NY-12');
                        expect(result.length).to.eq(2);
                        done();
                    }).catch(done);
            });
        });

        context('with a unsuccessful result', () => {
            it('can parse a no results message', (done) => {
                openMock({ uri:endpoint(99999) })
                    .then((html) => {
                        const result = scrapePage(html, 99999);
                        expect(result).to.be.an('array');
                        expect(result.length).to.eq(0);
                        done();
                    }).catch(done);
            });
            it('can parse an invalid zip code error', (done) => {
                openMock({ uri:endpoint('invalid') })
                    .then((html) => {
                        expect(() => {scrapePage(html, 'foo')})
                            .to.throw(INVALID_ZIP('foo'));
                        done();
                    }).catch(done);
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
