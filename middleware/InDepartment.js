const jwt = require('jsonwebtoken');

function departmentCheck(role) {
	const roles = ['marketing', 'engineer', 'super_admin'];
	return async (req, res, next) => {
		const authError = {
			message: 'Invalid credentials',
		};

		try {
			const token = req.headers.authorization;
			if (!token) {
				return res.status(401).json(authError);
			}

			jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
				if (err) {
					return res.status(401).json(authError);
				}
				if (
					role &&
					roles.indexOf(decoded.department) < roles.indexOf(role)
				) {
					return res.status(403).json({
						message: 'You are not allowed here',
					});
				}
				// we know the user is authorized at this point
				req.token = decoded;
				return next();
			});
		} catch (err) {
			next(err);
		}
	};
}

module.exports = departmentCheck;
