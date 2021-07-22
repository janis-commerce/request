'use strict';

const protocols = require('./wrappers');
const RequestResponse = require('./request-response');
const RequestUtils = require('./request-utils');
const RequestError = require('./request-error');

const defaultContentTypes = [
	'application/json',
	'text/plain',
	'application/pdf',
	'image/jpg'
];

const defaultHeaders = {
	'Content-Type': defaultContentTypes[0],
	Accept: defaultContentTypes.join()
};

/**
 * @typedef PathTemplate
 * @type {string} A string path. Supports templating in "{variable}" format. IE: "/api/users/{userId}/contacts"
 */

/**
 * @typedef Headers
 * @type {Object<string, string>} HTTP Headers as a key-value object
 */

/**
 * @typedef CallOptions
 * @type {object}
 * @property {Headers} headers - Custom headers on request. Define as { [headerName]: headerValue }
 * @property {object} pathParams - Replace variables in path declared as "{variable}". Define structure as { [variableNameInPath]: valueForReplace }
 * @property {object} queryParams - Query parameters / filters on request. Define structure as { [queryVariableName]: value }
 * @property {PathTemplate} path - The request path
 * @property {boolean} strictMode - When this flag is set as true, the request response content-type should be application/json or error will thrown
 * @property {string} endpoint - The request endpoint. Protocol and path are optionals. When no protocol specified, http goes by default. Supports *PathTemplate
 * @property {string} method - The request method. 'GET' is set by default
 * @property {*} body - The request body (if request method accepts it). Can be a valid object, Array, string, or any serializable type.
 */

/**
 * @typedef RequestOptions
 * @type {object}
 * @property {Headers} headers - Custom headers on request. Define as { [headerName]: headerValue }
 * @property {object} pathParams - Replace variables in path declared as "{variable}". Define structure as { [variableNameInPath]: valueForReplace }
 * @property {object} queryParams - Query parameters / filters on request. Define structure as { [queryVariableName]: value }
 * @property {PathTemplate} path - The request path
 * @property {boolean} strictMode - When this flag is set as true, the request response content-type should be application/json or error will thrown
 */

/**
 * @typedef RequestResponse
 * @type {object}
 * @property {boolean} complete Flag that represents that if operation was completed
 * @property {boolean} aborted Flag that represents that if operation was aborted
 * @property {string} httpVersion String with http protocol version of the response sent
 * @property {Array<String>} rawHeaders Request headers as array of srings
 * @property {Headers} headers Response headers. Formatted as { [headerName]: headerValue }
 * @property {number} statusCode Response status code
 * @property {string} statusMessage Response status message
 * @property {*} body Response body. Can be a valid object, Array, string, or any serializable type.
 * @property {Array} rawBody Response body without serialization.
 * @property {CallOptions} originRequest Used to make another request based on the origin request. Ie: For retry the same request
 */


/**
 * @class Request
 * @classdesc Simple static class to make external request using http and http node core packages
 */
module.exports = class Request {

	/**
	 * To get default request headers
	 *
	 */
	static get defaultHeaders() {
		return defaultHeaders;
	}

	/**
	 * To get request http method
	 *
	 */
	static get httpMethod() {
		return this.response.originRequest.method;
	}

	/**
	 * To get request endopoint
	 *
	 */
	static get endpoint() {
		return this.response.originRequest.endpoint;
	}

	/**
	 * To get request headers
	 *
	 */
	static get headers() {
		return this.response.originRequest.headers;
	}

	/**
	 * To get request body
	 *
	 */
	static get body() {
		return this.response.originRequest.body;
	}

	/**
	 * To get response status code
	 *
	 */
	static get statusCode() {
		return this.response.statusCode;
	}

	/**
	 * To get response headers
	 *
	 */
	static get responseHeaders() {
		return this.response.headers;
	}

	/**
	 * To get response body
	 *
	 */
	static get responseBody() {
		return this.response.body;
	}

	/**
	 * Get the safe mode value
	 *
	 */
	static get safeMode() {
		return false;
	}

	/**
	 * Get the last request
	 *
	 */
	static get lastRequest() {
		return {
			httpMethod: this.httpMethod,
			endpoint: this.endpoint,
			headers: this.headers,
			body: this.body
		};
	}

	/**
	 * Get the last response
	 *
	 */
	static get lastResponse() {
		return {
			statusCode: this.statusCode,
			headers: this.responseHeaders,
			body: this.responseBody
		};
	}

	/**
	 * To make a GET request
	 *
	 * @param {string} endpoint
	 * @param {RequestOptions} [options={}]
	 * @returns {Promise<RequestResponse>}
	 */
	static get(endpoint, options = {}) {
		return this.call({ ...options, method: 'GET', endpoint, body: '' });
	}

	/**
	 * To make a POST request
	 *
	 * @param {string} endpoint
	 * @param {*} body
	 * @param {RequestOptions} [options={}]
	 * @returns {Promise<RequestResponse>}
	 */
	static post(endpoint, body, options = {}) {
		return this.call({ ...options, method: 'POST', endpoint, body });
	}

	/**
	 * To make a PUT request
	 *
	 * @param {string} endpoint
	 * @param {*} body
	 * @param {RequestOptions} [options={}]
	 * @returns {Promise<RequestResponse>}
	 */
	static put(endpoint, body, options = {}) {
		return this.call({ ...options, method: 'PUT', endpoint, body });
	}

	/**
	 * To make a PATCH request
	 *
	 * @param {string} endpoint
	 * @param {*} body
	 * @param {RequestOptions} [options={}]
	 * @returns {Promise<RequestResponse>}
	 */
	static patch(endpoint, body, options = {}) {
		return this.call({ ...options, method: 'PATCH', endpoint, body });
	}

	/**
	 * To make a DELETE request
	 *
	 * @param {string} endpoint
	 * @param {RequestOptions} [options={}]
	 * @returns {Promise<RequestResponse>}
	 */
	static delete(endpoint, options = {}) {
		return this.call({ ...options, method: 'DELETE', endpoint, body: '' });
	}

	/**
	 * To make a custom request
	 *
	 * @param {object} params CallOptions params
	 * @param {*} body
	 * @param {boolean} strictMode
	 * @returns {Promise<RequestResponse>}
	 */
	static makeRequest(params, body, strictMode) {

		return new Promise((resolve, reject) => {

			const headers = { ...this.defaultHeaders, ...params.headers };
			const { protocol, ...options } = RequestUtils.getOptions({ ...params, headers });
			const requestProtocol = protocol.replace(':', '');
			const payload = RequestUtils.serializePayload(body);

			const nodeReq = protocols[requestProtocol].request(options,
				res => this.requestCallback(res, resolve, reject, { body, strictMode, ...params }));

			nodeReq.on('error', reject);

			nodeReq.write(payload);
			nodeReq.end();
		});
	}

	/**
	 * To make a custom request
	 *
	 * @param {CallOptions} options
	 * @returns {Promise<RequestResponse>}
	 */
	static async call({ body, strictMode, ...params }) {

		const response = await this.makeRequest(params, body, strictMode);

		if(!this.safeMode && this.statusCode >= 400)
			throw new RequestError(`Request failed: ${this.responseBody}`, RequestError.codes.REQUEST_ERROR);

		return response;
	}

	/**
	 * The request callback function
	 *
	 * @param {object} res Response from node request
	 * @param {function} resolve Master promise resolve function
	 * @param {function} reject Master promise reject function
	 * @param {object} { strictMode, body, ...params }
	 * @returns {void}
	 */
	static requestCallback(res, resolve, reject, { strictMode, body, ...params }) {

		const data = [];

		res.on('data', chunk => data.push(chunk));

		res.on('error', reject);

		res.on('end', () => {

			try {
				RequestUtils.validateResponseHeaders(res.headers, strictMode);
			} catch(error) {
				return reject(error);
			}

			const incommingMessage = { ...res, req: { body, ...params } };
			const rawResponse = Buffer.concat(data);

			this.response = new RequestResponse(incommingMessage, rawResponse);

			return resolve(this.response);
		});
	}
};
