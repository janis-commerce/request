# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.1] - 2021-08-23
### Fixed
- Now response body is parsed to string when the response is not valid JSON

## [2.0.0] - 2021-07-23
### Changed
- Now the package export `Request` and `RequestSafe`. See the [migration guide](./README.md#running-migration) **BREAKING CHANGE**
- Update `Request` with new getter methods to obtain last request and response data

### Added
- Types definitions
- `RequestSafe` class

## [1.0.1] - 2021-03-10
### Fixed
- Requests errors are now handled properly

## [1.0.0] - 2021-01-26
### Added
- Initial package version
