'use strict';

const { PassThrough } = require('stream');
const sinon = require('sinon');
const assert = require('assert');

const { http } = require('../lib/wrappers');
const { RequestSafe } = require('../lib');

describe('Request Safe Test', () => {

	const mockResponse = ({ code, body, headers }) => {
		const passThrough = new PassThrough();
		passThrough.headers = headers;
		passThrough.statusCode = code;
		passThrough.write(!Buffer.isBuffer(body) ? JSON.stringify(body) : body);
		passThrough.end();
		return passThrough;
	};

	const testCase = async (fn, response) => {
		const url = 'test.com';

		const writeSpy = sinon.spy(PassThrough.prototype, 'write');

		sinon.stub(http, 'request')
			.callsArgWith(1, mockResponse(response))
			.returns(new PassThrough());

		await RequestSafe[fn](url);

		sinon.assert.calledWithExactly(writeSpy, '');

		sinon.assert.calledWithMatch(http.request, {
			host: url,
			method: fn.toUpperCase(),
			path: '/',
			headers: RequestSafe.defaultHeaders
		});

		assert.deepStrictEqual(RequestSafe.statusCode, response.code);
		assert.deepStrictEqual(RequestSafe.responseBody, response.body);
	};

	afterEach(() => {
		sinon.restore();
	});

	it('Should not throw an error when the request returns and statusCode greather or equal to 400', async () => testCase('get', {
		code: 500,
		body: { message: 'internal error' },
		headers: { 'Content-Type': 'application/json' }
	}));


	it('Should make a simple get and returns a success request', async () => testCase('get', {
		code: 200,
		body: { message: 'success request' },
		headers: { 'Content-Type': 'application/json' }
	}));
});
