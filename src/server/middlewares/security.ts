import { getEnv } from '../env';
import { NextFunction, Request, Response } from 'express';

const x_security_header = getEnv('X_SEC_HEADER');

function checkHeaderValidAndReject(req: Request, res: Response, next: NextFunction): void {
	const secHeader = req.headers.x_security_header;
	if (secHeader !== x_security_header) {
		console.log('Blocked request', { time: new Date().toLocaleString(), url: req.originalUrl, method: req.method, ip: req.ip });
		res.status(403).send(':(');
	} else {
		next();
	}
}

export default checkHeaderValidAndReject;
