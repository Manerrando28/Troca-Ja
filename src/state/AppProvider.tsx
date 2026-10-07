import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import * as seed from '@/data';
import type { Category, Product, Negotiation } from '@/types';
import { applyTradeAction, type TradeAction, type TradeState } from '@/domain/trades';
import { fetchCatalog } from '@/services/catalog';
import { authenticateDemo } from '@/domain/auth';

type AppContextValue = {
  userId: string | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  state: TradeState;
  propose: (negotiation: Omit<Negotiation, 'id'>) => void;
  respond: (id: string, status: 'accepted' | 'rejected' | 'cancelled') => void;
  sendMessage: (id: string, text: string) => void;
  categories: Category[];
  products: Product[];
  catalogStatus: 'mock' | 'loading' | 'connected' | 'error';
  catalogError: string | null;
  retryCatalog: () => void;
};
const AppContext = createContext<AppContextValue | null>(null);
let sequence = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${++sequence}`;
const catalogUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
const catalogKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
const initialCatalogStatus = catalogUrl && catalogKey ? 'loading' : catalogUrl || catalogKey ? 'error' : 'mock';

export function AppProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [state, setState] = useState<TradeState>(initialCatalogStatus === 'mock'
    ? { negotiations: seed.negotiations, messages: seed.messages } : { negotiations: [], messages: [] });
  const stateRef = useRef(state);
  const [categories, setCategories] = useState<Category[]>(initialCatalogStatus === 'mock' ? seed.categories : []);
  const [products, setProducts] = useState<Product[]>(initialCatalogStatus === 'mock' ? seed.products : []);
  const [catalogStatus, setCatalogStatus] = useState<AppContextValue['catalogStatus']>(initialCatalogStatus);
  const [catalogError, setCatalogError] = useState<string | null>(initialCatalogStatus === 'error'
    ? 'Configuração incompleta do Supabase. Preencha as duas variáveis em .env.local e reinicie o Expo.' : null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!catalogUrl || !catalogKey) return;
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 10000);
    fetchCatalog(catalogUrl, catalogKey, seed.users.map(user => user.id), controller.signal).then(catalog => {
      if (!active) return;
      setCategories(catalog.categories);
      setProducts(catalog.products);
      setCatalogError(null);
      setCatalogStatus('connected');
    }).catch(cause => {
      if (!active) return;
      const timedOut = controller.signal.aborted;
      controller.abort(); // Encerra a outra consulta se apenas uma delas falhou.
      setCatalogStatus('error');
      setCatalogError(timedOut ? 'O Supabase demorou mais de 10 segundos. Tente novamente.'
        : cause instanceof Error ? cause.message : 'Falha ao consultar Supabase. Confira sua conexão.');
    }).finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [attempt]);

  function commit(action: TradeAction) {
    if (!userId) throw new Error('Entre em uma conta de demonstração.');
    if (catalogStatus === 'loading' || catalogStatus === 'error') throw new Error('Aguarde o catálogo carregar antes de continuar.');
    const next = applyTradeAction(stateRef.current, action, products);
    stateRef.current = next;
    setState(next);
  }
  return <AppContext.Provider value={{
    userId, state, categories, products, catalogStatus, catalogError,
    retryCatalog: () => {
      if (!catalogUrl || !catalogKey) return;
      setCatalogStatus('loading');
      setCatalogError(null);
      setAttempt(value => value + 1);
    },
    login: (email, password) => setUserId(authenticateDemo(email, password)),
    logout: () => setUserId(null),
    propose: n => commit({ type: 'propose', negotiation: { ...n, id: nextId('neg') }, actorId: userId ?? '' }),
    respond: (id, status) => commit({ type: 'respond', id, status, actorId: userId ?? '' }),
    sendMessage: (id, text) => commit({ type: 'message', actorId: userId ?? '', message: {
      id: nextId('msg'), negotiationId: id, senderId: userId ?? '', text, timestamp: new Date().toISOString(),
    } }),
  }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp deve ser usado dentro de AppProvider.');
  return context;
}
