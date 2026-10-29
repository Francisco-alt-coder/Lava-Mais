# Lava Mais · Projeto acadêmico

Projeto demonstrativo da disciplina **Programação para Web** (ADS, 2026.2). A aplicação permite explorar serviços de lavagem de veículos e simular agendamento, retirada, acompanhamento e entrega. O foco desta versão é apresentar um fluxo completo e compreensível, com HTML, CSS, JavaScript e uma API simples.

> **Status: demonstração.** Os lava-jatos, funcionários, avaliações, distâncias, valores e pedidos são fictícios. Nenhum serviço é contratado de verdade.

**Etapa acadêmica:** protótipo de interface integrado a uma API. A correspondência com uma TED específica, os requisitos aprovados e a validação de um cliente ainda precisam ser informados pela equipe.

## Revisão visual das seis telas aprovadas (proposta em branch)

A branch `feat/telas-aprovadas-assistente-ia` adapta a apresentação da versão 2.2.0 aos seis exemplos visuais fornecidos pela equipe:

- **Início:** identidade azul, seleção de carro/moto, endereço fictício e atalho para IA.
- **Lava-jatos próximos:** cartões e filtros de veículo; distâncias e notas continuam fictícias.
- **Detalhes:** seleção de lavagem simples/completa e retirada/devolução.
- **Agendamento:** data, lista de horários, bloqueio de horário indisponível e total calculado pela API.
- **Acompanhamento:** linha do tempo, estado demonstrativo, atualização e acesso ao assistente.
- **Entrega:** resumo, avaliação por estrelas, confirmação e relato de problema.

O assistente aparece na aba **IA**, no início e na tela de acompanhamento.
Sem `GROQ_API_KEY`, oferece respostas locais demonstrativas; com chave válida, o servidor tenta consultar a Groq.
As perguntas rápidas `Preços`, `Como agendar` e `Meu pedido` ajudam a começar a conversa.
O navegador **nunca** deve receber a chave da API.

### Validação da proposta

1. Execute `npm ci`, `npm run check`, `npm test` e `npm start`.
2. Abra `http://localhost:3000`; percorra Início → Lava-jatos → Detalhes → Agendamento → Acompanhamento → Entrega.
3. Selecione uma data futura e um horário disponível; **10:00** permanece bloqueado.
4. Clique na aba **IA** e confirme a resposta demonstrativa; teste separadamente a Groq com uma chave válida, se a equipe a tiver configurado.
5. Faça inspeção visual em tela pequena (320/375 px), tablet e desktop.
6. Peça aprovação da equipe antes de incorporar a branch à `main`.

**Limitações:** não existe serviço real, autenticação, persistência em banco, rastreamento do motorista ou previsão real de chegada. A inspeção visual no navegador, a integração Groq com credencial real e a validação da equipe ainda devem ser documentadas.

---

## Funcionalidades demonstradas

1. **Início:** escolha entre carro e moto e edição de endereço fictício.
2. **Lava-jatos:** catálogo demonstrativo, filtros e preços para cada veículo.
3. **Detalhes:** lavagem simples ou completa e opção de retirada/devolução.
4. **Agendamento:** seleção de data e horário, bloqueio de indisponibilidade e total previsto.
5. **Acompanhamento:** progresso por etapas, avançado manualmente na demonstração.
6. **Entrega:** avaliação de 1 a 5 estrelas, confirmação e registro de problema.

As abas **Pedidos** e **Perfil** complementam a navegação. A interface apresenta o último pedido criado naquele navegador. O assistente responde com regras locais quando a Groq não está configurada; com chave válida, o servidor tenta consultar a API da Groq.

## Tecnologias

| Camada         | Tecnologia                                                              |
| -------------- | ----------------------------------------------------------------------- |
| Interface      | HTML semântico, CSS responsivo e JavaScript                             |
| Servidor e API | Node.js 20+ e Express 5                                                 |
| Configuração   | dotenv e variáveis de ambiente                                          |
| IA opcional    | API de chat da Groq, chamada apenas pelo servidor                       |
| Testes         | Executor de testes nativo do Node.js                                    |
| Imagens        | Ilustrações próprias criadas com auxílio de IA e referências fornecidas |

Não são necessários React, banco de dados ou ferramentas de compilação para executar esta versão. Os arquivos foram mantidos separados por responsabilidade para facilitar a explicação e a manutenção.

## Como o código funciona

1. `public/index.html` define a estrutura da página e os elementos principais.
2. `public/app.css` define a aparência e a adaptação para telas menores.
3. `public/app.js` mantém o estado das telas, reage aos cliques e utiliza `fetch()` para conversar com a API. Os comentários explicam as funções principais.
4. `server.js` cria as rotas do Express, valida os pedidos, calcula preços e guarda os pedidos temporariamente em memória.
5. `tests/api.test.js` executa chamadas HTTP automatizadas, verificando os principais comportamentos da API.

**Fluxo para demonstrar em sala:** Início → Lava-jatos → Detalhes → Agendamento → Acompanhamento → Entrega. Selecione um horário livre; 10:00 fica bloqueado intencionalmente.

## Requisitos e execução

- Node.js **20 ou superior** e NPM.
- Acesso à internet somente para a primeira instalação das dependências; a integração com Groq também exige internet.

No terminal, na raiz do projeto:

```bash
npm ci
cp .env.example .env
npm start
```

No PowerShell, substitua o comando de cópia por `Copy-Item .env.example .env`. O arquivo `iniciar.bat` também pode iniciar a demonstração no Windows.

Depois, acesse **http://localhost:3000**. Para desenvolvimento com reinicialização automática, use `npm run dev`. Por segurança, o servidor inicia acessível somente neste computador (`127.0.0.1`).

### Variáveis de ambiente

| Variável       | Obrigatória? | Uso                                                            |
| -------------- | ------------ | -------------------------------------------------------------- |
| `PORT`         | Não          | Porta HTTP, padrão `3000`                                      |
| `GROQ_API_KEY` | Não          | Chave de API, somente no servidor                              |
| `GROQ_MODEL`   | Não          | Modelo enviado à Groq; consulte o modelo padrão em `server.js` |

O arquivo `.env.example` não contém credenciais. **Nunca publique `.env`, tokens ou dados pessoais no GitHub.** Sem chave, o chatbot utiliza respostas demonstrativas. Uma chave configurada não prova, sozinha, que a integração real está funcionando.

Para testar a Groq, informe sua própria chave em `GROQ_API_KEY` no arquivo `.env` local e reinicie o servidor. O chatbot identifica se a resposta veio da Groq ou do modo demonstrativo. A chave deve permanecer somente no servidor e não deve ser publicada.

## API REST

| Método | Endpoint                                          | Finalidade                             |
| ------ | ------------------------------------------------- | -------------------------------------- |
| GET    | `/api/health`                                     | Estado da API e modo do chatbot        |
| GET    | `/api/estabelecimentos`                           | Catálogo de exemplo                    |
| GET    | `/api/horarios?lavaJatoId=brilho&data=2027-01-10` | Horários simulados                     |
| POST   | `/api/pedidos`                                    | Criação de pedido em memória           |
| GET    | `/api/pedidos`                                    | Listagem dos pedidos do processo atual |
| GET    | `/api/pedidos/:id`                                | Consulta de um pedido                  |
| PATCH  | `/api/pedidos/:id/avancar`                        | Avanço manual da etapa                 |
| POST   | `/api/pedidos/:id/confirmar`                      | Confirmação de recebimento e avaliação |
| POST   | `/api/pedidos/:id/problema`                       | Relato demonstrativo de problema       |
| POST   | `/api/chat`                                       | Resposta local ou da Groq              |

Exemplo de corpo para criar um pedido:

```json
{
  "lavaJatoId": "brilho",
  "veiculo": "carro",
  "servico": "simples",
  "retirada": true,
  "endereco": "Rua Fictícia, 123 - Centro",
  "data": "2027-01-10",
  "horario": "09:30"
}
```

A data do exemplo deve ser substituída por uma data futura. O horário **10:00** foi marcado como indisponível no cenário de demonstração.

## Verificação

```bash
npm run check  # verifica sintaxe do JavaScript
npm test       # executa os testes automatizados da API
npm run format:check # verifica a padronização do código
```

Os testes cobrem catálogo, valores, validações, disponibilidade, conflito de horário, ciclo de pedido e os dois modos do chatbot (a chamada Groq é simulada nos testes). A inspeção visual em dispositivos reais continua pendente de validação pela equipe.

## Estrutura

```text
lava-mais/
├── public/
│   ├── assets/            # imagens usadas na interface
│   ├── index.html
│   ├── app.css
│   └── app.js
├── tests/
│   └── api.test.js
├── .env.example
├── .gitignore
├── iniciar.bat
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

## Limitações e segurança

- Pedidos são guardados apenas em memória e desaparecem ao reiniciar o servidor.
- O navegador lembra somente o identificador do último pedido. Não é um histórico de usuário.
- Não existem autenticação, autorização, banco de dados, pagamentos, geolocalização ou rastreamento real.
- O catálogo é fictício. O botão de ligar não faz chamadas telefônicas.
- Endpoints de pedidos não têm controle de acesso: **não use dados pessoais reais nem publique esta API como serviço de produção**.
- A integração Groq não foi validada com chave real nesta revisão.
- As telas de referência são metas visuais, não evidência de necessidades validadas por clientes.
- Uma revisão da equipe e testes em dispositivos reais ainda são necessários antes de qualquer aplicação pública.

O código está disponível para avaliação acadêmica. A licença de distribuição **não foi definida pela equipe**; confirme-a antes de tornar o repositório público ou aceitar contribuições.

## Repositório e atualização

O projeto está no GitHub: [Francisco-alt-coder/Lava-Mais](https://github.com/Francisco-alt-coder/Lava-Mais). Antes de publicar uma nova versão, a equipe deve conferir as alterações com `git status` e `git diff`, testar o funcionamento e fazer um commit com uma mensagem que descreva a mudança. Nenhum envio automático ao GitHub é exigido para executar o projeto localmente.

## Histórico e autoria

O projeto preserva a arquitetura da versão 2.1. A revisão 2.2 tornou o código mais didático e corrigiu detalhes de interação, sem adicionar serviços reais. Os documentos anteriores foram removidos da árvore atual para simplificar o repositório, mas podem ser recuperados pelo histórico de commits do Git.

### Participação dos estudantes

Os comentários nos arquivos explicam **como** e **por que** as funções foram organizadas, ajudando os integrantes a estudar e defender o código. Eles não comprovam, isoladamente, a autoria. A equipe deve registrar suas contribuições reais e as modificações que compreender, revisar ou realizar.

| Atividade                            | Integrante(s) responsável(is) | Evidência real             |
| ------------------------------------ | ----------------------------- | -------------------------- |
| Requisitos e decisões do protótipo   | [inserir nomes]               | [ata, documento ou commit] |
| Interface e navegação                | [inserir nomes]               | [commits ou capturas]      |
| API, agendamento e regras de negócio | [inserir nomes]               | [commits ou testes]        |
| Testes, revisão e apresentação       | [inserir nomes]               | [resultados e registros]   |

**Transparência:** a revisão 2.2 foi preparada com apoio do ChatGPT. Antes da entrega, os estudantes devem executar o projeto, conferir os resultados, registrar suas próprias correções e preencher a declaração de uso de IA conforme as orientações da disciplina. Não atribua a um integrante uma atividade que ele não realizou.

### Registro resumido do uso de IA

| Campo                             | Informação                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| Ferramenta                        | ChatGPT                                                                                          |
| Finalidade                        | Revisão didática do código, correções, testes e organização do repositório                       |
| Forma de utilização               | Análise e edição de JavaScript, Node.js, README e testes, com conferência no GitHub              |
| Contribuição da IA                | Comentários explicativos, ajustes de horários e interface, documentação e apoio à publicação     |
| Validações e correções dos alunos | [inserir responsáveis, testes manuais e modificações reais]                                      |
| Evidências preservadas            | Histórico de commits, conversas, testes automatizados e versões anteriores recuperáveis pelo Git |
