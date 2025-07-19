import type { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';
import { db } from '../../db/connection.ts';
import { schema } from '../../db/schema/index.ts';
import { generateEmbeddings, transcribeAudio } from '../../services/gemini.ts';

// Exporta uma rota para o Fastify, usando validação com Zod
export const uploadAudioRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/rooms/:roomId/audio',
    {
      schema: {
        params: z.object({
          roomId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { roomId } = request.params;
      // Pega o arquivo de áudio enviado no corpo da requisição
      const audio = await request.file();

      if (!audio) {
        throw new Error('Audio is required');
      }

      // Converte o áudio para buffer (binário)
      const audioBuffer = await audio.toBuffer();
      // Transforma o áudio em base64 (formato que pode ser enviado para IA)
      const audioAsBase64 = audioBuffer.toString('base64');
      // Chama a função que transcreve o áudio para texto, usando o Gemini
      const transcription = await transcribeAudio(
        audioAsBase64,
        audio.mimetype
      );

      // Gera os embeddings (vetor numérico) a partir da transcrição
      const embeddings = await generateEmbeddings(transcription);

      const result = await db
        .insert(schema.audioChunks)
        .values({
          roomId,
          transcription,
          embeddings,
        })
        .returning();

      // Pega o primeiro item retornado (chunk de áudio salvo)
      const chunk = result[0];

      if (!chunk) {
        throw new Error('Erro ao salvar chunk de áudio');
      }

      // Retorna resposta com status 201 (criado) e o ID do chunk criado
      return reply.status(201).send({ chunkId: chunk.id });

      // Etapas principais:
      // 1. Transcrever o audio
      // 2. Gerar o vetor semântico / embeddings
      // 3. Armazenar os vetores no banco de dados
    }
  );
};
