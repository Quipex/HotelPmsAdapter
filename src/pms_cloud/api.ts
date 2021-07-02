import axios, { AxiosRequestConfig } from 'axios';
import { authAndGetCookies } from './auth';
import { IWebDriverCookie } from 'selenium-webdriver';
import { getEnv } from '../env';

let cookies: IWebDriverCookie[] = [];
const MAX_RETRIES = Number(getEnv('MAX_API_RETRIES'));

interface ApiResponse {
	error?: string;
	data?: unknown;
}

export interface PmsApiResponse<T> {
	content: T[];
	page: {
		offset: number;
		pageNumber: number;
		pageSize: number;
		sort: Record<string, unknown>;
		totalCount: number;
	},
	success: boolean
}

function pmsUrl(path: string) {
	const restUrl = path.startsWith('/') ? path : (`/${path}`);
	return 'https://pmscloud.com/app/rest' + restUrl;
}

async function callPmsApi(path: string, config: AxiosRequestConfig = {}, retry = 0): Promise<ApiResponse> {
	if (cookies.length === 0) {
		console.log('[api] no cookies, getting some...');
		cookies = await authAndGetCookies();
	}
	console.log('[api] current cookies', cookies);
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
		return response;
	} catch (error) {
		if (error.response) {
			console.log('[api] bad status while trying to call api', error.response.status);
		}
		if (retry > MAX_RETRIES) {
			return Promise.reject(new Error('Max retries exceeded'));
		}
		console.log(`[api] retrying ${retry + 1} time...`);
		cookies = await authAndGetCookies();
		return callPmsApi(path, config, retry + 1);
	}
}

const api = {
	/**
	 * Make a call and retry if it failed up to 3 times
	 */
	get: async function get(path: string, config?: AxiosRequestConfig): Promise<ApiResponse> {
		return callPmsApi(path, { method: 'GET', ...config });
	},
	/**
	 * Make a call and retry if it failed up to 3 times
	 */
	post: async function post(path: string, config?: AxiosRequestConfig): Promise<ApiResponse> {
		return callPmsApi(path, { method: 'POST', ...config });
	}
};

export default api;
