import test from 'node:test';
import assert from 'node:assert/strict';
import { authenticateDemo, demoAccounts } from '../src/domain/auth.ts';
test('login valida as quatro credenciais exibidas no formulário', () => {
  for (const account of demoAccounts) assert.equal(authenticateDemo(account.email, account.password), account.userId);
  assert.equal(authenticateDemo(' ANA@TROCAJA.COM ', 'Ana12345'), 'user-1');
});
test('login rejeita campos vazios, senha incorreta e identidade inexistente', () => {
  assert.throws(() => authenticateDemo('', ''), /Preencha/);
  assert.throws(() => authenticateDemo('ana@trocaja.com', ''), /Preencha/);
  assert.throws(() => authenticateDemo('ana@trocaja.com', 'errada'), /incorretos/);
  assert.throws(() => authenticateDemo('intruso@trocaja.com', 'Ana12345'), /incorretos/);
});
