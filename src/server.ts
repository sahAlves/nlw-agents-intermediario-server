// importa o módulo fastify para criar um servidor web
// fastify é um framework web para Node.js focado em alta performance
// importa o módulo fastify-type-provider-zod para usar Zod como provedor de tipos
// Zod é uma biblioteca para validação de esquemas de dados
// e é usada aqui para definir e validar os tipos de dados das rotas
// importa o módulo @fastify/cors para habilitar CORS (Cross-Origin Resource Sharing)
// CORS é um mecanismo que permite que recursos restritos em uma página da web sejam solicitados de outro domínio
// importa o módulo env.ts para acessar as variáveis de ambiente definidas
import { fastifyCors } from '@fastify/cors';
import { fastify } from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from './env.ts';
import { createQuestionRoute } from './http/routes/create-question.ts';
import { createRoomRoute } from './http/routes/create-room.ts';
import { getRoomQuestions } from './http/routes/get-room-questions.ts';
import { getRoomsRoute } from './http/routes/get-rooms.ts';

// Cria uma instância do servidor Fastify
// O método withTypeProvider<ZodTypeProvider>() é usado para integrar o Zod
// como provedor de tipos, permitindo que as rotas usem esquemas Zod para validação
// Isso melhora a segurança e a confiabilidade do código, garantindo que os dados recebidos
// estejam no formato esperado e que os dados enviados estejam corretos
const app = fastify().withTypeProvider<ZodTypeProvider>();

// Registra o plugin CORS no servidor Fastify
// Isso permite que o servidor aceite requisições de origens diferentes
// O parâmetro origin define quais origens são permitidas para fazer requisições
// Neste caso, estamos permitindo requisições da origem 'http://localhost:5173'
app.register(fastifyCors, {
  origin: 'http://localhost:5173',
});

// Define o compilador de serialização e validação para o Fastify
// O serializerCompiler é usado para serializar os dados de resposta
// O validatorCompiler é usado para validar os dados de entrada das requisições
// Ambos usam os esquemas definidos pelo Zod para garantir que os dados estejam corretos
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// Define uma rota de saúde (health check) no servidor
// Esta rota responde com 'OK' quando acessada, indicando que o servidor está funcionando corretamente
app.get('/health', () => {
  return 'OK';
});

app.register(getRoomsRoute);
app.register(createRoomRoute);
app.register(getRoomQuestions);
app.register(createQuestionRoute);

// Inicia o servidor na porta definida pelas variáveis de ambiente
// A variável PORT é definida no arquivo env.ts e tem um valor padrão de 3333
app.listen({ port: env.PORT });
