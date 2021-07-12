import express from 'express';
import bodyParser from 'body-parser';
import env from '../config/env';
import checkHeaderValidAndReject from './middlewares/security';
import logRequest from './middlewares/request_logger';
import handleErrors from './middlewares/handle_errors';
import { createConnection } from 'typeorm';
import appRouter from '../domain/AppController';
import dbConfig from '../config/database';

const app = express();

app.use(checkHeaderValidAndReject);
app.use(logRequest);
app.use(bodyParser.json());

app.use(handleErrors);

createConnection(dbConfig).then(() => {
	console.log('Connection to database created');

	app.use(appRouter);

	app.listen(env.port, () => {
		console.log(`⚡️[server]: Server is running on port ${env.port}`);
	});
}).catch(err => {
	console.error('Error while creating db connection', err);
	process.exit(1);
});
