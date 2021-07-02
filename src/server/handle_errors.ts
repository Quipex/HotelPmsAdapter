import { NextFunction, Request, Response } from 'express';
import { AxiosError } from 'axios';

function handleErrors(err: any, req: Request, res: Response, _next: NextFunction): void {
	console.error('Unhandled error', err);
	let reason;
	if (err.isAxiosError) {
		reason = formAxiosError(err);
	} else {
		reason = err;
	}
	res.status(500).send({ message: 'Unhandled error', reason });
}

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


export default handleErrors;
