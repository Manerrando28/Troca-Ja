# Guia: transferir os produtos do TrocaJá para o Supabase

Ao terminar este guia, os oito produtos atuais estarão no banco e o aplicativo buscará produtos e categorias pela internet. Não é necessário instalar o Supabase CLI nem escrever o SQL: os scripts já estão prontos.

O Supabase fornece um banco de dados e uma API para consultá-lo. Uma **tabela** funciona como uma planilha: cada linha é um produto e cada coluna guarda uma informação dele. **Storage** é a área para arquivos, como fotos. **SQL Editor** é a tela onde você executará os scripts abaixo. **RLS** são as regras que controlam o acesso aos dados.

## 1. Criar seu projeto

1. Acesse o [painel do Supabase](https://supabase.com/dashboard), entre ou crie sua conta.
2. Crie uma organização se o painel solicitar e escolha **New project**.
3. Dê um nome, por exemplo `troca-ja`, escolha a região e defina a senha do banco. Guarde essa senha; ela **não vai no aplicativo**. Confira o plano e eventuais custos antes de criar.
4. Aguarde o projeto ficar disponível. Se já tem um projeto para este aplicativo, use-o.

## 2. Criar as tabelas

1. No projeto, abra **SQL Editor** e uma nova consulta (**New query**).
2. No editor de código, abra [supabase/schema.sql](../supabase/schema.sql), copie **todo** o conteúdo, cole no SQL Editor e clique em **Run**.
3. Abra **Table Editor**. No schema `public`, devem aparecer `categories` (quatro linhas) e `products` (ainda vazia).

Esse script também funciona em um projeto que já usava a tabela `categories` da versão anterior do TrocaJá. Cria `products`, mantém as categorias existentes e libera somente leitura pelo app. Se já existir uma tabela `products` de outro sistema, use um projeto separado: o script não converte estruturas externas.

As regras públicas são de leitura, incluindo produtos indisponíveis (para aparecerem no Perfil). Inserir, editar e apagar produtos será feito pelo painel administrativo. Não desative a RLS para resolver erros.

## 3. Importar os oito produtos atuais

1. Abra outra consulta no **SQL Editor**.
2. Copie todo o arquivo [supabase/seed.sql](../supabase/seed.sql), cole e clique em **Run**.
3. Em **Table Editor → products**, confira as oito linhas, de `prod-1` até `prod-8`.

Pronto: nomes, descrições, donos, categorias, disponibilidade, destaques e datas já foram transferidos. Pode executar os scripts novamente: eles não duplicam os IDs nem substituem suas edições. O PS5 e a bicicleta recebem a data da primeira importação; as datas dos demais produtos foram preservadas. O filtro “Lançados hoje” passa a usar essas datas gravadas, sem reiniciá-las toda vez que o app abre.

As fotos ficam `NULL` por enquanto (sem imagem); o aplicativo mostra um ícone. Não é necessário digitar produto por produto nem importar CSV.

## 4. Conectar o aplicativo ao banco

1. No painel, use **Connect** para localizar a **Project URL**. Ela se parece com `https://abcdefgh.supabase.co`. Também pode estar em **Settings → Data API**. Confirme que a Data API está habilitada para `public`.
2. Em **Settings → API Keys**, copie a **Publishable key**, que começa com `sb_publishable_`. Essa é a chave pública adequada ao aplicativo. Nunca use `sb_secret_`, `service_role` ou a senha do banco.
3. Na raiz do projeto local (a pasta do `package.json`), copie [.env.example](../.env.example) para um novo arquivo chamado `.env.local`. No PowerShell, pode usar:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Faça essa cópia só na primeira configuração, para não substituir um `.env.local` já preenchido.

4. Preencha o arquivo com os seus valores reais:

   ```dotenv
   EXPO_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
   EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_COLE_SUA_CHAVE_AQUI
   ```

5. Salve. Pare o Expo com `Ctrl+C` no terminal e execute:

   ```bash
   npm run web -- --clear
   ```

   Para Android: `npm run android -- --clear`. Use Node 22.18+ ou 24 LTS. Se estiver usando uma versão exportada, gere-a novamente com `npm run export:web -- --clear`, pois essas variáveis são incorporadas no build.

6. Entre com uma das contas de demonstração exibidas no login. No **Perfil**, confira a mensagem **“Produtos e categorias conectados ao Supabase.”**

O `.env.local` já é ignorado pelo Git. A chave publishable é pública por definição; a proteção contra escrita vem das permissões e políticas criadas pelo SQL.

## 5. Enviar as fotos

As imagens locais do aplicativo não são enviadas automaticamente pelo SQL. Para transferi-las:

1. No painel Supabase, abra **Storage → New bucket**.
2. Nomeie o bucket `product-images` e marque-o como **Public**. As fotos desse bucket poderão ser vistas por qualquer pessoa com o link; use apenas fotos públicas dos produtos.
3. Entre no bucket e use **Upload files** para enviar os cinco arquivos da pasta [assets/products](../assets/products) listados abaixo, diretamente na raiz do bucket.
4. Para cada arquivo, copie a **URL pública** (opção como **Get URL** ou **Copy URL**) e cole na coluna `image_url` da linha correspondente em **Table Editor → products**. Salve a alteração.

| Produto | ID | Arquivo local |
| --- | --- | --- |
| Livros de Clean Code | `prod-3` | `livros.jpg` |
| PS5 | `prod-4` | `ps5usado.jpg` |
| Headset Sony WH-1000XM5 | `prod-5` | `headsetusado.jpg` |
| Bike Speed Trek | `prod-6` | `bik-speed-trek.jpg` |
| iPad Pro 11 polegadas | `prod-7` | `ipadpro.jpg` |

Uma URL pública tem este formato:

```text
https://SEU-PROJETO.supabase.co/storage/v1/object/public/product-images/ps5usado.jpg
```

Use o endereço real, começando com `https://`. Não cole um caminho como `C:\...`, um `require(...)`, nem o link da tela administrativa do Supabase. Abra a URL numa aba do navegador para conferir se a foto aparece. Nintendo Switch, câmera e tênis não tinham fotos correspondentes no catálogo; deixe `NULL` ou envie fotos próprias e preencha as URLs. `NULL` significa ausência de valor, não o texto “null”.

Recarregue o aplicativo para ver as fotos. Não é necessário liberar upload público: você enviará as imagens pelo painel.

## 6. Confirmar que o app está usando o banco

1. No Table Editor, mude o nome de `prod-4` de `PS5` para `PS5 do Supabase` e salve.
2. Recarregue o app e entre como Ana. Busque `PS5 do Supabase`. O novo nome deve aparecer.
3. Abra esse produto e ofereça o Nintendo Switch. Confira a proposta em **Trocas**.
4. Saia da conta e entre como Bruno, **sem recarregar o app**. Aceite a proposta e abra **Negociações**: os nomes dos produtos também vêm do catálogo remoto.
5. Restaure o nome `PS5` no painel se desejar. Para buscar alterações no banco, recarregue o aplicativo. Não há atualização em tempo real nesta versão.

Em um banco recém-importado existem oito produtos, mas Ana vê cinco na Home: seus próprios dois produtos ficam no Perfil e o tênis está indisponível. O número da Home não precisa ser oito.

## 7. Cadastrar ou editar produtos depois

Em **Table Editor → products**, use **Insert row** para cadastrar ou edite uma linha existente. Não precisa alterar o código nem executar novamente o seed.

| Coluna | O que preencher |
| --- | --- |
| `id` | Deixe gerar automaticamente para novos produtos. Não mude os IDs importados. |
| `owner_id` | `user-1` = Ana; `user-2` = Bruno; `user-3` = Carla; `user-4` = Cláudio. |
| `name` | Nome do produto, obrigatório. |
| `description` | Descrição; pode ser vazia. |
| `category_id` | `cat-1` = Eletrônicos; `cat-2` = Jogos; `cat-3` = Livros; `cat-4` = Esportes. |
| `available_for_trade` | `true` para aparecer na Home de outras contas; `false` para indisponível. |
| `image_url` | URL HTTPS pública da foto, ou `NULL`. |
| `created_at` | Pode deixar o padrão `now()` para usar a data de cadastro. |
| `featured` | `true` para aparecer no filtro de destaques; padrão `false`. |

Também pode inserir novas categorias em `categories`, com um `id` único e um `name`, antes de usá-las nos produtos. Os donos continuam limitados às quatro contas de demonstração até uma futura integração com Supabase Auth.

## Se algo não funcionar

| Sintoma | Como resolver |
| --- | --- |
| “Catálogo local de demonstração” | As duas variáveis estão vazias. Preencha `.env.local` na raiz e reinicie o Expo. |
| Configuração incompleta | Preencha URL **e** chave pública; reinicie o Expo. |
| URL inválida | Copie a Project URL `https://...supabase.co`, não a URL do painel nem a conexão PostgreSQL. |
| HTTP 401/403 | Confira a publishable key do mesmo projeto, Data API, permissões e RLS de leitura. |
| HTTP 404 | Execute `schema.sql` e confirme que as tabelas estão no schema `public`. |
| Nenhum produto cadastrado | Execute `seed.sql`. Se há linhas no painel, confira a política SELECT: a RLS pode ocultar linhas sem retornar erro HTTP. |
| Categoria ausente ou proprietário desconhecido | Confira `category_id`, leitura de `categories` e os quatro `owner_id` permitidos. |
| Imagem não aparece | Confira bucket público, nome exato do arquivo e URL HTTPS. Abra a URL no navegador. |
| Demora ou erro de rede | Verifique internet e se o projeto está ativo. Use **Tentar novamente** na Home. |
| Mudança no banco não aparece | Recarregue o app. Mudanças nas variáveis exigem reiniciar o Expo ou gerar novamente o build. |

## O que esta refatoração cobre

Produtos e categorias são consultados pela Data API, com paginação e validação dos campos. Todas as telas e regras de proposta usam os mesmos produtos do `AppProvider`. Com ambas as variáveis vazias, o app continua no modo local. Com configuração parcial ou falha remota, apresenta erro e não usa produtos fictícios como substitutos. Uma tabela vazia é exibida como catálogo vazio.

Login, propostas e mensagens **continuam em memória**: não são gravados no Supabase nem sincronizados entre celulares. Em modo remoto, propostas e conversas começam vazias para não misturar negociações fictícias com produtos do banco; podem ser criadas durante a sessão e somem ao recarregar. Não cadastre usuários reais nem habilite escrita pública nesta etapa.

Não foram fornecidas credenciais de um projeto real. A validação remota deve ser feita seguindo o passo 6; os testes locais usam respostas simuladas da API.

Para verificar o código, execute `npm run check`. Para exercitar o modo Supabase no navegador com uma API simulada, execute `npm run test:e2e:supabase` (requer Chromium do Playwright ou `PLAYWRIGHT_CHANNEL=msedge`). Esse teste usa credenciais fictícias, ignora `.env.local`, limpa o cache do Metro e gera o bundle separado em `dist-supabase/`; não altera seu banco nem os arquivos do preview normal em `dist/`. Depois dele, inicie o app com `--clear` ou use `npm run export:web -- --clear` para gerar um novo build com sua própria configuração.

Referências oficiais: [tabelas](https://supabase.com/docs/guides/database/tables), [chaves públicas](https://supabase.com/docs/guides/getting-started/api-keys), [proteção dos dados](https://supabase.com/docs/guides/database/secure-data), [URLs de imagens públicas](https://supabase.com/docs/guides/storage/serving/downloads).
