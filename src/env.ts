const env = process.env;

export function getEnv(key: string): string | undefined {
	return env[key];
}
