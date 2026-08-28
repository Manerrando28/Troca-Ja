/**
 * data.ts — Mock data do TrocaJá
 *
 * Funciona como banco de dados em memória.
 * Dados normalizados com relacionamentos por ID.
 * Futuramente pode ser substituído por chamadas de API sem alterar as telas.
 *
 * Estrutura:
 * ├── users
 * ├── categories
 * ├── products       (cada um com ownerId)
 * ├── tradeListings  (cada um com ownerId e productIds[])
 * └── negotiations   (cada um com initiatorId, receiverId, productIds[])
 */

import type {
  User,
  Category,
  Product,
  TradeListing,
  Negotiation,
  Message,
} from "@/types";

// ─── Usuário atual (fake auth) ───────────────────────────────────────────────
// Em uma versão futura, isso viria de um contexto de autenticação real.
export const CURRENT_USER_ID = "user-1";

// ─── Usuários ─────────────────────────────────────────────────────────────────
export const users: User[] = [
  {
    id: "user-1",
    name: "Ana Costa",
    username: "ana.costa",
    completedTrades: 3,
  },
  {
    id: "user-2",
    name: "Bruno Lima",
    username: "brunolima",
    completedTrades: 12,
  },
  {
    id: "user-3",
    name: "Carla Souza",
    username: "carlasouza",
    completedTrades: 27,
  },
];

// ─── Categorias ───────────────────────────────────────────────────────────────
export const categories: Category[] = [
  { id: "cat-1", name: "Eletrônicos" },
  { id: "cat-2", name: "Jogos" },
  { id: "cat-3", name: "Livros" },
  { id: "cat-4", name: "Esportes" },
];

// ─── Produtos ─────────────────────────────────────────────────────────────────
// Cada produto possui um proprietário (ownerId) e pode estar disponível para troca.
export const products: Product[] = [
  // Ana
  {
    id: 'prod-1',
    ownerId: 'user-1',
    name: 'Nintendo Switch',
    description: 'Console em ótimo estado, acompanha dois jogos.',
    categoryId: 'cat-2',
    availableForTrade: true,
    image: require('../assets/products/ps5usado.jpg'),
    createdAt: '2026-08-28T08:00:00.000Z',
    featured: true,
  },
  {
    id: 'prod-2',
    ownerId: 'user-1',
    name: 'Câmera Fujifilm X-T30',
    description: 'Câmera mirrorless, pouco uso, com carregador.',
    categoryId: 'cat-1',
    availableForTrade: true,
    image: require('../assets/products/ps5usado.jpg'),
    createdAt: '2026-08-27T14:00:00.000Z',
    featured: false,
  },
  {
    id: 'prod-3',
    ownerId: 'user-1',
    name: 'Livros de Clean Code',
    description: 'Clean Code + The Pragmatic Programmer, ambos em inglês.',
    categoryId: 'cat-3',
    availableForTrade: false,
    image: require('../assets/products/bik-speed-trek.jpg'),
    createdAt: '2026-08-25T10:00:00.000Z',
    featured: false,
  },

  // Bruno
  {
    id: 'prod-4',
    ownerId: 'user-2',
    name: 'PS5',
    description: 'PlayStation 5 com dois controles e 3 jogos.',
    categoryId: 'cat-2',
    availableForTrade: true,
    image: require('../assets/products/ps5usado.jpg'),
    createdAt: '2026-08-28T09:00:00.000Z',
    featured: true,
  },
  {
    id: 'prod-5',
    ownerId: 'user-2',
    name: 'Headset Sony WH-1000XM5',
    description: 'Fone com cancelamento de ruído, usado por 6 meses.',
    categoryId: 'cat-1',
    availableForTrade: true,
    image: require('../assets/products/headsetusado.jpg'),
    createdAt: '2026-08-26T16:00:00.000Z',
    featured: true,
  },

  // Carla
  {
    id: 'prod-6',
    ownerId: 'user-3',
    name: 'Bike Speed Trek',
    description: 'Bicicleta speed aro 700, tamanho M, 11 marchas.',
    categoryId: 'cat-4',
    availableForTrade: true,
    image: require('../assets/products/bik-speed-trek.jpg'),
    createdAt: '2026-08-28T11:00:00.000Z',
    featured: false,
  },
  {
    id: 'prod-7',
    ownerId: 'user-3',
    name: 'iPad Pro 11"',
    description: 'iPad Pro 11 polegadas com Apple Pencil 2ª geração.',
    categoryId: 'cat-1',
    availableForTrade: true,
    image: require('../assets/products/ipadpro.jpg'),
    createdAt: '2026-08-27T18:00:00.000Z',
    featured: true,
  },
  {
    id: 'prod-8',
    ownerId: 'user-3',
    name: 'Tênis de Corrida Nike',
    description: 'Nike Air Zoom Pegasus 40, tamanho 41, usado 3x.',
    categoryId: 'cat-4',
    availableForTrade: false,
    image: require('../assets/products/ipadpro.jpg'),
    createdAt: '2026-08-24T12:00:00.000Z',
    featured: false,
  },
];

// ─── Trade Listings ───────────────────────────────────────────────────────────
// Intenções públicas de troca. Um usuário publica o que quer trocar.
export const tradeListings: TradeListing[] = [
  {
    id: "listing-1",
    ownerId: "user-2",
    productIds: ["prod-4", "prod-5"],
    description: "Procuro Nintendo Switch ou equipamento fotográfico.",
    status: "active",
  },
  {
    id: "listing-2",
    ownerId: "user-3",
    productIds: ["prod-6"],
    description: "Troco a bike por eletrônicos ou console.",
    status: "active",
  },
  {
    id: "listing-3",
    ownerId: "user-3",
    productIds: ["prod-7"],
    description: "iPad Pro — aceito notebooks ou câmeras.",
    status: "active",
  },
];

// ─── Negotiations ─────────────────────────────────────────────────────────────
// Negociações iniciadas entre usuários.
export const negotiations: Negotiation[] = [
  {
    id: "neg-1",
    initiatorId: "user-2", // Bruno
    receiverId: "user-1", // Ana (CURRENT_USER_ID)
    offeredProductIds: ["prod-4"], // PS5
    requestedProductIds: ["prod-1"], // Nintendo Switch
    status: "pending",
  },
  {
    id: "neg-2",
    initiatorId: "user-3", // Carla
    receiverId: "user-1", // Ana (CURRENT_USER_ID)
    offeredProductIds: ["prod-7"], // iPad Pro
    requestedProductIds: ["prod-2"], // Câmera
    status: "accepted",
  },
  {
    id: "neg-3",
    initiatorId: "user-1", // Ana
    receiverId: "user-2", // Bruno
    offeredProductIds: ["prod-2"], // Câmera
    requestedProductIds: ["prod-5"], // Headset
    status: "accepted",
  },
];

// ─── Messages ─────────────────────────────────────────────────────────────────
export const messages: Message[] = [
  {
    id: "msg-1",
    negotiationId: "neg-2",
    senderId: "user-3",
    text: "Oi Ana! Aceita trocar a câmera no meu iPad?",
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "msg-2",
    negotiationId: "neg-2",
    senderId: "user-1",
    text: "Olá Carla! Aceito sim. Como podemos fazer a troca?",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "msg-3",
    negotiationId: "neg-3",
    senderId: "user-1",
    text: "Bruno, tenho interesse no Headset. Troca na minha câmera?",
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: "msg-4",
    negotiationId: "neg-3",
    senderId: "user-2",
    text: "Fechado! Amanhã no centro?",
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
  },
];
