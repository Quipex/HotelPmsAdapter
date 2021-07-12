import env from '../../config/env';
import { NextFunction, Request, Response } from 'express';

function checkHeaderValidAndReject(req: Request, res: Response, next: NextFunction): void {
	const secHeader = req.headers.x_security_header;
	if (secHeader !== env.xSecHeader) {
		console.log('Blocked request', {
			time: new Date().toLocaleString(),
			url: req.originalUrl,
			method: req.method,
			ip: req.ip
		});
		res.status(403).send(':(');
	} else {
		next();
	}
}

export default checkHeaderValidAndReject;
