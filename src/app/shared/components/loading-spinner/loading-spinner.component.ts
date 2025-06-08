import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="flex justify-center items-center p-8">
      <div class="pokeball-loading">
        <span></span>
      </div>
    </div>
  `
})
export class LoadingSpinnerComponent {}