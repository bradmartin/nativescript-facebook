import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
    NativeScriptCommonModule,
    NativeScriptRouterModule
} from '@nativescript/angular';
import { LoginComponent } from './login.component';


export const routerConfig = [
	{
		path: '',
		component: LoginComponent
	}
];

@NgModule({
	imports: [
		NativeScriptCommonModule,
		NativeScriptRouterModule,
		NativeScriptRouterModule.forChild(routerConfig)
	],
	declarations: [LoginComponent],
	schemas: [NO_ERRORS_SCHEMA]
})
export class LoginModule {}
