import { Utils } from '@nativescript/core';
let appEventsLogger;

export function initAnalytics() {
	appEventsLogger = com.facebook.appevents.AppEventsLogger.newLogger(
		Utils.android.getApplicationContext()
	);
}

export function logEvent(name: string, parameters?: any) {
	if (name === undefined) {
		throw "Argument 'name' is missing";
	}

	const bundle = new android.os.Bundle();

	if (parameters !== undefined) {
		for (const p in parameters) {
			const param = parameters[p];
			if (param.value !== undefined) {
				console.dir(param);
				bundle.putString(param.key, param.value);
			}
		}
	}
	appEventsLogger.logEvent(name, bundle);
}
