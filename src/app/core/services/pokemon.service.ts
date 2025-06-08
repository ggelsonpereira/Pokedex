import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { 
  Pokemon, 
  PokemonList, 
  PokemonSpecies, 
  EvolutionChain,
  PokemonTypeResponse
} from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  getPokemonList(limit = 20, offset = 0): Observable<PokemonList> {
    return this.http.get<PokemonList>(`${this.apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
  }

  getPokemonByNameOrId(nameOrId: string): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/pokemon/${nameOrId.toLowerCase()}`);
  }

  getPokemonDetails(nameOrId: string): Observable<{
    pokemon: Pokemon;
    species: PokemonSpecies;
    evolutionChain: EvolutionChain;
  }> {
    return this.getPokemonByNameOrId(nameOrId).pipe(
      switchMap(pokemon => {
        const speciesId = pokemon.species.url.split('/').filter(Boolean).pop();
        return this.http.get<PokemonSpecies>(`${this.apiUrl}/pokemon-species/${speciesId}`).pipe(
          switchMap(species => {
            const evolutionChainId = species.evolution_chain.url.split('/').filter(Boolean).pop();
            return this.http.get<EvolutionChain>(`${this.apiUrl}/evolution-chain/${evolutionChainId}`).pipe(
              map(evolutionChain => ({
                pokemon,
                species,
                evolutionChain
              }))
            );
          })
        );
      })
    );
  }

  getPokemonsByType(type: string): Observable<Pokemon[]> {
    return this.http.get<PokemonTypeResponse>(`${this.apiUrl}/type/${type}`).pipe(
      switchMap(response => {
        const requests = response.pokemon
          .slice(0, 20) // Limit to 20 Pokemon for performance
          .map(entry => this.getPokemonByNameOrId(entry.pokemon.name));
        
        return forkJoin(requests);
      })
    );
  }

  searchPokemon(query: string): Observable<Pokemon[]> {
    // First try to get exact match
    return this.getPokemonByNameOrId(query).pipe(
      map(pokemon => [pokemon]),
      // If no exact match, return empty array (can be enhanced with fuzzy search)
      // Currently relies on error handling in components
    );
  }

  getEnglishFlavorText(species: PokemonSpecies): string {
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    
    return englishEntry 
      ? englishEntry.flavor_text.replace(/\f/g, ' ') 
      : 'No description available.';
  }
}