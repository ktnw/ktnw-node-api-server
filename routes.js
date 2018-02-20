const express = require('express');
const router  = express.Router();
const db = require('./db/queries');

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
		res.sendStatus(400);
	}
}

router

.get('/api/v1/puppies', (req, res) => {
	db.getAll()
	.then(function(puppies) {
		res.send({
			puppies: puppies
		});
	})
	.catch(function(err) {
		// the database returned an error
		console.log(err);
		res.sendStatus(500);
	})
})

.post('/api/v1/puppies', (req, res) => {
	validatePuppyForSave(req, res, (puppy) => {
		db.create(puppy)
		.then(ids => {
			const id = ids[0];
			res.status(201).send(puppy);
		})
		.catch(function(err) {
			// the database returned an error
			console.log(err);
			res.sendStatus(500);
		})		
	})
})

.get('/api/v1/puppies/:id', (req, res) => {
	const id = req.params.id;
	if (! isNaN(id)) {
		db.getOne(id)
		.then(function(puppy) {
			if (puppy) {
				res.send({
					puppy: puppy
				})
			} else {
				//no record was returned for this id
				res.sendStatus(403);
			}
		})
		.catch(function(err) {
			// the database returned an error
			console.log(err);
			res.sendStatus(500);
		})
	} else {
		// the id was invalid format
		res.sendStatus(403);
	}
})

.put('/api/v1/puppies/:id', (req, res) => {
	const id = req.params.id;
	if (!isNaN(id)) {
		validatePuppyForSave(req, res, (puppy) => {
			db.update(puppy, id)
				.then(() => {
					res.status(200).send(puppy)
				})
				.catch(function(err) {
				// the database returned an error
				console.log(err);
				res.sendStatus(500);
			})
		})
	} else {
		// the id was invalid format
		res.sendStatus(403);
	}
})

.delete('/api/v1/puppies/:id', (req, res) => {
	const id = req.params.id;
	if (! isNaN(id)) {
		db.delete(id)
		.then(() => {
			res.sendStatus(204)
		})
		.catch(function(err) {
			// the database returned an error
			console.log(err);
			res.sendStatus(500);
		})
	} else {
		// the id was invalid format
		res.sendStatus(403);
	}
})

module.exports = router;