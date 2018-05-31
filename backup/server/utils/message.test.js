var expect = requre('expect');
var {generateMessage} = require('./message');

describe('generateMassege', () => {
	it('sould generate correct message object', () => {
		var from ="Jen";
		var text ="Message";
		var message = generateMessage(from, text);
		expect.message.createAt.toBeA('number');
		expect.message.toIncude();

	});
});