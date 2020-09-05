const express = require('express');
const bcrypt = require('bcryptjs');
const Users = require('./users-model');
const jwt = require('jsonwebtoken');
const departmentCheck = require('../middleware/InDepartment');

const router = express.Router();

router.get('/users', departmentCheck('marketing'), async (req, res, next) => {
	try {
		res.json(await Users.find());
	} catch (err) {
		next(err);
	}
});

router.post('/register', validateRegBod(), async (req, res, next) => {
	try {
		const { username, password, department } = req.body;
		const user = await Users.findBy({ username }).first();

		if (user) {
			return res.status(409).json({
				message: 'Username is already taken',
			});
		}

		const newUser = await Users.add({
			username,
			// hash the password with a time complexity of "14"
			password: await bcrypt.hash(password, 14),
			department,
		});

		res.status(201).json(newUser);
	} catch (err) {
		next(err);
	}
});

router.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await Users.findBy({ username }).first();

		if (!user) {
			return res.status(401).json({
				message: 'Invalid Credentials',
			});
		}

		// hash the password again and see if it matches what we have in the database
		const passwordValid = await bcrypt.compare(password, user.password);

		if (!passwordValid) {
			return res.status(401).json({
				message: 'Invalid Credentials',
			});
		}

		const token = jwt.sign(
			{
				userID: user.id,
				department: user.department,
			},
			process.env.JWT_SECRET
		);
		res.json({
			token,
			message: `Welcome ${user.username}!`,
		});
	} catch (err) {
		next(err);
	}
});

function validateRegBod() {
	return (req, res, next) => {
		if (!req.body) {
			return res.status(500).json({
				message: 'Missing Content',
			});
		} else if (
			!req.body.username ||
			!req.body.password ||
			!req.body.department
		) {
			return res.status(500).json({
				message: 'Missing Required Content',
			});
		} else {
			return next();
		}
	};
}

module.exports = router;
