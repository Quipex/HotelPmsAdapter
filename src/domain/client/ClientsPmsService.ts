import api from '../../pms_cloud/api';
import { mapPmsClientToEntity, PmsClient, PmsClientEntity } from './ClientPmsModel';
import { urlEncode } from '../../helpers/url.helper';
import { saveClients, searchClients } from './ClientPmsRepository';
import developTranslatedNames from '../../helpers/translation.helper';


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
	return urlEncode(query);
}

function getSorting() {
	const sorting = [
		{ property: 'lastName', direction: 'ASC' }
	];
	return urlEncode(sorting);
}

function getUrl(name = '') {
	return `/adult?_dc=${Date.now()}&withFilter=${formFilter(name)}&sort=${getSorting()}&ajax_request=true`;
}

export async function getClients(): Promise<PmsClient[]> {
	const pmsClients = (await api.get(getUrl(), { extra: { limit: 100 } })) as PmsClient[];
	const clientEntities = pmsClients
		.map(mapPmsClientToEntity)
		.map(developTranslatedNames);
	await saveClients(clientEntities);
	return pmsClients;
}

export async function findClients(name: string): Promise<PmsClientEntity[]> {
	return await searchClients(name);
}
