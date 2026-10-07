import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import * as seed from '@/data';
import type { Category, Negotiation } from '@/types';
import { applyTradeAction, type TradeAction, type TradeState } from '@/domain/trades';
import { fetchCategories } from '@/services/catalog';
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
  catalogStatus: 'mock' | 'loading' | 'connected' | 'error';
  catalogError: string | null;
  retryCatalog: () => void;
};
const AppContext = createContext<AppContextValue | null>(null);
let sequence = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${++sequence}`;
const catalogUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const catalogKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const initialCatalogStatus = catalogUrl && catalogKey ? 'loading' : catalogUrl || catalogKey ? 'error' : 'mock';

export function AppProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [state, setState] = useState<TradeState>({ negotiations: seed.negotiations, messages: seed.messages });
  const stateRef = useRef(state);
  const [categories, setCategories] = useState(seed.categories);
  const [catalogStatus, setCatalogStatus] = useState<AppContextValue['catalogStatus']>(initialCatalogStatus);
  const [catalogError, setCatalogError] = useState<string | null>(initialCatalogStatus === 'error'
    ? 'Configuração incompleta do Supabase. Usando categorias locais.' : null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!catalogUrl || !catalogKey) return;
    const controller = new AbortController();
    let active = true;
    const timeout = setTimeout(() => controller.abort(), 10000);
    fetchCategories(catalogUrl, catalogKey, controller.signal).then(rows => {
      if (!active) return;
      if (!seed.products.every(p => rows.some(c => c.id === p.categoryId))) {
        throw new Error('Faltam categorias dos produtos mockados. Execute o seed completo.');
      }
      setCategories(rows);
      setCatalogStatus('connected');
    }).catch(() => {
      if (!active) return;
      setCategories(seed.categories);
      setCatalogStatus('error');
      setCatalogError('Falha ao consultar Supabase. Usando categorias locais; confira a conexão e o seed.');
    }).finally(() => clearTimeout(timeout));
    return () => { active = false; clearTimeout(timeout); controller.abort(); };
  }, [attempt]);

  function commit(action: TradeAction) {
    if (!userId) throw new Error('Entre em uma conta de demonstração.');
    const next = applyTradeAction(stateRef.current, action, seed.products);
    stateRef.current = next;
    setState(next);
  }
  return <AppContext.Provider value={{
    userId, state, categories, catalogStatus, catalogError,
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
