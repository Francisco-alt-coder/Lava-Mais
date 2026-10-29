// Lava Mais: seleção de endereço sem alterar a navegação original.
// Funciona com o estado e a ação salvar-modal já presentes em app.js.
const modalEndereco = document.querySelector('#modal');
const localizacao = {
  ativo: false,
  modo: 'manual',
  watchId: null,
  controller: null,
  ultimoGeocode: null,
  geocodeEmAndamento: false,
  enderecoOriginal: '',
};

// Evita interpretar texto de usuário como HTML.
function textoSeguro(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (caractere) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[caractere]);
}

function campo(id) {
  return modalEndereco.querySelector('#' + id);
}

function avisoLocalizacao(mensagem, erro = false) {
  const el = campo('pickupStatus');
  if (el) {
    el.textContent = mensagem;
    el.dataset.erro = String(erro);
  }
}

function pararLocalizacao() {
  if (localizacao.watchId !== null && navigator.geolocation) {
    navigator.geolocation.clearWatch(localizacao.watchId);
  }
  localizacao.watchId = null;
  localizacao.controller?.abort();
  localizacao.controller = null;
  localizacao.geocodeEmAndamento = false;
  localizacao.ultimoGeocode = null;
}

function fecharObservacao() {
  if (!localizacao.ativo) return;
  localizacao.ativo = false;
  pararLocalizacao();
}

// A modal original pode ser fechada por Escape, botão ou clique fora.
const observadorModal = new MutationObserver(() => {
  if (modalEndereco.classList.contains('hidden')) fecharObservacao();
});
observadorModal.observe(modalEndereco, { attributes: true, attributeFilter: ['class'] });

function enderecoAtual(cartao) {
  const titulo = cartao.querySelector('strong')?.textContent?.trim() || '';
  const resumo = cartao.querySelector('span:nth-child(2)')?.textContent || '';
  const complemento = resumo.replace(titulo, '').trim();
  return [titulo, complemento].filter(Boolean).join(', ');
}

function abrirEndereco(cartao) {
  fecharObservacao();
  localizacao.ativo = true;
  localizacao.modo = 'gps';
  localizacao.enderecoOriginal = enderecoAtual(cartao).startsWith('Definir endereço') ? '' : enderecoAtual(cartao);
  modalEndereco.innerHTML = `
    <div class="modal-box pickup-box" role="dialog" aria-modal="true" aria-labelledby="modalTitle" aria-describedby="pickupDescricao">
      <div class="pickup-heading">
        <h2 id="modalTitle">Endereço de retirada</h2>
        <button class="pickup-close" type="button" data-action="fechar-modal" aria-label="Fechar janela">×</button>
      </div>
      <p id="pickupDescricao">Escolha como informar o endereço para a retirada do veículo.</p>
      <div class="pickup-tabs" role="group" aria-label="Forma de informar o endereço">
        <button class="pickup-tab active" type="button" data-pickup="modo" data-mode="gps" aria-pressed="true">⌖ Minha localização</button>
        <button class="pickup-tab" type="button" data-pickup="modo" data-mode="manual" aria-pressed="false">✎ Inserir manualmente</button>
      </div>
      <section id="pickupGps" class="pickup-panel" aria-label="Localização atual">
        <div class="pickup-intro">
          <div class="pickup-icon">⌖</div>
          <div><strong>Usar minha localização atual</strong><small>Autorize o navegador a identificar sua posição e preencher o endereço.</small></div>
        </div>
        <button class="primary-btn pickup-locate" type="button" data-pickup="localizar">⌖ Usar minha localização atual</button>
        <p class="pickup-status" id="pickupStatus" role="status" aria-live="polite">A localização está desligada.</p>
        <p class="pickup-coords hidden" id="pickupCoords"></p>
        <div id="pickupMapa" class="pickup-map hidden"></div>
        <small class="pickup-privacy">Seu GPS funciona apenas com autorização. Para descobrir a rua e mostrar o mapa, as coordenadas são enviadas ao OpenStreetMap. O rastreamento é encerrado ao fechar ou salvar.</small>
      </section>
      <section id="pickupManual" class="pickup-panel hidden" aria-label="Endereço informado manualmente">
        <label for="modalAddress" class="pickup-label">Rua, número, bairro e cidade</label>
        <input id="modalAddress" class="field-input pickup-input" maxlength="180" autocomplete="street-address" value="${textoSeguro(localizacao.enderecoOriginal)}" placeholder="Ex.: Rua Exemplo, 123, Centro, Balsas - MA" />
        <small class="pickup-help">Confira rua, número, bairro e cidade antes de continuar.</small>
      </section>
      <div id="pickupEnderecoGps" class="pickup-gps-result">
        <label class="pickup-label" for="pickupAddressGps">Endereço identificado (confira antes de salvar)</label>
        <input id="pickupAddressGps" class="field-input pickup-input" maxlength="180" readonly placeholder="Aguardando sua localização..." />
        <button class="pickup-link" type="button" data-pickup="modo" data-mode="manual">Corrigir endereço manualmente</button>
      </div>
      <div class="buttons pickup-actions">
        <button class="secondary-btn" type="button" data-action="fechar-modal">Cancelar</button>
        <button class="primary-btn" type="button" data-action="salvar-modal" id="pickupSalvar" disabled>Salvar</button>
      </div>
    </div>`;
  modalEndereco.classList.remove('hidden');
  modalEndereco.querySelector('[data-pickup="localizar"]').focus();
}

function mudarModo(modo) {
  if (!localizacao.ativo) return;
  localizacao.modo = modo;
  if (modo === 'manual') pararLocalizacao();
  for (const tab of modalEndereco.querySelectorAll('.pickup-tab')) {
    const ativo = tab.dataset.mode === modo;
    tab.classList.toggle('active', ativo);
    tab.setAttribute('aria-pressed', String(ativo));
  }
  campo('pickupGps').classList.toggle('hidden', modo !== 'gps');
  campo('pickupManual').classList.toggle('hidden', modo !== 'manual');
  campo('pickupEnderecoGps').classList.toggle('hidden', modo !== 'gps');
  campo('pickupSalvar').disabled = modo === 'gps' && !campo('pickupAddressGps').value.trim();
  if (modo === 'manual') {
    campo('modalAddress').readOnly = false;
    campo('modalAddress').focus();
  }
}

function distanciaMetros(a, b) {
  const latMedia = ((a.lat + b.lat) / 2) * Math.PI / 180;
  return Math.hypot((a.lat - b.lat) * 111000, (a.lon - b.lon) * 111000 * Math.cos(latMedia));
}

function prepararMapa(lat, lon) {
  const area = 0.0035;
  const oeste = (lon - area).toFixed(6);
  const sul = (lat - area).toFixed(6);
  const leste = (lon + area).toFixed(6);
  const norte = (lat + area).toFixed(6);
  const url = 'https://www.openstreetmap.org/export/embed.html?bbox=' +
    encodeURIComponent([oeste, sul, leste, norte].join(',')) +
    '&layer=mapnik&marker=' + encodeURIComponent(lat.toFixed(6) + ',' + lon.toFixed(6));
  const container = campo('pickupMapa');
  container.classList.remove('hidden');
  const iframe = container.querySelector('iframe');
  if (iframe) iframe.src = url;
  else container.innerHTML = '<iframe title="Mapa da localização aproximada" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe><span>Mapa: © OpenStreetMap contributors</span>';
  container.querySelector('iframe').src = url;
}

function montarEndereco(resposta) {
  const a = resposta.address || {};
  const rua = [a.road || a.pedestrian || a.residential || a.hamlet, a.house_number].filter(Boolean).join(', ');
  const bairro = a.suburb || a.neighbourhood || a.city_district || '';
  const cidade = a.city || a.town || a.municipality || a.village || '';
  const estado = a.state || '';
  return [rua, bairro, [cidade, estado].filter(Boolean).join(' - ')].filter(Boolean).join(', ').slice(0, 180);
}

async function consultarEndereco(lat, lon) {
  if (localizacao.geocodeEmAndamento) return;
  localizacao.geocodeEmAndamento = true;
  localizacao.controller = new AbortController();
  const controller = localizacao.controller;
  try {
    const endpoint = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=' +
      encodeURIComponent(lat) + '&lon=' + encodeURIComponent(lon);
    const resposta = await fetch(endpoint, { signal: controller.signal });
    if (!resposta.ok) throw new Error('Não foi possível consultar o serviço de endereço.');
    const dados = await resposta.json();
    if (!localizacao.ativo || localizacao.modo !== 'gps' || controller.signal.aborted) return;
    const endereco = montarEndereco(dados);
    if (!endereco || endereco.length < 8) throw new Error('Endereço não identificado para esta posição.');
    campo('pickupAddressGps').value = endereco;
    // A ação salvar-modal existente lê somente #modalAddress.
    campo('modalAddress').value = endereco;
    campo('pickupSalvar').disabled = false;
    avisoLocalizacao('Localização ativa. Endereço identificado; confira o número e os detalhes.');
  } catch (error) {
    if (controller.signal.aborted || !localizacao.ativo) return;
    avisoLocalizacao('GPS ativo, mas o endereço não foi identificado. Escolha Inserir manualmente.', true);
    campo('pickupSalvar').disabled = true;
  } finally {
    if (localizacao.controller === controller) localizacao.controller = null;
    localizacao.geocodeEmAndamento = false;
  }
}

function atualizarPosicao(posicao) {
  if (!localizacao.ativo || localizacao.modo !== 'gps') return;
  const lat = posicao.coords.latitude;
  const lon = posicao.coords.longitude;
  const precisao = Math.round(posicao.coords.accuracy);
  campo('pickupCoords').textContent =
    'Posição do dispositivo · precisão estimada de ' + precisao + ' m · ' +
    lat.toFixed(5) + ', ' + lon.toFixed(5);
  campo('pickupCoords').classList.remove('hidden');

  const agora = Date.now();
  const anterior = localizacao.ultimoGeocode;
  // Reduz consultas externas: primeira leitura ou deslocamento maior que 150 m após 60 s.
  if (!anterior || (agora - anterior.quando >= 60000 && distanciaMetros(anterior, { lat, lon }) > 150)) {
    localizacao.ultimoGeocode = { lat, lon, quando: agora };
    prepararMapa(lat, lon);
    avisoLocalizacao('Localização atualizada. Buscando endereço...');
    void consultarEndereco(lat, lon);
  } else if (!localizacao.geocodeEmAndamento && campo('pickupAddressGps').value) {
    avisoLocalizacao('Localização em tempo real ativa. O endereço permanece disponível para conferência.');
  }
}

function erroGPS(error) {
  if (!localizacao.ativo) return;
  const mensagem = error.code === 1
    ? 'Permissão negada. Autorize nas configurações do navegador ou informe o endereço manualmente.'
    : error.code === 2
      ? 'Localização indisponível neste dispositivo. Informe o endereço manualmente.'
      : 'Tempo esgotado ao consultar o GPS. Tente novamente ou insira manualmente.';
  avisoLocalizacao(mensagem, true);
  pararLocalizacao();
  campo('pickupSalvar').disabled = true;
}

function iniciarGPS() {
  if (!localizacao.ativo) return;
  if (!window.isSecureContext || !navigator.geolocation) {
    avisoLocalizacao('A localização exige HTTPS ou localhost e um navegador compatível.', true);
    return;
  }
  pararLocalizacao();
  campo('pickupAddressGps').value = '';
  campo('modalAddress').value = '';
  campo('pickupSalvar').disabled = true;
  avisoLocalizacao('Solicitando autorização de localização ao navegador...');
  localizacao.watchId = navigator.geolocation.watchPosition(atualizarPosicao, erroGPS, {
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 15000,
  });
}

// Captura apenas o botão de endereço existente e mantém todos os outros fluxos intactos.
document.addEventListener('click', (event) => {
  const cartao = event.target.closest('[data-action="endereco"]');
  if (cartao) {
    event.preventDefault();
    event.stopPropagation();
    abrirEndereco(cartao);
    return;
  }
  const botao = event.target.closest('[data-pickup]');
  if (!botao || !localizacao.ativo) return;
  event.preventDefault();
  event.stopPropagation();
  if (botao.dataset.pickup === 'modo') mudarModo(botao.dataset.mode);
  else if (botao.dataset.pickup === 'localizar') iniciarGPS();
}, true);
