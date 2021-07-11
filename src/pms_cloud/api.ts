import axios, { AxiosRequestConfig } from 'axios';
import { authAndGetCookies } from './auth';
import { IWebDriverCookie } from 'selenium-webdriver';
import { getEnv } from '../server/env';
import * as queryString from 'query-string';
import { sleep } from './utils';

let cookies: IWebDriverCookie[] = [];
const MAX_RETRIES = Number(getEnv('MAX_API_RETRIES'));
const TIME_TO_SLEEP = Number(getEnv('TIME_TO_SLEEP'));

interface PmsPage {
	offset: number;
	pageNumber: number;
	pageSize: number;
	sort: Record<string, unknown>;
	totalCount: number;
}

export interface PmsApiResponse<T> {
	content: T[];
	page: PmsPage;
	success: boolean;
}

function pmsUrl(path: string) {
	const restUrl = path.startsWith('/') ? path : (`/${path}`);
	return 'https://pmscloud.com/app/rest' + restUrl;
}

interface RequestConfig extends AxiosRequestConfig {
	extra?: {
		page?: number;
		limit?: number;
	}
}

async function callPmsApi(path: string, config: RequestConfig = {}, retry = 0, accumulatedData: unknown[] = []): Promise<unknown[]> {
	if (cookies.length === 0) {
		console.log('[api] no cookies, getting some...');
		cookies = await authAndGetCookies();
	}
	console.log('[api] current cookies', cookies);

	if (config.extra) {
		const pathParts = path.split('?');
		if (pathParts.length === 1) {
			path = queryString.stringifyUrl({ url: pathParts[0], query: config.extra });
		} else {
			const parsedQuery = queryString.parse(pathParts[1]);
			path = queryString.stringifyUrl({ url: pathParts[0], query: { ...parsedQuery, ...config.extra } });
		}
	}

	try {
		console.log('[api] making request...', path, config);
		const response = await axios(pmsUrl(path), {
			...config,
			headers: {
				'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
				'X-Requested-With': 'XMLHttpRequest',
				'sec-ch-ua-mobile': '?0',
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36',
				'Accept': '*/*',
				'Cookie': cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(',')
			}
		});
		console.log('[api] received response.');
		const responseData = response.data as PmsApiResponse<unknown>;
		if (responseData?.page) {
			// pageNumber is zero-based
			if (anyContentLeft(responseData.page)) {
				return callPmsApi(path, withNextPage(config), 0, [...accumulatedData, ...responseData.content]);
			}
		}
		return [...accumulatedData, ...responseData.content];
	} catch (error) {
		if (error.response) {
			if (error.response.status === 429) {
				console.warn(`[api] making requests too fast. Sleeping for ${TIME_TO_SLEEP}ms`);
				await sleep(TIME_TO_SLEEP);
			} else {
				console.warn('[api] bad status while trying to call api', error.response.status);
			}
		}
		if (retry > MAX_RETRIES) {
			return Promise.reject(new Error('Max retries exceeded'));
		}
		console.log(`[api] retrying ${retry + 1} time...`);
		cookies = await authAndGetCookies();
		return callPmsApi(path, config, retry + 1, accumulatedData);
	}
}

function anyContentLeft(page: PmsPage) {
	const { totalCount, pageNumber, pageSize } = page;
	// pageNumber at the response is zero-based
	return pageSize * (pageNumber + 1) < totalCount;
}

function withNextPage(config: RequestConfig): RequestConfig {
	// page at url query is one-based
	const prevPage = config.extra?.page ?? 1;
	return {
		...config,
		extra: {
			...config.extra,
			page: prevPage + 1
		}
	};
}

const api = {
	/**
	 * Make a call and retry if it failed up to 3 times
	 */
	get: async function get(path: string, config?: RequestConfig): Promise<unknown[]> {
		return callPmsApi(path, { method: 'GET', ...config });
	},
	/**
	 * Make a call and retry if it failed up to 3 times
	 */
	post: async function post(path: string, config?: RequestConfig): Promise<unknown[]> {
		return callPmsApi(path, { method: 'POST', ...config });
	}
};

export default api;
