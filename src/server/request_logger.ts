import { NextFunction, Request, Response } from 'express';

function logRequest(req: Request, res: Response, next: NextFunction): void {
	console.log('New request: ', {
		time: new Date().toLocaleString(),
		url: req.originalUrl,
		method: req.method,
		headers: { ...req.headers, x_security_header: 'hidden' },
		ip: req.ip
	});
	next();
}

export default logRequest;
