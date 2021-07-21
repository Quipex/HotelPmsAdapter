import api from '../../pms_cloud/api';
import { getRoom } from '../../pms_cloud/room_constants';
import { urlEncode } from '../../helpers/url.helper';
import { and, SearchFilter, SearchParam } from '../../pms_cloud/search';
import { mapPmsBookingsToEntities, PmsBooking, PmsBookingEntity } from './BookingPmsModel';
import {
	findAllBookings,
	findArrivalsAt,
	findBookingsAddedAfter,
	findBookingsNotPayedArriveAfter,
	findBookingsWhoRemindedAndExpired,
	findById,
	saveBookings,
	setBookingPrepaymentWasReminded,
	setBookingToConfirmed,
	setBookingToLiving
} from './BookingPmsRepository';
import { dateToUnixSeconds, unixDateToDate } from '../../helpers/dates.helper';
import { getRoomCategory } from '../../pms_cloud/room_categories_constants';


function datesFilters(startTime: number, endTime: number): SearchParam[] {
	return [
		{
			field: 'startDate',
			comparison: 'lte',
			type: 'date',
			// this is not a mistake, we invert dates on purpose
			value: String(endTime)
		},
		{
			field: 'endDate',
			comparison: 'gte',
			type: 'date',
			// this is not a mistake, we invert dates on purpose
			value: String(startTime)
		}
	];
}

function composeBookingsUrlWithFilter(filter: SearchFilter) {
	const urlEncodedFilter = urlEncode(filter);
	return `/frontDesk?_dc=${Date.now()}&withFilter=${urlEncodedFilter}&ajax_request=true`;
}

const todayYear = new Date().getFullYear();
const startTime = Date.UTC(todayYear, 5, 1) / 1000;
const endTime = Date.UTC(todayYear, 8, 30) / 1000;

export async function fetchPmsAndGetAllBookings(): Promise<PmsBooking[]> {
	const bookingsByDatesPath = composeBookingsUrlWithFilter(and(...datesFilters(startTime, endTime)));
	const pmsBookings = (await api.get(bookingsByDatesPath, { extra: { limit: 100 } })) as PmsBooking[];
	const pmsBookingsWithRooms = pmsBookings.map(b => ({
		...b,
		realRoomNumber: getRoom(b.roomId),
		realRoomType: getRoomCategory(b.roomTypeId)
	}));
	const pmsBookingEntities = pmsBookingsWithRooms.map(mapPmsBookingsToEntities);

	await saveBookings(pmsBookingEntities);

	return pmsBookingsWithRooms.filter(b => (b.status !== 'REFUSE' && b.status !== 'NOT_ARRIVED'));
}

export async function getAllBookings(): Promise<PmsBookingEntity[]> {
	return findAllBookings();
}

export async function getArrivalsBy(unixDate: number): Promise<PmsBookingEntity[]> {
	return findArrivalsAt(unixDateToDate(unixDate));
}

export async function getBookingsAddedAfter(unixDate: number): Promise<PmsBookingEntity[]> {
	return findBookingsAddedAfter(unixDateToDate(unixDate));
}

export async function getBookingById(id: string): Promise<PmsBookingEntity | undefined> {
	return findById(id);
}

export async function getBookingsNotPayedArriveAfter(unixDate: number): Promise<PmsBookingEntity[]> {
	return findBookingsNotPayedArriveAfter(unixDateToDate(unixDate));
}

export async function confirmPrepayment(bookingId: string): Promise<void> {
	await api.post(`/roomUse/${bookingId}/confirmed`);
	await setBookingToConfirmed(+bookingId);
}

export async function confirmLiving(bookingId: string): Promise<void> {
	const booking = await findById(bookingId);
	if (booking?.status === 'BOOKING_FREE') {
		await confirmPrepayment(bookingId);
	}
	await api.post(`/roomUse/${bookingId}/checkedIn`, { data: { time: dateToUnixSeconds(new Date()) } });
	await setBookingToLiving(+bookingId);
}

export async function remindedOfPrepayment(bookingId: string): Promise<void> {
	await setBookingPrepaymentWasReminded(+bookingId);
}

export async function expiredRemindedPrepayment(): Promise<PmsBookingEntity[]> {
	return await findBookingsWhoRemindedAndExpired();
}
