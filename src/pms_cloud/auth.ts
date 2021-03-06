import { Builder, By, IWebDriverCookie, until, WebDriver } from 'selenium-webdriver';
import { Options, ServiceBuilder } from 'selenium-webdriver/chrome';
import env from '../config/env';

async function isLoginScreen(driver: WebDriver) {
	try {
		await driver.wait(until.elementLocated(By.css('form[name="user"]')), 1000);
		return Promise.resolve(true);
	} catch (err) {
		return Promise.resolve(false);
	}
}

async function isHomeScreen(driver: WebDriver) {
	try {
		console.log('[auth] awaiting url resolve');
		await driver.wait(until.urlContains('https://pmscloud.com/app/home'), 1000);
		return Promise.resolve(true);
	} catch (err) {
		return Promise.reject(false);
	}
}

async function getCookies(driver: WebDriver) {
	const cookies = await driver.manage().getCookies();
	console.log('[get cookies invoke] my new cookies', cookies);
	return cookies;
}

async function performLogin(driver: WebDriver) {
	console.log('[auth] performing login...');
	await driver.findElement(By.name('hotel')).sendKeys(env.pmsId as string);
	console.log('[login] typed id');
	await driver.findElement(By.name('login')).sendKeys(env.pmsLogin as string);
	console.log('[login] typed login');
	await driver.findElement(By.name('password')).sendKeys(env.pmsPw as string);
	console.log('[login] typed password');
	await driver.findElement(By.id('submit')).click();
	console.log('[login] clicked submit');
}

async function authAndGetCookies(retry = 0): Promise<IWebDriverCookie[]> {
	console.log('creating browser...');
	const chromeOptions = new Options();
	chromeOptions.addArguments('--headless');
	const driver = await new Builder()
		.forBrowser('chrome')
		.setChromeOptions(chromeOptions)
		.setChromeService(new ServiceBuilder(env.chromePath))
		.build();
	console.log('created');
	try {
		await driver.get('https://pmscloud.com/app/login');
		console.log('[auth] got to https://pmscloud.com/app/login and got cookies');
		await getCookies(driver);
		if (await isLoginScreen(driver)) {
			console.log('[auth] it\'s login screen , logging in');
			await performLogin(driver);
		}
		if (await isHomeScreen(driver)) {
			console.log('[auth] it\'s home screen, returning cookies');
			return getCookies(driver);
		} else {
			console.log('[auth] it\'s not home screen, retrying...');
			if (retry > env.maxApiRetries) {
				return Promise.reject(new Error('Max retries exceeded'));
			}
			return authAndGetCookies(retry + 1);
		}
	} finally {
		await driver.quit();
	}
}

export { authAndGetCookies };
