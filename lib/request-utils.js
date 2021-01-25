'use strict';

const { stringify } = require('querystring');
const RequestError = require('./request-error');

module.exports = class RequestUtils {

	/**
	 * Converts CallOptions in a valid http/https request options
	 *
	 * @static
	 * @param {CallOptions} {
	 * 		endpoint, headers, pathParams, queryParams = {}, method = 'GET', path = ''
	 * 	}
	 * @returns {object}
	 */
	static getOptions({
		endpoint, headers, pathParams, queryParams = {}, method = 'GET', path = ''
	}) {

		const formattedEndpoint = this.formatEndpoint(endpoint);
		const url = new URL(formattedEndpoint);

		const {
			protocol, host, port
		} = url;

		const optionsPath = this.getOptionsPath(path, pathParams, queryParams, url);

		return {
			host,
			method,
			path: optionsPath,
			port,
			protocol,
			headers
		};
	}

	/**
	 * Removes protocol from the specified endpoint
	 *
	 * @static
	 * @param {string} endpoint
	 * @returns {string}
	 */
	static formatEndpoint(endpoint) {

		const hasEndpointProtocol = /^https?:\/\//.test(endpoint);

		return hasEndpointProtocol ? endpoint : `http://${endpoint}`;
	}

	/**
	 * Resolves http/https request option path
	 *
	 * @static
	 * @param {string} path CallOptions path
	 * @param {object} pathParams CallOptions pathParams
	 * @param {object} queryParams CallOptions queryParams
	 * @param {URL} url
	 * @returns {string}
	 */
	static getOptionsPath(path, pathParams, queryParams, url) {

		const slashRegex = new RegExp('^/');

		const { pathname, searchParams } = url;

		const urlPath = path.replace(slashRegex, '') || decodeURIComponent(pathname.replace(slashRegex, '',));
		const parsedPath = this.parsePath(urlPath, pathParams);
		const urlQuerySting = stringify(queryParams) || searchParams.toString();

		return `/${parsedPath}${urlQuerySting && '?' + urlQuerySting}`;
	}

	/**
	 * Serializes request payload
	 *
	 * @static
	 * @param {*} [data=''] The payload
	 * @returns {string|buffer}
	 */
	static serializePayload(data = '') {

		if(Buffer.isBuffer(data))
			return data;

		if(data && typeof data === 'object')
			return JSON.stringify(data);

		return data.toString();
	}

	/**
	 * Resolves the endpoint variables based on pathParameters CallOptions object
	 *
	 * @static
	 * @param {string} pathTemplate Endpoint string with variables as {variable}
	 * @param {object} [pathParams={}] A key-value mapping to replace the path variables
	 * @returns {string}
	 */
	static parsePath(pathTemplate, pathParams = {}) {
		return pathTemplate.replace(/{([a-z0-9_-]+)}/ig, param => pathParams[param.slice(1, -1)]);
	}

	/**
	 * Validates the response haders
	 *
	 * @static
	 * @param {object} headers Response headers
	 * @param {boolean} strictMode Strict mode flag
	 */
	static validateResponseHeaders(headers, strictMode) {

		if(!strictMode)
			return;

		const [, contentType] = Object.entries(headers).find(([headerName]) => headerName.toLowerCase() === 'content-type') || [];

		if(!contentType || contentType.toLowerCase() !== 'application/json') {
			throw new RequestError('Response is not a valid "application/json"',
				RequestError.REQUEST_ERROR);
		}
	}
};
