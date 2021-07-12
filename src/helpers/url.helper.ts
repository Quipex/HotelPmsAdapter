export function urlEncode(object: any): string {
	return encodeURIComponent(JSON.stringify(object));
}
