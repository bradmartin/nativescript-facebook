import { ChangeDetectorRef, Component } from '@angular/core';
import { ApplicationSettings, Http } from '@nativescript/core';
import * as Facebook from 'nativescript-facebook';
import { config } from '../../app.config';
import { NavigationService } from '../../services/navigation.service';

@Component({
	selector: 'home',
	moduleId: module.id,
	templateUrl: 'home.component.html',
	styleUrls: ['home.component.css']
})
export class HomeComponent {
	accessToken: string = ApplicationSettings.getString('access_token');
	userId: string;
	username: string;
	avatarUrl: string;
	eventCounter: number = 0;

	constructor(
		private ref: ChangeDetectorRef,
		private navigationService: NavigationService
	) {
		// Get logged in user's info
		Http.getJSON(
			config.FACEBOOK_GRAPH_API_URL + '/me?access_token=' + this.accessToken
		).then(
			res => {
				this.username = res['name'];
				this.userId = res['id'];

				// Get logged in user's avatar
				// ref: https://github.com/NativeScript/NativeScript/issues/2176
				Http.getJSON(
					config.FACEBOOK_GRAPH_API_URL +
						'/' +
						this.userId +
						'/picture?type=large&redirect=false&access_token=' +
						this.accessToken
				).then(
					res => {
						this.avatarUrl = res['data']['url'];
						this.ref.detectChanges();
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

	onLogout(eventData: Facebook.LoginEventData) {
		if (eventData.error) {
			alert('Error during login: ' + eventData.error);
		} else {
			ApplicationSettings.clear();
			this.navigationService.go(['login'], 'slideRight');
		}
	}

	logout() {
		Facebook.logout(() => {
			ApplicationSettings.clear();
			this.navigationService.go(['login'], 'slideRight');
		});
	}

	logEvent() {
		this.eventCounter++;
		Facebook.logEvent('Home', [
			{
				key: 'counter',
				value: this.eventCounter.toString()
			}
		]);
	}

	public getCurrentAccessToken() {
		let accessToken = Facebook.getCurrentAccessToken();

		alert('Current access token: ' + JSON.stringify(accessToken, null, '\t'));
	}
}
