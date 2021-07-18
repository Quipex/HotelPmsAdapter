import { Column, Entity, PrimaryColumn } from 'typeorm';

export interface PmsBooking {
	id: number; // 98314
	endDate: number; // 1625961600
	startDate: number; // 1625270400
	cdsCustomerBalance: number; // 9712.8
	cdsCustomerFirstName: string; // "Yuriy"
	cdsCustomerId: number; // 65542
	cdsCustomerLastName: string; // "Sah"
	cdsTotal: number; // 9712.8
	customerFirstName: string; // "Yuriy"
	customerId: number; // 65542
	customerLastName: string; //"Sah"
	groupId: number; // 65545
	groupTotal: number; // 9712.8
	groupTotalPaid: number; // 0
	moved: boolean;// false
	roomId: number; // 34
	roomTypeId: number; // 2
	source: string; // "BOOKING"
	status: string; // "BOOKING_WARRANTY"
	total: number; // 0
	totalPaid: number; // 0
	type: string;// "ROOM_USE"
}

@Entity({ name: 'pms_bookings_raw' })
export class PmsBookingEntity {

	@PrimaryColumn('int')
	id!: number; // 98314

	@Column('date')
	endDate?: Date; // 1625961600

	@Column('date')
	startDate?: Date; // 1625270400

	@Column()
	cdsCustomerBalance?: number; // 9712.8

	@Column()
	cdsCustomerFirstName?: string; // "Yuriy"

	@Column()
	cdsCustomerId?: number; // 65542

	@Column()
	cdsCustomerLastName?: string; // "Sah"

	@Column()
	cdsTotal?: number; // 9712.8

	@Column()
	customerFirstName?: string; // "Yuriy"

	@Column()
	customerId?: number; // 65542

	@Column()
	customerLastName?: string; //"Sah"

	@Column()
	groupId?: number; // 65545

	@Column()
	groupTotal?: number; // 9712.8

	@Column()
	groupTotalPaid?: number; // 0

	@Column()
	moved?: boolean; // false

	@Column()
	roomId?: number; // 34

	@Column()
	roomTypeId?: number; // 2

	@Column()
	source?: string; // "BOOKING"

	@Column()
	status?: string; // "BOOKING_WARRANTY"

	@Column()
	total?: number; // 0

	@Column()
	totalPaid?: number; // 0

	@Column()
	type?: string;// "ROOM_USE"

	@Column()
	realRoomNumber?: number;

	@Column('timestamp')
	addedDate?: Date;

	@Column()
	realRoomType?: string;

	@Column()
	remindedPrepayment?: Date;
}

export function mapPmsBookingsToEntities(pmsBooking: PmsBooking): PmsBookingEntity {
	return {
		...pmsBooking,
		startDate: new Date(Number(pmsBooking.startDate) * 1000),
		endDate: new Date(Number(pmsBooking.endDate) * 1000)
	};
}
