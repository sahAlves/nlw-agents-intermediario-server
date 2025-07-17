// zod é uma biblioteca para validação de esquemas de dados
// e é usada aqui para definir e validar as variáveis de ambiente
import { z } from 'zod';

// Definindo um esquema de validação para as variáveis de ambiente
// Neste caso, estamos definindo que a variável PORT deve ser um número
// e terá um valor padrão de 3333 se não for definida
// O método z.coerce.number() converte o valor para um número, se possível
// A variável DATABASE_URL deve ser uma string que representa uma URL válida
// e deve começar com 'postgresql://', indicando que é uma conexão com um banco de dados PostgreSQL
// O método z.string().url() valida que a string é uma URL válida
const envSchema = z.object({
    PORT: z.coerce.number().default(3333),
    DATABASE_URL: z.string().url().startsWith('postgresql://')
})

// Exportando o esquema de validação para ser usado em outros arquivos
// Aqui, estamos usando o método parse para validar as variáveis de ambiente
// Se as variáveis não corresponderem ao esquema, um erro será lançado
// o process.env contém as variáveis de ambiente do Node.js
// o process vem do ambiente de execução do Node.js
// e é uma maneira de acessar as variáveis de ambiente do sistema operacional
export const env = envSchema.parse(process.env)