import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-type-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="type-badge type-{{ type.toLowerCase() }}">
      {{ type | titlecase }}
    </span>
  `
})
export class TypeBadgeComponent {
  @Input() type: string = '';
}