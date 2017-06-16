const express = require('express');

const router  = express.Router();

const db = require('./db/knex');

function validPuppy(puppy) {
	return typeof puppy.name == 'string' &&
		puppy.name.trim() != ''
		// + add something for the birthdate
};

router

.get('/', (req, res) => {
	db.column(db.raw("puppies.id, puppies.name, puppies.breed, to_char(puppies.birthdate, 'YYYY-MM-DD') as birthdate"))
	.from('puppies')
	.then(function(puppies) {
		res.render('index', {
			puppies: puppies
		});
	})
	.catch(function(err) {
		// the database returned an error
		console.log(err);
		res.status(500).send("Internal server error.");
	})
})

.get('/new', (req, res) => {
	res.render('new');
})

.post('/create', (req, res) => {
	if (validPuppy(req.body)) {
		const puppy = {
			name: req.body.name,
			breed: req.body.breed,
			birthdate: req.body.birthdate
		};
		db('puppies').insert(puppy, 'id')
		.then(ids => {
			const id = ids[0];
			res.redirect('/' + id);
		})
		.catch(function(err) {
			// the database returned an error
			console.log(err);
			res.status(500).send("Internal server error.");
		})
	} else {
		// the puppy data didn't pass validation
		res.status(500).send("Invalid puppy.");
	}
})

.get('/:id', (req, res) => {
	const id = req.params.id;
	if (! isNaN(id)) {
		db.column(db.raw("puppies.id, puppies.name, puppies.breed, to_char(puppies.birthdate, 'YYYY-MM-DD') as birthdate"))
		.from('puppies').where("puppies.id", id)
		.first()
		.then(function(puppy) {
			if (puppy) {
				res.render('view', {
					puppy: puppy
				})
			} else {
				//no record was returned for this id
				res.status(500).send("No puppy with this id.")
			}
		})
		.catch(function(err) {
			// the database returned an error
			console.log(err);
			res.status(500).send("Internal server error.");
		})
	} else {
		// the id was invalid format
		res.status(500).send("Invalid puppy id.");
	}
})

.get('/:id/edit', (req, res) => {
	const id = req.params.id;
	if (! isNaN(id)) {
		db.column(db.raw("puppies.id, puppies.name, puppies.breed, to_char(puppies.birthdate, 'YYYY-MM-DD') as birthdate"))
		.from('puppies').where("puppies.id", id)
		.first()
		.then(function(puppy) {
			if (puppy) {
				res.render('edit', {
					puppy: puppy
				})
			} else {
				//no record was returned for this id
				res.status(500).send("No puppy with this id.")
			}
		})
		.catch(function(err) {
			// the database returned an error
			console.log(err);
			res.status(500).send("Internal server error.");
		})
	} else {
		// the id was invalid format
		res.status(500).send("Invalid puppy id.");
	}
})

.put('/:id/update', (req, res) => {
	const id = req.params.id;
	if (validPuppy(req.body) && !isNaN(id)) {
		const puppy = {
			name: req.body.name,
			breed: req.body.breed,
			birthdate: req.body.birthdate
		};
		db('puppies')
		.where('puppies.id', id)
		.update(puppy)
			.then(() => {
				res.redirect('/')
			})
			.catch(function(err) {
			// the database returned an error
			console.log(err);
			res.status(500).send("Internal server error.");
		})
	} else {
		// the puppy data didn't pass validation or id was invalid format
		res.status(500).send("Invalid puppy.");
	}
})

.delete('/:id/destroy', (req, res) => {
	const id = req.params.id;
	if (! isNaN(id)) {
		db('puppies')
		.where("puppies.id", id)
		.first()
		.del()
		.then(() => {
			res.redirect('/')
		})
		.catch(function(err) {
			// the database returned an error
			console.log(err);
			res.status(500).send("Internal server error.");
		})
	} else {
		// the id was invalid format
		res.status(500).send("Invalid puppy id.");
	}
})

module.exports = router;