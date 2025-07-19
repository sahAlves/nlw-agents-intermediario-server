import { GoogleGenAI } from '@google/genai';
import { env } from '../env.ts';

// Cria uma instância da IA da Google, usando a chave da API armazenada no arquivo .env
const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

// Define o modelo da IA que será usado nas chamadas (modelo mais rápido e leve)
const model = 'gemini-2.5-flash';

// Transcreve um áudio enviado em base64 para texto, usando IA.
export async function transcribeAudio(audioAsBase64: string, mimeType: string) {
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        // Instrução para a IA: como ela deve agir
        text: 'Transcreva o áudio para português do Brasil. Seja preciso e natural na transcrição. Mantenha a pontuação adequada e divida o texto em parágrafos quando for apropriado.',
      },
      {
        // Aqui é onde enviamos o áudio real em base64
        inlineData: {
          mimeType, // Tipo do áudio (ex: audio/webm)
          data: audioAsBase64, // Conteúdo do áudio codificado
        },
      },
    ],
  });

  // Se a IA não conseguir gerar o texto, lança um erro
  if (!response.text) {
    throw new Error('Não foi possível converter o áudio');
  }
  // Retorna a transcrição feita pela IA
  return response.text;
}

// Gera embeddings (representações numéricas) de um texto
// Isso é usado, por exemplo, para comparação semântica ou busca por similaridade.
// Recebe o texto a ser transformado em embedding
export async function generateEmbeddings(text: string) {
  const response = await gemini.models.embedContent({
    model: 'text-embedding-004', // Modelo específico para gerar embeddings
    contents: [{ text }], // Enviamos o texto como conteúdo
    config: {
      taskType: 'RETRIEVAL_DOCUMENT', // Tipo de tarefa que estamos fazendo (busca por informação)
    },
  });

  // Se não gerar corretamente, lança um erro
  if (!response.embeddings?.[0].values) {
    throw new Error('Não foi possível gerar os embeddings.');
  }

  // Retorna os valores dos embeddings (vetores)
  return response.embeddings[0].values;
}

// Gera uma resposta baseada em uma pergunta e um conjunto de transcrições.
// Recebe a pergunta feita pelo usuário e as transcrições que serão usados como base para a resposta
export async function generateAnswer(
  question: string,
  transcriptions: string[]
) {
  // Junta todas as transcrições em um único texto separado por dois "enters"
  const context = transcriptions.join('\n\n');

  // Cria o prompt com instruções específicas para a IA seguir
  const prompt = `
    Com base no texto fornecido abaixo como contexto, responda a pergunta de forma clara e precisa em português do Brasil.

    CONTEXTO:
    ${context}

    PERGUNTA:
    ${question}

    INSTRUÇÕES:
    - Use apenas informações contidas no contexto enviado;
    - Se a resposta não for encontrada no contexto, apenas responda que não possui informações suficientes para responder;
    - Seja objetivo;
    - Mantenha um tom educativo e profissional;
    - Cite trechos relevantes do contexto se apropriado;
    - Se for citar o contexto, utilize o termo "conteúdo da aula";
  `.trim();

  // Envia o prompt para a IA gerar uma resposta
  const response = await gemini.models.generateContent({
    model,
    contents: [
      {
        text: prompt,
      },
    ],
  });

  // Verifica se foi gerada alguma resposta
  if (!response.text) {
    throw new Error('Falha ao gerar resposta pelo Gemini');
  }

  // Retorna o texto da resposta gerada
  return response.text;
}
