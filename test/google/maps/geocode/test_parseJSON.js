
import mocha from 'mocha';
import chai from 'chai';
import request from 'request-promise-native';
import sinon from 'sinon';

import parseJSON from '../../../../src/google/maps/geocode/parseJSON';

import mock11211 from '../../../mock/google/maps/geocode/11211.json';
import mockCanada from '../../../mock/google/maps/geocode/canada.json';
import mockTeritory from '../../../mock/google/maps/geocode/SanJuan.json';
import mock6085 from '../../../mock/google/maps/geocode/06085.json';

const { beforeEach, afterEach, describe, it } = mocha;
const { expect, config } = chai;


config.includeStack = true;

describe('#parseJSON', () => {

    context('with a successful US result', () => {

        it('can extract the country', (done) => {
            const result = parseJSON(mock11211);
            expect(result.country).to.eq('US');
            done();
        });

        it('can extract a state id', (done) => {
            const result = parseJSON(mock11211);
            expect(result.state).to.eq('NY');
            done();
        });

        it('can extract a zip code', (done) => {
            const result = parseJSON(mock6085);
            expect(result.zip).to.eq("06085");
            done();
        });
    });

    context('with a result outside the US', () => {
        it('can extract the country', (done) => {
            const result = parseJSON(mockCanada);
            expect(result.country).to.eq('CA');
            done();
        });
    });

    context('with a result in a US Territory', () => {
        it('can extract the country', (done) => {
            const result = parseJSON(mockTeritory);
            expect(result.country).to.eq('PR');
            done();
        });
    });
});
