import moment from 'moment';

export function unixDateToDate(unixDate: number): Date {
	return new Date(unixDate * 1000);
}

export function dateToUnixSeconds(date: Date): number {
	return Math.floor(date.getTime() / 1000);
}

export function toDate(date: Date): string {
	return moment(date).format('YYYY/MM/DD');
}
