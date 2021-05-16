import { Request, Response } from 'express';
import { getEnv } from '../env';
import { getBookings } from '../pms_cloud/actions';
import app from './server';

app.get('/', (req, res) => {
	res.send('hello');
});

const x_security_header = getEnv('X_SEC_HEADER');
function checkHeaderValidAndReject(req: Request, res: Response) {
	const secHeader = req.headers.x_security_header;
	if (secHeader !== x_security_header) {
		res.status(403).send(':(');
		return false;
	}
	return true;
}

app.post('/bookings', async (req, res) => {
	if (!checkHeaderValidAndReject(req, res)) return;

	try {
		const resp = await getBookings();
		res.send(resp);
	} catch (error) {
		console.error('Error occured at /bookings', error);
		res.status(500).send({ message: 'Failed to fetch', error });
	}
});
