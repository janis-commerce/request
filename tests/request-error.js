'use strict';

const assert = require('assert');

const RequestError = require('../lib/request-error.js');

describe('Request Error Test', () => {

	it('Should set an string error', () => {
		try {
			throw new RequestError('Testing request error', RequestError.codes.REQUEST_ERROR);
		} catch({ name, message, code }) {
			assert.deepStrictEqual(name, 'RequestError');
			assert.deepStrictEqual(message, 'Testing request error');
			assert.deepStrictEqual(code, 1);
		}
	});

	it('Should set previous error', () => {
		const error = new Error('Testing request error');

		try {
			throw new RequestError(error, RequestError.codes.REQUEST_ERROR);
		} catch({ name, message, code, previousError }) {
			assert.deepStrictEqual(name, 'RequestError');
			assert.deepStrictEqual(message, 'Testing request error');
			assert.deepStrictEqual(code, 1);
			assert.deepStrictEqual(previousError, error);
		}
	});

});
