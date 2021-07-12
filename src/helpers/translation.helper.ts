import CyrillicToTranslit from 'cyrillic-to-translit-js';
import { PmsClientEntity } from '../domain/client/ClientPmsModel';


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

export default developTranslatedNames;
