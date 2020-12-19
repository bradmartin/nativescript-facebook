import { AndroidApplication, Application, Utils } from '@nativescript/core';
import { FacebookAccessToken } from './facebook-access-token';
import { LoginResponse } from './login-response';

const LOGIN_PERMISSIONS = ['public_profile', 'email'];

export let onLoginCallback; // HACK: prevent compile error with angular + webpack
export let onLogoutCallback;
let loginManager;

export function _registerLogoutCallback(callback: Function) {
	onLogoutCallback = callback;
}

export function init(fbId: string) {
	setAppId(fbId);
	try {
		// fb initialization
		com.facebook.FacebookSdk.sdkInitialize(
			Utils.android.getApplicationContext()
		);
		com.facebook.FacebookSdk.setAutoLogAppEventsEnabled(true);
	} catch (e) {
		console.log(e);
	}
	loginManager = com.facebook.login.LoginManager.getInstance();

	// Workaround for firing the logout event in android:
	// https://stackoverflow.com/questions/30233284/how-to-add-a-logout-callback-for-facebook-sdk-in-android
	const LogoutAccessTokenTracker = (com.facebook
		.AccessTokenTracker as any).extend({
		onCurrentAccessTokenChanged: function (oldToken, newToken) {
			if (oldToken != null && newToken == null && onLogoutCallback) {
				onLogoutCallback();
			}
		}
	});
	const accessTokenTracker = new LogoutAccessTokenTracker();
	accessTokenTracker.startTracking();
}

export function _registerLoginCallback(callback: Function) {
	const onLoginCallback = com.facebook.CallbackManager.Factory.create();
	loginManager.registerCallback(
		onLoginCallback,
		new com.facebook.FacebookCallback<any>({
			onSuccess: result => {
				const token = result.getAccessToken().getToken();
				const loginResponse = new LoginResponse(token);
				callback(null, loginResponse);
			},
			onCancel: () => {
				callback(new Error('canceled'));
			},
			onError: e => {
				let errorMessage = 'Error with Facebook';
				if (e['getErrorMessage']) {
					errorMessage += ': ' + e['getErrorMessage']();
				} else if (e['getErrorCode']) {
					errorMessage += ': Code ' + e['getErrorCode']();
				} else {
					errorMessage += ': ' + e;
				}
				callback(new Error(errorMessage));
			}
		})
	);

	const onActivityResult = args => {
		if (
			onLoginCallback.onActivityResult(
				args.requestCode,
				args.resultCode,
				args.intent
			)
		) {
			unsubscribe();
		}
	};

	const unsubscribe = () => {
		Application.android.off(
			AndroidApplication.activityResultEvent,
			onActivityResult
		);
	};

	Application.android.on(
		AndroidApplication.activityResultEvent,
		onActivityResult
	);
}

function setAppId(fbAppId: string) {
	com.facebook.FacebookSdk.setApplicationId(fbAppId);
}

export function requestPublishPermissions(
	permissions: string[],
	callback: Function
) {
	_registerLoginCallback(callback);

	const javaPermissionsList = java.util.Arrays.asList(permissions);
	loginManager.logInWithPublishPermissions(
		Application.android.startActivity || Application.android.foregroundActivity,
		javaPermissionsList
	);
}

export function requestReadPermissions(
	permissions: string[],
	callback: Function
) {
	_registerLoginCallback(callback);

	const javaPermissionsList = java.util.Arrays.asList(permissions);
	loginManager.logInWithReadPermissions(
		Application.android.startActivity || Application.android.foregroundActivity,
		javaPermissionsList
	);
}

export function login(callback: Function) {
	requestReadPermissions(LOGIN_PERMISSIONS, callback);
}

export function getCurrentAccessToken() {
	const sdkAccessToken = com.facebook.AccessToken.getCurrentAccessToken();
	let accessToken = null;

	if (sdkAccessToken) {
		accessToken = new FacebookAccessToken();
		accessToken.accessToken = sdkAccessToken.getToken();
		accessToken.userId = sdkAccessToken.getUserId();
		accessToken.expirationDate = convertToISOStringDate(
			sdkAccessToken.getExpires().getTime()
		);
		accessToken.refreshDate = convertToISOStringDate(
			sdkAccessToken.getLastRefresh().getTime()
		);
	}

	return accessToken;
}

export function logout(callback: Function) {
	loginManager.logOut();
	if (callback) {
		callback();
	}
}

function convertToISOStringDate(time: number) {
	if (time != null && !isNaN(time) && isFinite(time)) {
		return new Date(time).toISOString();
	} else {
		return '';
	}
}
