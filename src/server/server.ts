import express from 'express';
import bodyParser from 'body-parser';
import { getEnv } from '../env';
import checkHeaderValidAndReject from './security';
import logRequest from './request_logger';
import handleErrors from './handle_errors';

const PORT = getEnv('PORT') ?? 9698;
const app = express();

app.use(checkHeaderValidAndReject);
app.use(logRequest);
app.use(bodyParser.json());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(handleErrors);

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

export default app;
