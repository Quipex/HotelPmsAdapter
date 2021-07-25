import { CreateBookingPayload } from '../domain/bookings/BookingPmsService';
import { pmsRoomTypeIdFromRealRoomNumber } from './room_categories_constants';
import { dateToUnixSeconds } from '../helpers/dates.helper';
import { getRoomPmsId } from './room_constants';

function createBookingPayload({ roomNumber, from, to, guestName }: CreateBookingPayload) {
	return {
		'customerGroup': {
			'customer': {
				'person': null,
				'id': null,
				'lastName': '',
				'firstName': guestName,
				'phone': '',
				'email': null,
				'address': null,
				'city': null,
				'province': null,
				'postIndex': null,
				'country': null,
				'personalData': null,
				'language': null,
				'discount': null,
				'active': null,
				'entryType': null,
				'visaType': null,
				'driverLicense': null,
				'type': 'adult'
			},
			'includeCustomer': true,
			'pov': 'TOURISM',
			'personalData': ''
		},
		'room': {
			'id': getRoomPmsId(roomNumber),
		},
		'baseRoom': {
			'id': pmsRoomTypeIdFromRealRoomNumber(roomNumber),
			'type': 'roomType'
		},
		'plan': {
			'id': 32768
		},
		'adults': 1,
		'children': 0,
		'startDate': dateToUnixSeconds(from), // inclusive
		'endDate': dateToUnixSeconds(to), // exclusive
		'comment': '',
		'additional': '',
		'source': 'FRONT_DESK',
		'rcode': null,
		'id': null,
		'earlyCheckInPlanned': false,
		'lateCheckOutPlanned': false,
		'acode': null,
		'customerPays': false
	};
}

export default createBookingPayload;
