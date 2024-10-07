import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { PredefinedHabitsService, PredefinedHabit, Task } from './predefined-habits.service';
import { HabitTaskService } from '../habit-tasks/habit-tasks.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-predefined-habits',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './predefined-habits.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class PredefinedHabitsComponent implements OnInit {
  #predefinedHabitsService = inject(PredefinedHabitsService);
  #habitTaskService = inject(HabitTaskService);
  predefinedHabits$ = this.#predefinedHabitsService.getPredefinedHabits();
  availableTasks$: Observable<Task[]>;

  formGroup = new FormGroup({
    habitName: new FormControl('', [Validators.required]),
    selectedTasks: new FormArray([])
  });

  ngOnInit() {
    this.availableTasks$ = this.#habitTaskService.getTasks();
    this.initializeFormControls();
  }

  initializeFormControls() {
    this.availableTasks$.pipe(
      map(tasks => tasks.map(() => new FormControl(false)))
    ).subscribe(controls => {
      this.formGroup.setControl('selectedTasks', new FormArray(controls));
    });
  }

  get selectedTasksControls() {
    return (this.formGroup.get('selectedTasks') as FormArray).controls;
  }

  saveNewHabit() {
    if (this.formGroup.valid) {
      const selectedTasksValue = this.formGroup.get('selectedTasks')?.value;
      if (!selectedTasksValue) {
        return;
      }

      this.availableTasks$.subscribe(tasks => {
        const selectedTasks = tasks.filter((_, index) => selectedTasksValue[index]);

        if (selectedTasks.length > 0) {
          const newHabit: Omit<PredefinedHabit, 'id'> = {
            name: this.formGroup.value.habitName ?? '',
            tasks: selectedTasks
          };
          this.#predefinedHabitsService.addPredefinedHabit(newHabit);
          this.formGroup.reset();
          this.initializeFormControls(); // Reset the form controls after submission
        }
      });
    }
  }

  deletePredefinedHabit(id: number) {
    this.#predefinedHabitsService.removePredefinedHabit(id);
  }
}
