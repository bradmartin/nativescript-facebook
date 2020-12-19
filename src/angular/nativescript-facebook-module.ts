import { NgModule } from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { DIRECTIVES } from './nativescript-facebook-directives';

@NgModule({
	declarations: [DIRECTIVES],
	exports: [DIRECTIVES]
})
export class NativeScriptFacebookModule {}

registerElement('FacebookLoginButton', () => require('../').LoginButton);
registerElement('FacebookShareButton', () => require('../').ShareButton);
registerElement('FacebookSendButton', () => require('../').SendButton);
