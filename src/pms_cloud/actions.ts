import { IWebDriverCookie } from 'selenium-webdriver';
import axios from 'axios';
import { authAndGetCookies } from './auth';

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
	cdsCustomerFirstName: string; //"Yuriy"
	cdsCustomerId: number; //65542
	cdsCustomerLastName: string; //"Sah"
	cdsTotal: number; //9712.8
	customerFirstName: string; //"Yuriy"
	customerId: number; //65542
	customerLastName: string; //"Sah"
	endDate: Date; //1625961600
	groupId: number; // 65545
	groupTotal: number; // 9712.8
	groupTotalPaid: number; // 0
	id: number; //98314
	moved: boolean;//false
	roomId: number; //34
	roomTypeId: number; //2
	source: string; //"BOOKING"
	startDate: Date;//1625270400
	status: string;//"BOOKING_WARRANTY"
	total: number; //0
	totalPaid: number; //0
	type: string;//"ROOM_USE"
}
const filter = '%7B%22conn%22%3A%22AND%22%2C%22params%22%3A%5B%7B%22field%22%3A%22startDate%22%2C%22comparison%22%3A%22lte%22%2C%22type%22%3A%22date%22%2C%22value%22%3A1632960000%7D%2C%7B%22field%22%3A%22endDate%22%2C%22comparison%22%3A%22gte%22%2C%22type%22%3A%22date%22%2C%22value%22%3A1622505600%7D%2C%7B%22field%22%3A%22status%22%2C%22comparison%22%3A%22not_in%22%2C%22type%22%3A%22ROOM_USE_STATUS%22%2C%22values%22%3A%5B%22REFUSE%22%2C%22NOT_ARRIVED%22%5D%7D%5D%7D';
function getUrl() {
	return `https://pmscloud.com/app/rest/frontDesk?_dc=${Date.now()}&withFilter=${filter}&ajax_request=true`;
}

let cookies: IWebDriverCookie[] = [];

export async function getBookings(): Promise<FrontDeskResponse> {
	if (cookies.length === 0) {
		cookies = await authAndGetCookies();
	}
	console.log('[get bookings] current cookies', cookies);

	try {
		const resp = await axios.get(getUrl(), {
			headers: {
				'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
				'X-Requested-With': 'XMLHttpRequest',
				'sec-ch-ua-mobile': '?0',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36',
				'Accept': '*/*',
				'Cookie': cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(',')
			}
		});
		return resp.data;
	} catch ({ response }) {
		console.log('bad status while trying to get bookings', response.status);
		cookies = await authAndGetCookies();
		return await getBookings();
	}
}
