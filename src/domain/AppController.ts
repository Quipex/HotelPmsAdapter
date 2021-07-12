import express, { Request, Response } from 'express';
import { getAllBookings } from './bookings/BookingPmsService';
import { findClients, getClients } from './client/ClientsPmsService';
import asyncHandler from 'express-async-handler';

const appRouter = express.Router();

appRouter.get('/', (req, res) => {
	res.send('hello');
});

appRouter.post('/bookings', asyncHandler(async (req: Request, res: Response) => {
	const resp = await getAllBookings();
	res.send(resp);
}));

appRouter.put('/clients/sync', asyncHandler(async (req: Request, res: Response) => {
	await getClients();
	res.sendStatus(200);
}));

appRouter.post('/clients/search', asyncHandler(async (req: Request, res: Response) => {
	const requestName = req.body.name;
	if (requestName === undefined || requestName === null) {
		res.status(400).send({ message: 'missing name' });
	}
	const resp = await findClients(requestName);
	res.send(resp);
}));

export default appRouter;
