import api from '../../pms_cloud/api';
import { getRoom } from '../../pms_cloud/constants';
import { urlEncode } from '../../helpers/url.helper';
import { and, SearchFilter, SearchParam } from '../../pms_cloud/search';
import { mapPmsBookingsToEntities, PmsBooking } from './BookingPmsModel';
import { saveBookings } from './BookingPmsRepository';


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

const startTime = Date.UTC(2021, 5, 1) / 1000;
const endTime = Date.UTC(2021, 8, 30) / 1000;

export async function getAllBookings(): Promise<PmsBooking[]> {
	const bookingsByDates = composeBookingsUrlWithFilter(and(...datesFilters(startTime, endTime)));
	const pmsBookings = (await api.get(bookingsByDates, { extra: { limit: 100 } })) as PmsBooking[];
	const pmsBookingsWithRooms = pmsBookings.map(b => ({
		...b,
		realRoomNumber: getRoom(b.roomId)
	}));
	const pmsBookingEntities = pmsBookingsWithRooms.map(mapPmsBookingsToEntities);

	await saveBookings(pmsBookingEntities);

	return pmsBookingsWithRooms.filter(b => (b.status !== 'REFUSE' && b.status !== 'NOT_ARRIVED'));
}
