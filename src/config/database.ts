import { ConnectionOptions } from 'typeorm';
import { getEnv } from '../server/env';
import { PmsBookingEntity } from '../domain/bookings/BookingPmsModel';
import { PmsClientEntity } from '../domain/client/ClientPmsModel';

const config: ConnectionOptions = {
	type: 'postgres',
	host: getEnv('DB_HOST') || 'localhost',
	port: Number(getEnv('DB_PORT')) || 5432,
	username: getEnv('DB_USER') || 'postgres',
	password: getEnv('DB_PASS') || 'admin',
	database: getEnv('DB_DATABASE') || 'hotel_integration',
	entities: [PmsBookingEntity, PmsClientEntity],
	logging: true
};

export default config;
