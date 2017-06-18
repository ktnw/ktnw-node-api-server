function renderError(res, code, message) {
	res.status(code).render('error', {
		code,
		message
	});
};

module.exports = {
	renderError
}