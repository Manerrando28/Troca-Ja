import test from 'node:test';
import assert from 'node:assert/strict';
import { applyTradeAction, filterProducts } from '../src/domain/trades.ts';

const products = [
  { id: 'p1', ownerId: 'ana', availableForTrade: true, name: 'Livro', description: 'Algoritmos', categoryId: 'books', featured: false, createdAt: '2026-10-07T12:00:00Z' },
  { id: 'p2', ownerId: 'bruno', availableForTrade: true, name: 'Console', description: 'Jogos', categoryId: 'games', featured: true, createdAt: '2026-10-07T12:00:00Z' },
  { id: 'p3', ownerId: 'bruno', availableForTrade: false, name: 'Controle', description: '', categoryId: 'games', featured: false, createdAt: '2026-09-01T12:00:00Z' },
];
const proposal = { id: 'n1', initiatorId: 'ana', receiverId: 'bruno', offeredProductIds: ['p1'], requestedProductIds: ['p2'], status: 'pending' };
const initial = () => ({ negotiations: [], messages: [] });
const propose = (state = initial(), negotiation = proposal, actorId = 'ana') => applyTradeAction(state, { type: 'propose', negotiation, actorId }, products);
const respond = (state, actorId = 'bruno', status = 'accepted') => applyTradeAction(state, { type: 'respond', id: 'n1', status, actorId }, products);
const send = (state, text = 'Combinado!', actorId = 'ana') => applyTradeAction(state, { type: 'message', actorId,
  message: { id: 'm1', negotiationId: 'n1', senderId: actorId, text, timestamp: '2026-10-07T12:00:00Z' } }, products);

test('proposta → aceite pelo receptor → mensagem mantém o estado sem mutar os mocks', () => {
  const seed = initial();
  const pending = propose(seed);
  const accepted = respond(pending);
  const chat = send(accepted, '  Combinado!  ');
  assert.equal(seed.negotiations.length, 0);
  assert.equal(pending.negotiations[0].status, 'pending');
  assert.equal(accepted.negotiations[0].status, 'accepted');
  assert.equal(chat.messages[0].text, 'Combinado!');
  assert.equal(accepted.messages.length, 0);
});
test('rejeita oferta vazia, repetida, de terceiros, indisponível ou consigo mesmo', () => {
  for (const change of [{ offeredProductIds: [] }, { offeredProductIds: ['p1', 'p1'] },
    { offeredProductIds: ['p2'] }, { requestedProductIds: ['p3'] }, { receiverId: 'ana' }, { status: 'accepted' }]) {
    assert.throws(() => propose(initial(), { ...proposal, ...change }));
  }
  assert.throws(() => propose(initial(), proposal, 'intruso'));
  assert.throws(() => propose(propose(), { ...proposal, id: 'n2' }));
});
test('apenas receptor responde e apenas iniciador cancela uma proposta pendente', () => {
  const pending = propose();
  assert.throws(() => respond(pending, 'ana'));
  assert.throws(() => respond(pending, 'intruso', 'rejected'));
  assert.throws(() => respond(pending, 'bruno', 'cancelled'));
  assert.equal(respond(pending, 'ana', 'cancelled').negotiations[0].status, 'cancelled');
  assert.equal(respond(pending, 'bruno', 'rejected').negotiations[0].status, 'rejected');
  assert.throws(() => respond(respond(pending)));
});
test('chat bloqueia propostas pendentes/recusadas e participantes externos', () => {
  assert.throws(() => send(propose()));
  assert.throws(() => send(respond(propose(), 'bruno', 'rejected')));
  assert.throws(() => send(respond(propose()), 'Olá', 'intruso'));
  assert.throws(() => send(respond(propose()), '   '));
  assert.throws(() => send(respond(propose()), 'a'.repeat(1001)));
  assert.throws(() => send(send(respond(propose()))));
  assert.throws(() => send(initial()));
});
test('busca e filtros respeitam disponibilidade, proprietário, categoria e data local', () => {
  const users = [{ id: 'bruno', completedTrades: 12 }];
  const select = (category = null, filter = null, query = '') => filterProducts(products, users, 'ana', category, filter, query, new Date('2026-10-07T15:00:00Z'));
  assert.deepEqual(select().map(p => p.id), ['p2']);
  assert.equal(select('games', 'featured', 'CONSOLE').length, 1);
  assert.equal(select(null, 'trusted').length, 1);
  assert.equal(select(null, 'today').length, 1);
  assert.equal(select('books').length, 0);
  assert.equal(select(null, null, 'inexistente').length, 0);
});
