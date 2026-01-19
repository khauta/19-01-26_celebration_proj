import { bootstrapApplication } from '@angular/platform-browser';
import { GeekyBirthdayComponent } from './app/geeky-birthday/geeky-birthday.component';

bootstrapApplication(GeekyBirthdayComponent)
  .catch(err => console.error(err));
