import { PmsBookingEntity } from './BookingPmsModel';
import { getRepository, In, MoreThan } from 'typeorm';
import { toDate } from '../../helpers/dates.helper';

export const saveBookings = async (bookings: PmsBookingEntity[]): Promise<PmsBookingEntity[]> => {
	const bookingsRepository = getRepository(PmsBookingEntity);
	return bookingsRepository.save(bookings);
};

export const findAllBookings = async (): Promise<PmsBookingEntity[]> => {
	const bookingsRepository = getRepository(PmsBookingEntity);
	return bookingsRepository.find();
};

export const findArrivalsAt = async (startDate: Date): Promise<PmsBookingEntity[]> => {
	const bookingsRepository = getRepository(PmsBookingEntity);
	return bookingsRepository.find({
		where: {
			startDate,
			status: In(['LIVING', 'BOOKING_FREE', 'BOOKING_WARRANTY']),
			moved: false,
		},
		order: {
			realRoomNumber: 'ASC'
		}
	});
};

export const findBookingsAddedAfter = async (date: Date): Promise<PmsBookingEntity[]> => {
	const bookingsRepository = getRepository(PmsBookingEntity);
	return bookingsRepository.find({
		where: {
			addedDate: MoreThan(toDate(date)),
			moved: false,
		},
		order: {
			startDate: 'ASC',
			realRoomNumber: 'ASC'
		}
	});
};

export async function findById(id: string): Promise<PmsBookingEntity | undefined> {
	const bookingsRepository = getRepository(PmsBookingEntity);
	return bookingsRepository.findOne(id);
}

export async function findBookingsNotPayedArriveAfter(date: Date): Promise<PmsBookingEntity[]> {
	const bookingsRepository = getRepository(PmsBookingEntity);
	return bookingsRepository.find({
		where: {
			startDate: MoreThan(toDate(date)),
			status: 'BOOKING_FREE',
			moved: false,
		},
		order: {
			startDate: 'ASC',
			realRoomNumber: 'ASC'
		}
	});
}

export async function setBookingToConfirmed(id: number): Promise<void> {
	const bookingsRepository = getRepository(PmsBookingEntity);
	await bookingsRepository.update({ id }, { status: 'BOOKING_WARRANTY' });
}

export async function setBookingToLiving(id: number): Promise<void> {
	const bookingsRepository = getRepository(PmsBookingEntity);
	await bookingsRepository.update({ id }, { status: 'LIVING' });
}

export async function setBookingPrepaymentWasReminded(id: number): Promise<void> {
	const bookingsRepository = getRepository(PmsBookingEntity);
	await bookingsRepository.update({ id }, { remindedPrepayment: new Date() });
}
