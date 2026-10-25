# Revisão visual da proposta Lava Mais

## Fontes de referência

- `referencias/01-inicio.png`
- `referencias/02-lista.png`
- `referencias/03-detalhes.png`
- `referencias/04-agendamento.png`
- `referencias/05-acompanhamento.png`
- `referencias/06-entrega.png`

## Implementação observada

- Prévia local: aplicação Express em navegador de prévia (porta 4173).
- Viewport observado: aproximadamente 1350 × 900 px em desktop, com tela móvel simulada no centro.
- Estado inspecionado: início, lista, detalhes, agendamento inválido e válido, acompanhamento, entrega, confirmação e chatbot demonstrativo.
- Interações verificadas: escolha do veículo e estabelecimento, criação de pedido, avanço de etapas, avaliação, recebimento e pergunta ao chatbot local.
- Console: sem erros atribuídos à página da aplicação. Foram observados avisos de uma extensão do navegador, não do código Lava Mais.

## Comparação com as imagens

| Superfície | Observação |
| --- | --- |
| Tipografia | Hierarquia de títulos, rótulos e valores mais clara; fonte de sistema sem dependência de internet |
| Layout e espaços | Mantidas as regiões essenciais dos wireframes; adicionado espaço no rodapé da página para afastar o conteúdo do botão de chat |
| Cores | Wireframes em tons de cinza reinterpretados como proposta em verde-água, azul escuro e fundos claros |
| Imagens e ícones | Ícones existentes preservados, sem fotos reais ou imagens inventadas de estabelecimentos |
| Textos | Avisos de simulação preservados; chatbot identifica modo local ou chave configurada |

## Ajustes feitos nesta revisão

1. Cor de seleção mais visível em veículo, filtros, serviços e horários.
2. Cartões com bordas, sombras e maior contraste em textos de preços.
3. Estados de foco acessíveis e transições reduzidas para usuários que preferem menos movimento.
4. Espaçamento adicional para reduzir sobreposição com o botão flutuante do chat.
5. Resposta local sobre lavagem completa corrigida para apresentar preços ilustrativos dessa categoria.

## Limites de QA

As capturas do navegador foram **observadas durante a revisão**, mas não foram exportadas para arquivos locais. Não foi produzida a comparação visual lado a lado, em tamanho normalizado, exigida para uma aprovação formal de fidelidade. A versão também não foi testada no Windows real, em múltiplos tamanhos de tela ou com uma chave Groq válida.

**final result: blocked**

Para concluir o QA formal, capture as seis telas no dispositivo de apresentação, compare-as com as referências e registre eventuais ajustes antes de marcar a interface como definitivamente validada.
