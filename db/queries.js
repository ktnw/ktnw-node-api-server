const knex = require('./knex');

module.exports = {
	getAll: () => {
		return knex
			.column(knex.raw("puppies.id, puppies.name, puppies.breed, to_char(puppies.birthdate, 'YYYY-MM-DD') as birthdate"))
			.select()
			.from('puppies')
	},

	getOne: (id) => {
		return knex
		.column(knex.raw("puppies.id, puppies.name, puppies.breed, to_char(puppies.birthdate, 'YYYY-MM-DD') as birthdate"))
		.from('puppies').where("puppies.id", id)
		.first()

	},

	create: (puppy) => {
		return knex('puppies').insert(puppy, 'id')
	},

	update: (puppy, id) => {
		return knex('puppies')
			.where('puppies.id', id)
			.update(puppy)
	},

	delete: (id) => {
		return knex('puppies')
		.where("puppies.id", id)
		.first()
		.del()
	}
};