import { EventData } from '@nativescript/core';
import { LoginResponse } from './login-response';

export interface LoginEventData extends EventData {
	error: Error;
	loginResponse: LoginResponse;
}
