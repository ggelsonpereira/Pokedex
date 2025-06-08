import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="relative max-w-md mx-auto my-4">
      <input
        type="text"
        [(ngModel)]="searchQuery"
        (keyup.enter)="search()"
        placeholder="Buscar Pokémon por nome ou ID..."
        class="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pokemon-red"
      />
      <button
        (click)="search()"
        class="absolute right-2 top-1/2 -translate-y-1/2 bg-pokemon-red text-white p-2 rounded-full hover:bg-red-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  `
})
export class SearchBarComponent {
  @Output() searchSubmitted = new EventEmitter<string>();
  searchQuery: string = '';

  search(): void {
    if (this.searchQuery.trim()) {
      this.searchSubmitted.emit(this.searchQuery.trim());
    }
  }
}