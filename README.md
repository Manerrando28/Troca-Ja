# TrocaJá

Aplicativo mobile de trocas entre usuários desenvolvido com **Expo**, **React Native**, **TypeScript** e **Expo Router**.

Este README descreve **somente o conteúdo e o comportamento observável no repositório fornecido**. Não inclui decisões ou requisitos externos ao código-fonte.

## Stack

O `package.json` do projeto declara:

- Expo `~57.0.16`
- Expo Router `~57.0.16`
- React `19.2.3`
- React Native `0.86.2`
- TypeScript `~6.0.3`
- React Native Paper `^5.15.3`
- React Native Reanimated `4.5.1`
- React Native Gesture Handler `~2.32.0`
- React Native Safe Area Context `~5.7.0`
- React Native Screens `~4.26.0`
- React Native Web `~0.21.0`
- Expo Image `~57.0.3`
- Expo Splash Screen `~57.0.8`
- Expo Symbols `~57.0.2`
- Expo Web Browser `~57.0.2`

O entry point definido no `package.json` é:

```json
"main": "expo-router/entry"
```

## Scripts

```bash
npm run start
npm run android
npm run ios
npm run web
npm run lint
```

Equivalentes:

```bash
npx expo start
npx expo start --android
npx expo start --ios
npx expo start --web
expo lint
```

O projeto também possui o script:

```bash
npm run reset-project
```

que executa `scripts/reset-project.js`. Esse script é um utilitário herdado do template do Expo para mover ou remover diretórios existentes e recriar um `src/app` mínimo.

---

## Estrutura do projeto

A estrutura de código registrada no repositório é:

```text
.
├── scripts/
│   └── reset-project.js
│
└── src/
    ├── app/
    │   ├── _layout.tsx
    │   ├── index.tsx
    │   │
    │   ├── (auth)/
    │   │   ├── _layout.tsx
    │   │   └── login.tsx
    │   │
    │   ├── (tabs)/
    │   │   ├── _layout.tsx
    │   │   ├── index.tsx
    │   │   ├── negotiations.tsx
    │   │   ├── profile.tsx
    │   │   └── trades.tsx
    │   │
    │   └── chat/
    │       └── [id].tsx
    │
    ├── components/
    │   ├── ui/
    │   │   ├── Avatar.tsx
    │   │   └── Button.tsx
    │   │
    │   ├── NegotiationCard.tsx
    │   ├── ProductCard.tsx
    │   ├── ProductTradeModal.tsx
    │   └── TradeCard.tsx
    │
    ├── data.ts
    ├── global.css
    ├── types.ts
    │
    └── tokens/
        └── theme.ts
```

O código também contém referências a assets como:

```text
assets/
├── products/
├── ui-images/
└── ...
```

Esses arquivos são utilizados por `require(...)` em telas, componentes e dados mock.

---

# Navegação

O projeto utiliza **Expo Router** com três grupos/áreas principais:

```text
/
├── (auth)/
├── (tabs)/
└── chat/[id]
```

## Root layout

`src/app/_layout.tsx` configura um `Stack` e registra:

- `(auth)` sem header;
- `(tabs)` sem header;
- `chat/[id]`.

Também chama `SplashScreen.preventAutoHideAsync()` e esconde o splash em um `useEffect`.

## Entrada da aplicação

`src/app/index.tsx` redireciona para:

```text
/(auth)/login
```

Portanto, a entrada atual da aplicação passa pela tela de login.

---

# Autenticação

A autenticação implementada atualmente é simulada.

`src/app/(auth)/login.tsx` apresenta:

- logo;
- nome `TrocaJá`;
- texto `Troque produtos com pessoas perto de você`;
- botão `Entrar`.

Ao pressionar `Entrar`, a aplicação executa:

```ts
router.replace("/(tabs)")
```

Não há validação de credenciais nessa tela.

O usuário utilizado pelo restante do protótipo é definido em `src/data.ts`:

```ts
export const CURRENT_USER_ID = "user-1";
```

---

# Bottom Navigation

`src/app/(tabs)/_layout.tsx` utiliza `Tabs` do Expo Router.

As quatro abas configuradas são:

| Rota | Título |
|---|---|
| `index` | Home |
| `trades` | Trocas |
| `negotiations` | Negociações |
| `profile` | Perfil |

A barra utiliza:

- `Colors.secondary` como cor ativa;
- `Colors.textMuted` como cor inativa;
- fundo `Colors.surface`;
- borda superior `Colors.border`.

Os ícones são carregados de:

```text
assets/ui-images/
```

---

# Home

Arquivo:

```text
src/app/(tabs)/index.tsx
```

A Home possui:

- saudação ao usuário;
- categorias;
- filtros;
- lista de produtos;
- estado vazio;
- modal de proposta.

## Categorias

As categorias são exibidas em uma lista horizontal.

Cada categoria pode ser selecionada e desmarcada.

O código constrói `categoryCards` a partir de `categories`, procurando uma imagem correspondente nos produtos da categoria.

## Filtros

A Home possui três filtros:

```text
Lançados hoje
Destaques
Usuários confiáveis
```

Também existe filtro por categoria.

O estado usado pela tela é:

```ts
selectedCategoryId
selectedFilter
selectedProduct
pendingNegotiations
```

## Produtos exibidos

A lista inicial é formada por produtos que:

```ts
p.availableForTrade && p.ownerId !== CURRENT_USER_ID
```

Depois são aplicados:

- filtro de categoria;
- filtro `today`;
- filtro `featured`;
- filtro `trusted`.

O filtro `today` compara `createdAt` com a data atual.

O filtro `trusted` considera usuários com:

```ts
completedTrades >= 10
```

## Lista

A Home usa `FlatList` para renderizar `filteredProducts`.

Cada item é renderizado como:

```tsx
<ProductCard
  product={item}
  owner={owner}
  onPress={() => setSelectedProduct(item)}
/>
```

Quando não há resultados, é exibida a mensagem:

```text
Nenhum produto disponível para os
filtros selecionados.
```

---

# ProductCard

Arquivo:

```text
src/components/ProductCard.tsx
```

Props:

```ts
type ProductCardProps = {
  product: Product;
  owner: User;
  onPress: () => void;
};
```

O componente:

- usa `Pressable`;
- mostra imagem do produto;
- mostra nome;
- mostra descrição;
- mostra proprietário;
- possui feedback visual quando pressionado.

O card não possui botão de negociação.

A interação é feita pelo próprio `Pressable`.

Existe um mapa local de emojis por categoria:

```text
cat-1 → 💻
cat-2 → 🎮
cat-3 → 📚
cat-4 → 🏃
```

Embora esse mapa exista, o componente atualmente renderiza a imagem do produto.

---

# ProductTradeModal

Arquivo:

```text
src/components/ProductTradeModal.tsx
```

O modal representa a proposta de troca.

Props:

```ts
type ProductTradeModalProps = {
  visible: boolean;
  targetProduct: Product | null;
  targetUser: User | null;
  currentUserProducts: Product[];
  currentUser: User;
  onClose: () => void;
  onConfirm: (negotiation: Omit<Negotiation, 'id'>) => void;
};
```

## Seleção

O modal mantém localmente:

```ts
selectedProductIds
```

O usuário pode alternar produtos próprios.

Ao fechar, a seleção é zerada.

## Validações

Antes de confirmar:

1. deve existir pelo menos um produto selecionado;
2. `targetUser` e `targetProduct` devem existir;
3. o usuário atual não pode ser o proprietário do produto alvo.

Caso a oferta seja válida, o modal cria:

```ts
{
  initiatorId: currentUser.id,
  receiverId: targetUser.id,
  offeredProductIds: selectedProductIds,
  requestedProductIds: [targetProduct.id],
  status: 'pending'
}
```

e chama `onConfirm`.

A interface também desabilita o botão quando nenhum produto foi selecionado.

---

# Trocas

Arquivo:

```text
src/app/(tabs)/trades.tsx
```

Apesar do nome da rota ser `trades`, a implementação atual funciona como uma tela de **ofertas recebidas**.

Ela inicia estado local com:

```ts
const [negotiationsList, setNegotiationsList] =
  useState<Negotiation[]>(mockNegotiations);
```

São exibidas somente negociações:

```ts
n.receiverId === CURRENT_USER_ID &&
n.status === 'pending'
```

O cabeçalho exibido é:

```text
Ofertas Recebidas
Propostas de troca para os seus produtos
```

Cada oferta é renderizada usando:

```text
src/components/TradeCard.tsx
```

## Aceitar

Ao aceitar uma oferta:

```ts
status → 'accepted'
```

e é exibido um `Alert` informando:

```text
Aceita!
A proposta foi aceita. Acesse a aba Negociações para conversar.
```

## Recusar

Ao recusar:

```ts
status → 'rejected'
```

Essa alteração ocorre no estado local da tela.

---

# TradeCard

Arquivo:

```text
src/components/TradeCard.tsx
```

O componente representa uma oferta recebida.

Ele recebe:

```ts
negotiation
owner
offeredProducts
requestedProducts
onAccept
onReject
```

Visualmente mostra:

- avatar;
- nome;
- username;
- produtos oferecidos;
- produtos solicitados;
- botão `Recusar`;
- botão `Negociar`.

A área central representa a troca como:

```text
produtos oferecidos
        ↕
produtos solicitados
```

O botão de aceitação é apresentado ao usuário como:

```text
Negociar
```

---

# Negociações

Arquivo:

```text
src/app/(tabs)/negotiations.tsx
```

A tela funciona como uma lista de conversas.

São exibidas negociações que:

```ts
(n.initiatorId === CURRENT_USER_ID ||
 n.receiverId === CURRENT_USER_ID)
&&
n.status === 'accepted'
```

Cada negociação é transformada em dados para `NegotiationCard`.

A tela determina:

- outro usuário;
- produtos oferecidos;
- produtos solicitados;
- quais produtos pertencem a cada lado na perspectiva do usuário atual;
- última mensagem.

Ao tocar em uma negociação:

```ts
router.push(`/chat/${negotiation.id}`)
```

---

# NegotiationCard

Arquivo:

```text
src/components/NegotiationCard.tsx
```

Props:

```ts
type NegotiationCardProps = {
  negotiation: Negotiation;
  otherUser: User;
  offeredProducts: Product[];
  requestedProducts: Product[];
  lastMessage?: Message;
  onPress: () => void;
};
```

O componente apresenta a negociação no estilo de uma lista de conversas.

Mostra:

- avatar;
- nome do outro usuário;
- horário da última mensagem;
- assunto da troca;
- trecho da última mensagem.

Se não houver mensagem, utiliza textos como:

```text
Nova oferta recebida!
```

ou:

```text
Nenhuma mensagem ainda.
```

---

# Chat

Arquivo:

```text
src/app/chat/[id].tsx
```

É uma rota dinâmica do Expo Router.

O ID da negociação é obtido por:

```ts
useLocalSearchParams()
```

A tela procura a negociação correspondente em:

```ts
negotiations
```

e as mensagens correspondentes em:

```ts
messages
```

## Conteúdo

O chat mostra:

- outro usuário;
- produtos envolvidos na troca;
- mensagens;
- horário das mensagens;
- campo de texto;
- botão de envio.

A interface possui uma faixa superior apresentando os produtos da negociação.

As mensagens do usuário atual ficam alinhadas à direita e as do outro participante à esquerda.

## Envio de mensagem

O envio ignora texto vazio:

```ts
if (!inputText.trim()) return;
```

Uma nova `Message` é criada com:

```ts
{
  id: `msg-${Date.now()}`,
  negotiationId: negotiation.id,
  senderId: CURRENT_USER_ID,
  text: inputText.trim(),
  timestamp: new Date().toISOString()
}
```

A mensagem é adicionada ao estado local.

A tela utiliza `FlatList` e rola para o final após o envio.

Não existe persistência.

---

# Perfil

Arquivo:

```text
src/app/(tabs)/profile.tsx
```

O perfil encontra o usuário atual através de:

```ts
users.find((u) => u.id === CURRENT_USER_ID)
```

Os produtos próprios são derivados de:

```ts
products.filter((p) => p.ownerId === CURRENT_USER_ID)
```

A tela mostra:

- avatar;
- nome;
- username;
- quantidade total de produtos;
- quantidade de produtos disponíveis para troca;
- seção `Meus produtos`;
- produtos próprios;
- botão `Sair`.

O botão `Sair` executa:

```ts
router.replace('/(auth)/login')
```

Os produtos do perfil utilizam `ProductCard`.

O callback atual do card contém um TODO para futuramente abrir detalhes/edição do produto.

---

# Modelo de dados

Os tipos estão em:

```text
src/types.ts
```

## User

```ts
type User = {
  id: string;
  name: string;
  username: string;
  completedTrades: number;
};
```

## Category

```ts
type Category = {
  id: string;
  name: string;
};
```

## Product

```ts
type Product = {
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
```

Cada produto possui `ownerId`, relacionando-o a um usuário.

## TradeListing

```ts
type TradeListing = {
  id: string;
  ownerId: string;
  productIds: string[];
  description?: string;
  status: 'active' | 'closed';
};
```

O próprio código descreve `TradeListing` como a intenção pública de um usuário de realizar uma troca, diferente de uma negociação.

## Negotiation

```ts
type Negotiation = {
  id: string;
  initiatorId: string;
  receiverId: string;
  offeredProductIds: string[];
  requestedProductIds: string[];
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
};
```

## Message

```ts
type Message = {
  id: string;
  negotiationId: string;
  senderId: string;
  text: string;
  timestamp: string;
};
```

---

# Dados mock

Arquivo:

```text
src/data.ts
```

O arquivo funciona como banco de dados em memória.

Ele exporta:

```text
CURRENT_USER_ID
users
categories
products
tradeListings
negotiations
messages
```

## Usuário atual

```ts
CURRENT_USER_ID = "user-1"
```

## Usuários

Existem três usuários mock:

| ID | Nome | Username | Trocas concluídas |
|---|---|---|---:|
| `user-1` | Ana Costa | `ana.costa` | 3 |
| `user-2` | Bruno Lima | `brunolima` | 12 |
| `user-3` | Carla Souza | `carlasouza` | 27 |

## Categorias

```text
cat-1 → Eletrônicos
cat-2 → Jogos
cat-3 → Livros
cat-4 → Esportes
```

## Produtos

O arquivo contém oito produtos mock, pertencentes aos três usuários.

Os produtos incluem:

- Nintendo Switch;
- Câmera Fujifilm X-T30;
- Livros de Clean Code;
- PS5;
- Headset Gamer;
- Bicicleta Speed Trek;
- iPad Pro;
- Tênis de Corrida Nike.

Os produtos possuem `ownerId`, categoria, disponibilidade para troca, data de criação e indicador `featured`.

As imagens são referências estáticas a arquivos dentro de `assets/products`.

## Trade listings

Existem três `TradeListing`:

```text
listing-1
listing-2
listing-3
```

Eles representam intenções públicas de troca e possuem `ownerId`, `productIds`, descrição e status.

## Negotiations

Existem três negociações mock:

```text
neg-1 → pending
neg-2 → accepted
neg-3 → accepted
```

As negociações relacionam os participantes e os produtos oferecidos/solicitados por IDs.

## Messages

Existem mensagens associadas às negociações aceitas.

Os timestamps são gerados usando `Date.now()` e offsets em horas/dias, portanto são relativos ao momento em que o módulo é executado.

---

# Tema e design tokens

Arquivo:

```text
src/tokens/theme.ts
```

O arquivo centraliza:

- cores;
- fontes;
- tipografia;
- espaçamentos;
- dimensões auxiliares.

## Cores

O conjunto principal contém:

```text
primary
secondary
background
surface
button
text
secondaryText
textMuted
error
success
buttonText
border
```

Também existem conjuntos `light` e `dark`.

## Tipografia

```ts
typography.h1
typography.h2
typography.h3
typography.body
typography.caption
```

## Outras constantes

```ts
BottomTabInset
MaxContentWidth
```

`MaxContentWidth` é `800`.

---

# Componentes de UI

## Avatar

Arquivo:

```text
src/components/ui/Avatar.tsx
```

Props:

```ts
{
  name: string;
  size?: number;
}
```

O avatar:

- gera iniciais a partir do nome;
- usa uma cor determinística baseada no nome;
- não depende de uma imagem de perfil.

## Button

Arquivo:

```text
src/components/ui/Button.tsx
```

Props:

```ts
{
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}
```

Variantes:

```text
primary
secondary
danger
```

Quando `loading` é verdadeiro, o botão mostra `ActivityIndicator`.

---

# Estilo

As telas e componentes utilizam principalmente:

```text
StyleSheet
```

e importam os tokens de:

```ts
@/tokens/theme
```

A aplicação usa:

```text
SafeAreaView
FlatList
ScrollView
Pressable
Modal
KeyboardAvoidingView
```

de acordo com a tela.

O `global.css` define variáveis de fonte para o ambiente web.

---

# Arquivos legados do template

O snapshot do repositório também contém código proveniente do template do Expo, incluindo:

```text
scripts/reset-project.js
```

e, no histórico/conteúdo do repositório fornecido, componentes como:

```text
AppTabs
ThemedText
ThemedView
ExternalLink
HintRow
WebBadge
AnimatedIcon
useColorScheme
useTheme
```

O utilitário `reset-project.js` explicitamente se descreve como um script para resetar o projeto criado a partir do template do Expo.

A estrutura funcional atual do aplicativo, porém, utiliza as telas e componentes descritos nas seções anteriores.

---

# Fluxos atualmente implementados

## Entrada

```text
App
 ↓
/(auth)/login
 ↓
Entrar
 ↓
/(tabs)
```

## Home → proposta

```text
Home
 ↓
ProductCard
 ↓
selecionar produto
 ↓
ProductTradeModal
 ↓
selecionar produtos próprios
 ↓
Propor negociação
```

## Oferta recebida

```text
Trocas
 ↓
oferta pending
 ├── Recusar → rejected
 └── Negociar → accepted
                    ↓
              Negociações
```

## Negociação aceita

```text
Negociações
 ↓
NegotiationCard
 ↓
/chat/[id]
 ↓
mensagens
```

## Perfil

```text
Perfil
 ↓
produtos cujo ownerId = CURRENT_USER_ID
 ↓
Sair
 ↓
Login
```

---

# Estado de implementação

O repositório fornecido contém uma implementação funcional de protótipo com:

- navegação por Stack;
- grupo de autenticação;
- Bottom Navigation;
- Home;
- filtros e categorias;
- produtos mock;
- ProductCard;
- modal de proposta;
- ofertas recebidas;
- aceitação/rejeição de ofertas;
- lista de negociações aceitas;
- chat simulado;
- perfil;
- dados mock normalizados por IDs;
- tipos TypeScript;
- tokens de design.

A persistência dos dados, a autenticação real e a comunicação com um servidor não estão presentes no código fornecido.
