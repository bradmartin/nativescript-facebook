import { Application } from '@nativescript/core';
let iosApplication: UIApplication;

export function initAnalytics() {
	iosApplication = Application.ios.nativeApp;
	FBSDKAppEvents.activateApp();
}

export function logEvent(name: string, parameters?: any) {
	if (name === undefined) {
		throw "Argument 'name' is missing";
	}

	if (parameters === undefined) {
		FBSDKAppEvents.logEvent(name);
	} else {
		const parametersDictionary = new (NSDictionary as any)(
			parameters.map(parameter => parameter.value),
			parameters.map(parameter => parameter.key)
		);

		FBSDKAppEvents.logEventParameters(name, parametersDictionary);
	}
}
