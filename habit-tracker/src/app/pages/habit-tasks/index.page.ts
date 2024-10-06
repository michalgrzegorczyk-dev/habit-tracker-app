import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormsModule, FormControl, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HabitTaskService } from './habit-tasks.service';

@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: 'habit-tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class TasksComponent {
  #habitTasksService = inject(HabitTaskService)
  tasks$ = this.#habitTasksService.getTasks();
  categories = ['Work', 'Personal', 'Shopping', 'Health', 'Education'];
  formGroup = new FormGroup({
    taskDescription: new FormControl('', [Validators.required]),
    taskCategory: new FormControl('Work', [Validators.required])
  });

  addTask() {
    if (this.formGroup.valid) {
      this.#habitTasksService.addTask({
        description: this.formGroup.controls.taskDescription.value ?? '',
        completed: false,
        category: this.formGroup.controls.taskCategory.value ?? ''
      });
    }
  }

  removeTask(id: number) {
    this.#habitTasksService.removeTask(id);
  }
}
