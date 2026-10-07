# Integração do CP5

A integração implementada consulta a tabela pública `categories` do Supabase via REST. Os nomes retornados alimentam os filtros da Home. Produtos, usuários, propostas e mensagens continuam mockados; não há gravação de dados pessoais no banco.

## Configuração

1. Crie um projeto Supabase e habilite a Data API para o schema `public`.
2. Execute [schema.sql](../supabase/schema.sql) no SQL Editor. O script cria e popula quatro categorias, habilita RLS e concede somente leitura às roles públicas.
3. Copie `.env.example` para `.env.local`.
4. Preencha `EXPO_PUBLIC_SUPABASE_URL` com a URL HTTPS do projeto, sem barra final, e `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` com a chave **publishable** (`sb_publishable_...`). Não use senha, chave secreta ou `service_role` no aplicativo.
5. Reinicie `npm run web -- --clear`. No Perfil, verifique “Categorias conectadas ao Supabase”.
6. No banco, altere temporariamente o nome de uma categoria. Recarregue o app e confirme que o filtro mostra esse nome. Restaure o nome executando o seed novamente e capture a tela como evidência.

Sem variáveis, o aplicativo usa categorias locais e informa isso no Perfil. Falhas de rede, timeout (10 segundos), chave incorreta, tabela vazia ou seed incompleto apresentam aviso e opção de nova tentativa na Home. Não são tratadas como conexão bem-sucedida.

## Escopo e comprovação

O adaptador tem testes de contrato com respostas simuladas. **A integração em um projeto remoto ainda precisa ser configurada e validada pelo grupo**; não foram fornecidas credenciais de um projeto existente. O modo mock sozinho não comprova o requisito de banco do CP5.

Não há autenticação real: a seleção de conta serve somente para a demonstração local. Para o CP6, evoluir para Supabase Auth, relacionamentos de produtos/propostas/mensagens e políticas RLS por participante antes de habilitar escritas remotas.

Referências: [Data API](https://supabase.com/docs/guides/api/creating-routes), [chaves públicas](https://supabase.com/docs/guides/getting-started/api-keys), [proteção dos dados](https://supabase.com/docs/guides/database/secure-data).
