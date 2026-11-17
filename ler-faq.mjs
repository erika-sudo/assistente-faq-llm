import readline from "node:readline/promises";

// Lista de perguntas e respostas (o FAQ)
const faq = [
    {
        pergunta: "Como redefino minha senha?",
        resposta: "Para redefinir sua senha, clique em 'Esqueci minha senha' na tela de login e siga as instruções enviadas para o seu e-mail."
    },
    {
        pergunta: "Quais são as formas de pagamento aceitas?",
        resposta: "Aceitamos cartão de crédito (em até 12x), PIX com aprovação imediata e boleto bancário."
    },
    {
        pergunta: "Qual é o prazo de entrega?",
        resposta: "O prazo de entrega varia de 3 a 7 dias úteis após a confirmação do pagamento, dependendo da sua região."
    },
    {
        pergunta: "Como faço para rastrear meu pedido?",
        resposta: "Você pode acompanhar a entrega acessando a aba 'Meus Pedidos' no site ou usando o código de rastreio enviado por e-mail."
    },
    {
        pergunta: "Quero falar com um atendente humano.",
        resposta: "Nosso atendimento humano funciona de segunda a sexta, das 9h às 18h, pelo chat do site ou pelo telefone 0800 000 0000."
    }
];

// Boas-vindas
console.log("Bem-vinda ao assistente de suporte!");
console.log(`Eu sei responder ${faq.length} perguntas.`);

// Mostrar todas as perguntas e respostas
for (const item of faq) {
    console.log(`Pergunta: ${item.pergunta}`);
    console.log(`Resposta: ${item.resposta}`);
    console.log("");
}

// Perguntar algo ao usuário
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const pergunta = await rl.question("Digite sua pergunta: ");
rl.close();

console.log(`Você perguntou: ${pergunta}`);