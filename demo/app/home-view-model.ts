import {
	ApplicationSettings,
	Frame,
	Http,
	Observable
} from '@nativescript/core';
import {
	getCurrentAccessToken,
	logEvent,
	logout as fbLogout
} from 'nativescript-facebook';

let config = require('./app.config').config;

export class HomeViewModel extends Observable {
	userId: string;
	accessToken: string = ApplicationSettings.getString('access_token');
	eventCounter: 0;

	constructor() {
		super();

		// Get logged in user's info
		Http.getJSON(
			config.FACEBOOK_GRAPH_API_URL + '/me?access_token=' + this.accessToken
		).then(
			(res: any) => {
				this.set('username', res.name);
				this.set('userId', res.id);

				// Get logged in user's avatar
				// ref: https://github.com/NativeScript/NativeScript/issues/2176
				console.log(
					config.FACEBOOK_GRAPH_API_URL +
						'/' +
						this.get('userId') +
						'/picture?type=large&redirect=false&access_token=' +
						this.accessToken
				);

				Http.getJSON(
					config.FACEBOOK_GRAPH_API_URL +
						'/' +
						this.get('userId') +
						'/picture?type=large&redirect=false&access_token=' +
						this.accessToken
				).then(
					(res: any) => {
						this.set('avatarUrl', res.data.url);
					},
					err => {
						alert('Error getting user info: ' + err);
					}
				);
			},
			err => {
				alert('Error getting user info: ' + err);
			}
		);
	}

	private _navigate(path: string) {
		let topmost = Frame.topmost();
		topmost.navigate({
			moduleName: path,
			clearHistory: true
		});
	}

	public onLogout() {
		ApplicationSettings.clear();
		this._navigate('login-page');
	}

	public logout() {
		fbLogout(() => {
			ApplicationSettings.clear();
			this._navigate('login-page');
		});
	}

	public getCurrentAccessToken() {
		let accessToken = getCurrentAccessToken();

		alert('Current access token: ' + JSON.stringify(accessToken, null, '\t'));
	}

	public logEventAction() {
		this.eventCounter++;
		console.log('this.eventCounter', this.eventCounter);
		logEvent('Home', [
			{
				key: 'counter',
				value: this.eventCounter.toString()
			}
		]);
	}
}
