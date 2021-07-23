'use strict';

const Request = require('./request');

module.exports = class RequestSafe extends Request {

	/**
	 * Get the safe mode value
	 *
	 * @readonly
	 * @static
	 */
	static get safeMode() {
		return true;
	}
};
