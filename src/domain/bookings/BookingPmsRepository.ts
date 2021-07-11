import { PmsBookingEntity } from './BookingPmsModel';
import { getRepository } from 'typeorm';

export const saveBookings = async (bookings: PmsBookingEntity[]): Promise<PmsBookingEntity[]> => {
	const bookingsRepository = getRepository(PmsBookingEntity);
	return bookingsRepository.save(bookings);
};
