import moment from 'moment';

export function unixDateToDate(unixDate: number): Date {
	return new Date(unixDate * 1000);
}

export function toDate(date: Date) {
	return moment(date).format('YYYY/MM/DD');
}
