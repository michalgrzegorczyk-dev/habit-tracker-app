import { Component } from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';
import {HlmButtonDirective} from "@spartan-ng/ui-button-helm";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, HlmButtonDirective],
  template: `

    <div class="flex justify-center pt-6">
        <button hlmBtn routerLink="predefined">Predefined Habits</button>
        <button hlmBtn routerLink="tasks">Habit Tasks</button>
    </div>





    <router-outlet></router-outlet> `,
})
export class AppComponent {}
