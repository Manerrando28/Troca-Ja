// Tipos do domínio do TrocaJá
// Cada entidade possui um ID próprio e relacionamentos via ID.

import type { ImageSourcePropType } from 'react-native';

export type User = {
  id: string;
  name: string;
  username: string;
  completedTrades: number;
};

export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  categoryId: string;
  availableForTrade: boolean;
  image: ImageSourcePropType;
  createdAt: string;
  featured: boolean;
};

/**
 * TradeListing representa a intenção pública de um usuário de realizar uma troca.
 * Não é uma negociação — é um anúncio de interesse.
 *
 * Fluxo conceitual:
 *   TradeListing → usuário demonstra interesse → Negotiation
 */
export type TradeListing = {
  id: string;
  ownerId: string;
  productIds: string[];
  description?: string;
  status: 'active' | 'closed';
};

/**
 * Negotiation representa uma negociação entre dois usuários.
 *
 * initiatorId: quem propôs a troca
 * receiverId: quem recebeu a proposta
 * offeredProductIds: produtos que o iniciador oferece
 * requestedProductIds: produtos do outro usuário que o iniciador quer
 */
export type Negotiation = {
  id: string;
  initiatorId: string;
  receiverId: string;
  offeredProductIds: string[];
  requestedProductIds: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
};

export type Message = {
  id: string;
  negotiationId: string;
  senderId: string;
  text: string;
  timestamp: string;
};
