# Configurar a Groq no Lava Mais

A aplicação já possui uma integração no servidor Node.js com a API de chat da Groq. Para ativá-la, é necessária uma **chave pessoal válida**. Nenhuma chave foi incluída neste pacote.

## Passo a passo no Windows

1. Entre em [GroqCloud Console](https://console.groq.com/keys) e gere sua própria chave de API.
2. Abra a pasta do projeto `lava-mais` no VS Code.
3. Copie `.env.example` para um novo arquivo chamado `.env`, caso ele ainda não exista. Se você já executou `iniciar.bat`, ele provavelmente foi criado.
4. Edite **somente seu `.env` local** desta forma, substituindo o valor indicado pela sua chave:

```dotenv
GROQ_API_KEY=COLE_SUA_CHAVE_NESTE_ARQUIVO_LOCAL
GROQ_MODEL=openai/gpt-oss-20b
PORT=3000
```

5. Salve e **reinicie** o servidor: pressione `Ctrl+C` no terminal e execute `iniciar.bat` outra vez.
6. Abra o aplicativo, escolha **Conversar com o assistente virtual** na tela inicial ou em Perfil e pergunte: `Qual é a diferença entre lavagem simples e completa?`

## Como conferir o modo

No cabeçalho do chatbot:

- **Modo demonstração · sem chave Groq:** a chave não foi configurada e são usadas respostas pré-programadas.
- **Groq configurada · aguardando resposta:** existe uma chave, mas ainda não há prova de conexão bem-sucedida.
- **Conectado à Groq IA:** uma resposta real da API foi recebida.

Também é possível consultar `http://localhost:3000/api/health`. Esse endpoint indica o modo configurado, **não comprova sozinho** que a chave é válida nem que a API está acessível.

## Cuidados importantes

- Nunca coloque a chave no JavaScript do navegador, em slides, capturas ou GitHub.
- Não envie a chave em conversas. Edite-a somente no arquivo `.env` do seu computador.
- O arquivo `.gitignore` já exclui `.env` do versionamento.
- Sem conexão com a internet ou com chave inválida, o chatbot pode mostrar erro ao tentar usar a API. Para apresentar offline, deixe `GROQ_API_KEY` vazia e use o modo demonstração.
- O identificador de modelo `openai/gpt-oss-20b` é o padrão informado no código recebido. Antes de usar a integração real, confirme no console da Groq se ele continua disponível para sua conta.

**Atenção:** o chatbot não cria reservas reais, não executa pagamentos e não recebe informações de um estabelecimento comercial.
