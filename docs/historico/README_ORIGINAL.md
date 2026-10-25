# Lava Mais | Protótipo de seis telas + Groq IA

> **Nova proposta visual:** esta cópia inclui um tema colorido em `public/theme-demo.css`, mantendo as seis telas de referência e a API original. Consulte [PROPOSTA_DE_MELHORIAS.md](PROPOSTA_DE_MELHORIAS.md) e [CONFIGURAR_GROQ.md](CONFIGURAR_GROQ.md).

> **Versão de demonstração em aula:** para começar rapidamente no Windows, leia primeiro [LEIA_PRIMEIRO_DEMO.md](LEIA_PRIMEIRO_DEMO.md) e abra `iniciar.bat`. Consulte também [ROTEIRO_5_MINUTOS.md](ROTEIRO_5_MINUTOS.md) e [CHECKLIST_DEMO.md](CHECKLIST_DEMO.md).

Este projeto reproduz em HTML, CSS e JavaScript **as seis telas** do protótipo fornecido pelo usuário:

1. Início: localização e escolha entre carro ou moto.
2. Lava-jatos próximos: lista com filtro e preços.
3. Detalhes do lava-jato: lavagem simples, completa e retirada/devolução.
4. Agendamento: endereço, data, disponibilidade e resumo do valor.
5. Acompanhar pedido: funcionário e seis etapas de acompanhamento.
6. Entrega do veículo: avaliação, confirmação e relato de problemas.

Também possui as abas Pedidos e Perfil e um **chatbot com integração à API da Groq**, utilizando o modelo `openai/gpt-oss-20b`.

## Como executar no Windows (VS Code / PowerShell)

É necessário Node.js 20 ou superior e conexão à internet para instalar as dependências.

1. Descompacte o arquivo e abra a pasta `lava-mais-seis-telas` no VS Code.
2. Abra o terminal do VS Code na pasta do projeto.
3. Execute:

```powershell
npm install
Copy-Item .env.example .env
npm start
```

4. Acesse **http://localhost:3000** no seu navegador.

### Ativar o chatbot Groq

Por segurança, **a chave não está incluída nos arquivos**. No [Groq Console](https://console.groq.com/keys), crie uma chave **nova**. Abra o arquivo `.env` e configure:

```dotenv
GROQ_API_KEY=COLOQUE_SUA_NOVA_CHAVE_AQUI
GROQ_MODEL=openai/gpt-oss-20b
PORT=3000
```

Reinicie a aplicação pressionando `Ctrl+C`, seguido de `npm start`.

**Importante:** como uma chave anterior foi compartilhada numa conversa, revogue-a no painel da Groq e use uma nova. Nunca publique `.env` no GitHub, em uma hospedagem pública ou em capturas de tela.

Sem chave, o chatbot usa **respostas pré-programadas**, identificadas como demonstração. Com uma chave válida, o backend Express faz uma requisição HTTP para `https://api.groq.com/openai/v1/chat/completions`. A chave não é enviada ao frontend.

## Testar o fluxo do protótipo

Na tela inicial, selecione o veículo e toque em **Buscar lava-jatos**. Escolha um estabelecimento, selecione lavagem simples ou completa e, opcionalmente, retirada/devolução. Clique em **Escolher serviço**. A tela de agendamento começa com **10:00 indisponível**, de acordo com o protótipo; escolha outro horário disponível e confirme. No acompanhamento, clique em **Avançar etapa (demo)** até o veículo ser entregue. Avalie com estrelas e confirme o recebimento. O botão com o ícone de robô abre o chatbot.

Os pedidos ficam guardados **apenas na memória do Node.js**. Ao reiniciar o servidor, eles são perdidos. A aplicação não envia solicitações a lava-jatos reais, não coleta localização, não faz pagamentos ou autenticação e não possui rastreamento GPS. A lista de empresas, preços, avaliações, distâncias e funcionário é **fictícia**. As etapas são avançadas manualmente.

## Endpoints REST

| Método | Caminho | Função |
| --- | --- | --- |
| GET | `/api/health` | Estado da API e modo chatbot |
| GET | `/api/estabelecimentos` | Catálogo ilustrativo |
| GET | `/api/horarios?lavaJatoId=brilho&data=2027-01-10` | Disponibilidade simulada |
| POST | `/api/pedidos` | Criar pedido demonstrativo |
| GET | `/api/pedidos` | Listar pedidos da sessão do servidor |
| GET | `/api/pedidos/:id` | Consultar pedido |
| PATCH | `/api/pedidos/:id/avancar` | Avançar etapa para demonstração |
| POST | `/api/pedidos/:id/confirmar` | Confirmar entrega e avaliação |
| POST | `/api/pedidos/:id/problema` | Registrar relato de problema |
| POST | `/api/chat` | Resposta da Groq ou demonstração local |

Exemplo de mensagem enviada para `/api/chat`:

```json
{"mensagem":"Quanto custa a lavagem completa?","historico":[]}
```

## Testes

Execute:

```powershell
npm test
```

O arquivo `tests/api.test.js` contém oito verificações de API, incluindo um teste com resposta simulada da Groq, **sem usar chave real**. Os testes precisam das dependências instaladas.

## Pastas e arquivos

```text
lava-mais-seis-telas/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── tests/
│   └── api.test.js
├── referencias/
│   └── (seis imagens fornecidas para referência)
├── server.js
├── package.json
├── .env.example
└── README.md
```

**Status:** código preparado para execução local. A interface foi concebida para reproduzir os protótipos. A integração real com a Groq somente pode ser verificada no ambiente configurado com nova chave válida e conexão à internet.
