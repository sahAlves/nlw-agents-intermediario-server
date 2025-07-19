import { and, eq, sql } from 'drizzle-orm';
import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';
import { generateAnswer, generateEmbeddings } from '../../services/gemini.ts';

// Define uma nova rota POST que cria uma pergunta
export const createQuestionRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/questions',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
        body: z.object({
          question: z.string().min(1),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      const { question } = request.body;

      // Gera os embeddings (vetor numérico) da pergunta usando IA
      const embeddings = await generateEmbeddings(question);

      // Converte o vetor para string no formato: [0.123, -0.456, ...]
      const embeddingsAsString = `[${embeddings.join(',')}]`;

      // Busca os 3 trechos de áudio mais parecidos com a pergunta (semântica)
      const chunks = await db
        .select({
          id: schema.audioChunks.id,
          transcription: schema.audioChunks.transcription,
          // Calcula a similaridade (1 - distância vetorial)
          similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
        })
        .from(schema.audioChunks)
        .where(
          and(
            // Filtra pela sala
            eq(schema.audioChunks.roomId, roomId),
            // Só pega os trechos com similaridade maior que 0.7
            sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.7` //<=>
          )
        )
        // Ordena por maior similaridade (os mais relevantes primeiro)
        .orderBy(
          sql`${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector`
        )
        .limit(3); // Limita aos 3 mais similares

      let answer: string | null = null;

      // Se encontrou algum trecho semelhante...
      if (chunks.length > 0) {
        // Pega as transcrições dos trechos encontrados
        const transcriptions = chunks.map((chunk) => chunk.transcription);

        // Gera uma resposta com base na pergunta e nas transcrições
        answer = await generateAnswer(question, transcriptions);
      }

      // Insere a nova pergunta no banco (com ou sem resposta)
      const result = await db
        .insert(schema.questions)
        .values({
          roomId,
          question,
          answer,
        })
        .returning();

      const insertedQuestion = result[0];

      // Se por algum motivo não salvou, lança erro
      if (!insertedQuestion) {
        throw new Error('Failed to create new room');
      }

      // Retorna status 201 (criado) com o ID da pergunta e a resposta gerada
      return reply
        .status(201)
        .send({ questionId: insertedQuestion.id, answer });
    }
  );
};
