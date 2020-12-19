import { Application } from '@nativescript/core';
import { init, initAnalytics } from 'nativescript-facebook';

Application.on(Application.launchEvent, args => {
	init('1771472059772879');
	initAnalytics();
});

Application.run({ moduleName: 'app-root' });
