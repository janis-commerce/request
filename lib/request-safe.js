'use strict';

const Request = require('./request');

module.exports = class RequestSafe extends Request {

	/**
	 * To make a custom request. Not trown an error if the statusCode is greather than or equal to 400
	 *
	 * @static
	 * @param {import('./request').CallOptions} options
	 * @returns {Promise<RequestResponse>}
	 */
	static call({ body, strictMode, ...params }) {
		return Request.makeRequest(params, body, strictMode);
	}
};
