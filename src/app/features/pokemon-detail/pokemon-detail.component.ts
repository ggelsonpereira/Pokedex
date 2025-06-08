import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { PokemonService } from '../../core/services/pokemon.service';
import { Pokemon, PokemonSpecies, EvolutionChain, ChainLink } from '../../core/models/pokemon.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { TypeBadgeComponent } from '../../shared/components/type-badge/type-badge.component';

interface EvolutionData {
  name: string;
  id: number;
  image: string;
}

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    LoadingSpinnerComponent,
    TypeBadgeComponent
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <button 
        (click)="goBack()" 
        class="btn bg-gray-200 hover:bg-gray-300 mb-4 flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Voltar
      </button>
      
      <ng-container *ngIf="isLoading">
        <app-loading-spinner></app-loading-spinner>
      </ng-container>
      
      <ng-container *ngIf="error">
        <div class="text-center py-8">
          <p class="text-red-500">{{ error }}</p>
          <button (click)="loadPokemon()" class="btn btn-primary mt-4">Tentar Novamente</button>
        </div>
      </ng-container>
      
      <ng-container *ngIf="!isLoading && !error && pokemon">
        <!-- Cabeçalho do Pokémon -->
        <div class="bg-gradient-to-br from-pokemon-red to-red-700 text-white rounded-t-lg p-6 shadow-lg">
          <div class="flex flex-col md:flex-row items-center">
            <div class="md:w-1/3 flex justify-center">
              <img 
                [src]="pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default" 
                [alt]="pokemon.name"
                class="w-48 h-48 object-contain animate-pulse"
              />
            </div>
            <div class="md:w-2/3 text-center md:text-left mt-4 md:mt-0">
              <p class="text-xl font-light opacity-80">#{{ pokemon.id.toString().padStart(3, '0') }}</p>
              <h1 class="text-4xl font-bold capitalize mb-2">{{ pokemon.name }}</h1>
              
              <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <app-type-badge 
                  *ngFor="let type of pokemon.types" 
                  [type]="type.type.name"
                ></app-type-badge>
              </div>
              
              <p class="mt-4 italic">{{ description }}</p>
            </div>
          </div>
        </div>
        
        <!-- Detalhes do Pokémon -->
        <div class="bg-white rounded-b-lg p-6 shadow-lg">
          <!-- Atributos Físicos -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-gray-500 text-sm">Altura</p>
              <p class="font-semibold">{{ (pokemon.height / 10) | number:'1.1-1' }} m</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-gray-500 text-sm">Peso</p>
              <p class="font-semibold">{{ (pokemon.weight / 10) | number:'1.1-1' }} kg</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-gray-500 text-sm">Exp. Base</p>
              <p class="font-semibold">{{ pokemon.base_experience || 'Desconhecido' }}</p>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <p class="text-gray-500 text-sm">Espécie</p>
              <p class="font-semibold capitalize">{{ pokemon.species.name }}</p>
            </div>
          </div>
          
          <!-- Habilidades -->
          <div class="mb-8">
            <h2 class="text-2xl font-semibold mb-4">Habilidades</h2>
            <div class="flex flex-wrap gap-2">
              <span 
                *ngFor="let ability of pokemon.abilities"
                class="px-3 py-1 bg-gray-100 rounded-full text-sm capitalize"
                [class.font-semibold]="!ability.is_hidden"
                [class.opacity-75]="ability.is_hidden"
              >
                {{ ability.ability.name }}
                <span *ngIf="ability.is_hidden" class="text-xs ml-1">(Oculta)</span>
              </span>
            </div>
          </div>
          
          <!-- Estatísticas -->
          <div class="mb-8">
            <h2 class="text-2xl font-semibold mb-4">Estatísticas Base</h2>
            <div class="space-y-3">
              <div *ngFor="let stat of pokemon.stats" class="grid grid-cols-8 items-center gap-2">
                <div class="col-span-2 text-right pr-2 capitalize">
                  <span [title]="stat.stat.name">
                    {{ getShortenedStatName(stat.stat.name) }}
                  </span>
                </div>
                <div class="col-span-1 text-right">{{ stat.base_stat }}</div>
                <div class="col-span-5">
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      class="pokemon-stat-bar" 
                      [style.width.%]="getStatPercentage(stat.base_stat)"
                      [ngClass]="{
                        'bg-red-500': stat.base_stat < 50,
                        'bg-yellow-500': stat.base_stat >= 50 && stat.base_stat < 80,
                        'bg-green-500': stat.base_stat >= 80
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Cadeia de Evolução -->
          <div *ngIf="evolutions.length > 0">
            <h2 class="text-2xl font-semibold mb-4">Cadeia de Evolução</h2>
            <div class="flex flex-wrap justify-center gap-4">
              <div 
                *ngFor="let evolution of evolutions; let i = index" 
                class="flex flex-col items-center"
              >
                <!-- Seta entre evoluções -->
                <div *ngIf="i > 0" class="hidden md:flex items-center justify-center h-20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                
                <!-- Cartão de Evolução -->
                <a 
                  [routerLink]="['/pokemon', evolution.id]" 
                  class="pokemon-card p-4 text-center"
                >
                  <img 
                    [src]="evolution.image" 
                    [alt]="evolution.name"
                    class="w-24 h-24 mx-auto"
                  />
                  <p class="capitalize mt-2">{{ evolution.name }}</p>
                  <p class="text-gray-500 text-sm">#{{ evolution.id.toString().padStart(3, '0') }}</p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class PokemonDetailComponent implements OnInit {
  pokemon?: Pokemon;
  species?: PokemonSpecies;
  evolutionChain?: EvolutionChain;
  isLoading: boolean = true;
  error: string = '';
  description: string = '';
  evolutions: EvolutionData[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadPokemon(id);
      }
    });
  }

  loadPokemon(id?: string): void {
    this.isLoading = true;
    this.error = '';
    
    if (!id) {
      id = this.route.snapshot.paramMap.get('id') || '';
    }
    
    if (!id) {
      this.error = 'ID do Pokémon não fornecido';
      this.isLoading = false;
      return;
    }
    
    this.pokemonService.getPokemonDetails(id).subscribe({
      next: (data) => {
        this.pokemon = data.pokemon;
        this.species = data.species;
        this.evolutionChain = data.evolutionChain;
        
        this.description = this.pokemonService.getEnglishFlavorText(data.species);
        
        this.processEvolutionChain(data.evolutionChain.chain);
        
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Falha ao carregar detalhes do Pokémon';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getShortenedStatName(name: string): string {
    const statMap: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'ATQ',
      'defense': 'DEF',
      'special-attack': 'ATQ.ESP',
      'special-defense': 'DEF.ESP',
      'speed': 'VEL'
    };
    
    return statMap[name] || name;
  }

  getStatPercentage(value: number): number {
    return Math.min(100, (value / 150) * 100);
  }

  processEvolutionChain(chain: ChainLink): void {
    this.evolutions = [];
    
    this.addEvolutionToChain(chain.species);
    
    let currentChain = chain;
    while (currentChain.evolves_to.length > 0) {
      currentChain = currentChain.evolves_to[0];
      this.addEvolutionToChain(currentChain.species);
    }
  }

  addEvolutionToChain(species: { name: string, url: string }): void {
    const id = species.url.split('/').filter(Boolean).pop() || '';
    
    this.pokemonService.getPokemonByNameOrId(id).subscribe(pokemon => {
      this.evolutions.push({
        name: pokemon.name,
        id: pokemon.id,
        image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default
      });
      
      this.evolutions.sort((a, b) => a.id - b.id);
    });
  }
}