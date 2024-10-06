import { Component } from '@angular/core';
import HabitTrackerComponent from './habit-tracker/index.page';


@Component({
  selector: 'habit-tracker-home',
  standalone: true,
  imports: [HabitTrackerComponent],
  template: `<app-habits></app-habits>`,
})
export default class HomeComponent {
}
