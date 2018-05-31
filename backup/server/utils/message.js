var generateMessage = (from, text) => {
	return {
		from,
		text,
		createdAt: new Date().getTime()
	}
}

var generatelocationMessage = function(from, lat, lng) {
	return {
		from,
		url : `htttps://www.google.com/maps?q=${lat},${lng}`,
		createdAt: new Date().getTime()
	}
};
module.exports = {
	generateMessage,
	generatelocationMessage 
};

