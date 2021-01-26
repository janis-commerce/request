'use strict';

const protocols = require('./wrappers');
const RequestResponse = require('./request-response');
const RequestUtils = require('./request-utils');

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
	 * @readonly
	 * @static
	 */
	static get defaultHeaders() {
		return defaultHeaders;
	}

	/**
	 * To make a GET request
	 *
	 * @static
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
	 * @static
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
	 * @static
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
	 * @static
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
	 * @static
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
	 * @static
	 * @param {CallOptions} options
	 * @returns {Promise<RequestResponse>}
	 */
	static call({ body, strictMode, ...params }) {

		return new Promise((resolve, reject) => {

			const headers = { ...this.defaultHeaders, ...params.headers };
			const { protocol, ...options } = RequestUtils.getOptions({ ...params, headers });
			const requestProtocol = protocol.replace(':', '');
			const payload = RequestUtils.serializePayload(body);

			const nodeReq = protocols[requestProtocol].request(options,
				res => this.requestCallback(res, resolve, reject, { body, strictMode, ...params }));

			nodeReq.write(payload);
			nodeReq.end();

		});

	}

	/**
	 * The request callback function
	 *
	 * @static
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
			return resolve(new RequestResponse(incommingMessage, rawResponse));
		});
	}

};
