import express, { Request, Response } from 'express';
import {
	confirmLiving,
	confirmPrepayment,
	expiredRemindedPrepayment,
	fetchPmsAndGetAllBookings,
	getAllBookings,
	getArrivalsBy,
	getBookingById,
	getBookingsAddedAfter,
	getBookingsNotPayedArriveAfter,
	remindedOfPrepayment
} from './bookings/BookingPmsService';
import { findClients, getClients } from './client/ClientsPmsService';
import asyncHandler from 'express-async-handler';

const appRouter = express.Router();

appRouter.get('/', (req, res) => {
	res.send('hello');
});

appRouter.post('/bookings', asyncHandler(async (req: Request, res: Response) => {
	const resp = await fetchPmsAndGetAllBookings();
	res.send(resp);
}));

appRouter.get('/bookings/cached', asyncHandler(async (req: Request, res: Response) => {
	const resp = await getAllBookings();
	res.send(resp);
}));

appRouter.get('/bookings/arrive', asyncHandler(async (req: Request, res: Response) => {
	const { date: unixDate } = req.query;
	if (!unixDate) {
		res.sendStatus(400);
		return;
	}
	const resp = await getArrivalsBy(+unixDate);
	res.send(resp);
}));

appRouter.get('/bookings/added', asyncHandler(async (req: Request, res: Response) => {
	const { after: unixDate } = req.query;
	if (!unixDate) {
		res.sendStatus(400);
		return;
	}
	const resp = await getBookingsAddedAfter(+unixDate);
	res.send(resp);
}));

appRouter.get('/booking/:id', asyncHandler(async (req: Request, res: Response) => {
	const { id } = req.params;
	const resp = await getBookingById(id);
	if (resp) {
		res.send(resp);
	} else {
		res.sendStatus(204);
	}
}));

appRouter.get('/bookings/not_payed', asyncHandler(async (req: Request, res: Response) => {
	const { arrive_after: unixDate } = req.query;
	if (!unixDate) {
		res.sendStatus(400);
		return;
	}
	const resp = await getBookingsNotPayedArriveAfter(+unixDate);
	res.send(resp);
}));

appRouter.put('/bookings/sync', asyncHandler(async (req: Request, res: Response) => {
	await fetchPmsAndGetAllBookings();
	res.sendStatus(200);
}));

appRouter.put('/booking/confirm', asyncHandler(async (req: Request, res: Response) => {
	const { bookingId } = req.body;
	if (!bookingId) {
		res.status(400).send({ message: 'missing booking id' });
	}
	await confirmPrepayment(bookingId);
	res.sendStatus(200);
}));

appRouter.put('/booking/confirm_living', asyncHandler(async (req: Request, res: Response) => {
	const { bookingId } = req.body;
	if (!bookingId) {
		res.status(400).send({ message: 'missing booking id' });
	}
	await confirmLiving(bookingId);
	res.sendStatus(200);
}));

appRouter.put('/booking/reminded_prepayment', asyncHandler(async (req: Request, res: Response) => {
	const { bookingId } = req.body;
	if (!bookingId) {
		res.status(400).send({ message: 'missing booking id' });
	}
	await remindedOfPrepayment(bookingId);
	res.sendStatus(200);
}));

appRouter.get('/bookings/expired_remind', asyncHandler(async (req: Request, res: Response) => {
	const bookings = await expiredRemindedPrepayment();
	res.send(bookings);
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
