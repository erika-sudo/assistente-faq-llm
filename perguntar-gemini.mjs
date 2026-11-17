import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({}); // lê a chave GEMINI_API_KEY sozinho

const MODELO = "gemini-3.8-flash";

const interacao = await ai.interactions.create({
    model: MODELO,
    input: "Diga olá em uma frase.",
});

console.log(interacao.output_text);