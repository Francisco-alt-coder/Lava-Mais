# Lava Mais | Versão para demonstração em aula

Este pacote foi preparado para **apresentar o protótipo do Lava Mais no navegador**. Ele preserva as seis telas, a API Express e o chatbot já existentes. Os dados continuam demonstrativos: **não há agendamentos, funcionários, rastreamento ou pagamentos reais**.

## Iniciar em um computador Windows

**Antes da aula:** instale o [Node.js](https://nodejs.org/) versão 20 ou superior. Na primeira execução, tenha internet para instalar os pacotes.

1. Extraia todo o ZIP para uma pasta no computador (não execute o projeto dentro da visualização do ZIP).
2. Abra a pasta `Lava_Mais_Demo_Visual_Groq`.
3. Dê dois cliques em **`iniciar.bat`**.
4. Aguarde a instalação inicial. O navegador deverá abrir automaticamente em **http://localhost:3000**. Se não abrir, digite esse endereço manualmente.
5. **Mantenha a janela do terminal aberta** durante a apresentação. Para encerrar, volte à janela e pressione `Ctrl+C`.

O iniciador cria automaticamente um `.env` a partir de `.env.example`, caso ainda não exista. Ele não precisa de uma chave Groq para mostrar o chatbot em modo demonstração.

## Alternativa pelo VS Code

Abra a pasta `Lava_Mais_Demo_Visual_Groq` no VS Code e execute no terminal PowerShell:

```powershell
npm ci
Copy-Item .env.example .env
npm start
```

Se `.env` já existir, pule a linha `Copy-Item` para preservar sua configuração. Depois, abra **http://localhost:3000**.

## Sequência recomendada para mostrar as seis telas

1. **Início:** escolha `Carro` ou `Moto` e clique em **Buscar lava-jatos**.
2. **Lista:** selecione um dos estabelecimentos fictícios.
3. **Detalhes:** escolha lavagem simples ou completa e a opção de retirada/devolução.
4. **Agendamento:** selecione uma data e um horário disponível. **10:00 aparece indisponível de propósito**. Confirme o pedido de demonstração.
5. **Acompanhar pedido:** clique em **Avançar etapa (demo)** até chegar à entrega. As etapas não são atualizadas por um estabelecimento real.
6. **Entrega:** atribua uma avaliação com estrelas e confirme o recebimento.

Depois, abra o botão do **assistente virtual** (ícone de robô) e pergunte, por exemplo, `Quanto custa a lavagem completa?`. Sem uma chave Groq válida, a resposta será local e estará identificada como demonstração.

Para falas de apresentação, consulte **`ROTEIRO_5_MINUTOS.md`**. Antes de sair para a aula, confira **`CHECKLIST_DEMO.md`**. As mudanças visuais estão em **`PROPOSTA_DE_MELHORIAS.md`**.

## Ativar a Groq (opcional)

Caso tenha uma chave de API **válida e própria**, siga o passo a passo em **`CONFIGURAR_GROQ.md`**. A chave fica exclusivamente no seu `.env` local. Reinicie o servidor. Para testar uma resposta da IA real é necessária internet.

**Não compartilhe o arquivo `.env`, a chave ou capturas que a exibam.** Não é necessário ativar a API real para apresentar o fluxo do protótipo.

## Se não iniciar

- **`node`/`npm` não reconhecido:** instale o Node.js, feche e abra o terminal e tente novamente.
- **Falha no `npm ci`:** confira a internet e execute `iniciar.bat` outra vez.
- **Página não abre:** confirme que o terminal mostra `Lava Mais em http://localhost:3000` e abra o endereço manualmente.
- **Porta 3000 em uso:** feche outra instância do servidor que esteja aberta e inicie novamente.
- **Chatbot responde como demonstração:** comportamento esperado sem chave Groq; não é um erro.
- **Pedido desapareceu após reiniciar:** comportamento esperado porque a persistência ainda é somente em memória.

## Verificação técnica

Use `npm test` no terminal para rodar os oito testes da API. Na preparação deste pacote, os **8 testes passaram** e os arquivos JavaScript passaram na verificação de sintaxe no Node.js 24. As seis telas, o fluxo de pedido e o chatbot demonstrativo foram inspecionados em um navegador de prévia. **O iniciador no Windows, os diferentes tamanhos de tela e a integração real com uma chave Groq ainda precisam ser verificados no computador da apresentação.**

### Histórico desta versão

| Versão | Data | Alterações | Responsável pela validação |
| --- | --- | --- | --- |
| Demo 1.0 | 24/10/2026 | Iniciador Windows revisado, instruções, roteiro e checklist de apresentação; funcionalidades existentes preservadas | [inserir responsável real] |
| Demo Visual 1.1 | 24/10/2026 | Camada de cores e estilos, status de configuração Groq, resposta demonstrativa mais específica e documentação de melhorias | [inserir responsável real] |
