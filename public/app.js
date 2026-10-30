// Lava Mais: interface em JavaScript puro para facilitar a leitura acadêmica.
// O servidor fornece os dados; este arquivo controla telas, eventos e mensagens.
const $ = (selector) => document.querySelector(selector);
// O identificador do pedido é lembrado no navegador, mas o pedido fica no servidor.
const storageGet = (k) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const storageSet = (k, v) => {
  try {
    localStorage.setItem(k, v);
  } catch {}
};
const storageDelete = (k) => {
  try {
    localStorage.removeItem(k);
  } catch {}
};
const paths = {
  back: '<path d="m15 18-6-6 6-6"/><path d="M9 12h12"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  car: '<path d="M5 17H3V9l3-5h12l3 5v8h-2"/><path d="M5 17h14M3 10h18M6 10l2-4h8l2 4"/><circle cx="7.5" cy="16" r="1.5"/><circle cx="16.5" cy="16" r="1.5"/>',
  bike: '<circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="m9 17 3-8 4 0 3 8M12 9l-2-3H7m9 0h3"/>',
  store:
    '<path d="M3 10V21h18V10M3 10l2-7h14l2 7M3 10h18M8 21v-8h8v8M3 10c0 3 4 3 4 0 0 3 4 3 4 0 0 3 4 3 4 0 0 3 5 3 5 0"/>',
  star: '<polygon points="12 2 15.1 8.5 22 9.3 17 14.2 18.2 21.2 12 17.8 5.8 21.2 7 14.2 2 9.3 8.9 8.5 12 2"/>',
  truck:
    '<path d="M1 5h14v13H1zM15 10h4l4 4v4h-8M5 18h3m11 0h1"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>',
  home: '<path d="m3 10 9-8 9 8v11h-7v-7h-4v7H3Z"/>',
  orders: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  user: '<circle cx="12" cy="7" r="4"/><path d="M4 22v-3a8 8 0 0 1 16 0v3"/>',
  bot: '<rect x="3" y="7" width="18" height="14" rx="4"/><path d="M12 3v4M9 3h6M7 13h.1M17 13h.1M8 17h8"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  calendar:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h2m3 0h2"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m4 12 5 5L20 6"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
  message: '<path d="M21 12a8 8 0 0 1-8 8H4l2-4A8 8 0 1 1 21 12Z"/><path d="M9 11h7m-7 4h4"/>',
  phone: '<path d="M7 2 4 5c-2 2 1 9 5 13s11 7 13 5l-3-4-5 1-5-5 1-5Z"/>',
  refresh: '<path d="M20 7A9 9 0 0 0 4 8M4 3v5h5M4 17a9 9 0 0 0 16-1m0 5v-5h-5"/>',
  alert: '<circle cx="12" cy="12" r="10"/><path d="M12 7v6m0 4h.01"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  droplets:
    '<path d="M12 3C10 7 6 10 6 14a6 6 0 0 0 12 0c0-4-4-7-6-11ZM19 3c-1 2-1 3 0 4s2 0 2-1-1-2-2-3Z"/>',
  sparkle: '<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5Z"/>',
  close: '<path d="M5 5 19 19M19 5 5 19"/>',
};
// Ícones SVG locais, sem biblioteca adicional.
const icon = (name, className = '') =>
  `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.sparkle}</svg>`;
// Escapa textos antes de colocá-los no HTML, evitando interpretar tags digitadas.
const h = (text = '') =>
  String(text).replace(
    /[&<>"']/g,
    (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char],
  );
const brl = (n) => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const decimal = (n) => Number(n).toFixed(1).replace('.', ',');
const nomeServico = (tipo) => (tipo === 'completa' ? 'Lavagem completa' : 'Lavagem simples');
const localDate = () =>
  new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'America/Fortaleza',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
function amanha() {
  const dt = new Date(localDate() + 'T12:00:00Z');
  dt.setUTCDate(dt.getUTCDate() + 1);
  return dt.toISOString().slice(0, 10);
}
function diaFormatado(iso) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso + 'T12:00:00Z'));
}

// Estado temporário da interface. Não substitui banco de dados ou autenticação.
const state = {
  screen: 'inicio',
  veiculo: 'carro',
  filtro: 'todos',
  lavaJatoId: 'brilho',
  estabelecimentos: [],
  servico: 'simples',
  retirada: true,
  endereco: 'Rua das Flores, 123, Bairro Centro - Cidade/UF',
  data: amanha(),
  horario: '',
  horarios: [],
  pedido: null,
  avaliacao: 0,
  chatOpen: false,
  chatBusy: false,
  mensagens: [
    {
      role: 'assistant',
      content:
        'Olá! Posso ajudar a escolher sua lavagem, consultar preços, informar o endereço de retirada ou acompanhar um pedido. Como posso ajudar?',
    },
  ],
  chatMode: '',
  favoritos: new Set(),
};
const locationDraft = {
  mode: 'gps', manual: '', address: '', lat: null, lon: null, accuracy: null,
  status: 'idle', error: '', watchId: null, reverseStarted: false,
  lastUpdate: '', lastMapLat: null, lastMapLon: null, requestToken: 0, requiresManual: false,
};
// Posição GPS usada somente enquanto o modal estiver aberto.
const loja = () =>
  state.estabelecimentos.find((e) => e.id === state.lavaJatoId) || state.estabelecimentos[0];
const valorServico = () => {
  const l = loja();
  if (!l) return 0;
  return state.servico === 'simples'
    ? l[state.veiculo]
    : l[`completa${state.veiculo === 'carro' ? 'Carro' : 'Moto'}`];
};
const valorRetirada = () => (state.retirada ? loja()?.retirada || 0 : 0);
function notify(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => el.classList.add('hidden'), 3300);
}
// Todas as chamadas à API passam por esta função e tratam erros HTTP.
async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
  } catch {
    throw Error('Não foi possível conectar com a API. Verifique se o servidor está ligado.');
  }
  let json;
  try {
    json = await response.json();
  } catch {
    throw Error('Resposta inválida da API.');
  }
  if (!response.ok) throw Error(json.erro || `Erro HTTP ${response.status}`);
  return json;
}
function renderHeader() {
  const titles = {
    inicio: '',
    lista: 'Lava-jatos próximos',
    detalhes: loja()?.nome || 'Detalhes',
    agendamento: 'Agendamento',
    acompanhar: 'Acompanhar pedido',
    entrega: 'Entrega do veículo',
    pedidos: 'Meus pedidos',
    perfil: 'Meu perfil',
  };
  const screen = state.screen;
  $('#header').classList.toggle('hidden', screen === 'inicio');
  $('#header').innerHTML =
    `${screen !== 'inicio' ? `<button class="back" data-action="voltar" aria-label="Voltar">${icon('back')}</button>` : ''}<h1>${h(titles[screen] || '')}</h1>${screen === 'detalhes' ? `<button class="heart-btn ${state.favoritos.has(state.lavaJatoId) ? 'selected' : ''}" data-action="favorito" aria-label="Favoritar lava-jato">${icon('heart')}</button>` : ''}`;
}
// Cada função a seguir monta uma tela; render() escolhe qual mostrar.
function renderTabs() {
  // Quatro opções: assistente ao lado de Perfil, sem trocar a tela do pedido.
  const visible = ['inicio', 'lista', 'pedidos', 'perfil'].includes(state.screen);
  $('#tabbar').classList.toggle('hidden', !visible);
  $('#page').classList.toggle('no-nav', !visible);
  const entries = [
    ['inicio', 'home', 'Início'],
    ['pedidos', 'orders', 'Pedidos'],
    ['perfil', 'user', 'Perfil'],
    ['chat', 'bot', 'Assistente IA'],
  ];
  $('#tabbar').innerHTML =
    `<div class="desktop-brand" aria-label="Lava Mais">${icon('car')}<strong>Lava <span>Mais</span></strong></div>` +
    entries.map(([screen, symbol, label]) => {
      const assistant = screen === 'chat';
      const selected = assistant ? state.chatOpen : screen === state.screen ||
        (state.screen === 'lista' && screen === 'inicio');
      return `<button type="button" class="tab ${selected ? 'active' : ''}"
        data-action="${assistant ? 'chat' : 'tab'}"
        ${assistant ? `aria-haspopup="dialog" aria-controls="chatPanel" aria-expanded="${state.chatOpen}"` : `data-screen="${screen}" aria-current="${selected ? 'page' : 'false'}"`}
        aria-label="${label}">
        ${icon(symbol)}<span>${label}</span>
      </button>`;
    }).join('');
}
function addressCard() {
  return `<button class="location-card" type="button" aria-label="Abrir opções de endereço de retirada" data-action="endereco"><span class="location-icon">${icon('pin')}</span><span><strong>${h(state.endereco.split(',').slice(0, 2).join(',') || 'Definir endereço')}</strong><br>${h(state.endereco.split(',').slice(2).join(',').trim() || 'Toque para alterar')}</span>${icon('chevron', 'chevron')}</button>`;
}
function home() {
  return `<div class="home-layout"><section class="home-hero">
      <div class="hero-brand"><span class="hero-icon">${icon('car')}</span><strong>Lava Mais</strong></div>
      <h2>Seu veículo limpo sem sair de casa</h2>
      <p>Agende, acompanhe e receba seu veículo com tranquilidade.</p>
    </section>
    <section class="home-controls">
    <h2 class="label-title">${icon('pin')} Sua localização</h2>
    ${addressCard()}
    <h2 class="choice-heading">Qual é o seu veículo?</h2>
    <div class="vehicles">
      <button type="button" class="vehicle ${state.veiculo === 'carro' ? 'active' : ''}"
        data-action="veiculo" data-veiculo="carro" aria-pressed="${state.veiculo === 'carro'}">
        <span class="vehicle-symbol">${icon('car')}</span><strong>Carro</strong>
      </button>
      <button type="button" class="vehicle ${state.veiculo === 'moto' ? 'active' : ''}"
        data-action="veiculo" data-veiculo="moto" aria-pressed="${state.veiculo === 'moto'}">
        <span class="vehicle-symbol">${icon('bike')}</span><strong>Moto</strong>
      </button>
    </div>
    <div class="home-bottom"><button class="primary-btn" data-action="buscar">Buscar lava-jatos ${icon('arrow')}</button></div>
    </section></div>
    <p class="small-warning">Catálogo ilustrativo. Nenhum serviço real é contratado nesta versão.</p>`;
}
function storeCard(e) {
  return `<button class="store-card" data-action="abrir-loja" data-id="${h(e.id)}">
      <div class="store-main">
        <span class="store-symbol">${icon('store')}</span>
        <span class="store-copy">
          <strong class="store-name">${h(e.nome)}</strong>
          <span class="store-rating">${icon('star')} <b>${decimal(e.nota)}</b> (${e.avaliacoes}) · ${decimal(e.distancia)} km*</span>
          <span class="store-prices">Carro <b>${brl(e.carro)}</b> · Moto <b>${brl(e.moto)}</b></span>
        </span>
        <span class="store-right">${icon('chevron')}</span>
      </div>
      <div class="pickup-row">${icon('truck')} Retirada e devolução: <strong>${e.retirada === 0 ? 'grátis' : brl(e.retirada)}</strong></div>
    </button>`;
}
function list() {
  const items = state.estabelecimentos.filter((e) => state.filtro === 'todos' || e[state.filtro] != null);
  return `<div class="filter-row">${[
    ['todos','Todos'],['carro','Carro'],['moto','Moto']
  ].map(([v,label]) =>
    `<button class="pill ${state.filtro === v ? 'active' : ''}" data-action="filtro" data-filtro="${v}" aria-pressed="${state.filtro === v}">${label}</button>`
  ).join('')}</div>
  <p class="list-hint">${icon('pin')} Opções ilustrativas de lava-jatos</p>
  <section class="store-grid" aria-label="Lava-jatos disponíveis">${items.map(storeCard).join('') || '<p class="muted-small">Nenhum estabelecimento para esse filtro.</p>'}</section>
  <p class="small-warning">*Avaliações e distâncias são ilustrativas e não calculadas pelo GPS.</p>`;
}
function details() {
  const e = loja();
  if (!e) return '<div class="loading">Carregando catálogo...</div>';
  const simple = e[state.veiculo];
  const completa = e[`completa${state.veiculo === 'carro' ? 'Carro' : 'Moto'}`];
  return `<section class="details-banner">
      <span class="store-symbol large">${icon('store')}</span>
      <div><strong>Lavagem com retirada</strong><span>${icon('star')} ${decimal(e.nota)} · ${e.avaliacoes} avaliações fictícias</span>
      <span>${icon('pin')} ${decimal(e.distancia)} km ilustrativos</span></div>
    </section>
    <div class="details-content"><section class="details-services">
    <h2 class="section-title">Serviços disponíveis</h2>
    <div class="segment">
      <button data-action="veiculo" data-veiculo="carro" class="${state.veiculo === 'carro' ? 'active' : ''}" aria-pressed="${state.veiculo === 'carro'}">Carro</button>
      <button data-action="veiculo" data-veiculo="moto" class="${state.veiculo === 'moto' ? 'active' : ''}" aria-pressed="${state.veiculo === 'moto'}">Moto</button>
    </div>
    <button class="service-choice ${state.servico === 'simples' ? 'is-selected' : ''}" data-action="servico" data-servico="simples" aria-pressed="${state.servico === 'simples'}">
      <span class="radio-look ${state.servico === 'simples' ? 'active' : ''}"></span>
      <span class="service-text"><strong>Lavagem simples</strong><small>Lavagem externa</small></span><b>${brl(simple)}</b>
    </button>
    <button class="service-choice ${state.servico === 'completa' ? 'is-selected' : ''}" data-action="servico" data-servico="completa" aria-pressed="${state.servico === 'completa'}">
      <span class="radio-look ${state.servico === 'completa' ? 'active' : ''}"></span>
      <span class="service-text"><strong>Lavagem completa</strong><small>Limpeza externa e interna</small></span><b>${brl(completa)}</b>
    </button>
    <label class="pickup-option">${icon('truck')}
      <span><strong>Retirada e devolução: ${e.retirada === 0 ? 'grátis' : brl(e.retirada)}</strong><small>Serviço demonstrativo de busca e entrega.</small></span>
      <input type="checkbox" id="retirada" ${state.retirada ? 'checked' : ''}/>
    </label></section>
    <aside class="details-aside"><section class="safety">${icon('shield')}<div><h3>Informações do atendimento</h3>
      <ul><li>Acompanhamento das etapas do pedido</li><li>Confirmação de recebimento e avaliação</li><li>Registro de problemas do pedido</li></ul>
    </div></section>
    <button class="primary-btn" data-action="ir-agendamento">Escolher serviço ${icon('arrow')}</button></aside></div>
    <p class="small-warning">Não há prestadores reais nem verificação de identidade nesta versão.</p>`;
}
function summary(pedido = null) {
  const e = loja();
  const v = pedido?.veiculo || state.veiculo,
    s = pedido?.servico || state.servico,
    r = pedido?.retirada ?? state.retirada,
    serviceValue = pedido?.valorServico ?? valorServico(),
    pickupValue = pedido?.valorRetirada ?? valorRetirada(),
    total = pedido?.total ?? serviceValue + pickupValue;
  return `<div class="summary"><h3>Resumo do pedido</h3><h4>${h(pedido?.loja || e?.nome || 'Lava Mais')}</h4><div class="sum-row"><span>${nomeServico(s)} (${v === 'carro' ? 'Carro' : 'Moto'})</span><span>${brl(serviceValue)}</span></div>${r ? `<div class="sum-row"><span>Retirada e devolução</span><span>${brl(pickupValue)}</span></div>` : ''}<div class="sum-row total"><span>Total ${pedido ? '' : 'previsto'}</span><span>${brl(total)}</span></div></div>`;
}
function agendamento() {
  const selecionado = state.horarios.find((t) => t.horario === state.horario);
  const disponivel = selecionado?.disponivel === true;
  const slotButtons = state.horarios.length ? state.horarios.map((t) =>
    `<button type="button" class="time-option ${state.horario === t.horario ? 'active' : ''} ${!t.disponivel ? 'unavailable' : ''}"
      data-action="horario" data-horario="${t.horario}"
      aria-label="${t.horario}${t.disponivel ? '' : ' indisponível'}" aria-pressed="${state.horario === t.horario}"
      ${!t.disponivel ? 'disabled' : ''}>${t.horario}</button>`
  ).join('') : '<p class="muted-small">Consultando horários disponíveis...</p>';
  return `<div class="booking-layout"><section class="booking-fields"><div class="field-block">
      <label>${icon('pin')} Endereço de retirada</label>${addressCard()}
    </div>
    <div class="field-block">
      <label for="agData">${icon('calendar')} Data da retirada</label>
      <input id="agData" class="date-input" type="date" min="${localDate()}" value="${h(state.data)}">
    </div>
    <div class="field-block">
      <label>${icon('clock')} Horário da retirada</label>
      <div class="time-grid">${slotButtons}</div>
      <p class="slot-help">${state.horarios.length ? (disponivel ? 'Horário escolhido para a simulação.' : 'Escolha um dos horários disponíveis acima.') : 'Aguarde a consulta de horários.'}</p>
      ${state.horarios.length && !state.horarios.some((t) => t.disponivel)
        ? `<div class="error-box">${icon('alert')} Não há horários disponíveis nesta data. Escolha outra.</div>` : ''}
    </div></section><aside class="booking-summary">
    ${summary()}
    <div class="action-bottom">
      <button class="primary-btn" data-action="confirmar-pedido" ${!disponivel ? 'disabled' : ''}>
        Confirmar pedido ${icon('arrow')}
      </button>
    </div>
    <p class="small-warning">Agendamento ilustrativo, sem pagamento nem contratação real.</p></aside></div>`;
}
function tracking() {
  const p = state.pedido;
  if (!p) return emptyPedidos();
  const stages = ['Pedido confirmado','Indo buscar o veículo','Veículo retirado','Lavagem em andamento','Indo devolver','Veículo entregue'];
  const timeline = stages.map((s,i) =>
    `<div class="timeline-item"><span class="timeline-dot ${p.etapa > i ? 'done' : p.etapa === i ? 'current' : ''}">${p.etapa > i ? icon('check') : ''}</span>
      <div class="timeline-detail"><strong class="${p.etapa >= i ? 'done-text' : ''}">${s}</strong>${i === p.etapa ? '<small>Etapa atual · simulação</small>' : ''}</div>
    </div>`
  ).join('');
  return `<section class="tracking-layout">
      <div class="tracking-primary">
        <div class="employee"><span class="avatar">${icon('user')}</span><div class="bio">
          <span>Equipe de exemplo</span><strong>${h(p.funcionario)}</strong><span>${h(p.loja)}</span>
        </div></div>
        <div class="timeline">${timeline}</div>
      </div>
      <aside class="tracking-side">
        <section class="status-panel"><p>${icon('truck')} Status do pedido</p>
          <strong>${h(stages[Math.min(p.etapa,5)])}</strong>
          <span>Atualização manual para fins acadêmicos. Não há localização ou previsão em tempo real.</span></section>
        <section class="tracking-address">${icon('shield')}<div><strong>Endereço informado</strong><p>${h(p.endereco)}</p></div></section>
      </aside>
    </section>
    <div class="tracking-actions">
      <button class="secondary-btn" data-action="chat" aria-label="Falar com o assistente virtual do Lava Mais">${icon('message')} Falar com o lava-jato</button>
      <button class="primary-btn" data-action="atualizar">${icon('refresh')} Atualizar</button>
    </div>
    ${p.etapa < 5 ? `<button class="stage-next" data-action="avancar" aria-label="Avançar etapa da demonstração">Avançar etapa de teste ${icon('arrow')}</button>` : ''}
    <p class="small-warning">O botão de conversa abre o assistente virtual. Nenhuma mensagem é enviada a um lava-jato real. O acompanhamento é manual.</p>`;
}
function delivery() {
  const p = state.pedido;
  if (!p) return emptyPedidos();
  if (p.etapa === 6)
    return `<section class="delivery-confirmed"><div class="big-check">${icon('check')}</div>
      <h2>Recebimento confirmado!</h2><p>Sua avaliação foi registrada apenas nesta demonstração.</p>
      ${summary(p)}<button class="primary-btn" data-action="inicio">Voltar ao início ${icon('arrow')}</button></section>`;
  const stars = [1,2,3,4,5].map((n) =>
    `<button type="button" data-action="avaliar" data-nota="${n}" class="star-btn ${state.avaliacao >= n ? 'selected' : ''}"
       aria-label="Avaliar ${n} estrelas" aria-pressed="${state.avaliacao === n}">
       <svg viewBox="0 0 24 24" style="fill:${state.avaliacao >= n ? '#f0ab25' : 'transparent'}">${paths.star}</svg>
     </button>`
  ).join('');
  return `<section class="deliver-hero"><span class="big-check">${icon('check')}</span>
      <div><h2>Seu veículo foi devolvido!</h2><p>Confira o veículo e confirme o recebimento.</p></div>
    </section>
    <div class="delivery-layout">
      <section class="delivery-summary">${summary(p)}</section>
      <section class="rating-panel"><h3>Como foi o serviço?</h3>
        <p>Sua avaliação ajuda nesta simulação.</p><div class="stars">${stars}</div>
        <small>${state.avaliacao ? `${state.avaliacao} de 5 estrelas selecionadas` : 'Selecione de 1 a 5 estrelas'}</small>
      </section>
    </div>
    <div class="stack-buttons delivery-actions">
      <button class="primary-btn" data-action="confirmar-entrega" ${!state.avaliacao ? 'disabled' : ''}>Confirmar recebimento</button>
      <button class="secondary-btn issue-btn" data-action="problema">${icon('alert')} Informar problema</button>
    </div>
    <p class="small-warning">Avaliação e relato ficam somente no servidor local enquanto ele estiver ligado.</p>`;
}
function emptyPedidos() {
  return `<div class="empty-state">${icon('orders')}<h2>Nenhum pedido por aqui</h2><p>Faça um agendamento de demonstração para acompanhar o pedido.</p><button class="primary-btn" data-action="inicio">Buscar lava-jatos ${icon('arrow')}</button></div>`;
}
function pedidos() {
  return state.pedido
    ? `<button class="order-mini" data-action="abrir-pedido"><strong>${h(state.pedido.loja)}</strong><span>${h(state.pedido.data)} às ${h(state.pedido.horario)} · ${nomeServico(state.pedido.servico)} · ${brl(state.pedido.total)}</span><strong>Etapa: ${['Confirmado', 'Buscando veículo', 'Veículo retirado', 'Lavando', 'Devolvendo', 'Entregue', 'Concluído'][state.pedido.etapa]} →</strong></button><p class="small-warning">Pedido simulado, não enviado ao estabelecimento.</p>`
    : emptyPedidos();
}
function perfil() {
  return `<div class="empty-state profile-content">${icon('user')}<h2>Meu perfil</h2><p>Esta versão acadêmica não possui cadastro de usuário nem autenticação.</p></div>
    <h2 class="label-title">${icon('pin')} Endereço demonstrativo</h2>${addressCard()}
    <section class="assistant-teaser"><span class="assistant-teaser-icon">${icon('bot')}</span>
      <div><strong>Assistente de IA Lava Mais</strong><small>Converse sobre os serviços e o agendamento.</small></div>
      <button class="assistant-open" data-action="chat" aria-label="Conversar com a IA">${icon('chevron')}</button>
    </section>
    <p class="small-warning">Não informe dados pessoais verdadeiros. Os estabelecimentos são fictícios.</p>`;
}
function render() {
  // A tela atual é escolhida pelo estado, sem precisar recarregar a página.
  renderHeader();
  renderTabs();
  const screens = {
    inicio: home,
    lista: list,
    detalhes: details,
    agendamento,
    acompanhar: tracking,
    entrega: delivery,
    pedidos,
    perfil,
  };
  $('#page').innerHTML = (screens[state.screen] || home)();
}
function navigate(dest) {
  state.screen = dest;
  render();
  $('#page').scrollTop = 0;
  // Em desktop, a rolagem é do documento inteiro.
  if (typeof window !== 'undefined' && window.scrollY > 0) window.scrollTo(0, 0);
}
// Consulta o servidor sempre que o estabelecimento ou a data mudam.
function loadSlots() {
  const selectedDate=state.data, selectedStore=state.lavaJatoId;
  state.horarios = [];
  if(state.screen === 'agendamento') render();
  return api(`/api/horarios?lavaJatoId=${encodeURIComponent(selectedStore)}&data=${encodeURIComponent(selectedDate)}`)
    .then((j) => {
      if(state.data !== selectedDate || state.lavaJatoId !== selectedStore) return;
      state.horarios = j.horarios;
      if(!state.horarios.some((t) => t.horario === state.horario && t.disponivel)) state.horario = '';
    })
    .catch((e) => {
      if(state.data !== selectedDate || state.lavaJatoId !== selectedStore) return;
      state.horarios = [];
      state.horario = '';
      notify(e.message);
    })
    .finally(() => {
      if(state.data === selectedDate && state.lavaJatoId === selectedStore && state.screen === 'agendamento') render();
    });
}
async function loadPedido() {
  if (!state.pedido) return false;
  try {
    state.pedido = (await api(`/api/pedidos/${state.pedido.id}`)).pedido;
  } catch (e) {
    notify(e.message);
    return false;
  }
  render();
  return true;
}
function stopLocationWatch() {
  locationDraft.requestToken++;
  if (locationDraft.watchId !== null && typeof navigator !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.clearWatch(locationDraft.watchId);
  }
  locationDraft.watchId = null;
}

function openAddressModal() {
  stopLocationWatch();
  Object.assign(locationDraft, {mode:'gps',manual:state.endereco,address:'',lat:null,lon:null,accuracy:null,status:'idle',error:'',reverseStarted:false,lastUpdate:'',lastMapLat:null,lastMapLon:null,requiresManual:false});
  $('#modal').dataset.mode = 'endereco';
  $('#modal').classList.remove('hidden');
  renderAddressModal();
  $('#modal').querySelector('[data-action="localizacao-atual"]')?.focus();
}

function mapUrl(lat, lon) {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat)>90 || Math.abs(lon)>180) return '';
  const bbox = [lon-.0045,lat-.0035,lon+.0045,lat+.0035].map(v=>v.toFixed(5)).join(',');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat.toFixed(6)}%2C${lon.toFixed(6)}`;
}

function renderAddressModal() {
  const el=$('#modal');
  if (el.dataset.mode !== 'endereco') return;
  const gps=locationDraft.mode === 'gps';
  const positioned=Number.isFinite(locationDraft.lat)&&Number.isFinite(locationDraft.lon);
  const text=locationDraft.error || (locationDraft.status==='loading' ? 'Aguardando sua permissão e consultando o endereço...' : `Localização obtida às ${locationDraft.lastUpdate}. Confira antes de salvar.`);
  const body=gps?`<div class="location-choice">
    <div class="location-choice-title">${icon('pin')}<div><strong>Usar minha localização atual</strong>
       <p>Permita o acesso à sua posição para sugerir um endereço de retirada.</p></div></div>
    <button type="button" class="primary-btn location-detect" data-action="localizacao-atual">
       ${icon('pin')} ${locationDraft.status==='loading'?'Localizando...':positioned?'Atualizar localização':'Usar minha localização atual'}
    </button>
    ${locationDraft.status!=='idle'?`<div class="gps-status ${locationDraft.error?'has-error':''}" role="status">${icon(locationDraft.error?'alert':'check')}<span>${h(text)}</span></div>`:''}
    ${positioned?`<div class="location-map"><iframe loading="lazy" title="Mapa da localização atual" referrerpolicy="no-referrer" src="${mapUrl(locationDraft.lat,locationDraft.lon)}"></iframe></div>
    <div class="gps-address">${icon('pin')}<div><strong>${h(locationDraft.address || 'Localização encontrada. Confirme o endereço.')}</strong>
      <small>Precisão aproximada: ${Math.round(locationDraft.accuracy||0)} m. Verifique rua e número.</small></div>
      <button type="button" data-action="endereco-editar" aria-label="Editar endereço sugerido">${icon('chevron')} Editar</button></div>`:''}
    <div class="location-privacy">${icon('shield')}<span>Somente com sua permissão: a posição é enviada ao Photon/OpenStreetMap para sugerir o endereço e mostrar o mapa. O Lava Mais não guarda suas coordenadas.</span></div>
  </div>`:`<div class="location-choice"><label for="modalAddress" class="location-manual-label">Endereço de retirada</label>
      <input id="modalAddress" class="field-input" autocomplete="street-address" maxlength="180" placeholder="Rua, número, bairro, cidade e estado" value="${h(locationDraft.manual)}">
      <small class="location-help">Confira rua, número, bairro e cidade antes de salvar.</small></div>`;
  el.innerHTML=`<div class="modal-box location-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <div class="location-modal-heading"><h2 id="modalTitle">Endereço de retirada</h2>
      <button type="button" data-action="fechar-modal" class="location-close" aria-label="Fechar">${icon('close')}</button></div>
    <p class="location-intro">Use um endereço para agendar a retirada do seu veículo.</p>
    <div class="location-switch" role="group" aria-label="Forma de informar o endereço">
      <button type="button" class="${gps?'selected':''}" data-action="endereco-modo" data-mode="gps" aria-pressed="${gps}">${icon('pin')} Minha localização</button>
      <button type="button" class="${!gps?'selected':''}" data-action="endereco-modo" data-mode="manual" aria-pressed="${!gps}">${icon('message')} Inserir manualmente</button>
    </div>
    <div aria-live="polite">${body}</div>
    <div class="location-buttons"><button type="button" class="secondary-btn" data-action="fechar-modal">Cancelar</button>
      <button type="button" class="primary-btn" data-action="salvar-modal" ${gps&&(!locationDraft.address||locationDraft.requiresManual)?'disabled':''}>Salvar</button></div>
    </div>`;
}

function locationError(error) {
  if ($('#modal').dataset.mode !== 'endereco' || locationDraft.mode!=='gps') return;
  locationDraft.status='error';
  locationDraft.error=error?.code===1?'Localização não autorizada. Use Inserir manualmente.':error?.code===2?
    'O navegador não conseguiu identificar sua posição. Insira o endereço manualmente.':
    'Não foi possível obter sua posição. Tente novamente ou insira o endereço.';
  renderAddressModal();
}

async function geocodePosition(lat,lon,token) {
  try {
    // Apenas uma consulta após solicitação explícita, sem geocodificação periódica.
    const url=`https://photon.komoot.io/reverse?lat=${lat.toFixed(6)}&lon=${lon.toFixed(6)}&limit=1`;
    const result=await fetch(url,{headers:{Accept:'application/json'}});
    if (!result.ok) throw Error('Serviço de endereço indisponível');
    const j=await result.json();
    if (token!==locationDraft.requestToken || $('#modal').dataset.mode!=='endereco') return;
    const p=j?.features?.[0]?.properties||{};
    const street=p.street || (p.osm_key==='highway'?p.name:'');
    const city=p.city||p.town||p.locality||p.county||'';
    const address=[[street,p.housenumber].filter(Boolean).join(', '),p.district||p.suburb||'',[city,p.state].filter(Boolean).join(' - ')].filter(Boolean).join(', ');
    locationDraft.manual=address.slice(0,180);
    if (street && address.length>=8) {
      locationDraft.address=locationDraft.manual;
      locationDraft.requiresManual=!p.housenumber;
      if (!p.housenumber) locationDraft.error='Número não identificado. Toque em Editar para completar antes de salvar.';
    } else {
      locationDraft.error='Posição identificada, mas sem rua completa. Toque em Editar para informar o endereço.';
    }
  } catch {
    if(token===locationDraft.requestToken) locationDraft.error='Localização obtida, mas o endereço não pôde ser consultado. Insira manualmente.';
  } finally {
    if(token===locationDraft.requestToken && $('#modal').dataset.mode==='endereco') {
      locationDraft.status='ready';
      renderAddressModal();
    }
  }
}

function startLocationWatch() {
  if ($('#modal').dataset.mode!=='endereco') return;
  if (typeof navigator==='undefined'||!navigator.geolocation) {
    locationError({code:2});return;
  }
  stopLocationWatch();
  const token=locationDraft.requestToken;
  Object.assign(locationDraft,{status:'loading',error:'',address:'',requiresManual:false,reverseStarted:false,lat:null,lon:null,lastMapLat:null,lastMapLon:null});
  renderAddressModal();
  locationDraft.watchId=navigator.geolocation.watchPosition((pos)=>{
    if(token!==locationDraft.requestToken || locationDraft.mode!=='gps') return;
    const {latitude,longitude,accuracy}=pos.coords;
    if(!Number.isFinite(latitude)||!Number.isFinite(longitude))return;
    const moved=locationDraft.lastMapLat===null||Math.abs(latitude-locationDraft.lastMapLat)>.0005||Math.abs(longitude-locationDraft.lastMapLon)>.0005;
    locationDraft.lat=latitude;locationDraft.lon=longitude;locationDraft.accuracy=accuracy;
    locationDraft.lastUpdate=new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
    if(!locationDraft.reverseStarted){
      locationDraft.reverseStarted=true;
      locationDraft.lastMapLat=latitude;locationDraft.lastMapLon=longitude;
      renderAddressModal();geocodePosition(latitude,longitude,token);
    }else if(moved){
      locationDraft.lastMapLat=latitude;locationDraft.lastMapLon=longitude;
      renderAddressModal();
    }
  },locationError,{enableHighAccuracy:true,maximumAge:20000,timeout:15000});
}

function modal(title, description, withText = false) {
  $('#modal').innerHTML =
    `<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><h2 id="modalTitle">${h(title)}</h2><p>${h(description)}</p>${withText ? '<textarea id="modalText" aria-label="Descrição do problema" placeholder="Descreva brevemente o problema..." maxlength="500"></textarea>' : ''}<div class="buttons"><button class="secondary-btn" data-action="fechar-modal">Cancelar</button><button class="primary-btn" data-action="salvar-modal">${withText ? 'Enviar' : 'Salvar'}</button></div></div>`;
  $('#modal').classList.remove('hidden');
  $('#modal').querySelector('textarea,button')?.focus();
}
function closeModal() {
  stopLocationWatch();
  $('#modal').classList.add('hidden');
  $('#modal').dataset.mode = '';
  $('#modal').innerHTML = '';
  locationDraft.lat = null;
  locationDraft.lon = null;
}
function openChat() {
  state.chatOpen = true;
  $('#chatPanel').classList.remove('hidden');
  $('#chatFab').classList.add('hidden');
  renderChat();
  renderTabs();
  $('#chatInput').focus();
}
function closeChat() {
  state.chatOpen = false;
  $('#chatPanel').classList.add('hidden');
  renderTabs();
}
function renderChat() {
  $('#chatMessages').innerHTML =
    state.mensagens
      .map(
        (m) =>
          `<div class="bubble ${m.role === 'user' ? 'user' : 'assistant'}">${h(m.content)}${m.modo ? `<small>${m.modo === 'groq' ? 'Assistente de IA' : 'Atendimento automático'}</small>` : ''}</div>`,
      )
      .join('') + (state.chatBusy ? '<div class="bubble assistant">Digitando...</div>' : '');
  $('#chatMode').textContent = state.chatMode || 'Assistente virtual';
  $('#chatMessages').scrollTop = $('#chatMessages').scrollHeight;
  $('#chatSend').disabled = state.chatBusy;
}
async function chatSubmit(event) {
  event.preventDefault();
  const input = $('#chatInput'),
    mensagem = input.value.trim();
  if (!mensagem || state.chatBusy) return;
  const historico = state.mensagens.slice(-8).map((m) => ({ role: m.role, content: m.content }));
  state.mensagens.push({ role: 'user', content: mensagem });
  input.value = '';
  state.chatBusy = true;
  renderChat();
  try {
    const j = await api('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ mensagem, historico }),
    });
    state.mensagens.push({ role: 'assistant', content: j.resposta, modo: j.modo });
    state.chatMode = j.modo === 'groq' ? 'Assistente de IA ativo' : 'Atendimento automático';
  } catch (e) {
    state.mensagens.push({ role: 'assistant', content: e.message });
  } finally {
    state.chatBusy = false;
    renderChat();
  }
}
$('#chatForm').addEventListener('submit', chatSubmit);
$('#chatFab').addEventListener('click', openChat);
$('#chatAvatar').innerHTML = icon('bot');
$('#chatSend').innerHTML = icon('send');
$('#modal').addEventListener('click', (event) => {
  if (event.target.id === 'modal') closeModal();
});
// Delegação de eventos: os botões continuam funcionando após renderizar outra tela.
document.addEventListener('click', async (event) => {
  const btn = event.target.closest('[data-action]');
  if (!btn || btn.disabled) return;
  const action = btn.dataset.action;
  try {
    if (action === 'inicio') {
      navigate('inicio');
      return;
    }
    if (action === 'voltar') {
      const previous = {
        lista: 'inicio',
        detalhes: 'lista',
        agendamento: 'detalhes',
        acompanhar: 'pedidos',
        entrega: 'acompanhar',
        pedidos: 'inicio',
        perfil: 'inicio',
      };
      navigate(previous[state.screen] || 'inicio');
      return;
    }
    if (action === 'tab') {
      navigate(btn.dataset.screen);
      return;
    }
    if (action === 'veiculo') {
      state.veiculo = btn.dataset.veiculo;
      render();
      return;
    }
    if (action === 'buscar') {
      state.filtro = state.veiculo;
      navigate('lista');
      return;
    }
    if (action === 'filtro') {
      state.filtro = btn.dataset.filtro;
      if (state.filtro === 'carro' || state.filtro === 'moto') state.veiculo = state.filtro;
      render();
      return;
    }
    if (action === 'abrir-loja') {
      state.lavaJatoId = btn.dataset.id;
      state.servico = 'simples';
      navigate('detalhes');
      return;
    }
    if (action === 'favorito') {
      state.favoritos.has(state.lavaJatoId)
        ? state.favoritos.delete(state.lavaJatoId)
        : state.favoritos.add(state.lavaJatoId);
      render();
      notify('Favorito alterado nesta sessão.');
      return;
    }
    if (action === 'servico') {
      state.servico = btn.dataset.servico;
      render();
      return;
    }
    if (action === 'endereco') {
      openAddressModal();
      return;
    }
    if (action === 'endereco-modo') {
      if (btn.dataset.mode === 'manual') {
        stopLocationWatch();
        locationDraft.mode='manual';
        renderAddressModal();
        $('#modalAddress')?.focus();
      } else {
        locationDraft.mode='gps';
        renderAddressModal();
      }
      return;
    }
    if (action === 'localizacao-atual') {
      startLocationWatch();
      return;
    }
    if (action === 'endereco-editar') {
      stopLocationWatch();
      locationDraft.mode='manual';
      locationDraft.manual=locationDraft.address||locationDraft.manual;
      renderAddressModal();
      $('#modalAddress')?.focus();
      return;
    }
    if (action === 'ir-agendamento') {
      navigate('agendamento');
      await loadSlots();
      return;
    }
    if (action === 'horario') {
      state.horario = btn.dataset.horario;
      render();
      return;
    }
    if (action === 'outro-horario') {
      const primeiro = state.horarios.find((t) => t.disponivel);
      if (primeiro) {
        state.horario = primeiro.horario;
        render();
      } else notify('Não há horários disponíveis nessa data.');
      return;
    }
    if (action === 'confirmar-pedido') {
      // O navegador envia as escolhas; a API valida o horário e calcula o valor final.
      btn.disabled = true;
      try {
        const j = await api('/api/pedidos', {
          method: 'POST',
          body: JSON.stringify({
            lavaJatoId: state.lavaJatoId,
            veiculo: state.veiculo,
            servico: state.servico,
            retirada: state.retirada,
            // O endereço escolhido fica no navegador; a API pública não recebe endereço real.
            endereco: 'Endereço informado na interface',
            data: state.data,
            horario: state.horario,
          }),
        });
        state.pedido = { ...j.pedido, endereco: state.endereco };
        storageSet('lavaMaisPedidoId', j.pedido.id);
        navigate('acompanhar');
        notify('Pedido registrado para conferência.');
      } catch (e) {
        notify(e.message);
        await loadSlots();
      }
      return;
    }
    if (action === 'abrir-pedido') {
      navigate(state.pedido?.etapa >= 5 ? 'entrega' : 'acompanhar');
      return;
    }
    if (action === 'avancar') {
      const j = await api(`/api/pedidos/${state.pedido.id}/avancar`, {
        method: 'PATCH',
        body: '{}',
      });
      state.pedido = j.pedido;
      navigate(state.pedido.etapa >= 5 ? 'entrega' : 'acompanhar');
      return;
    }
    if (action === 'atualizar') {
      if (await loadPedido()) notify('Estado demonstrativo atualizado.');
      return;
    }
    if (action === 'ligar') {
      notify('Telefone não disponível: estabelecimento fictício.');
      return;
    }
    if (action === 'pergunta-ia') {
      if (!state.chatOpen) openChat();
      $('#chatInput').value = btn.dataset.prompt || '';
      $('#chatForm').requestSubmit();
      return;
    }
    if (action === 'chat') {
      openChat();
      return;
    }
    if (action === 'close-chat') {
      closeChat();
      return;
    }
    if (action === 'avaliar') {
      state.avaliacao = Number(btn.dataset.nota);
      render();
      return;
    }
    if (action === 'confirmar-entrega') {
      const j = await api(`/api/pedidos/${state.pedido.id}/confirmar`, {
        method: 'POST',
        body: JSON.stringify({ avaliacao: state.avaliacao }),
      });
      state.pedido = j.pedido;
      render();
      notify('Recebimento confirmado.');
      return;
    }
    if (action === 'problema') {
      modal(
        'Informar problema',
        'Relate o ocorrido. O registro não será enviado a um lava-jato real.',
        true,
      );
      return;
    }
    if (action === 'fechar-modal') {
      closeModal();
      return;
    }
    if (action === 'salvar-modal' && $('#modal').dataset.mode==='endereco') {
      const address=locationDraft.mode==='manual'
        ? ($('#modalAddress')?.value||'').trim()
        : locationDraft.address.trim();
      if(locationDraft.mode==='gps' && locationDraft.requiresManual) {
        notify('Confira o número do endereço na opção Editar antes de salvar.');return;
      }
      if(address.length<8||address.length>180) {
        notify('Informe um endereço válido com rua, número e cidade.');return;
      }
      state.endereco=address;
      closeModal();
      render();
      notify('Endereço de retirada atualizado. Confira antes de continuar.');
      return;
    }
    if (action === 'salvar-modal') {
      const address = $('#modalAddress');
      if (address) {
        const value = address.value.trim();
        if (value.length < 8) {
          notify('Informe um endereço demonstrativo com ao menos 8 caracteres.');
          return;
        }
        state.endereco = value;
        closeModal();
        render();
        return;
      }
      const text = $('#modalText');
      if (text) {
        const value = text.value.trim();
        if (value.length < 5) {
          notify('Descreva o problema com ao menos 5 caracteres.');
          return;
        }
        await api(`/api/pedidos/${state.pedido.id}/problema`, {
          method: 'POST',
          body: JSON.stringify({ descricao: value }),
        });
        closeModal();
        notify('Problema registrado na demonstração.');
        return;
      }
    }
  } catch (e) {
    notify(e.message);
  }
});
document.addEventListener('input', (e) => {
  if(e.target.id==='modalAddress' && $('#modal').dataset.mode==='endereco') {
    locationDraft.manual=e.target.value;
  }
});
document.addEventListener('change', async (e) => {
  if (e.target.id === 'retirada') {
    state.retirada = e.target.checked;
    render();
  }
  if (e.target.id === 'agData') {
    state.data = e.target.value;
    state.horario = '';
    await loadSlots();
  }
});
document.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.getAttribute('role') === 'button') {
    e.preventDefault();
    e.target.click();
  }
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (!$('#modal').classList.contains('hidden')) closeModal();
    else if (state.chatOpen) closeChat();
  }
});
async function init() {
  // Carrega os dados iniciais e tenta recuperar o último pedido desta sessão.
  try {
    const status = await api('/api/health');
    state.chatMode =
      status.chatbot === 'groq'
        ? 'Assistente de IA disponível'
        : 'Atendimento automático disponível';
  } catch {
    state.chatMode = 'Assistente virtual';
  }
  try {
    const j = await api('/api/estabelecimentos');
    state.estabelecimentos = j.dados;
  } catch (e) {
    notify(e.message);
  }
  try {
    const saved = storageGet('lavaMaisPedidoId');
    if (saved) state.pedido = (await api(`/api/pedidos/${encodeURIComponent(saved)}`)).pedido;
  } catch {
    storageDelete('lavaMaisPedidoId');
  }
  render();
}
init();
