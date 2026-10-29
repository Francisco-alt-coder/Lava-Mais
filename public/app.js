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
        'Olá! Sou o assistente do Lava Mais. Posso explicar os serviços, os preços demonstrativos e como acompanhar seu pedido. Como posso ajudar?',
    },
  ],
  chatMode: '',
  favoritos: new Set(),
};
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
  // Navegação principal fiel às três abas das telas aprovadas.
  const visible = ['inicio', 'lista', 'pedidos', 'perfil'].includes(state.screen);
  $('#tabbar').classList.toggle('hidden', !visible);
  $('#page').classList.toggle('no-nav', !visible);
  $('#tabbar').innerHTML = [
    ['inicio', 'home', 'Início'],
    ['pedidos', 'orders', 'Pedidos'],
    ['perfil', 'user', 'Perfil'],
  ].map(([screen, symbol, label]) =>
    `<button type="button" class="tab ${screen === state.screen || (state.screen === 'lista' && screen === 'inicio') ? 'active' : ''}"
      data-action="tab" data-screen="${screen}"
      aria-current="${screen === state.screen ? 'page' : 'false'}">
      ${icon(symbol)}<span>${label}</span>
    </button>`
  ).join('');
}
function addressCard() {
  return `<button class="location-card" data-action="endereco"><span class="location-icon">${icon('pin')}</span><span><strong>${h(state.endereco.split(',').slice(0, 2).join(',') || 'Definir endereço')}</strong><br>${h(state.endereco.split(',').slice(2).join(',').trim() || 'Toque para alterar')}</span>${icon('chevron', 'chevron')}</button>`;
}
function home() {
  return `<section class="home-hero">
      <div class="hero-brand"><span class="hero-icon">${icon('car')}</span><strong>Lava Mais</strong></div>
      <h2>Seu veículo limpo sem sair de casa</h2>
      <p>Agende, acompanhe e receba seu veículo com tranquilidade.</p>
    </section>
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
    <p class="small-warning">Lava-jatos, endereços e pedidos fictícios. Nenhuma reserva real é realizada.</p>`;
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
  ${items.map(storeCard).join('') || '<p class="muted-small">Nenhum estabelecimento para esse filtro.</p>'}
  <p class="small-warning">*Avaliações e distâncias são fictícias. Esta demonstração não usa sua localização real.</p>`;
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
    </label>
    <section class="safety">${icon('shield')}<div><h3>Segurança na demonstração</h3>
      <ul><li>Acompanhamento das etapas do pedido</li><li>Confirmação de recebimento e avaliação</li><li>Registro demonstrativo de problemas</li></ul>
    </div></section>
    <button class="primary-btn" data-action="ir-agendamento">Escolher serviço ${icon('arrow')}</button>
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
  return `<div class="field-block">
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
    </div>
    ${summary()}
    <div class="action-bottom">
      <button class="primary-btn" data-action="confirmar-pedido" ${!disponivel ? 'disabled' : ''}>
        Confirmar pedido ${icon('arrow')}
      </button>
    </div>
    <p class="small-warning">Agendamento demonstrativo, sem pagamento ou contratação de serviço real.</p>`;
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
          <span>Equipe demonstrativa</span><strong>${h(p.funcionario)}</strong><span>${h(p.loja)}</span>
        </div></div>
        <div class="timeline">${timeline}</div>
      </div>
      <aside class="tracking-side">
        <section class="status-panel"><p>${icon('truck')} Status do pedido</p>
          <strong>${h(stages[Math.min(p.etapa,5)])}</strong>
          <span>Atualização manual para fins acadêmicos. Não há localização ou previsão em tempo real.</span></section>
        <section class="tracking-address">${icon('shield')}<div><strong>Retirada demonstrativa</strong><p>${h(p.endereco)}</p></div></section>
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
function modal(title, description, withText = false) {
  $('#modal').innerHTML =
    `<div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle"><h2 id="modalTitle">${h(title)}</h2><p>${h(description)}</p>${withText ? '<textarea id="modalText" aria-label="Descrição do problema" placeholder="Descreva brevemente o problema..." maxlength="500"></textarea>' : ''}<div class="buttons"><button class="secondary-btn" data-action="fechar-modal">Cancelar</button><button class="primary-btn" data-action="salvar-modal">${withText ? 'Enviar' : 'Salvar'}</button></div></div>`;
  $('#modal').classList.remove('hidden');
  $('#modal').querySelector('textarea,button')?.focus();
}
function closeModal() {
  $('#modal').classList.add('hidden');
  $('#modal').innerHTML = '';
}
function openChat() {
  state.chatOpen = true;
  $('#chatPanel').classList.remove('hidden');
  $('#chatFab').classList.add('hidden');
  renderChat();
  $('#chatInput').focus();
}
function closeChat() {
  state.chatOpen = false;
  $('#chatPanel').classList.add('hidden');
  $('#chatFab').classList.remove('hidden');
}
function renderChat() {
  $('#chatMessages').innerHTML =
    state.mensagens
      .map(
        (m) =>
          `<div class="bubble ${m.role === 'user' ? 'user' : 'assistant'}">${h(m.content)}${m.modo ? `<small>${m.modo === 'groq' ? 'Resposta por Groq IA' : 'Resposta demonstrativa'}</small>` : ''}</div>`,
      )
      .join('') + (state.chatBusy ? '<div class="bubble assistant">Digitando...</div>' : '');
  $('#chatMode').textContent = state.chatMode || 'Atendimento virtual · protótipo';
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
    state.chatMode = j.modo === 'groq' ? 'Conectado à Groq IA' : 'Modo demonstração local';
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
      modal('Endereço de retirada', 'Use um endereço fictício para testar o agendamento.');
      $('#modal')
        .querySelector('p')
        .insertAdjacentHTML(
          'afterend',
          `<input id="modalAddress" aria-label="Endereço demonstrativo" class="field-input" maxlength="180" value="${h(state.endereco)}" style="margin-bottom:13px"/>`,
        );
      $('#modalAddress').focus();
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
            endereco: state.endereco,
            data: state.data,
            horario: state.horario,
          }),
        });
        state.pedido = j.pedido;
        storageSet('lavaMaisPedidoId', j.pedido.id);
        navigate('acompanhar');
        notify('Pedido de demonstração criado!');
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
      notify('Recebimento confirmado no protótipo.');
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
        ? 'Groq configurada · aguardando resposta'
        : 'Modo demonstração · sem chave Groq';
  } catch {
    state.chatMode = 'Modo demonstração · estado não verificado';
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
