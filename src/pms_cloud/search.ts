type Connection = 'AND' | 'OR';

export interface SearchFilter {
	conn: Connection;
	params: SearchParam[];
}

export interface SearchParam {
	field: string;
	comparison: 'gte' | 'lte' | 'not_in' | 'in' | 'like';
	type: string;
	value?: string;
	values?: string[];
}

function composeFilters(connection: Connection, ...filters: SearchParam[]): SearchFilter {
	return {
		conn: connection,
		params: filters
	};
}

export function and(...filters: SearchParam[]): SearchFilter {
	return composeFilters('AND', ...filters);
}

export function or(...filters: SearchParam[]): SearchFilter {
	return composeFilters('OR', ...filters);
}
