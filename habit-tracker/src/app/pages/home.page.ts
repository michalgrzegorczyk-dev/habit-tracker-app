import { Component } from '@angular/core';

import { HabitsComponent } from './habits.component';

@Component({
  selector: 'habit-tracker-home',
  standalone: true,
  imports: [HabitsComponent],
  template: `<app-habits></app-habits>`,
})
export default class HomeComponent {
}
