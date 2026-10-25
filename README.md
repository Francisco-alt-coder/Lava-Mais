# Lava Mais

Protótipo acadêmico de uma aplicação web para explorar serviços de lavagem de veículos e simular agendamento, retirada, acompanhamento e entrega. A interface segue seis referências visuais de aplicativo móvel e também pode ser demonstrada em um navegador de computador.

> **Status: demonstração.** Os lava-jatos, funcionários, avaliações, distâncias, valores e pedidos são fictícios. Nenhum serviço é contratado de verdade.

## Funcionalidades demonstradas

1. **Início:** escolha entre carro e moto e edição de endereço fictício.
2. **Lava-jatos:** catálogo demonstrativo, filtros e preços para cada veículo.
3. **Detalhes:** lavagem simples ou completa e opção de retirada/devolução.
4. **Agendamento:** seleção de data e horário, bloqueio de indisponibilidade e total previsto.
5. **Acompanhamento:** progresso por etapas, avançado manualmente na demonstração.
6. **Entrega:** avaliação de 1 a 5 estrelas, confirmação e registro de problema.

As abas **Pedidos** e **Perfil** complementam a navegação. O assistente virtual responde com regras locais quando a Groq não está configurada; com chave válida, o servidor envia perguntas à API da Groq.

## Tecnologias

| Camada         | Tecnologia                                                              |
| -------------- | ----------------------------------------------------------------------- |
| Interface      | HTML semântico, CSS responsivo e JavaScript                             |
| Servidor e API | Node.js 20+ e Express 5                                                 |
| Configuração   | dotenv e variáveis de ambiente                                          |
| IA opcional    | API de chat da Groq, chamada apenas pelo servidor                       |
| Testes         | Executor de testes nativo do Node.js                                    |
| Imagens        | Ilustrações próprias criadas com auxílio de IA e referências fornecidas |

Não são necessários React, banco de dados ou ferramentas de compilação para executar esta versão.

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

Depois, acesse **http://localhost:3000**. Para desenvolvimento com reinicialização automática, use `npm run dev`.

### Variáveis de ambiente

| Variável       | Obrigatória? | Uso                                                            |
| -------------- | ------------ | -------------------------------------------------------------- |
| `PORT`         | Não          | Porta HTTP, padrão `3000`                                      |
| `GROQ_API_KEY` | Não          | Chave de API, somente no servidor                              |
| `GROQ_MODEL`   | Não          | Modelo enviado à Groq; consulte o modelo padrão em `server.js` |

O arquivo `.env.example` não contém credenciais. **Nunca publique `.env`, tokens ou dados pessoais no GitHub.** Sem chave, o chatbot utiliza respostas demonstrativas. Uma chave configurada não prova, sozinha, que a integração real está funcionando.

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

Os testes cobrem catálogo, valores, validações, conflito de horário, ciclo de pedido e os dois modos do chatbot (a chamada Groq é simulada nos testes). Consulte `design-qa.md` para o registro da inspeção visual e suas limitações.

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
├── docs/
│   ├── referencias/      # telas de referência fornecidas
│   ├── historico/        # evidências e documentos anteriores
│   ├── CONFIGURAR_GROQ.md
│   └── REGISTRO_IA.md
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
- Não existem autenticação, autorização, banco de dados, pagamentos, geolocalização ou rastreamento real.
- O catálogo é fictício. O botão de ligar não faz chamadas telefônicas.
- Endpoints de pedidos não têm controle de acesso: **não use dados pessoais reais nem publique esta API como serviço de produção**.
- A integração Groq não foi validada com chave real nesta revisão.
- As telas de referência são metas visuais, não evidência de necessidades validadas por clientes.
- Uma revisão da equipe e testes em dispositivos reais ainda são necessários antes de qualquer aplicação pública.

O código está disponível para avaliação acadêmica. A licença de distribuição **não foi definida pela equipe**; confirme-a antes de tornar o repositório público ou aceitar contribuições.

## Publicação do código no GitHub

Depois de revisar os arquivos e criar um **repositório vazio** na sua conta do GitHub, execute na pasta do projeto:

```bash
git init
git add .
git commit -m "feat: prepara prototipo Lava Mais para demonstracao"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/lava-mais.git
git push -u origin main
```

Troque `SEU_USUARIO` pelo usuário real. Se o destino já tiver commits ou arquivos, confira o histórico antes de configurar o remoto, para não sobrescrever trabalho existente. O Git pode solicitar que você configure sua identidade de autor e a autenticação da sua conta.

## Histórico e autoria

O projeto preserva a arquitetura entregue no ZIP original e os documentos anteriores em `docs/historico/`. A revisão atual modifica a identidade visual e a organização dos arquivos, sem adicionar serviços reais. O registro do uso de IA, das fontes visuais e das validações pendentes está em [docs/REGISTRO_IA.md](docs/REGISTRO_IA.md).
