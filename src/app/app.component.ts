import { Component } from '@angular/core';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomeComponent],
  template: '<app-home></app-home>'
})
export class AppComponent {
  title = 'shopapp-angular';
}
