'use strict';

module.exports = class RequestResponse {

	constructor(incomingMessage, responseBody, rawBody) {

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
			body: responseBody,
			rawBody,
			originRequest
		});
	}
};
