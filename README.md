# Angular Pokédex

Uma aplicação web moderna que simula uma Pokédex, desenvolvida com Angular e integrada com a PokeAPI.

## 🚀 Características

- Lista de Pokémon com paginação
- Pesquisa por nome ou ID
- Filtragem por tipo de Pokémon
- Visualização detalhada de cada Pokémon
- Cadeia de evolução
- Estatísticas base
- Interface responsiva
- Design moderno com Tailwind CSS

## 🛠️ Tecnologias Utilizadas

- Angular 19.2.0
- TypeScript
- RxJS
- Tailwind CSS
- PokeAPI

## 📋 Pré-requisitos

- Node.js (versão LTS recomendada)
- npm (gerenciador de pacotes do Node.js)

## ⚙️ Instalação

1. Clone o repositório
```sh
git clone https://github.com/seu-usuario/Pokedex.git
```

2. Entre no diretório do projeto
```sh
cd Pokedex
```

3. Instale as dependências
```sh
npm install
```

4. Inicie o servidor de desenvolvimento
```sh
npm run dev
```

A aplicação estará disponível em `http://localhost:4200`

## 🔨 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run dev` - Alias para `npm start`
- `npm run build` - Cria a versão de produção do projeto

## 🎨 Estrutura do Projeto

```
src/
├── app/
│   ├── core/            # Serviços e modelos principais
│   ├── features/        # Componentes principais (páginas)
│   └── shared/         # Componentes compartilhados
├── assets/            # Recursos estáticos
└── global_styles.css  # Estilos globais com Tailwind
```

## 🌟 Funcionalidades Principais

### Lista de Pokémon
- Visualização em grid
- Paginação
- Pesquisa por nome/ID
- Filtragem por tipo

### Detalhes do Pokémon
- Informações básicas
- Estatísticas
- Cadeia de evolução
- Tipos
- Habilidades

## 🤝 Contribuindo

1. Faça um Fork do projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT.

## 👏 Agradecimentos

- [PokeAPI](https://pokeapi.co/) por fornecer a API gratuita
- [Tailwind CSS](https://tailwindcss.com/) pelo framework de CSS
- [Angular Team](https://angular.io/) pelo excelente framework