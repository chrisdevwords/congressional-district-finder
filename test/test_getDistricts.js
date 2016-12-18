import 'babel-polyfill';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { getDistricts } from '../src';

const expect = chai.expect;
chai.use(chaiAsPromised);
chai.config.includeStack = true;

describe('#getDistricts', () => {
    context('with a valid state', ()=> {
        it('returns a list of districts', ()=> {
            const districts = getDistricts('NY');
            expect(districts)
                .to.eventually.eq(['NY-1'])
        });
    })
});
