import util from 'util';

export async function sleep(ms: number): Promise<any> {
	return util.promisify(setTimeout)(ms);
}
