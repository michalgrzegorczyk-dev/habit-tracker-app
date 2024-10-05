import { Component } from '@angular/core';

import { AnalogWelcomeComponent } from './analog-welcome.component';

@Component({
  selector: 'habit-tracker-home',
  standalone: true,
  imports: [AnalogWelcomeComponent],
  template: `
     <habit-tracker-analog-welcome/>
  `,
})
export default class HomeComponent {
}
