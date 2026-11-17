import { readFile, writeFile, mkdir } from "node:fs/promises";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({}); // lê a chave GEMINI_API_KEY sozinho
const MODELO = "gemini-3.8-flash";

// 1. Ler o FAQ e os testes
const faq = JSON.parse(await readFile("faq.json", "utf-8"));
const testes = JSON.parse(await readFile("testes.json", "utf-8"));

// 2. Regras do assistente (iguais às do assistente.mjs)
const instrucoes = `Você é o assistente de suporte de uma loja online.
Responda usando SOMENTE as informações do FAQ abaixo.
Se a resposta não estiver no FAQ, responda exatamente: NAO_SEI
Não invente prazos, telefones nem procedimentos.
Responda em português, em até 3 frases.`;

const textoFaq = faq
    .map((item) => `Pergunta: ${item.pergunta}\nResposta: ${item.resposta}`)
    .join("\n\n");

// 3. Funções de apoio
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

async function perguntar(pergunta) {
    const prompt = `${instrucoes}\n\nFAQ:\n${textoFaq}\n\nPergunta do cliente: ${pergunta}`;
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
        try {
            const interacao = await ai.interactions.create({ model: MODELO, input: prompt });
            return interacao.output_text.trim();
        } catch (erro) {
            if (tentativa === 3) throw erro;
            await esperar(5000 * tentativa); // espera e tenta de novo
        }
    }
}

function acertou(teste, resposta) {
    const recusou = resposta.startsWith("NAO_SEI");
    if (!teste.tem_resposta) return recusou;      // devia recusar
    if (recusou) return false;                    // recusou sem precisar
    const r = normalizar(resposta);
    return teste.deve_conter.some((p) => r.includes(normalizar(p)));
}

// 4. Rodar todos os testes
const resultados = [];
for (const teste of testes) {
    const resposta = await perguntar(teste.pergunta);
    const ok = acertou(teste, resposta);
    resultados.push({ pergunta: teste.pergunta, tem_resposta: teste.tem_resposta, resposta, acertou: ok });
    console.log(`${ok ? "OK  " : "ERRO"} ${teste.pergunta}`);
    if (!ok) console.log(`     resposta: ${resposta.replace(/\n/g, " ")}`);
    await esperar(6000); // pausa para não estourar o limite do plano gratuito
}

// 5. Resumo
const com = resultados.filter((r) => r.tem_resposta);
const sem = resultados.filter((r) => !r.tem_resposta);
const acertosCom = com.filter((r) => r.acertou).length;
const acertosSem = sem.filter((r) => r.acertou).length;

console.log("\n--- Resumo ---");
console.log(`Com resposta no FAQ: ${acertosCom}/${com.length}`);
console.log(`Fora do FAQ (recusa certa): ${acertosSem}/${sem.length}`);
console.log(`Total: ${acertosCom + acertosSem}/${resultados.length}`);

// 6. Salvar o resultado
await mkdir("resultados", { recursive: true });
const rotulo = process.argv[2] || "v1";
await writeFile(`resultados/${rotulo}.json`, JSON.stringify(resultados, null, 2));
console.log(`\nResultado salvo em resultados/${rotulo}.json`);