// using this custom function instead of npm method-override
// this is because the method-override cannot be used from <a> tag
module.exports = (req, res, next) => {
	switch(req.query._method) {
		case 'PUT':
			req.method = 'PUT';
			req.url = req.path;
			break;
		case 'DELETE':
			req.method = 'DELETE';
			req.url = req.path;
	        break;
	} 
    next(); 
}