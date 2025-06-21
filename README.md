# API de E-commerce

Esse repositório da nossa API de E-commerce. Este projeto é um backend simples construído com NestJS, projetado para gerenciar produtos, pedidos, usuários e avaliações, além de conectar api externa de produtos outros fornecedores salvando internamente .

## Descrição

Esta API e-commerce fornece os endpoints necessários para operações comprar de produto, adicionar avaliaçõe e gerenciamento de usuários. Ela foi desenvolvida utilizando uma arquitetura modular.

Um dos principais recursos é a sincronização de produtos, que busca dados de APIs de fornecedores externos (um brasileiro e um europeu), mapeia esses dados para um modelo de `Produto` unificado e os persiste no banco de dados. Isso permite que o e-commerce apresente um catálogo diversificado e atualizado.

A autenticação é gerenciada via JWT (JSON Web Tokens), com o recurso guard do próprio nestjs  para que as rotas sejam seguras e acessíveis apenas a usuários autenticados.

## 🚀 Tecnologias Utilizadas e Decisões Técnicas

### Tecnologias Utilizadas

  * **Framework**: [NestJS](https://nestjs.com/)
  * **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
  * **ORM**: [TypeORM](https://typeorm.io/)
  * **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
  * **Autenticação**: [JWT (JSON Web Token)](https://jwt.io/) com [Passport](http://www.passportjs.org/)
  * **Validação**: [class-validator](https://github.com/typestack/class-validator) e [class-transformer](https://github.com/typestack/class-transformer)
  * **Documentação da API**: [Swagger](https://swagger.io/) (via `@nestjs/swagger`)


### NestJS

O NestJS foi escolhido como o framework principal para a construção da API. A decisão de usar o NestJS se baseia em sua arquitetura modular muito semelhante a do Angular, que permite uma organização clara do código em módulos como `ProductsModule`, `OrdersModule`, `ReviewsModule` e `UsersModule` e também por ter uma documentação e muito boa, e com muito exemplos de uso. Essa estrutura facilita a manutenção e construção rapida do projeto.

O NestJS também oferece um sistema de injeção de dependências que simplifica o gerenciamento de serviços e repositórios, como pode ser visto no `OrdersService` e `ReviewsService`. Além disso, a integração com o TypeORM é feita de forma nativa, o que agiliza a configuração da camada de acesso a dados.
 

### TypeORM

Para a camada de persistência de dados, foi escolhido o TypeORM a proprio documentação sugerer uso dele. Esta é uma decisão técnica que permite o mapeamento objeto-relacional (ORM) entre as classes da aplicação e as tabelas do banco de dados. O uso de `decorators` como `@Entity`, `@Column`, e `@PrimaryGeneratedColumn` nas entidades (`Product`, `Order`, `User`, `Review`) simplifica a definição dos modelos de dados e suas relações.

A configuração do TypeORM no `DatabaseModule` permite que a sincronização do schema do banco de dados seja automatizada em ambiente de desenvolvimento, agilizando o processo de desenvolvimento e prototipação. Pensei em utilizar as migrtions no projeto mas quetão de tempo e otimizar as entregas featura seguir utilizando a forma de sicronização. 

### PostgreSQL

O PostgreSQL foi o sistema de gerenciamento de banco de dados escolhido para este projeto pensei em usar o MongoDB, mas acredito que iria fugir do escopo do desafio técnico e seguir com o postgre. A configuração no `data-source.ts` e `database.config.ts` especifica o uso do driver `postgres`. O PostgreSQL é conhecido por sua robustez, escalabilidade e conformidade com os padrões SQL, o que o torna uma escolha sólida para uma aplicação de e-commerce que precisa lidar com transações e um volume crescente de dados.


Para criar um README abrangente e informativo para o seu projeto de e-commerce, analisei a estrutura do código, as dependências e as funcionalidades implementadas. O resultado é um README que não apenas descreve o projeto, mas também orienta os desenvolvedores sobre como configurá-lo, executá-lo e interagir com ele.


## ✨  Funcionalidades

  * **Autenticação de Usuário**: Sistema completo de registro e login de usuários com autenticação baseada em JWT (JSON Web Token).
  * **Gerenciamento de Produtos**:
      * Listagem de produtos com filtros avançados (preço, nome, provedor) e paginação.
      * Visualização de detalhes de um produto específico.
  * **Gerenciamento de Pedidos**:
      * Criação de novos pedidos com validação de estoque e cálculo de total.
      * Listagem de todos os pedidos ou por status (pendente, confirmado, cancelado).
      * Busca de pedidos por usuário.
      * Atualização do status e do método de pagamento de um pedido.
      * Cancelamento de pedidos com devolução de estoque.
  * **Gerenciamento de Avaliações (Reviews)**:
      * Criação de avaliações para produtos, restrita a usuários que compraram o item.
      * Um usuário pode avaliar cada produto apenas uma vez.
      * Listagem, visualização, atualização e exclusão de avaliações.
  * **Sincronização de Produtos**:
      * Um endpoint para acionar a sincronização de produtos de múltiplos provedores (brasileiro e europeu) em segundo plano.
      * Mapeamento de dados de diferentes APIs para um modelo de produto unificado.

## 🏗️ Estrutura do Projeto

O projeto é organizado em módulos, cada um responsável por uma funcionalidade específica:

```
src
├── app.module.ts
├── main.ts
├── common/             # DTOs, interfaces e configurações globais
├── database/           # Configuração de banco de dados e migrações
├── orders/             # Módulo de gerenciamento de pedidos
├── products/           # Módulo de gerenciamento de produtos
├── product-sync/       # Módulo para sincronização de produtos
├── reviews/            # Módulo de gerenciamento de avaliações
└── users/              # Módulo de gerenciamento de usuários e autenticação
```

## Primeiros Passos

Siga as instruções abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

  * [Node.js](https://nodejs.org/en/) (versão \>= 20.11)
  * [npm](https://www.npmjs.com/) (versão \>= 11) ou [Yarn](https://yarnpkg.com/)
  * [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) (recomendado para o banco de dados)

### Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/erikbernard/ecommerce-api.git
    cd ecommerce-api/ecommerce-api
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

### Configuração do Ambiente

1.  **Crie um arquivo de ambiente:**
    Copie o arquivo `.env.example` (se existir) para um novo arquivo chamado `.env` na raiz do projeto.

2.  **Configure as variáveis de ambiente no arquivo `.env`:**
    Você precisará definir as variáveis para a conexão com o banco de dados PostgreSQL e as URLs dos provedores de produtos.

    ```env
    # Configuração da Aplicação
    PORT=3000

    # Configuração do Banco de Dados PostgreSQL
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=seu_usuario
    DB_PASSWORD=sua_senha
    DB_DATABASE=ecommerce_db

    # Chave Secreta para JWT
    JWT_SECRET_KEY=sua_chave_super_secreta

    # URLs dos Provedores de Produtos
    BRAZILIAN_PROVIDER_URL=http://exemplo.com/api/br
    EUROPEAN_PROVIDER_URL=http://exemplo.com/api/eu

    ```

    *É fortemente recomendado o uso do Docker para configurar o banco de dados de forma rápida e consistente.*

## Executando a Aplicação

Para iniciar a aplicação em modo de desenvolvimento com hot-reload:

```bash
npm run start:dev
```

A aplicação estará disponível em `http://localhost:3000`.


## Como Usar a Extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) com este Projeto 

1. Instale a Extensão
2. Abra o Visual Studio Code.
3. Vá para a aba de Extensões (Ctrl+Shift+X).
4. Procure por REST Client (do autor Huachao Mao).
5. Clique em "Instalar".
6. abra o arquivo .rest raiz do projeto

Como Executar as Requisições

1.  **Clique em "Send Request"**: Acima de cada requisição definida (começando com `###`), um link "Send Request" aparecerá.
2.  **Visualize a Resposta**: Ao clicar, a extensão fará a chamada HTTP e exibirá a resposta (cabeçalhos, status e corpo) em uma nova aba ao lado.
3.  **Ordem de Execução**:
      * Execute a requisição **\#1 (Criar um novo usuário)** primeiro.
      * Em seguida, execute a **\#2 (Autenticar usuário)**. A extensão irá capturar automaticamente o `access_token` da resposta e armazená-lo na variável `@authToken`.
      * Agora você pode executar as requisições que precisam de autenticação, como a **\#6 (Criar um novo pedido)**, pois o token será enviado no cabeçalho `Authorization`.




## Visão Geral dos Endpoints da API


Todos os endpoints que necessitam de autenticação são protegidos por um `JwtAuthGuard`.

### Autenticação

  * `POST /user` - Registra um novo usuário.
  * `POST /user/signin` - Realiza o login e retorna um token de acesso JWT.

### Usuários (`/user`)

  * `GET /` - Lista todos os usuários.
  * `GET /:id` - Busca um usuário por ID.
  * `PATCH /:id` - Atualiza os dados de um usuário.
  * `DELETE /:id` - Remove um usuário.

### Produtos (`/products`)

  * `GET /` - Lista produtos com suporte a filtros e paginação.
      * Query Params: `limit`, `offset`, `minPrice`, `maxPrice`, `name`, `provider`, `hasDiscount`, `order`.
  * `GET /:id` - Busca um produto por ID.

### Pedidos (`/orders`)

  * `POST /` - Cria um novo pedido.
  * `GET /` - Lista todos os pedidos.
  * `GET /user/:userId` - Lista os pedidos de um usuário específico.
  * `GET /:id` - Busca um pedido por ID.
  * `PATCH /:id` - Atualiza um pedido.
  * `PATCH /:id/status` - Atualiza o status de um pedido.
  * `DELETE /:id` - Cancela um pedido.

### Avaliações (`/reviews`)

  * `POST /` - Cria uma nova avaliação para um produto.
  * `GET /` - Lista todas as avaliações.
  * `GET /:id` - Busca uma avaliação por ID.
  * `PATCH /:id` - Atualiza uma avaliação.
  * `DELETE /:id` - Remove uma avaliação.

### Sincronização de Produtos (`/product-sync`)

  * `POST /` - Dispara o processo de sincronização de produtos de todos os provedores externos. Retorna uma mensagem de que a sincronização foi iniciada em segundo plano.

-----