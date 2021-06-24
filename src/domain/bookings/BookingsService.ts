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

const filter = '%7B%22conn%22%3A%22AND%22%2C%22params%22%3A%5B%7B%22field%22%3A%22startDate%22%2C%22comparison%22%3A%22lte%22%2C%22type%22%3A%22date%22%2C%22value%22%3A1632960000%7D%2C%7B%22field%22%3A%22endDate%22%2C%22comparison%22%3A%22gte%22%2C%22type%22%3A%22date%22%2C%22value%22%3A1622505600%7D%2C%7B%22field%22%3A%22status%22%2C%22comparison%22%3A%22not_in%22%2C%22type%22%3A%22ROOM_USE_STATUS%22%2C%22values%22%3A%5B%22REFUSE%22%2C%22NOT_ARRIVED%22%5D%7D%5D%7D';

function getUrl() {
	return `/frontDesk?_dc=${Date.now()}&withFilter=${filter}&ajax_request=true`;
}

export async function getBookings(): Promise<FrontDeskResponse> {
	const resp = (await api.get(getUrl())).data as FrontDeskResponse;
	return {
		...resp,
		content: resp.content.map(b => ({...b, realRoomNumber: getRoom(b.roomId)}))
	};
}
