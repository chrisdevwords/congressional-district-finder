# Congressional District Finder 
A small library of functions for determining US Congressional representation based on location.

[![CircleCI](https://circleci.com/gh/chrisdevwords/congressional-district-finder/tree/master.svg?style=shield)](https://circleci.com/gh/chrisdevwords/congressional-district-finder/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/chrisdevwords/congressional-district-finder/badge.svg?branch=master)](https://coveralls.io/github/chrisdevwords/congressional-district-finder?branch=master)
[![Dependency Status](https://david-dm.org/chrisdevwords/congressional-district-finder.svg)](https://david-dm.org/chrisdevwords/congressional-district-finder)
[![Dev Dependency Status](https://david-dm.org/chrisdevwords/congressional-district-finder/dev-status.svg)](https://david-dm.org/chrisdevwords/congressional-district-finder?type=dev)
[![Known Vulnerabilities](https://snyk.io/test/github/chrisdevwords/congressional-district-finder/badge.svg)](https://snyk.io/test/github/chrisdevwords/congressional-district-finder)

Fetches and parses data from:
- https://github.com/unitedstates/districts/
- http://www.house.gov/
- http://maps.googleapis.com/maps/api/geocode/json

And uses [geolib](https://www.npmjs.com/package/geolib) to determine if a given latitude or longitude resides in a State or Congressional District's [geoJSON](http://geojson.org/) boundaries.

None of these endpoints require API tokens but [getDistricts](#get-a-list-of-all-us-congressional-districts) fetches from the github API, which [rate-limits unauthenticated requests](https://developer.github.com/v3/rate_limit/) to 60 per hour from a given IP.

## Requirements
Requires NodeJS version 4.3.2 or greater. 

## Installation
```
$ npm install congressional-district-finder --save
```

## Usage 

All methods return promises, using [Request-Promise-Native](https://www.npmjs.com/package/request-promise-native) for various http GET requests.

### Get a District by Latitude and Longitude

```js
var finder = require('congressional-district-finder');

finder.getDistrictByLatLng(40.718031, -73.9583047)
    .then(function(result) {
        console.log(result.isMatched); // outputs true
        console.log(result.district.name); //outputs "New York 12th"
        console.log(result.district.districtCode); //outputs "NY-12"
    });
```
If coordinates are outside the US:
```js
var finder = require('congressional-district-finder');

finder.getDistrictByLatLng(31.6538179, -106.5890206)
    .catch(function(err) {
        console.log(err.message);
        // Outputs:
        //      "The specified latitude: 31.6538179 and longitude: -106.5890206
        //       are for the country: MX. To Find a Congressional District,
        //       please provide coordinates in the US."
    });
```

### Other Methods

#### Get a List of All US Congressional Districts
```js
finder.getDistricts()
    .then(function(result) {
        console.log(result.districts.length); // outputs all 435 US Congressional Districts
        console.log(result.districts[0]);// outputs AK-0
        console.log(result.districts[434]);// outputs WY-0
    });
```
Note that this particular method uses the [Github Contents API](https://developer.github.com/v3/repos/contents/)
Without Github API auth credentials, you are limited to 60 requests per hour from a given IP.
If your application will likely exceed this, you can do the following:
- [Increase your rate limit by passing auth credentials via the customHeaders](https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications).
- Cache the result and verify that it's up to date by passing an etag or last modified time stamp.

```js
var districts, myCachedEtag = '"36bac568759f240e06955cf597493555"';
finder.getDistricts({'If-None-Match': myCachedEtag})
    .then(function(result) {
        //update your cached etag and cached list of districts
        myCachedEtag = result.headers.etag;
        districts = result.districts;
        console.log(myCachedEtag);
    })
    .catch(function(err) {
        if (err.statusCode === 304) {
           console.log('just use your cached districts.');
        }
    });
```
[Read more about Github's rate limit rules](https://developer.github.com/v3/#rate-limiting).

#### Check Coordinates Against a State
- fetches [GEOJson](http://geojson.org/) from [github/unitedstates](https://github.com/unitedstates/districts/)
- parses and checks the coordinates using [geolib](https://www.npmjs.com/package/geolib)

```js
var lat = 40.718031;
var lng = -73.9583047;

finder.checkLatLngInState(lat, lng, 'NY')
    .then(function(result) {
        console.log('Check coordinates in New York...');
        console.log(result); // outputs { isMatched: true, stateId: 'NY', latitude: 40.718031, longitude: -73.9583047 }
    });

finder.checkLatLngInState(lat, lng, 'CT')
    .then(function(result) {
        console.log('Check coordinates in Connecticut...');
        console.log(result); // outputs {isMatched: false, stateId: 'CT',latitude: 40.718031, ongitude: -73.9583047 }
    });

```
#### Check Coordinates Against a District
- fetches [GEOJson](http://geojson.org/) from [github/unitedstates](https://github.com/unitedstates/districts/)
- parses and checks the coordinates using [geolib](https://www.npmjs.com/package/geolib)

```js
var honolulu = {latitude: 21.3069, longitude: -157.8583};

finder.checkLatLngInDistrict(honolulu.latitude, honolulu.longitude, 'HI-1')
    .then(function(result) {
        console.log(result.districtId); // outputs HI-1
        console.log(result.district.districtCode); // outputs HI-01
        console.log(result.district.name); // outputs Hawaii 1st
        console.log(result.isMatched); // outputs true
        console.log('-');
    });

finder.checkLatLngInDistrict(honolulu.latitude, honolulu.longitude, 'HI-2')
    .then(function(result) {
        console.log(result.districtId); // outputs HI-2
        console.log(result.district.districtCode); // outputs HI-02
        console.log(result.district.name); // outputs Hawaii 2nd
        console.log(result.isMatched); // outputs false
        console.log('-');
    });
```

## Tests
```
$ npm test
```

## Contributing 
Code is transpiled from ES6/ES2015. You can lint code by running:
```
$ npm run lint
```
