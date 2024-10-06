import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { injectTrpcClient } from "../../../trpc-client";

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="container mx-auto px-4 py-8">
      <header class="text-center mb-12">
        <h1 class="font-heading font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4">
          <span class="text-[#DD0031]">Add New</span> Habit
        </h1>
      </header>

      <section class="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <form #f="ngForm" (ngSubmit)="addHabit(f)" class="space-y-4">
          <div>
            <input
              required
              autocomplete="off"
              name="newHabit"
              [(ngModel)]="newHabit"
              placeholder="Enter a new habit"
              class="w-full px-4 py-2 rounded-md border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-[#DD0031] focus:border-transparent transition"
            />
          </div>
          <button
            type="submit"
            class="w-full px-4 py-2 bg-[#DD0031] text-white rounded-md hover:bg-[#BB0029] transition-colors focus:outline-none focus:ring-2 focus:ring-[#DD0031] focus:ring-offset-2"
          >
            Add Habit
          </button>
        </form>
      </section>

      <div class="text-center">
        <button (click)="navigateToList()" class="px-6 py-3 bg-zinc-200 text-zinc-800 rounded-md hover:bg-zinc-300 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-300 focus:ring-offset-2">
          Back to Habit List
        </button>
      </div>
    </main>
  `,
})
export default class AddHabitComponent {
  private _trpc = injectTrpcClient();
  public newHabit = '';

  constructor(private router: Router) {}

  addHabit(form: NgForm) {
    if (!form.valid) {
      form.form.markAllAsTouched();
      return;
    }
    this._trpc.habit.create
      .mutate({ name: this.newHabit, tasks: [] })
      .subscribe(() => {
        this.newHabit = '';
        form.form.reset();
        this.navigateToList();
      });
  }

  navigateToList() {
    this.router.navigate(['/']);
  }
}
