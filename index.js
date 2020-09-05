require('dotenv/config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const userRoutes = require('./users/users-routes');

// custom route imports

const server = express();
const port = process.env.PORT || 8080;

// middlewares
server.use(helmet());
server.use(cors());
server.use(express.json());

// custom routes
server.use('/api', userRoutes);

// error catching
server.use((err, _, res, __) => {
	console.log(err);

	res.status(500).json({
		message: 'Something went wrong',
	});
});

server.listen(port, () => {
	console.log(`### Running at http://localhost:${port}`);
});
