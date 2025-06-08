import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div class="text-center">
        <h1 class="text-6xl font-bold text-pokemon-red mb-4">404</h1>
        <div class="pokeball-loading mx-auto mb-6">
          <span></span>
        </div>
        <p class="text-2xl font-semibold mb-2">Pokémon Não Encontrado!</p>
        <p class="text-gray-600 mb-6">Parece que este Pokémon escapou para a grama alta...</p>
        <a routerLink="/" class="btn btn-primary">Voltar para a Pokédex</a>
      </div>
    </div>
  `
})
export class NotFoundComponent {}