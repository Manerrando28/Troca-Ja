// Contas públicas para avaliação do protótipo. Não usar como autenticação de produção.
export const demoAccounts = [
  { userId: 'user-1', name: 'Ana', email: 'ana@trocaja.com', password: 'Ana12345' },
  { userId: 'user-2', name: 'Bruno', email: 'bruno@trocaja.com', password: 'Bruno12345' },
  { userId: 'user-3', name: 'Carla', email: 'carla@trocaja.com', password: 'Carla12345' },
  { userId: 'user-4', name: 'Cláudio', email: 'claudio@trocaja.com', password: 'Claudio12345' },
] as const;

export function authenticateDemo(email: string, password: string): string {
  if (!email.trim() || !password) throw new Error('Preencha seu e-mail e sua senha.');
  const account = demoAccounts.find(a => a.email === email.trim().toLowerCase() && a.password === password);
  if (!account) throw new Error('E-mail ou senha incorretos. Confira os dados e tente novamente.');
  return account.userId;
}
