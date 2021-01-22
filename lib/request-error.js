'use strict';

module.exports = class RequestError extends Error {
	constructor(err, code) {

		super(err.message || err);

		this.name = 'RequestError';
		this.code = code;

		if(typeof err !== 'string')
			this.previousError = err;
	}

	static get codes() {
		return {
			REQUEST_ERROR: 1,
			PARSE_ERROR: 2
		};
	}
};
