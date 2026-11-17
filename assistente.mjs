import { readFile } from "node:fs/promises";
import readline from "node:readline/promises";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({}); // lê a chave GEMINI_API_KEY sozinho
const MODELO = "gemini-3.8-flash";

// 1. Ler o FAQ
const texto = await readFile("faq.json", "utf-8");
const faq = JSON.parse(texto);

// 2. Regras do assistente
const instrucoes = `Você é o assistente de suporte de uma loja online.
Responda usando SOMENTE as informações do FAQ abaixo.
Se a resposta não estiver no FAQ, responda exatamente: NAO_SEI
Não invente prazos, telefones nem procedimentos.
Responda em português, em até 3 frases.`;

// 3. Transformar o FAQ em texto
const textoFaq = faq
    .map((item) => `Pergunta: ${item.pergunta}\nResposta: ${item.resposta}`)
    .join("\n\n");

// 4. Perguntar ao usuário
console.log("Bem-vinda ao assistente de suporte!");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const pergunta = await rl.question("Digite sua pergunta: ");
rl.close();

// 5. Enviar tudo ao modelo
const prompt = `${instrucoes}\n\nFAQ:\n${textoFaq}\n\nPergunta do cliente: ${pergunta}`;

const interacao = await ai.interactions.create({
    model: MODELO,
    input: prompt,
});

// 6. Mostrar a resposta
const resposta = interacao.output_text.trim();
if (resposta.startsWith("NAO_SEI")) {
    console.log("Não encontrei essa informação. Fale com um atendente pelo chat do site.");
} else {
    console.log(resposta);
}