const db = require('../database/config');

async function add(user) {
	const [id] = await db('users').insert(user);
	return findById(id);
}

function find() {
	return db('users').select('id', 'username');
}

function findBy(filter) {
	return db('users')
		.select('id', 'username', 'password', 'department')
		.where(filter);
}

function findById(id) {
	return db('users')
		.select('id', 'username', 'department')
		.where({ id })
		.first();
}

module.exports = {
	add,
	find,
	findBy,
	findById,
};
