# Let me Ask - Server/API

Este é o backend (API) do projeto **Let me Ask**, desenvolvido durante o evento **NLW Agents** da Rocketseat.

## Tecnologias e Bibliotecas Utilizadas

- **Node.js** (runtime)
- **TypeScript** (tipagem estática)
- **Fastify** (framework web para Node.js)
- **Zod** (validação de esquemas e variáveis de ambiente)
- **drizzle-orm** (ORM para PostgreSQL)
- **drizzle-seed** (seed de banco de dados)
- **PostgreSQL** (banco de dados relacional)
- **pgvector** (extensão para vetores no PostgreSQL)
- **@fastify/cors** (CORS para Fastify)

## Padrões de Projeto

- **Type-safe API**: Uso de Zod para validação de dados e tipos nas rotas.
- **Barrel Files**: Organização dos schemas do banco de dados.
- **Separation of Concerns**: Separação clara entre rotas, conexão com banco e validação de ambiente.

## Setup e Configuração

### 1. Clone o repositório

```sh
git clone <url-do-repo>
cd server
npm install
```

### 2. Configure o ambiente

Copie o arquivo `.env.example` para `.env` e ajuste as variáveis conforme necessário.

### 3. Suba o banco de dados com Docker

```sh
docker-compose up -d
```

### 4. Rode as migrations e o seed

```sh
npm run db:seed
```

### 5. Inicie o servidor

```sh
npm run dev
```

A API estará disponível em `http://localhost:3333`.

---

Projeto desenvolvido durante o **NLW Agents**