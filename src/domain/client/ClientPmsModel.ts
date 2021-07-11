import { Column, Entity, PrimaryColumn } from 'typeorm';

export interface PmsClient {
	createdDate: number, //1618796840,
	updatedDate: number, //1618796840,
	id: number, //65536,
	firstName: string, //'БелИмя1',
	lastName: string, //'БелФам1',
	patronymic: string, //null,
	dob: string, //null,
	identity: string, //null,
	country: string, //null,
	city: string, //null,
	province: string, //null,
	address: string, //null,
	fromPoH: boolean, //false,
	phone: string, //'БелТел1',
	email: string, //null,
	language: string, //null,
	driverLicense: string, //null,
	passportNumber: string, //null,
	passportValidTill: string, //null,
	passportIssued: string, //null,
	passportIssuedBy: string, //null,
	postIndex: string, //null,
	cio: string, //null,
	entryType: string, //null,
	entryValidFrom: string, //null,
	entryValidTill: string, //null,
	entryNumber: string, //null,
	visaType: string, //null,
	carBrand: string, //null,
	carNumber: string, //null,
	listMembership: string, //null,
	membershipReason: string, //null,
	discount: number, //0,
	notes: string, //null,
	hasPersonalData: boolean, //false,
	active: boolean, //true,
	type: string, //'adult',
}

@Entity({ name: 'pms_clients_raw' })
export class PmsClientEntity {

	@PrimaryColumn('int')
	id!: number; //65536,

	@Column('date')
	createdDate?: Date; //1618796840;

	@Column('date')
	updatedDate?: Date; //1618796840;

	@Column()
	firstName?: string; //'БелИмя1';

	@Column()
	lastName?: string; //'БелФам1';

	@Column()
	patronymic?: string; //null;

	@Column()
	dob?: string; //null;

	@Column()
	identity?: string; //null;

	@Column()
	country?: string; //null;

	@Column()
	city?: string; //null;

	@Column()
	province?: string; //null;

	@Column()
	address?: string; //null;

	@Column()
	fromPoH?: boolean; //false;

	@Column()
	phone?: string; //'БелТел1';

	@Column()
	email?: string; //null;

	@Column()
	language?: string; //null;

	@Column()
	driverLicense?: string; //null;

	@Column()
	passportNumber?: string; //null;

	@Column()
	passportValidTill?: string; //null;

	@Column()
	passportIssued?: string; //null;

	@Column()
	passportIssuedBy?: string; //null;

	@Column()
	postIndex?: string; //null;

	@Column()
	cio?: string; //null;

	@Column()
	entryType?: string; //null;

	@Column()
	entryValidFrom?: string; //null;

	@Column()
	entryValidTill?: string; //null;

	@Column()
	entryNumber?: string; //null;

	@Column()
	visaType?: string; //null;

	@Column()
	carBrand?: string; //null;

	@Column()
	carNumber?: string; //null;

	@Column()
	listMembership?: string; //null;

	@Column()
	membershipReason?: string; //null;

	@Column()
	discount?: number; //0;

	@Column()
	notes?: string; //null;

	@Column()
	hasPersonalData?: boolean; //false;

	@Column()
	active?: boolean; //true;

	@Column()
	type?: string; //'adult';

	@Column()
	fullNameRu?: string;

	@Column()
	fullNameUa?: string;

	@Column()
	fullNameEn?: string;

	@Column()
	fullNameOrig?: string;
}

export function mapPmsClientToEntity(client: PmsClient): PmsClientEntity {
	return {
		...client,
		createdDate: new Date(client.createdDate * 1000),
		updatedDate: new Date(client.updatedDate * 1000)
	};
}
