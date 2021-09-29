'use strict';

const { PassThrough } = require('stream');
const sinon = require('sinon');
const assert = require('assert');

const { http, https } = require('../lib/wrappers');
const { Request } = require('../lib');
const RequestError = require('../lib/request-error');

describe('Request Test', () => {

	const mockResponse = ({ code, body, headers }) => {
		const passThrough = new PassThrough();
		passThrough.headers = headers;
		passThrough.statusCode = code;
		passThrough.write(!Buffer.isBuffer(body) ? JSON.stringify(body) : body);
		passThrough.end();
		return passThrough;
	};

	const testWithPayload = async (fn, res) => {

		const url = 'test.com';

		const response = res || {
			code: 200,
			body: { message: 'ok' },
			headers: { 'Content-Type': 'application/json' }
		};

		const payload = {
			test: 'test'
		};

		const writeSpy = sinon.spy(PassThrough.prototype, 'write');

		sinon.stub(http, 'request')
			.callsArgWith(1, mockResponse(response))
			.returns(new PassThrough());

		const reqResponse = await Request[fn](url, payload);

		sinon.assert.calledWithExactly(writeSpy, JSON.stringify(payload));

		sinon.assert.calledWithMatch(http.request, {
			hostname: url,
			method: fn.toUpperCase(),
			path: '/',
			headers: { ...Request.defaultHeaders }
		});

		assert.deepStrictEqual(reqResponse.statusCode, response.code);
		assert.deepStrictEqual(reqResponse.body, response.body);

		assert.deepStrictEqual(Request.httpMethod, fn.toUpperCase());
		assert.deepStrictEqual(Request.endpoint, url);
		assert.deepStrictEqual(Request.headers, undefined);
		assert.deepStrictEqual(Request.body, payload);

		assert.deepStrictEqual(Request.statusCode, response.code);
		assert.deepStrictEqual(Request.responseHeaders, response.headers);
		assert.deepStrictEqual(Request.responseBody, response.body);

		assert.deepStrictEqual(Request.lastRequest, {
			body: {
				test: 'test'
			},
			endpoint: 'test.com',
			headers: undefined,
			httpMethod: fn.toUpperCase()
		});

		assert.deepStrictEqual(Request.lastResponse, {
			body: {
				message: 'ok'
			},
			headers: {
				'Content-Type': 'application/json'
			},
			statusCode: 200
		});
	};

	const testWithoutPayload = async (fn, res) => {
		const url = 'test.com';

		const response = res || {
			code: 200,
			body: { message: 'ok' },
			headers: { 'Content-Type': 'application/json' }
		};

		const writeSpy = sinon.spy(PassThrough.prototype, 'write');

		sinon.stub(http, 'request')
			.callsArgWith(1, mockResponse(response))
			.returns(new PassThrough());

		const reqResponse = await Request[fn](url);

		sinon.assert.calledWithExactly(writeSpy, '');

		sinon.assert.calledWithMatch(http.request, {
			hostname: url,
			method: fn.toUpperCase(),
			path: '/',
			headers: Request.defaultHeaders
		});

		assert.deepStrictEqual(reqResponse.statusCode, response.code);
		assert.deepStrictEqual(reqResponse.body, response.body);
	};

	afterEach(() => {
		sinon.restore();
	});

	it('Should make a simple get', async () => testWithoutPayload('get'));

	it('Should make a simple post', async () => testWithPayload('post'));

	it('Should make a simple put', async () => testWithPayload('put'));

	it('Should make a simple patch', async () => testWithPayload('patch'));

	it('Should make a simple delete', async () => testWithoutPayload('delete'));

	it('Should throw an error if response without content type header when strict mode is enabled', async () => {

		const url = 'http://test.com';

		const response = {
			code: 200,
			body: '<h1>test</h1>',
			headers: {}
		};

		const writeSpy = sinon.spy(PassThrough.prototype, 'write');

		sinon.stub(http, 'request')
			.callsArgWith(1, mockResponse(response))
			.returns(new PassThrough());

		await assert.rejects(Request.get(url, { strictMode: true }), {
			code: RequestError.REQUEST_ERROR
		});

		sinon.assert.calledWithExactly(writeSpy, '');

		sinon.assert.calledWithMatch(http.request, {
			hostname: 'test.com',
			method: 'GET',
			path: '/',
			headers: Request.defaultHeaders
		});

	});

	it('Should throw an error if response is not application/json when strict mode is enabled', async () => {

		const url = 'http://test.com';

		const response = {
			code: 200,
			body: '<h1>test</h1>',
			headers: { 'Content-Type': 'text/html' }
		};

		const writeSpy = sinon.spy(PassThrough.prototype, 'write');

		sinon.stub(http, 'request')
			.callsArgWith(1, mockResponse(response))
			.returns(new PassThrough());

		await assert.rejects(Request.get(url, { strictMode: true }), {
			code: RequestError.REQUEST_ERROR
		});

		sinon.assert.calledWithExactly(writeSpy, '');

		sinon.assert.calledWithMatch(http.request, {
			hostname: 'test.com',
			method: 'GET',
			path: '/',
			headers: Request.defaultHeaders
		});

	});

	it('Should make a get in strict mode and success', async () => {

		const url = 'http://test.com';

		const response = {
			code: 200,
			body: { message: 'ok' },
			headers: { 'Content-Type': 'application/json' }
		};

		const writeSpy = sinon.spy(PassThrough.prototype, 'write');

		sinon.stub(http, 'request')
			.callsArgWith(1, mockResponse(response))
			.returns(new PassThrough());

		const reqResponse = await Request.get(url, { strictMode: true });

		sinon.assert.calledWithExactly(writeSpy, '');

		sinon.assert.calledWithMatch(http.request, {
			hostname: 'test.com',
			method: 'GET',
			path: '/',
			headers: Request.defaultHeaders
		});

		assert.deepStrictEqual(reqResponse.statusCode, response.code);
		assert.deepStrictEqual(reqResponse.body, response.body);
	});

	it('Should make a get with path and query', async () => {

		const url = 'https://test.com';
		const path = 'hello';
		const queryParams = { pag: 2 };

		const response = {
			code: 200,
			body: { message: 'ok' },
			headers: { 'Content-Type': 'application/json' }
		};

		const writeSpy = sinon.spy(PassThrough.prototype, 'write');

		sinon.stub(https, 'request')
			.callsArgWith(1, mockResponse(response))
			.returns(new PassThrough());

		const reqResponse = await Request.get(url, { path, queryParams });

		sinon.assert.calledWithExactly(writeSpy, '');

		sinon.assert.calledWithMatch(https.request, {
			hostname: 'test.com',
			method: 'GET',
			path: '/hello?pag=2',
			headers: Request.defaultHeaders
		});

		assert.deepStrictEqual(reqResponse.statusCode, response.code);
		assert.deepStrictEqual(reqResponse.body, response.body);

	});

	it('Should make a post and replace path params', async () => {

		const url = 'https://test.com/id/{id}/refid/{refId}';
		const pathParams = { id: 2, refId: 3 };
		const payload = { test: 'test' };

		const response = {
			code: 200,
			body: { message: 'ok' },
			headers: { 'Content-Type': 'application/json' }
		};

		const reqPassThrough = new PassThrough();
		const writeSpy = sinon.spy(reqPassThrough, 'write');

		sinon.stub(https, 'request')
			.callsArgWith(1, mockResponse(response))
			.returns(reqPassThrough);

		const reqResponse = await Request.post(url, payload, { pathParams });

		sinon.assert.calledWithExactly(writeSpy, JSON.stringify(payload));

		sinon.assert.calledWithMatch(https.request, {
			hostname: 'test.com',
			method: 'POST',
			path: '/id/2/refid/3',
			headers: Request.defaultHeaders
		});

		assert.deepStrictEqual(reqResponse.statusCode, response.code);
		assert.deepStrictEqual(reqResponse.body, response.body);

	});

	it('Should make a post request using raw formats', async () => {

		const url = 'http://test.com';

		const bodyContent = '<h1>test</h1>';

		const response = {
			code: 200,
			body: Buffer.from(bodyContent),
			headers: { 'content-type': 'text/html' }
		};

		const payload = Buffer.from(bodyContent, 'utf-8');

		const reqPassThrough = new PassThrough();
		const writeSpy = sinon.spy(reqPassThrough, 'write');

		sinon.stub(http, 'request')
			.callsArgWith(1, mockResponse(response))
			.returns(reqPassThrough);

		const reqResponse = await Request.post(url, payload);

		sinon.assert.calledOnceWithExactly(writeSpy, payload);

		sinon.assert.calledWithMatch(http.request, {
			hostname: 'test.com',
			method: 'POST',
			path: '/',
			headers: Request.defaultHeaders
		});

		assert.deepStrictEqual(Request.statusCode, response.code);
		assert.deepStrictEqual(Request.responseBody, bodyContent);
		assert.deepStrictEqual(reqResponse.rawBody, payload);
	});

	it('Should make a get request by default', async () => {
		const url = 'test.com';

		const response = {
			code: 200,
			body: { message: 'ok' },
			headers: { 'Content-Type': 'application/json' }
		};

		const writeSpy = sinon.spy(PassThrough.prototype, 'write');

		sinon.stub(http, 'request')
			.callsArgWith(1, mockResponse(response))
			.returns(new PassThrough());

		const reqResponse = await Request.call({ endpoint: url });

		sinon.assert.calledWithExactly(writeSpy, '');

		sinon.assert.calledWithMatch(http.request, {
			hostname: url,
			method: 'GET',
			path: '/',
			headers: Request.defaultHeaders
		});

		assert.deepStrictEqual(reqResponse.statusCode, response.code);
		assert.deepStrictEqual(reqResponse.body, response.body);
	});

	it('Should throw an error when the request return a statusCode greather than or equal to 400', async () => {

		const url = 'http://test.com';

		const response = {
			code: 500,
			body: 'internal error',
			headers: { 'Content-Type': 'application/json' }
		};

		const writeSpy = sinon.spy(PassThrough.prototype, 'write');

		sinon.stub(http, 'request')
			.callsArgWith(1, mockResponse(response))
			.returns(new PassThrough());

		await assert.rejects(Request.get(url), {
			code: RequestError.codes.REQUEST_ERROR,
			message: 'Request failed: "internal error"'
		});

		sinon.assert.calledWithExactly(writeSpy, '');

		sinon.assert.calledWithMatch(http.request, {
			hostname: 'test.com',
			method: 'GET',
			path: '/',
			headers: Request.defaultHeaders
		});
	});
});
