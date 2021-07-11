import CyrillicToTranslit from 'cyrillic-to-translit-js';

import api from '../../pms_cloud/api';
import { mapPmsClientToEntity, PmsClient, PmsClientEntity } from './ClientPmsModel';
import { urlEncode } from '../../pms_cloud/utils';
import { saveClients, searchClients } from './ClientPmsRepository';


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

const latin = /^[a-zA-Z\s]+$/;
const transUa = new CyrillicToTranslit({ preset: 'uk' });
const transRu = new CyrillicToTranslit({ preset: 'ru' });

function developTranslatedNames(client: PmsClientEntity): PmsClientEntity {
	const fullNameOrig = `${client.lastName} ${client.firstName}`;
	let fullNameEn, fullNameRu, fullNameUa;
	if (latin.test(fullNameOrig)) {
		fullNameEn = fullNameOrig;
		fullNameRu = transRu.reverse(fullNameOrig);
		fullNameUa = transUa.reverse(fullNameOrig);
	} else {
		fullNameRu = fullNameOrig;
		fullNameUa = fullNameOrig;
		fullNameEn = transRu.transform(fullNameRu);
	}

	return {
		...client,
		fullNameOrig,
		fullNameEn,
		fullNameRu,
		fullNameUa
	};
}
