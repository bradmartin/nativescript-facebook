import { EventData, View } from '@nativescript/core';
import { LoginEventData } from './../login-event-data';

export declare class LoginButton extends View {
	on(event: 'login', callback: (data: LoginEventData) => void, thisArg?: any);
	on(eventNames: string, callback: (data: EventData) => void, thisArg?: any);
}
