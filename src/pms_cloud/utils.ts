import util from 'util';

export function urlEncode(object: any): string {
	return encodeURIComponent(JSON.stringify(object));
}

export async function sleep(ms: number): Promise<any> {
	return util.promisify(setTimeout)(ms);
}
