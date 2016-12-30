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

None of these endpoints require API tokens but [getDistricts](####get-a-list-of-all-us-congressional-districts) fetches from the github API, which [rate-limits unauthenticated requests](https://developer.github.com/v3/rate_limit/) to 50 per hour from a given IP.

## Requirements
Requires NodeJS version 4.3.2 or greater. 

## Installation
```
$ npm install congressional-district-finder --save
```

## Usage 

All methods return promises, using [Request-Promise-Native](https://www.npmjs.com/package/request-promise-native) for various http GET requests.

#### Get a district by latitude and longitude:
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

#### Get a list of all US congressional districts
```js
finder.getDistricts()
    .then(function(result) {
        console.log(result.districts.length); // outputs all 435 US Congressional Districts
        console.log(result.districts[0]);// outputs AK-0
        console.log(result.districts[434]);// outputs WY-0
    });
```
Without Github api auth credentials, you are limited to 60 requests per minute from a given IP.
If your application will exceed this amount, you can pass auth credentials in the customHeader, parameter or
cache the result and verify that's up to date by passing an etag or last modified time stamp.

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



## Tests
```
$ npm test
```

## Contributing 
Code is transpiled from ES6/ES2015. Before opening a PR be sure to lint any changes by running:
```
$ npm run lint
```
