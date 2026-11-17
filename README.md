# Assistente de suporte com IA (FAQ)

Assistente de linha de comando que responde dúvidas de clientes de uma loja online usando **somente** as informações de um FAQ. Quando a resposta não está no FAQ, ele recusa em vez de inventar.

> Todos os dados do FAQ são fictícios, criados para este projeto.

## Problema

Equipes de suporte recebem muitas perguntas repetidas (pagamento, prazo, troca, reembolso). Um assistente de IA pode responder as mais comuns, mas só é útil se não inventar prazos, valores ou procedimentos que a loja não oferece. Por isso o foco do projeto é responder com base no FAQ e dizer "não sei" quando não houver base.

## Como funciona

1. O programa lê as perguntas e respostas do arquivo `faq.json`.
2. Monta um texto com as regras do assistente (usar só o FAQ, não inventar, responder `NAO_SEI` se não souber) e com o FAQ inteiro.
3. Envia esse texto e a pergunta do usuário ao modelo Gemini.
4. Se o modelo responde `NAO_SEI`, o programa mostra uma mensagem fixa mandando o cliente falar com um atendente. Caso contrário, mostra a resposta do modelo.

## Tecnologias

Node.js e a API do Google Gemini (biblioteca `@google/genai`).

## Como rodar

1. Instale o Node.js e, na pasta do projeto, rode `npm install`.
2. Crie um arquivo `.env` com a linha `GEMINI_API_KEY=sua_chave_aqui` (veja o `.env.example`). A chave gratuita é criada no Google AI Studio.
3. Rode:

```
node --env-file=.env assistente.mjs
```

## Como avaliar

O arquivo `testes.json` tem perguntas escritas de forma diferente das do FAQ, de dois tipos:

- **Com resposta no FAQ** (`tem_resposta: true`): o teste passa se o assistente respondeu e a resposta contém uma das palavras de `deve_conter`.
- **Fora do FAQ** (`tem_resposta: false`): o teste passa se o assistente recusou com `NAO_SEI`.

```
node --env-file=.env avaliar.mjs v1
```

O programa salva cada resposta em `resultados/v1.json` e, se a cota da API acabar, continua de onde parou ao rodar de novo com o mesmo nome. Ao mudar o prompt, use um nome novo (`v2`, `v3`) para comparar versões.

## Resultados

| Versão | Com resposta no FAQ | Fora do FAQ (recusa) | O que mudou |
|--------|---------------------|----------------------|-------------|
| v1 | 10/10 | 5/5 | Prompt inicial, 15 testes |
| v2 | [ ]/[ ] | [ ]/[ ] | [descreva o ajuste e preencha após rodar] |

A v1 acertou tudo, o que indica que esses 15 testes eram fáceis. Por isso foram acrescentados testes mais difíceis, como perguntas parecidas com o FAQ mas sem resposta nele, tentativa de burlar as regras e informação errada dentro da pergunta.

## Limitações

- A correção por palavra-chave pode marcar como erro uma resposta certa. Exemplo real: o modelo respondeu "em até 12 vezes" e o teste procurava "12x".
- Com poucos testes, uma diferença de um ou dois acertos pode ser só variação do modelo.
- O FAQ inteiro vai no prompt, então a abordagem não escala para uma base grande.
- O plano gratuito da API tem limite diário baixo (20 pedidos por dia no modelo usado), o que limita quantas rodadas de teste cabem por dia.
- Não há proteção completa contra tentativas de burlar as regras; existe só a instrução no prompt.

## Próximos passos

- Usar busca por similaridade (RAG) para suportar um FAQ maior.
- Fazer o modelo indicar qual item do FAQ usou na resposta.
- Criar uma interface web simples.
- Usar um segundo modelo como avaliador, além das palavras-chave.