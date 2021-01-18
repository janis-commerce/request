'use strict';

const { stringify } = require('querystring');

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

		const formattedPathName = decodeURIComponent(pathname.replace(slashRegex, '',));
		const urlPath = path.replace(slashRegex, '') || formattedPathName;
		const parsedPath = this.parsePath(urlPath, pathParams);
		const urlQuerySting = stringify(queryParams) || searchParams.toString();

		return `/${parsedPath}${urlQuerySting && '?' + urlQuerySting}`;
	}

	/**
	 * Serializes request payload
	 *
	 * @static
	 * @param {any} [data='']
	 * @returns {any}
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
	 * @param {object} [pathParams={}] CallOptions pathParams
	 * @returns {string}
	 */
	static parsePath(pathTemplate, pathParams = {}) {

		return Object.entries(pathParams).reduce((path, [key, value]) => {

			const regex = new RegExp(`{${key}}`);
			return path.replace(regex, value);

		}, pathTemplate);
	}
};
