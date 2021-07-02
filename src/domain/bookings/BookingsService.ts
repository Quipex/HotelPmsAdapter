import api, { PmsApiResponse } from '../../pms_cloud/api';
import { getRoom } from '../../pms_cloud/constants';
import { urlEncode } from '../../pms_cloud/utils';
import { and, SearchFilter, SearchParam } from '../../pms_cloud/search';

interface Booking {
	cdsCustomerBalance: number; // 9712.8
	cdsCustomerFirstName: string; // "Yuriy"
	cdsCustomerId: number; // 65542
	cdsCustomerLastName: string; // "Sah"
	cdsTotal: number; // 9712.8
	customerFirstName: string; // "Yuriy"
	customerId: number; // 65542
	customerLastName: string; //"Sah"
	endDate: Date; // 1625961600
	startDate: Date; // 1625270400
	groupId: number; // 65545
	groupTotal: number; // 9712.8
	groupTotalPaid: number; // 0
	id: number; // 98314
	moved: boolean;// false
	roomId: number; // 34
	roomTypeId: number; // 2
	source: string; // "BOOKING"
	status: string; // "BOOKING_WARRANTY"
	total: number; // 0
	totalPaid: number; // 0
	type: string;// "ROOM_USE"
}

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

const activeBookingsFilter: SearchParam = {
	field: 'status',
	comparison: 'not_in',
	type: 'ROOM_USE_STATUS',
	values: [
		'REFUSE',
		'NOT_ARRIVED'
	]
};

function composeBookingsUrlWithFilter(filter: SearchFilter) {
	const urlEncodedFilter = urlEncode(filter);
	return `/frontDesk?_dc=${Date.now()}&withFilter=${urlEncodedFilter}&ajax_request=true`;
}

const startTime = Date.UTC(2021, 5, 1) / 1000;
const endTime = Date.UTC(2021, 8, 30) / 1000;

export async function getAllBookings(): Promise<PmsApiResponse<Booking>> {
	const bookingsByDates = composeBookingsUrlWithFilter(and(...datesFilters(startTime, endTime), activeBookingsFilter));
	const resp = (await api.get(bookingsByDates)).data as PmsApiResponse<Booking>;
	return {
		...resp,
		content: resp.content.map(b => ({ ...b, realRoomNumber: getRoom(b.roomId) }))
	};
}
