import { AndroidApplication, Application, Utils } from '@nativescript/core';
import { DeepLink } from './deep-linking.common';

export function initDeepLinking(appId: string) {
	com.facebook.FacebookSdk.setApplicationId(appId);
	try {
		// fb initialization
		com.facebook.FacebookSdk.sdkInitialize(
			Utils.android.getApplicationContext()
		);
		com.facebook.FacebookSdk.setAutoLogAppEventsEnabled(true);
	} catch (e) {
		console.log(e);
	}
}

export function fetchDeferredAppLink(): Promise<DeepLink> {
	return new Promise((resolve, reject) => {
		try {
			com.facebook.applinks.AppLinkData.fetchDeferredAppLinkData(
				Utils.android.getApplicationContext(),
				new com.facebook.applinks.AppLinkData.CompletionHandler({
					onDeferredAppLinkDataFetched: function (appLinkData) {
						// Process app link data
						if (!appLinkData) {
							resolve(null);
							return;
						}
						const targetUri = appLinkData.getTargetUri();
						let target = null;
						if (targetUri) target = targetUri.toString();
						const deepLink = new DeepLink({
							target: target,
							ref: appLinkData.getRef(),
							promoCode: appLinkData.getPromotionCode()
						});
						resolve(deepLink);
					}
				})
			);
		} catch (e) {
			reject(e);
		}
	});
}

export function registerDeepLinkCallback(callback): void {
	Application.android.on(AndroidApplication.activityNewIntentEvent, args => {
		const intent = args.activity.getIntent() as android.content.Intent;
		try {
			const data = intent.getData();
			let url = null;
			if (data) {
				url = data.toString();
			}
			if (url == null) {
				const appLink = com.facebook.applinks.AppLinkData.createFromAlApplinkData(
					intent
				);
				if (!appLink) return;
				url = appLink.getTargetUri();
			}
			if (callback) callback(null, url, null);
		} catch (e) {
			console.error(e);
		}
	});
}
