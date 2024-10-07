import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-help',
  standalone: true,
  template: `
    <!--    make it center tailwind-->
    <div class="flex justify-center gap-4 pt-20">
      <img src="/images.jpeg" alt="Help" />
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class HelpComponent {}
