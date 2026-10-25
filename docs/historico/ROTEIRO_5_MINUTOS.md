# Roteiro de apresentação | Lava Mais

**Duração sugerida:** aproximadamente 5 minutos. Adapte as falas à sua experiência e ao que funcionar no computador da aula.

## 0:00–0:30 | Introdução

> O Lava Mais é um protótipo de aplicação web para facilitar a busca por lava-jatos e a simulação de um agendamento de lavagem de veículos. Hoje vou demonstrar as seis telas e explicar como a interface conversa com o servidor.

## 0:30–1:30 | Início, lista e detalhes

**Na tela:** selecione carro ou moto, clique em Buscar lava-jatos, abra um estabelecimento e escolha o tipo de lavagem.

> O usuário escolhe seu veículo, visualiza estabelecimentos e compara serviços e valores. Nesta versão, os dados dos lava-jatos e os preços são ilustrativos.

## 1:30–2:30 | Agendamento

**Na tela:** abra Agendamento, selecione uma data e outro horário disponível (10:00 está bloqueado) e confirme.

> O navegador envia os dados para uma API em Node.js com Express. O servidor valida as informações, calcula o valor e registra um pedido demonstrativo.

## 2:30–3:30 | Acompanhamento e entrega

**Na tela:** use Avançar etapa (demo) até a entrega, dê uma nota e confirme o recebimento.

> O sistema representa as etapas do pedido, da confirmação até a entrega. Por enquanto, o avanço é manual e não existe rastreamento real.

## 3:30–4:30 | Chatbot

**Na tela:** abra o robô e pergunte `Quanto custa a lavagem completa?`.

> Também existe um assistente virtual. Com a chave configurada, o servidor pode consultar a API Groq; sem a chave, ele apresenta respostas locais de demonstração. A chave nunca deve ficar exposta no navegador.

## 4:30–5:00 | Tecnologias e próximos passos

> A interface usa HTML, CSS e JavaScript. O back-end usa Node.js e Express, com endpoints REST para horários e pedidos. Nosso próximo objetivo é acrescentar um banco de dados e autenticação para evoluir o protótipo. Hoje, os pedidos ficam apenas na memória do servidor.

## Perguntas que podem surgir

**Os agendamentos já chegam a um lava-jato?** Não. Ainda é uma simulação acadêmica.

**O chatbot precisa de internet?** A resposta local demonstrativa não precisa de acesso à Groq; a integração real com Groq precisa.

**Qual é o banco de dados?** Ainda não há banco. Os pedidos ficam em memória; PostgreSQL é uma proposta futura.

**Existe localização e rastreamento real?** Não. Distâncias e etapas são ilustrativas.

**O que já foi testado?** Oito testes automatizados da API passaram na preparação. A demonstração visual deverá ser conferida no computador da aula.
