import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Verifica a montagem de interface com os dados demonstrativos,
// sem navegador ou bibliotecas adicionais.
function interfaceFixture() {
  const elements = new Map();
  const document = {
    querySelector(selector) {
      if (!elements.has(selector)) {
        elements.set(selector, {
          innerHTML: '',
          dataset: {},
          classList: { toggle() {}, add() {}, remove() {} },
          addEventListener() {},
        });
      }
      return elements.get(selector);
    },
    addEventListener() {},
  };
  const context = vm.createContext({
    document,
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
  });
  const script = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(script, /\binit\(\);\s*$/);
  // Não realiza chamadas HTTP nos testes de renderização.
  vm.runInContext(script.replace(/\binit\(\);\s*$/, ''), context);
  vm.runInContext(`
    state.estabelecimentos = [{
      id: 'brilho', nome: 'Lava Jato Brilho', nota: 4.8, avaliacoes: 120,
      distancia: 1.2, carro: 40, moto: 25, retirada: 10,
      completaCarro: 60, completaMoto: 40, funcionario: 'Equipe de teste'
    }];
    state.lavaJatoId = 'brilho';
    state.horarios = [
      { horario: '09:00', disponivel: true },
      { horario: '10:00', disponivel: false }
    ];
    state.horario = '';
    state.pedido = {
      id: 'pedido-exemplo', loja: 'Lava Jato Brilho', lavaJatoId: 'brilho',
      funcionario: 'Equipe de teste', endereco: 'Rua Fictícia, 123',
      data: state.data, horario: '09:00', servico: 'simples', veiculo: 'carro',
      valorServico: 40, valorRetirada: 10, total: 50, retirada: true, etapa: 2
    };
  `, context);
  return {
    html(expression) { return vm.runInContext(expression, context); },
    elements,
  };
}

test('navegação mostra Assistente IA imediatamente depois de Perfil', () => {
  const ui = interfaceFixture();
  ui.html('renderTabs()');
  const nav = ui.elements.get('#tabbar').innerHTML;
  assert.equal((nav.match(/class="tab\b/g) || []).length, 4);
  assert.equal((nav.match(/data-action="tab"/g) || []).length, 3);
  assert.equal((nav.match(/data-action="chat"/g) || []).length, 1);
  assert.match(nav, /Início/);
  assert.match(nav, /Pedidos/);
  assert.match(nav, /Perfil/);
  assert.match(nav, /Assistente IA/);
  assert.ok(nav.indexOf('Perfil') < nav.indexOf('Assistente IA'));
  assert.match(nav, /aria-controls="chatPanel"/);
  assert.doesNotMatch(nav, /data-screen="chat"/);
});

test('seis telas mantêm os principais componentes do fluxo aprovado', () => {
  const ui = interfaceFixture();
  const screens = {
    inicio: ui.html('home()'),
    lista: ui.html('list()'),
    detalhes: ui.html('details()'),
    agendamento: ui.html('agendamento()'),
    acompanhamento: ui.html('tracking()'),
    entrega: ui.html('delivery()'),
  };
  assert.match(screens.inicio, /Buscar lava-jatos/);
  assert.match(screens.inicio, /Carro/);
  assert.match(screens.inicio, /Moto/);
  assert.doesNotMatch(screens.inicio, /assistant-teaser/);
  assert.match(screens.lista, /Lava Jato Brilho/);
  assert.match(screens.detalhes, /Lavagem completa/);
  assert.match(screens.agendamento, /Confirmar pedido/);
  assert.match(screens.acompanhamento, /Indo buscar o veículo/);
  assert.match(screens.entrega, /Confirmar recebimento/);
  assert.match(screens.entrega, /Informar problema/);
  Object.values(screens).forEach((html) => {
    assert.equal((html.match(/<button\b/g) || []).length, (html.match(/<\/button>/g) || []).length);
  });
});

test('agendamento exige um horário disponível antes de confirmar', () => {
  const ui = interfaceFixture();
  const screen = ui.html('agendamento()');
  assert.match(screen, /data-horario="10:00"[^>]*disabled/);
  assert.match(screen, /data-action="confirmar-pedido" disabled/);
});

test('assistente também continua acessível pelo acompanhamento e Perfil', () => {
  const ui = interfaceFixture();
  assert.match(ui.html('tracking()'), /data-action="chat"/);
  assert.match(ui.html('tracking()'), /Falar com o lava-jato/);
  assert.match(ui.html('perfil()'), /Assistente de IA Lava Mais/);
  assert.match(ui.html('perfil()'), /data-action="chat"/);
});

test('áreas de desktop e celular têm estrutura responsiva', () => {
  const ui = interfaceFixture();
  assert.match(ui.html('home()'), /class="home-layout"/);
  assert.match(ui.html('list()'), /class="store-grid"/);
  assert.match(ui.html('details()'), /class="details-content"/);
  assert.match(ui.html('agendamento()'), /class="booking-layout"/);
  const css = readFileSync(new URL('../public/app.css', import.meta.url), 'utf8');
  assert.match(css, /@media \(min-width: 821px\)/);
  assert.match(css, /@media \(max-width: 820px\)/);
  assert.match(css, /\.home-layout\s*\{\s*display:\s*grid/);
  assert.match(css, /\.store-grid\s*\{\s*display:\s*grid/);
  assert.match(css, /\.chat-panel\s*\{\s*position:\s*fixed/);
});

test('endereço abre duas opções e formulário manual funcional', () => {
  const ui = interfaceFixture();
  ui.html("$('#modal').dataset.mode = 'endereco'; locationDraft.mode = 'gps'; renderAddressModal()");
  const gps = ui.elements.get('#modal').innerHTML;
  assert.match(gps, /Endereço de retirada/);
  assert.match(gps, /Minha localização/);
  assert.match(gps, /Inserir manualmente/);
  assert.match(gps, /data-action="localizacao-atual"/);
  assert.match(gps, /Salvar/);
  assert.match(gps, /disabled/);

  ui.html("locationDraft.mode = 'manual'; locationDraft.manual = 'Rua das Flores, 123, Centro'; renderAddressModal()");
  const manual = ui.elements.get('#modal').innerHTML;
  assert.match(manual, /id="modalAddress"/);
  assert.match(manual, /Rua das Flores, 123, Centro/);
  assert.doesNotMatch(manual, /data-action="localizacao-atual"/);
});

test('mapa possui marcador, e endereço do navegador não entra na API pública', () => {
  const ui = interfaceFixture();
  const url = ui.html("mapUrl(-7.532, -46.036)");
  assert.match(url, /openstreetmap.org\/export\/embed.html/);
  assert.match(url, /marker=-7\.532000%2C-46\.036000/);
  const javascript = readFileSync(new URL('../public/app.js', import.meta.url), 'utf8');
  assert.match(javascript, /endereco: 'Endereço informado na interface'/);
  assert.match(javascript, /navigator\.geolocation\.watchPosition/);
  assert.match(javascript, /navigator\.geolocation\.clearWatch/);
});

test('chat local responde sem instruções sobre chaves ou arquivos do servidor', () => {
  const backend = readFileSync(new URL('../server.js', import.meta.url), 'utf8');
  assert.doesNotMatch(backend, /configure a chave no arquivo \.env do servidor/i);
  assert.match(backend, /endereço.*retirada/);
});
