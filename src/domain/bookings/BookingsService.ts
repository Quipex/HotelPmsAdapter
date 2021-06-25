import api from '../../pms_cloud/api';
import { getRoom } from '../../pms_cloud/constants';

interface FrontDeskResponse {
	content: Booking[];
	page: {
		offset: number;
		pageNumber: number;
		pageSize: number;
		sort: Record<string, unknown>;
		totalCount: number;
	},
	success: boolean
}

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

function formFilter(startTime: number, endTime: number) {
	const query = {
		conn: 'AND',
		params: [
			{
				field: 'startDate',
				comparison: 'lte',
				type: 'date',
				// this is not a mistake, we invert dates on purpose
				value: endTime
			},
			{
				field: 'endDate',
				comparison: 'gte',
				type: 'date',
				// this is not a mistake, we invert dates on purpose
				value: startTime
			},
			{
				field: 'status',
				comparison: 'not_in',
				type: 'ROOM_USE_STATUS',
				values: [
					'REFUSE',
					'NOT_ARRIVED'
				]
			}
		]
	};
	return encodeURIComponent(JSON.stringify(query));
}

function getUrl(startTime: number, endTime: number) {
	return `/frontDesk?_dc=${Date.now()}&withFilter=${formFilter(startTime, endTime)}&ajax_request=true`;
}

export async function getBookings(): Promise<FrontDeskResponse> {
	const startTime = Date.UTC(2021, 5, 1) / 1000;
	const endTime = Date.UTC(2021, 8, 30) / 1000;
	const resp = (await api.get(getUrl(startTime, endTime))).data as FrontDeskResponse;
	return {
		...resp,
		content: resp.content.map(b => ({...b, realRoomNumber: getRoom(b.roomId)}))
	};
}
