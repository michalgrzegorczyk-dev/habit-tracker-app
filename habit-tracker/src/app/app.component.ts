import { Component } from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';
import {HlmButtonDirective} from "@spartan-ng/ui-button-helm";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HlmButtonDirective],
  template: `

    <div class="flex justify-center gap-4 pt-8">
        <button hlmBtn variant='link' routerLink="habit-tracker">Habit Tracker</button>
        <button hlmBtn variant='link' routerLink="predefined-habits">Habit Collections</button>
        <button hlmBtn variant='link' routerLink="habit-tasks">Single Habit</button>
        <button hlmBtn variant='link' routerLink="help">Help</button>
    </div>

    <router-outlet></router-outlet>

  `,
})
export class AppComponent {}
