import api, { PmsApiResponse } from '../../pms_cloud/api';

interface Client {
	'createdDate': Date, //1618796840,
	'updatedDate': Date, //1618796840,
	'id': string, //65536,
	'firstName': string, //'БелИмя1',
	'lastName': string, //'БелФам1',
	'patronymic': string, //null,
	'dob': string, //null,
	'identity': string, //null,
	'country': string, //null,
	'city': string, //null,
	'province': string, //null,
	'address': string, //null,
	'fromPoH': boolean, //false,
	'phone': string, //'БелТел1',
	'email': string, //null,
	'language': string, //null,
	'driverLicense': string, //null,
	'passportNumber': string, //null,
	'passportValidTill': string, //null,
	'passportIssued': string, //null,
	'passportIssuedBy': string, //null,
	'postIndex': string, //null,
	'cio': string, //null,
	'entryType': string, //null,
	'entryValidFrom': string, //null,
	'entryValidTill': string, //null,
	'entryNumber': string, //null,
	'visaType': string, //null,
	'carBrand': string, //null,
	'carNumber': string, //null,
	'listMembership': string, //null,
	'membershipReason': string, //null,
	'discount': number, //0,
	'notes': string, //null,
	'hasPersonalData': boolean, //false,
	'active': boolean, //true,
	'type': string, //'adult',
}

function formFilter(name: string) {
	const query = {
		conn: 'OR',
		params: [
			{
				field: 'lastName',
				comparison: 'like',
				type: 'string',
				value: name
			},
			{
				field: 'firstName',
				comparison: 'like',
				type: 'string',
				value: name
			}
		]
	};
	return encodeURIComponent(JSON.stringify(query));
}

function getUrl(name: string) {
	return `/adult?_dc=${Date.now()}&withFilter=${formFilter(name)}&page=1&start=0&limit=100&sort=%5B%7B%22property%22%3A%22lastName%22%2C%22direction%22%3A%22ASC%22%7D%5D&ajax_request=true`;
}

export async function getClients(name: string): Promise<PmsApiResponse<Client>> {
	return (await api.get(getUrl(name))).data as PmsApiResponse<Client>;
}
