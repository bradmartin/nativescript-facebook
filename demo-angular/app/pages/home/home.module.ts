import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptRouterModule } from '@nativescript/angular';
import { HomeComponent } from './home.component';


export const routerConfig = [
	{
		path: '',
		component: HomeComponent
	}
];

@NgModule({
	imports: [
		NativeScriptRouterModule,
		NativeScriptRouterModule.forChild(routerConfig),
		CommonModule
	],
	declarations: [HomeComponent],
	schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule {}
