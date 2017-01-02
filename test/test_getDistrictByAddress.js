

import mocha from 'mocha';
import chai from 'chai';

import getDistrictByAddress, {
    OUTSIDE_US,
    MORE_SPECIFIC
} from '../src/getDistrictByAddress';

const { describe, it } = mocha;
const { expect, config } = chai;

config.includeStack = true;


describe('#getDistrictByAddress', () => {

    context('with an american street address', () => {

        it('can find the district', (done) => {
            getDistrictByAddress('45 Main Street Brooklyn')
                .then(({ district }) => {
                    expect(district.districtCode).to.eq('NY-07');
                    done();
                })
                .catch(done);
        });
    });

    context('with the name of a city', () => {

        const address = 'Santa Monica, CA';

        it('throws a 400 for being too vague', (done) => {
            getDistrictByAddress(address)
                .then(() => {
                    done(Error('Promise should be rejected.'))
                })
                .catch(({ statusCode, message }) => {
                    expect(statusCode)
                        .to.eq(400);
                    expect(message)
                        .to.eq(MORE_SPECIFIC(address));
                    done();
                })
                .catch(done);
        })
    });

    context('with an address outside the country', () => {

        const address = '279 Yonge Street Toronto';

        it('rejects with a 404', (done) => {
            getDistrictByAddress(address)
                .then(() => {
                    done(Error('Promise should be rejected.'))
                })
                .catch(({ statusCode, message }) => {
                    expect(statusCode)
                        .to.eq(404);
                    expect(message)
                        .to.eq(OUTSIDE_US(address, 'CA'));
                    done();
                })
                .catch(done);

        });
    });

});