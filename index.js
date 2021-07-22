'use strict';

const { RequestSafe } = require('./lib/index');

(async () => {

	try {

		const url = 'https://delivery.janisdev.in/api/shipping/5e7d25b261152432f375b585';
		const response = await RequestSafe.get(url);
		// console.log(response);
		console.log(RequestSafe.lastRequest);
		console.log(RequestSafe.lastResponse);
	} catch(error) {
		console.log('entro');
		console.log(error.message);
	}


})();
