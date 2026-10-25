import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp, ESTABELECIMENTOS, precoServico } from '../server.js';

async function servidorTeste(fn, { fetchImpl } = {}) {
  const server = createApp({ fetchImpl, storage: new Map() }).listen(0, '127.0.0.1');
  await new Promise((r) => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const call = async (url, { method = 'GET', body } = {}) => {
    const res = await fetch(base + url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return { status: res.status, data: await res.json() };
  };
  try {
    await fn(call);
  } finally {
    await new Promise((r, j) => server.close((e) => (e ? j(e) : r())));
  }
}
const amanha = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 2);
  return d.toISOString().slice(0, 10);
};
const pedido = () => ({
  lavaJatoId: 'brilho',
  veiculo: 'carro',
  servico: 'simples',
  retirada: true,
  endereco: 'Rua Fictícia, 123 - Centro',
  data: amanha(),
  horario: '09:30',
});

test('catálogo de três estabelecimentos e precificação corretos', () => {
  assert.equal(ESTABELECIMENTOS.length, 3);
  assert.equal(precoServico(ESTABELECIMENTOS[0], 'carro', 'simples'), 40);
  assert.equal(precoServico(ESTABELECIMENTOS[0], 'moto', 'completa'), 40);
});
test('health e listagem de lava-jatos', async () =>
  servidorTeste(async (call) => {
    assert.equal((await call('/api/health')).status, 200);
    const r = await call('/api/estabelecimentos');
    assert.equal(r.status, 200);
    assert.equal(r.data.dados.length, 3);
    assert.equal(r.data.demonstracao, true);
  }));
test('horário 10:00 indisponível e inválidos rejeitados', async () =>
  servidorTeste(async (call) => {
    const data = amanha();
    const r = await call(`/api/horarios?lavaJatoId=brilho&data=${data}`);
    assert.equal(r.status, 200);
    assert.equal(r.data.horarios.find((x) => x.horario === '10:00').disponivel, false);
    assert.equal((await call('/api/horarios?lavaJatoId=desconhecido&data=2027-01-01')).status, 400);
  }));
test('pedido cria valor no backend, bloqueia conflito e preserva leitura', async () =>
  servidorTeste(async (call) => {
    const r = await call('/api/pedidos', { method: 'POST', body: pedido() });
    assert.equal(r.status, 201);
    assert.equal(r.data.pedido.total, 50);
    assert.equal(r.data.pedido.etapa, 0);
    assert.equal((await call(`/api/pedidos/${r.data.pedido.id}`)).status, 200);
    assert.equal((await call('/api/pedidos', { method: 'POST', body: pedido() })).status, 409);
  }));
test('não permite pedido sem endereço, data passada ou horário indisponível', async () =>
  servidorTeste(async (call) => {
    assert.equal(
      (await call('/api/pedidos', { method: 'POST', body: { ...pedido(), endereco: 'X' } })).status,
      400,
    );
    assert.equal(
      (await call('/api/pedidos', { method: 'POST', body: { ...pedido(), data: '2024-03-25' } }))
        .status,
      400,
    );
    assert.equal(
      (await call('/api/pedidos', { method: 'POST', body: { ...pedido(), horario: '10:00' } }))
        .status,
      409,
    );
  }));
test('fluxo de acompanhamento e confirmação com 5 estrelas', async () =>
  servidorTeste(async (call) => {
    const r = await call('/api/pedidos', { method: 'POST', body: pedido() });
    const id = r.data.pedido.id;
    assert.equal(
      (await call(`/api/pedidos/${id}/confirmar`, { method: 'POST', body: { avaliacao: 5 } }))
        .status,
      409,
    );
    for (let i = 0; i < 5; i++)
      assert.equal((await call(`/api/pedidos/${id}/avancar`, { method: 'PATCH' })).status, 200);
    assert.equal((await call(`/api/pedidos/${id}/avancar`, { method: 'PATCH' })).status, 409);
    assert.equal(
      (await call(`/api/pedidos/${id}/confirmar`, { method: 'POST', body: { avaliacao: 0 } }))
        .status,
      400,
    );
    const ok = await call(`/api/pedidos/${id}/confirmar`, {
      method: 'POST',
      body: { avaliacao: 5 },
    });
    assert.equal(ok.status, 200);
    assert.equal(ok.data.pedido.etapa, 6);
  }));
test('chat valida mensagens e funciona em modo de demonstração sem chave', async () => {
  const original = process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEY;
  try {
    await servidorTeste(async (call) => {
      assert.equal(
        (await call('/api/chat', { method: 'POST', body: { mensagem: '' } })).status,
        400,
      );
      const r = await call('/api/chat', {
        method: 'POST',
        body: { mensagem: 'Quanto custa a lavagem?' },
      });
      assert.equal(r.status, 200);
      assert.equal(r.data.modo, 'demonstracao');
      const completa = await call('/api/chat', {
        method: 'POST',
        body: { mensagem: 'Quanto custa a lavagem completa?' },
      });
      assert.equal(completa.status, 200);
      assert.match(completa.data.resposta, /completa de carro começa em R\$ 55/);
    });
  } finally {
    if (original) process.env.GROQ_API_KEY = original;
  }
});
test('chat utiliza Groq exclusivamente no servidor', async () => {
  const original = process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY = 'chave_de_teste_nao_real';
  let chamada;
  try {
    await servidorTeste(
      async (call) => {
        const r = await call('/api/chat', { method: 'POST', body: { mensagem: 'Olá' } });
        assert.equal(r.status, 200);
        assert.equal(r.data.resposta, 'Olá! Resposta de teste.');
        assert.equal(r.data.modo, 'groq');
      },
      {
        fetchImpl: async (url, opts) => {
          chamada = { url, opts };
          return {
            ok: true,
            json: async () => ({ choices: [{ message: { content: 'Olá! Resposta de teste.' } }] }),
          };
        },
      },
    );
    assert.equal(chamada.url, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(chamada.opts.headers.Authorization, 'Bearer chave_de_teste_nao_real');
  } finally {
    if (original) process.env.GROQ_API_KEY = original;
    else delete process.env.GROQ_API_KEY;
  }
});
