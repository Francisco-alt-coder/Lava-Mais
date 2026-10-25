# Revisão visual e funcional · Lava Mais 2.1.0

## Evidências e contexto

- **Referência principal:** `docs/referencias/01-inicio-v2.png`; telas 02 a 06 na mesma pasta.
- **Implementação:** `public/index.html`, `public/app.css` e `public/app.js`.
- **Captura renderizada:** observada no navegador em uma comparação lado a lado, mas **não exportada para arquivo local**. O comparador temporário foi removido do pacote.
- **Viewport comparado:** navegador de aproximadamente 1340 × 900 px, com implementação em área de 393 × 735 CSS px.
- **Dimensões:** a referência original foi exibida proporcionalmente em uma área de 393 × 735 px; a implementação foi renderizada em iframe com o mesmo tamanho CSS. A referência inclui moldura de telefone, o iframe não.
- **Estado visual comparado lado a lado:** tela inicial, veículo carro selecionado, endereço fictício.
- **Outros estados observados no navegador:** lista, detalhes, agendamento inválido e válido, acompanhamento, entrega, confirmação e chatbot local.

## Comparação e ajustes

| Superfície  | Resultado observado                                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Tipografia  | Hierarquia em azul-marinho com fonte Nunito Sans e fallbacks; aproxima-se da aparência arredondada da referência                         |
| Espaçamento | Cartões, CTA e navegação móvel em posições compatíveis; a tela inicial foi compactada para manter o botão principal visível em 393 × 735 |
| Cores       | Azul elétrico nas ações, turquesa nas seleções e azul-marinho no texto, de acordo com a linguagem das referências                        |
| Imagens     | Nova ilustração vetorial de carro branco e água na abertura; recortes de carro, moto, lavagem e transporte são assets independentes      |
| Textos      | Fluxo das seis telas preservado; avisos deixam claro que dados, entregas e avaliações são simulados                                      |
| Estados     | Seleção de veículo e serviço, indisponibilidade às 10:00, avaliação por estrelas e confirmação estão visíveis                            |

### Histórico de correções

1. **P2, abertura móvel:** antes da correção, o botão `Buscar lava-jatos` ficava abaixo da região visível em 393 × 735. Foi removido o cabeçalho vazio da tela inicial, reduzida a altura da ilustração e compactados os cartões. Nova comparação lado a lado mostrou o CTA visível acima da navegação.
2. **P2, sobreposição:** o atalho flutuante do chat encobria parte de ações e cartões. Ele foi substituído por acessos em Início, Perfil e Acompanhamento. A tela inicial foi observada novamente sem sobreposição.
3. **P2, identidade das imagens:** a primeira imagem de abertura era excessivamente fotográfica. Foi substituída por ilustração de carro branco com ondas e bolhas mais próxima da referência.

## Interações verificadas

- Seleção de veículo, abertura do catálogo e detalhe de estabelecimento.
- Escolha de lavagem e retirada/devolução.
- Exibição de horário indisponível, seleção de 09:30 e criação do pedido de demonstração.
- Avanço manual pelas etapas, entrega, avaliação com cinco estrelas e confirmação.
- Envio de pergunta ao chatbot com resposta local identificada como demonstração.
- Logs inspecionados: não foi observado erro originado pela aplicação; os erros mostrados pertenciam a uma extensão do navegador.

## Pendências

- Exportar as capturas renderizadas e arquivar comparações normalizadas das seis telas para uma aprovação formal.
- Repetir a verificação em aparelhos físicos e nos navegadores da equipe.
- Confirmar com a equipe se as diferenças residuais de imagem, fonte e dimensão são aceitáveis.
- Validar a integração Groq com uma **nova chave** autorizada, se esse modo for necessário.

**final result: blocked**

O bloqueio acima diz respeito à **evidência formal de fidelidade visual**, pois as capturas do navegador não foram salvas como arquivos. Ele não invalida a execução dos testes automatizados ou das interações observadas, mas impede declarar a aparência como definitivamente aprovada pela equipe.
