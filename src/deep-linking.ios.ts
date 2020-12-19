import { Application } from '@nativescript/core';
import { DeepLink } from './deep-linking.common';

export function initDeepLinking(appId: string) {
	FBSDKSettings.autoInitEnabled = true;
	FBSDKSettings.appID = appId;
}

export function fetchDeferredAppLink(): Promise<DeepLink> {
	return new Promise((resolve, reject) => {
		FBSDKAppLinkUtility.fetchDeferredAppLink((url, error) => {
			if (error) {
				reject(error);
				return;
			}
			if (!url) {
				resolve(null);
				return;
			}
			const deepLink = new DeepLink({ target: url.absoluteString });
			resolve(deepLink);
		});
	});
}

export function registerDeepLinkCallback(callback): void {
	if (Application.ios && Application.ios.delegate) {
		const crtHandler =
			Application.ios.delegate.prototype['applicationOpenURLOptions'];
		Application.ios.delegate.prototype[
			'applicationOpenURLOptions'
		] = function () {
			const args = Array.from(arguments);
			if (crtHandler) {
				const result = crtHandler.apply(this, args);
				args.push(result);
			}
			return callback.apply(this, args);
		};
	}
}
