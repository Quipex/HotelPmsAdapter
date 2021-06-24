import { Request, Response } from 'express';
import { getBookings } from './BookingsService';
import app from '../../server/server';

app.get('/', (req, res) => {
	res.send('hello');
});

app.post('/bookings', async (_req: Request, res: Response) => {
	const resp = await getBookings();
	res.send(resp);
});
