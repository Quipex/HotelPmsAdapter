import { Request, Response } from 'express';
import { getAllBookings } from './bookings/BookingsService';
import app from '../server/server';
import { getClients } from './bookings/ClientsService';
import asyncHandler from 'express-async-handler';

app.get('/', (req, res) => {
	res.send('hello');
});

app.post('/bookings', asyncHandler(async (_req: Request, res: Response) => {
	const resp = await getAllBookings();
	res.send(resp);
}));

app.post('/client', asyncHandler(async (req: Request, res: Response) => {
	if (!req.body.name) {
		res.status(400).send({ message: 'missing name' });
	}
	const resp = await getClients(req.body.name);
	res.send(resp);
}));
