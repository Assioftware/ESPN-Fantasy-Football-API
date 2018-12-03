# ESPN Fantasy Football API [![Build Status](https://travis-ci.org/mkreiser/ESPN-FantasyFootball-API.svg?branch=master)](https://travis-ci.org/mkreiser/ESPN-FantasyFootball-API) [![Maintainability](https://api.codeclimate.com/v1/badges/b8e7a59ae69f5fbfb8e1/maintainability)](https://codeclimate.com/github/mkreiser/ESPN-FantasyFootball-API/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/b8e7a59ae69f5fbfb8e1/test_coverage)](https://codeclimate.com/github/mkreiser/ESPN-FantasyFootball-API/test_coverage)

## How to Use

***Node module coming soon™***

### Default file
`dist/index-web.js` - Production file built for web environments

### Additional files available in package
`dist/index-node.js` - Production file built for node environments

### Additional files available in local builds
`dist/index-web-dev.js` - Development file built for web environments

`dist/index-node-dev.js` - Development file built for node environments

## Scripts

| Script     | Description                                                             | Options |
|------------|-------------------------------------------------------------------------|---------|
| build      | Builds the module                                                       |         |
| build:docs | Builds the docs                                                         |         |
| clean      | Runs all clean scripts                                                  |         |
| clean:dist | Removes the dist folder                                                 |         |
| clean:docs | Removes the docs folder                                                 |         |
| ci         | Runs continuous integration tasks. Currently runs lint, test, and build |         |
| lint       | Ensures code style is correct                                           |         |
| serve:docs | Builds and serves docs. Defaults to port 8080                           |         |
| test       | Runs the unit tests                                                     |         |
| test:watch | Runs and live-watches the unit tests                                    |         |
