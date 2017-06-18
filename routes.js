const express = require('express');
const router  = express.Router();
const db = require('./db/queries');
const renderError = require('./lib/responseHelpers').renderError;

const validPuppy = require('./lib/validations').validPuppy;

function validatePuppyForSave(req, res, callback) {
	if (validPuppy(req.body)) {
		const puppy = {
			name: req.body.name,
			breed: req.body.breed,
			birthdate: req.body.birthdate
		};
		callback(puppy);
	} else {
		// the puppy data didn't pass validation
		renderError(res, 400, "Invalid puppy.");
	}
}

router

.get('/', (req, res) => {
	db.getAll()
	.then(function(puppies) {
		res.render('index', {
			puppies: puppies
		});
	})
	.catch(function(err) {
		// the database returned an error
		console.log(err);
		renderError(res, 500, "Something went wrong.");
	})
})

.get('/new', (req, res) => {
	res.render('new');
})

.post('/create', (req, res) => {
	validatePuppyForSave(req, res, (puppy) => {
		db.create(puppy)
		.then(ids => {
			const id = ids[0];
			res.redirect('/' + id);
		})
		.catch(function(err) {
			// the database returned an error
			console.log(err);
			renderError(res, 500, "Something went wrong.");
		})		
	})
})

.get('/:id', (req, res) => {
	const id = req.params.id;
	if (! isNaN(id)) {
		db.getOne(id)
		.then(function(puppy) {
			if (puppy) {
				res.render('view', {
					puppy: puppy
				})
			} else {
				//no record was returned for this id
				renderError(res, 403, "Forbidden.");
			}
		})
		.catch(function(err) {
			// the database returned an error
			console.log(err);
			renderError(res, 500, "Something went wrong.");
		})
	} else {
		// the id was invalid format
		renderError(res, 403, "Forbidden.");
	}
})

.get('/:id/edit', (req, res) => {
	const id = req.params.id;
	if (! isNaN(id)) {
		db.getOne(id)
		.then(function(puppy) {
			if (puppy) {
				res.render('edit', {
					puppy: puppy
				})
			} else {
				//no record was returned for this id
				renderError(res, 403, "Forbidden.");
			}
		})
		.catch(function(err) {
			// the database returned an error
			console.log(err);
			renderError(res, 500, "Something went wrong.");
		})
	} else {
		// the id was invalid format
		renderError(res, 403, "Something went wrong.");
	}
})

.put('/:id/update', (req, res) => {
	const id = req.params.id;
	if (!isNaN(id)) {
		validatePuppyForSave(req, res, (puppy) => {
			db.update(puppy, id)
				.then(() => {
					res.redirect('/')
				})
				.catch(function(err) {
				// the database returned an error
				console.log(err);
				renderError(res, 500, "Something went wrong.");
			})
		})
	} else {
		// the id was invalid format
		renderError(res, 403, "Forbidden.");
	}
})

.delete('/:id/destroy', (req, res) => {
	const id = req.params.id;
	if (! isNaN(id)) {
		db.delete(id)
		.then(() => {
			res.redirect('/')
		})
		.catch(function(err) {
			// the database returned an error
			console.log(err);
			renderError(res, 500, "Something went wrong.");
		})
	} else {
		// the id was invalid format
		renderError(res, 403, "Forbidden.");
	}
})

module.exports = router;