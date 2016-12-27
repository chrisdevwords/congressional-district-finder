# Congressional District Finder 
A small library of functions for determining US Congressional representation based on location.

[![CircleCI](https://circleci.com/gh/chrisdevwords/congressional-district-finder/tree/master.svg?style=svg)](https://circleci.com/gh/chrisdevwords/congressional-district-finder/tree/master)

Fetches and parses data from:
- https://github.com/unitedstates/districts/
- http://www.house.gov/
- http://maps.googleapis.com/maps/api/geocode/json

None of these endpoints require API tokens but but getDistricts and getDistrictsByState fetch from the github API, which [rate-limits unauthenticated requests](https://developer.github.com/v3/rate_limit/) to 50 per hour from a given IP. 

## Requirements
Requires NodeJS version 4.3.2 or greater. 

## Installation
```
$ npm install congressional-district-finder --save
```

## Usage 

All methods return promises, using [Request-Promise](https://www.npmjs.com/package/request-promise) for various http GET requests.

#### Get a district by latitude and longitude:
```js
var districtFinder = require('congressional-district-finder');

districtFinder.getDistrictByLatLng(40.718031, -73.9583047)
    .then(function (district) {
        console.log(district.name); //outputs "New York 12th"
        console.log(district.districtCode) //outputs "NY-12"
    });
```
If coordinates are outside the US or Invalid:
```js
var districtFinder = require('congressional-district-finder');

districtFinder.getDistrictByLatLng(31.6538179, -106.5890206)
    .catch(function (err) {
        console.log(err.message);
        // Outputs:
        //      "The specified latitude: 31.6538179 and longitude: -106.5890206 
        //       are for the country: MX. To Find a Congressional District, 
        //       please provide coordinates in the US."
    });
```

## Tests
```
$ npm test
```

## Contributing 
Code is transpiled from ES6/ES2015. Before opening a PR be sure to lint any changes by running:
```
$ npm run lint
```
