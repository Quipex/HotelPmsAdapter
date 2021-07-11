import dotenv from 'dotenv';

dotenv.config();

const env = process.env;

export function getEnv(key: string): string | undefined {
	return env[key];
}
