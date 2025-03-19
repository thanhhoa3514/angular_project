import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

import { appConfig } from './app/app.config';



bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('Application started successfully'))
  .catch(err => console.error('Application failed to start:', err));