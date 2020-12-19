import { Application } from '@nativescript/core';
export * from './app-events';
export * from './deep-linking';
export * from './login-event-data';
export * from './login-manager';
export * from './share-manager';
export * from './ui/login-button';
export * from './ui/share-button';

declare interface UIApplicationDelegate {}

// TODO: Extend existing delegate if exists
class BaseDelegate extends UIResponder implements UIApplicationDelegate {
	public static ObjCProtocols = [UIApplicationDelegate];

	applicationDidFinishLaunchingWithOptions(
		application: UIApplication,
		launchOptions: NSDictionary<any, any>
	): boolean {
		return FBSDKApplicationDelegate.sharedInstance.applicationDidFinishLaunchingWithOptions(
			application,
			launchOptions
		);
	}

	applicationOpenURLSourceApplicationAnnotation(
		application,
		url,
		sourceApplication,
		annotation
	) {
		return FBSDKApplicationDelegate.sharedInstance.applicationOpenURLSourceApplicationAnnotation(
			application,
			url,
			sourceApplication,
			annotation
		);
	}

	applicationDidBecomeActive(application: UIApplication): void {
		FBSDKAppEvents.activateApp();
	}
}

if (!Application.ios.delegate) {
	Application.ios.delegate = BaseDelegate;
}
