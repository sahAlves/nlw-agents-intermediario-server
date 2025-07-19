# 🚀 Let me Ask - Server/API

Bem-vindo ao backend do **Let me Ask**, desenvolvido durante a trilha intermediária do evento **NLW Agents** da Rocketseat!  
Esta API permite criar salas, enviar perguntas e consultar respostas em tempo real — tudo com o apoio de um agente de I.A. que torna a interação muito mais dinâmica.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js** & **TypeScript** — Backend moderno e tipado
- **Fastify** — Framework web rápido e eficiente
- **Zod** — Validação de dados e variáveis de ambiente
- **Drizzle ORM** — ORM para PostgreSQL
- **Drizzle Seed** — Seed de banco de dados
- **PostgreSQL** + **pgvector** — Banco relacional com extensão para IA
- **Docker** — Containerização para facilitar deploy e desenvolvimento
- **Biome** — Ferramenta para lint e formatação de código
- **Google Gemini** — API de IA para transcrição, embeddings e respostas inteligentes


---

## 🔧 Funcionalidades principais

1. **Criar sala** (`POST /rooms`)
   - Cria uma nova sala para receber perguntas e áudios

2. **Receber áudio de sala** (`POST /rooms/:roomId/audio`)
   - Faz upload de trechos de áudio
   - Transcreve o áudio para português
   - Gera embeddings e armazena no banco

3. **Criar pergunta em sala** (`POST /rooms/:roomId/questions`)
   - Recebe pergunta do usuário
   - Gera embeddings da pergunta
   - Busca trechos com maior similaridade semântica (> 0.7)
   - Gera resposta com base no contexto encontrado
   - Salva pergunta e resposta no banco

4. **Listar perguntas da sala** (`GET /rooms/:roomId/questions`)
   - Retorna todas as perguntas e respostas da sala especificada


---

## ⚡ Como rodar o projeto

1. **Clone o repositório**
   ```sh
   git clone https://github.com/sahAlves/nlw-agents-intermediario-server.git
   cd nlw-agents-intermediario-server
   ```

2. **Instale as dependências**
   ```sh
   npm install
   ```

3. **Configure o ambiente**
   - Copie o arquivo `.env.example` para `.env` e ajuste as variáveis se necessário.

4. **Suba o banco de dados com Docker**
   ```sh
   docker compose up -d
   ```

   - Para parar os containers:
     ```sh
     docker-compose down
     ```
   - Para visualizar os logs do banco:
     ```sh
     docker-compose logs -f
     ```
   - Para reiniciar os containers:
     ```sh
     docker-compose restart
     ```

5. **Comandos de banco de dados**
   
   - Gerar tipos a partir do banco:
     ```sh
     npm run db:generate
     ```
   - Rodar as migrations:
     ```sh
     npm run db:migrate
     ```
   - Rodar o seed:
     ```sh
     npm run db:seed
     ```

6. **Inicie o servidor**
   ```sh
   npm run dev
   ```

7. **Acesse a API:**  
   [http://localhost:3333](http://localhost:3333)

---

## 💡 Dicas

- O backend espera que o banco de dados PostgreSQL esteja rodando localmente na porta 5432, conforme configurado no `docker-compose.yml`.
- Teste as rotas rapidamente usando o arquivo [`client.http`](client.http).

---

Projeto desenvolvido durante o **NLW Agents** da Rocketseat.