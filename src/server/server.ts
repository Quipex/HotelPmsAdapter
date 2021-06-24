import express, { NextFunction, Request, Response } from 'express';
import { getEnv } from '../env';
import { AxiosError } from 'axios';

const PORT = getEnv('PORT') ?? 9698;
const app = express();


const x_security_header = getEnv('X_SEC_HEADER');

function checkHeaderValidAndReject(req: Request, res: Response, next) {
	const secHeader = req.headers.x_security_header;
	if (secHeader !== x_security_header) {
		console.log('Blocked request', { time: new Date().toLocaleString(), url: req.originalUrl, method: req.method, ip: req.ip });
		res.status(403).send(':(');
	} else {
		next();
	}
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(checkHeaderValidAndReject);

app.use(function (req, res, next) {
	console.log('New request: ', { time: new Date().toLocaleString(), url: req.originalUrl, method: req.method, headers: { ...req.headers, x_security_header: undefined }, ip: req.ip });
	next();
});

interface ErrorReason {
	response?: {
		status: number,
		data: any,
		headers: any
	},
	request?: any,
	config: {
		baseURL?: string,
		method?: string,
		data: any,
		headers: any
	},
	message?: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use(function (err: any, req: Request, res: Response, _next: NextFunction) {
	console.error('Unhandled error', err);
	let reason;
	if (err.isAxiosError) {
		reason = formAxiosError(err);
	} else {
		reason = err;
	}
	res.status(500).send({ message: 'Unhandled error', reason });
});

function formAxiosError(err: AxiosError) {
	const formedError: ErrorReason = {
		config: {
			baseURL: err.config.baseURL,
			method: err.config.method,
			data: err.config.data,
			headers: err.config.headers
		}
	};
	if (err.response) {
		formedError.response = {
			status: err.response.status,
			data: err.response.data,
			headers: err.response.headers,
		};
	} else if (err.request) {
		formedError.request = err.request;
	} else {
		formedError.message = err.message;
	}
	return formedError;
}

app.listen(PORT, () => {
	console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

export default app;
