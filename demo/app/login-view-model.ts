import {
    ApplicationSettings,
    Frame,
    ImageSource,
    Observable
} from '@nativescript/core';
import {
    canMessageDialogShow,
    canShareDialogShow,
    createShareLinksContent,
    createShareMessageGenericTemplateContent,
    createSharePhotosContent,
    getCurrentAccessToken,
    logEvent,
    login as fbLogin,
    LoginEventData,
    MessageGenericTemplateImageAspectRatio,
    showMessageDialog,
    showShareDialog
} from 'nativescript-facebook';

export class LoginViewModel extends Observable {
	public linkContent = this.generateLinksShareContent();
	public photosContent = this.generatePhotosShareContent();
	public genericContent = this.generateGenericTemplateContent();
	public canShowLinksShareDialog = canShareDialogShow(this.linkContent);
	public canShowPhotosShareDialog = canShareDialogShow(this.photosContent);
	public canShowLinksMessageDialog = canMessageDialogShow(this.linkContent);
	public canShowGenericMessageDialog = canMessageDialogShow(
		this.genericContent
	);
	public eventCounter = 0;

	private _navigate(path: string) {
		let topmost = Frame.topmost();
		topmost.navigate({
			moduleName: path,
			clearHistory: true
		});
	}

	public onLogin(eventData: LoginEventData) {
		if (eventData.error) {
			alert('Error during login: ' + eventData.error.message);
		} else {
			ApplicationSettings.setString(
				'access_token',
				eventData.loginResponse.token
			);
			this._navigate('home-page');
		}
	}

	public login() {
		fbLogin((err, fbData) => {
			if (err) {
				alert('Error during login: ' + err.message);
			} else {
				ApplicationSettings.setString('access_token', fbData.token);
				this._navigate('home-page');
			}
		});
	}

	public getCurrentAccessToken() {
		const accessToken = getCurrentAccessToken();

		alert('Current access token: ' + JSON.stringify(accessToken, null, '\t'));
	}

	public generateLinksShareContent() {
		return createShareLinksContent(
			'https://www.nativescript.org',
			'Create Native iOS and Android Apps With JavaScript',
			{
				hashtag: '#Nativescript'
			}
		);
	}

	public generatePhotosShareContent() {
		const logoImage = ImageSource.fromResourceSync('logo');
		return createSharePhotosContent([logoImage], false, {
			hashtag: '#Nativescript'
		});
	}

	public generateGenericTemplateContent() {
		return createShareMessageGenericTemplateContent({
			element: {
				title: 'Nativescript',
				subtitle: 'Create Native iOS and Android Apps With JavaScript',
				imageUrl:
					'https://d2odgkulk9w7if.cloudfront.net/images/default-source/home/how-it-works-min.png',
				button: {
					title: 'Check Doc',
					url: 'https://docs.nativescript.org'
				},
				defaultAction: {
					title: 'Go HomePage',
					url: 'https://www.nativescript.org'
				}
			},
			// it seems android have to provide a pageId, otherwise the MessageDialog just wont show
			pageID: 'testestsett',
			imageAspectRatio: MessageGenericTemplateImageAspectRatio.Horizontal
		});
	}

	public onShareDialog() {
		showShareDialog(this.linkContent, (error, result) => {
			if (error) {
				console.error(error);
				return;
			}
			alert('Successfully shared');
		});
	}

	public onShareDialogPhotos() {
		showShareDialog(this.photosContent);
	}

	public onSendDialog() {
		showMessageDialog(this.linkContent);
	}

	public onSendGenericDialog() {
		showMessageDialog(this.genericContent);
	}

	public logEventAction() {
		this.eventCounter++;
		logEvent('Login', [
			{
				key: 'counter',
				value: this.eventCounter
			}
		]);
	}
}
