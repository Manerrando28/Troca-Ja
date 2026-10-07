import type { Message, Negotiation, Product, User } from '../types';

export type TradeState = { negotiations: Negotiation[]; messages: Message[] };
export type TradeAction =
  | { type: 'propose'; negotiation: Negotiation; actorId: string }
  | { type: 'respond'; id: string; status: 'accepted' | 'rejected' | 'cancelled'; actorId: string }
  | { type: 'message'; message: Message; actorId: string };

export function applyTradeAction(state: TradeState, action: TradeAction, products: Product[]): TradeState {
  if (action.type === 'propose') {
    const n = action.negotiation;
    if (n.initiatorId !== action.actorId || n.initiatorId === n.receiverId || n.status !== 'pending') {
      throw new Error('Participantes inválidos para a proposta.');
    }
    for (const [ids, ownerId] of [[n.offeredProductIds, n.initiatorId], [n.requestedProductIds, n.receiverId]] as const) {
      if (!ids.length || new Set(ids).size !== ids.length || ids.some(id =>
        !products.some(p => p.id === id && p.ownerId === ownerId && p.availableForTrade))) {
        throw new Error('Selecione produtos disponíveis dos respectivos participantes.');
      }
    }
    const sameItems = (a: string[], b: string[]) => a.length === b.length && a.every(id => b.includes(id));
    if (state.negotiations.some(existing => existing.id === n.id ||
      (existing.status === 'pending' && existing.initiatorId === n.initiatorId && existing.receiverId === n.receiverId &&
        sameItems(existing.offeredProductIds, n.offeredProductIds) && sameItems(existing.requestedProductIds, n.requestedProductIds)))) {
      throw new Error('Você já enviou esta proposta. Acompanhe na aba Trocas.');
    }
    return { ...state, negotiations: [...state.negotiations, n] };
  }
  const id = action.type === 'respond' ? action.id : action.message.negotiationId;
  const negotiation = state.negotiations.find(n => n.id === id);
  if (!negotiation) throw new Error('Negociação não encontrada.');
  if (action.type === 'respond') {
    const allowedActor = action.status === 'cancelled' ? negotiation.initiatorId : negotiation.receiverId;
    if (negotiation.status !== 'pending' || action.actorId !== allowedActor) {
      throw new Error('Esta proposta não pode ser alterada por este usuário.');
    }
    return { ...state, negotiations: state.negotiations.map(n => n.id === id ? { ...n, status: action.status } : n) };
  }
  const message = action.message;
  if (negotiation.status !== 'accepted' || ![negotiation.initiatorId, negotiation.receiverId].includes(action.actorId) ||
      message.senderId !== action.actorId || !message.text.trim() || message.text.trim().length > 1000 ||
      state.messages.some(m => m.id === message.id)) {
    throw new Error('Envie até 1.000 caracteres em uma negociação aceita da qual você participa.');
  }
  return { ...state, messages: [...state.messages, { ...message, text: message.text.trim() }] };
}

export type ProductFilter = 'today' | 'featured' | 'trusted' | null;
export function filterProducts(products: Product[], users: User[], actorId: string, categoryId: string | null,
  filter: ProductFilter, query = '', now = new Date()): Product[] {
  return products.filter(p => {
    if (!p.availableForTrade || p.ownerId === actorId || (categoryId && p.categoryId !== categoryId)) return false;
    if (!`${p.name} ${p.description}`.toLocaleLowerCase('pt-BR').includes(query.trim().toLocaleLowerCase('pt-BR'))) return false;
    if (filter === 'featured') return p.featured;
    if (filter === 'trusted') return users.some(u => u.id === p.ownerId && u.completedTrades >= 5);
    if (filter === 'today') return new Date(p.createdAt).toDateString() === now.toDateString();
    return true;
  });
}
