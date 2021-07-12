import dotenv from 'dotenv';

dotenv.config();

const _env = process.env;

export function getEnv(key: string): string {
	const val = _env[key];
	if (!val) {
		console.warn('Missing env variable', key);
	}
	return _env[key] ?? '';
}

interface Env {
	pmsId: string;
	pmsLogin: string;
	pmsPw: string;
	port: number;
	xSecHeader: string;
	chromePath: string;
	maxApiRetries: number;
	msToSleep_429: number;
}

const env: Env = {
	pmsId: getEnv('CREDS_ID'),
	pmsLogin: getEnv('CREDS_LOGIN'),
	pmsPw: getEnv('CREDS_PW'),
	port: +getEnv('PORT'),
	xSecHeader: getEnv('X_SEC_HEADER'),
	chromePath: getEnv('CHROME_PATH'),
	maxApiRetries: +getEnv('MAX_API_RETRIES'),
	msToSleep_429: +getEnv('TIME_TO_SLEEP')
};

export default env;
