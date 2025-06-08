import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { PokemonService } from '../../core/services/pokemon.service';
import { Pokemon, PokemonListItem } from '../../core/models/pokemon.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { TypeBadgeComponent } from '../../shared/components/type-badge/type-badge.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    LoadingSpinnerComponent,
    TypeBadgeComponent,
    SearchBarComponent,
    PaginationComponent
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-center mb-8 text-pokemon-red">Pokédex</h1>
      
      <app-search-bar (searchSubmitted)="searchPokemon($event)"></app-search-bar>
      
      <div class="flex flex-wrap gap-4 justify-center my-6">
        <button 
          *ngFor="let type of pokemonTypes" 
          (click)="filterByType(type)"
          [class.ring-2]="selectedType === type"
          [class.ring-black]="selectedType === type"
          class="type-badge type-{{ type }} capitalize"
        >
          {{ getTypeTranslation(type) }}
        </button>
        <button 
          *ngIf="selectedType" 
          (click)="clearTypeFilter()"
          class="type-badge bg-gray-200 text-gray-800"
        >
          Limpar Filtro
        </button>
      </div>
      
      <ng-container *ngIf="isLoading">
        <app-loading-spinner></app-loading-spinner>
      </ng-container>
      
      <ng-container *ngIf="error">
        <div class="text-center py-8">
          <p class="text-red-500">{{ error }}</p>
          <button (click)="loadPokemons()" class="btn btn-primary mt-4">Tentar Novamente</button>
        </div>
      </ng-container>
      
      <div *ngIf="!isLoading && !error" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <div *ngFor="let pokemon of pokemons" class="pokemon-card">
          <a [routerLink]="['/pokemon', pokemon.id]" class="block">
            <div class="p-4 text-center">
              <img 
                [src]="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default" 
                [alt]="pokemon.name"
                class="w-32 h-32 mx-auto transition-transform hover:scale-110"
              />
              <h2 class="text-lg font-semibold mt-2 capitalize">{{ pokemon.name }}</h2>
              <p class="text-gray-500">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
              
              <div class="flex justify-center gap-2 mt-2">
                <app-type-badge 
                  *ngFor="let type of pokemon.types" 
                  [type]="type.type.name"
                ></app-type-badge>
              </div>
            </div>
          </a>
        </div>
      </div>
      
      <app-pagination 
        *ngIf="!isLoading && !error && !selectedType && !searchMode"
        [currentPage]="currentPage"
        [totalPages]="totalPages"
        (pageChanged)="onPageChange($event)"
      ></app-pagination>
    </div>
  `
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];
  isLoading: boolean = true;
  error: string = '';
  currentPage: number = 1;
  pageSize: number = 20;
  totalPokemons: number = 0;
  totalPages: number = 0;
  selectedType: string = '';
  searchMode: boolean = false;
  
  pokemonTypes: string[] = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice', 
    'fighting', 'poison', 'ground', 'flying', 'psychic', 
    'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  typeTranslations: { [key: string]: string } = {
    'normal': 'Normal',
    'fire': 'Fogo',
    'water': 'Água',
    'electric': 'Elétrico',
    'grass': 'Planta',
    'ice': 'Gelo',
    'fighting': 'Lutador',
    'poison': 'Veneno',
    'ground': 'Terra',
    'flying': 'Voador',
    'psychic': 'Psíquico',
    'bug': 'Inseto',
    'rock': 'Pedra',
    'ghost': 'Fantasma',
    'dragon': 'Dragão',
    'dark': 'Sombrio',
    'steel': 'Aço',
    'fairy': 'Fada'
  };

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemons();
  }

  getTypeTranslation(type: string): string {
    return this.typeTranslations[type] || type;
  }

  loadPokemons(): void {
    this.isLoading = true;
    this.error = '';
    this.searchMode = false;
    this.selectedType = '';
    
    const offset = (this.currentPage - 1) * this.pageSize;
    
    this.pokemonService.getPokemonList(this.pageSize, offset).subscribe({
      next: (data) => {
        this.totalPokemons = data.count;
        this.totalPages = Math.ceil(data.count / this.pageSize);
        
        const requests = data.results.map((pokemon: PokemonListItem) => {
          return this.pokemonService.getPokemonByNameOrId(pokemon.name);
        });
        
        forkJoin(requests).subscribe({
          next: (results) => {
            this.pokemons = results.filter(p => p !== undefined) as Pokemon[];
            this.isLoading = false;
          },
          error: (error) => {
            this.error = 'Falha ao carregar dados dos Pokémon';
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        this.error = 'Falha ao carregar lista de Pokémon';
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPokemons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  filterByType(type: string): void {
    this.isLoading = true;
    this.error = '';
    this.selectedType = type;
    this.searchMode = true;
    
    this.pokemonService.getPokemonsByType(type).subscribe({
      next: (pokemons) => {
        this.pokemons = pokemons;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = `Falha ao carregar Pokémon do tipo ${this.getTypeTranslation(type)}`;
        this.isLoading = false;
      }
    });
  }

  clearTypeFilter(): void {
    this.selectedType = '';
    this.loadPokemons();
  }

  searchPokemon(query: string): void {
    this.isLoading = true;
    this.error = '';
    this.searchMode = true;
    
    this.pokemonService.searchPokemon(query).subscribe({
      next: (pokemons) => {
        this.pokemons = pokemons;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = `Nenhum Pokémon encontrado com "${query}"`;
        this.pokemons = [];
        this.isLoading = false;
      }
    });
  }
}