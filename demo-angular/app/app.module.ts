import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import {
    NativeScriptModule,
    NativeScriptRouterModule
} from '@nativescript/angular';
import { Application } from '@nativescript/core';
import { init, initAnalytics } from 'nativescript-facebook';
import { NativeScriptFacebookModule } from 'nativescript-facebook/angular';
import { AppComponent } from './app.component';
import { routes } from './app.routing';
import { NavigationService } from './services/navigation.service';

Application.on(Application.launchEvent, args => {
	init('1771472059772879');
	initAnalytics();
});

@NgModule({
	bootstrap: [AppComponent],
	imports: [
		NativeScriptModule,
		NativeScriptFacebookModule,
		NativeScriptRouterModule,
		NativeScriptRouterModule.forRoot(routes)
	],
	providers: [NavigationService],
	declarations: [AppComponent],
	schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule {}
