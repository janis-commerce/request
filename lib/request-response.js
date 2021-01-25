'use strict';

module.exports = class RequestResponse {

	constructor(incomingMessage, rawBody) {

		const body = this.parseRawBody(rawBody);

		const {
			complete,
			aborted,
			httpVersion,
			headers,
			rawHeaders,
			req: originRequest,
			statusCode,
			statusMessage
		} = incomingMessage;

		Object.assign(this, {
			complete,
			aborted,
			httpVersion,
			rawHeaders,
			headers,
			statusCode,
			statusMessage,
			body,
			rawBody,
			originRequest
		});
	}

	/**
	 * Try to parse the raw body to object otherwise return the raw body
	 *
	 * @param {Buffer} rawBody The raw body
	 * @return {Object|Buffer} The parsed body or raw body instead
	 */
	parseRawBody(rawBody) {
		try {
			const responseBody = JSON.parse(rawBody);
			return responseBody;
		} catch(error) {
			return rawBody;
		}
	}
};
