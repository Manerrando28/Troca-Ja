# TrocaJá

Aplicativo mobile de **trocas de produtos entre usuários**, desenvolvido com React Native e Expo.

O TrocaJá permite que usuários anunciem produtos disponíveis para troca, enviem propostas utilizando seus próprios produtos e negociem por meio de um chat após a aceitação da proposta.

> **Status:** protótipo funcional com dados mockados. Autenticação real, persistência e comunicação com servidor ainda não estão implementadas.

---

## Funcionalidades

* Login simulado
* Home com produtos disponíveis para troca
* Filtro por categoria
* Filtros de produtos:

  * Lançados hoje
  * Destaques
  * Usuários confiáveis
* Visualização dos produtos
* Criação de propostas de troca
* Seleção de um ou mais produtos para oferecer
* Recebimento de propostas
* Aceitação e recusa de propostas
* Lista de negociações aceitas
* Chat entre os participantes da negociação
* Perfil do usuário
* Visualização dos próprios produtos

---

## Tecnologias

* **React Native**
* **Expo**
* **Expo Router**
* **TypeScript**
* **React Native Paper**
* **React Native Reanimated**
* **React Native Gesture Handler**

Versões principais utilizadas:

| Tecnologia   | Versão   |
| ------------ | -------- |
| Expo         | ~57.0.16 |
| Expo Router  | ~57.0.16 |
| React        | 19.2.3   |
| React Native | 0.86.2   |
| TypeScript   | ~6.0.3   |

---

## Como executar

### 1. Instalar as dependências

```bash
npm install
```

### 2. Iniciar o projeto

```bash
npm run start
```

Após iniciar o Expo, é possível executar o projeto nos ambientes disponíveis:

```bash
npm run android
npm run ios
npm run web

npx expo start // MAIS UTILIZADA
```

Para verificar o código com o linter:

```bash
npm run lint
```

---

## Estrutura do projeto

```text
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   └── login.tsx
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── trades.tsx
│   │   ├── negotiations.tsx
│   │   └── profile.tsx
│   └── chat/
│       └── [id].tsx
│
├── components/
│   ├── ui/
│   ├── ProductCard.tsx
│   ├── ProductTradeModal.tsx
│   ├── TradeCard.tsx
│   └── NegotiationCard.tsx
│
├── data.ts
├── types.ts
├── global.css
└── tokens/
    └── theme.ts
```

### Organização

* `app/` — telas e rotas da aplicação.
* `components/` — componentes reutilizáveis da interface.
* `data.ts` — dados mockados utilizados pelo protótipo.
* `types.ts` — tipos TypeScript utilizados no projeto.
* `tokens/` — tokens de design, como cores e tipografia.

A navegação é feita pelo **Expo Router**, utilizando grupos de rotas para autenticação e navegação principal.

---

## Fluxo da aplicação

```text
Login
  ↓
Home
  ↓
Selecionar produto
  ↓
Criar proposta
  ↓
Oferta recebida
  ├── Recusar
  └── Aceitar
        ↓
   Negociações
        ↓
      Chat
```

### Proposta de troca

Na Home, o usuário seleciona um produto de outro usuário e abre a tela de proposta.

Ele pode selecionar produtos próprios para oferecer em troca. A proposta registra:

* usuário que iniciou a negociação;
* usuário que receberá a proposta;
* produtos oferecidos;
* produto(s) solicitados;
* status da negociação.

---

## Dados

O protótipo utiliza dados armazenados em memória no arquivo:

```text
src/data.ts
```

São disponibilizados dados mockados para:

* usuários;
* categorias;
* produtos;
* anúncios de troca;
* negociações;
* mensagens.

O usuário atualmente utilizado pelo protótipo é:

```text
user-1
```

Os dados são relacionados por IDs, seguindo os tipos definidos em `src/types.ts`.

---

## Modelo de dados

As principais entidades do projeto são:

```text
User
 └── possui produtos

Product
 └── pertence a um User
 └── possui categoria

TradeListing
 └── representa uma intenção pública de troca

Negotiation
 ├── possui um iniciador
 ├── possui um receptor
 ├── possui produtos oferecidos
 ├── possui produtos solicitados
 └── possui status

Message
 └── pertence a uma Negotiation
```

Os status de uma negociação são:

```text
pending
accepted
rejected
cancelled
```

---

## Navegação

A aplicação possui quatro áreas principais na Bottom Navigation:

| Área        | Função                            |
| ----------- | --------------------------------- |
| Home        | Descoberta de produtos            |
| Trocas      | Ofertas recebidas                 |
| Negociações | Negociações aceitas               |
| Perfil      | Produtos e informações do usuário |

Negociações aceitas podem ser abertas para acessar o chat correspondente.

---

## Design

O projeto utiliza tokens centralizados em:

```text
src/tokens/theme.ts
```

Esses tokens concentram elementos como:

* cores;
* tipografia;
* espaçamentos;
* dimensões.

A interface utiliza componentes nativos do React Native e `StyleSheet`.

---

## Limitações do protótipo

O projeto atualmente utiliza dados mockados e não possui:

* autenticação real;
* banco de dados;
* API/backend;
* persistência de negociações;
* persistência de mensagens;
* comunicação em tempo real;
* cadastro real de usuários;
* gerenciamento persistente de produtos.

As alterações realizadas durante a execução permanecem apenas no estado da aplicação.

---

## Scripts

| Comando                 | Descrição                      |
| ----------------------- | ------------------------------ |
| `npm run start`         | Inicia o Expo                  |
| `npm run android`       | Executa no Android             |
| `npm run ios`           | Executa no iOS                 |
| `npm run web`           | Executa na Web                 |
| `npm run lint`          | Executa o lint                 |
| `npm run reset-project` | Utilitário de reset do projeto |

---

## Projeto

O TrocaJá foi desenvolvido como um protótipo de uma plataforma de trocas entre usuários, com foco no fluxo de descoberta de produtos, criação de propostas, negociação e comunicação entre os participantes.

O estado atual prioriza a implementação da **experiência e dos fluxos principais da aplicação**, utilizando dados mockados para simular o funcionamento de um sistema completo.
