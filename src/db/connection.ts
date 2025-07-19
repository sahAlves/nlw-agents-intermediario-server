import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../env.ts';
import { schema } from './schema/index.ts';

// Cria a conexão com o banco PostgreSQL usando a URL da variável de ambiente
export const sql = postgres(env.DATABASE_URL);
// Cria a instância principal do banco com suporte ao Drizzle ORM
// - Passa o schema para permitir autocomplete e validação
// - Define que os nomes das colunas devem usar snake_case (ex: created_at)
export const db = drizzle(sql, {
  schema,
  casing: 'snake_case',
});
