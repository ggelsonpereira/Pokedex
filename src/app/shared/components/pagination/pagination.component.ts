import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center gap-2 my-6">
      <button 
        [disabled]="currentPage === 1"
        (click)="pageChanged.emit(currentPage - 1)"
        [class.opacity-50]="currentPage === 1"
        class="btn btn-secondary"
      >
        Anterior
      </button>
      
      <span class="px-4 py-2 bg-gray-100 rounded-md">
        {{ currentPage }} de {{ totalPages }}
      </span>
      
      <button 
        [disabled]="currentPage === totalPages"
        (click)="pageChanged.emit(currentPage + 1)"
        [class.opacity-50]="currentPage === totalPages"
        class="btn btn-secondary"
      >
        Próximo
      </button>
    </div>
  `
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChanged = new EventEmitter<number>();
}