# Proposta de melhorias visuais | Lava Mais

**Objetivo:** apresentar uma evolução de interface do protótipo, preservando a estrutura e o fluxo das seis imagens de referência. Estas são **propostas de design**, não requisitos validados por clientes.

| Tela de referência | O que foi preservado | Melhoria nesta versão |
| --- | --- | --- |
| 01. Início | Marca, localização, escolha de carro/moto e CTA | Identidade em verde-água e azul, hierarquia visual, seleção destacada e botão mais evidente |
| 02. Lista | Filtros e cartões de lava-jatos | Cartões com bordas suaves, melhor contraste e realce ao passar o mouse |
| 03. Detalhes | Alternância carro/moto, serviços e retirada | Destaque visível no serviço selecionado, preços e seção de segurança |
| 04. Agendamento | Endereço, data, horários e resumo | Melhor distinção entre horário selecionado, indisponível e total do pedido |
| 05. Acompanhamento | Funcionário, etapas e ações | Linha do tempo destacando a etapa atual e ações secundárias mais legíveis |
| 06. Entrega | Resumo, estrelas e confirmação | Estado de sucesso em verde-água e estrelas com cor de avaliação |

## Decisões implementadas

- Foi adicionado `public/theme-demo.css` como camada de estilo, mantendo o `style.css` original para facilitar comparação ou reversão.
- A interface usa cores claras, cartões, bordas suaves, focos de teclado visíveis e estados de interação.
- O app preserva os dados fictícios, o funcionamento das seis telas e o back-end Express.
- O cabeçalho do chatbot informa se existe chave Groq configurada, sem expor a chave.

## Próximas melhorias sugeridas, não implementadas

1. Testar com usuários reais a clareza do agendamento e da confirmação de entrega.
2. Criar catálogo de fotos reais autorizadas dos estabelecimentos quando existirem parceiros.
3. Incluir autenticação e banco de dados antes de operar com pedidos reais.
4. Adicionar histórico persistente e notificações somente após definição das regras de negócio.
5. Verificar contraste, navegação por teclado e uso por leitores de tela em dispositivos reais.

## Limitações da demonstração

Os estabelecimentos, as distâncias, as avaliações e os dados de pedido são fictícios. O modo com IA real depende de uma chave e conexão válidas. A proposta visual deve ser avaliada e aprovada pela equipe antes de ser tratada como versão final do produto.
