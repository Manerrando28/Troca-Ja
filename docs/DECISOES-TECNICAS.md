# Decisões técnicas — CP5

## Arquitetura

- **Expo Router + TypeScript estrito:** rotas por arquivos, `Stack.Protected` controla o acesso durante a demonstração e o chat usa rota parametrizada sem `as any`.
- **Context API:** `AppProvider` mantém a sessão fictícia, propostas e mensagens. Estado compartilhado resolve o defeito em que aceitar uma oferta numa tela não abria conversa na outra. O estado permanece ao sair/entrar como outro participante, até recarregar o app.
- **Domínio separado:** `domain/trades.ts` valida propriedade e disponibilidade de produtos, proposta vazia/duplicada, transições de status e participantes do chat. Funções puras permitem testar regras sem emulador.
- **Serviço isolado:** `services/catalog.ts` consulta categorias do Supabase. Foi usado `fetch`, já disponível no React Native e navegador, pois essa etapa faz uma leitura pública simples. RLS concede somente SELECT. Não adicionamos um SDK para uma única consulta.
- **Design System:** cores, gradiente, fontes Inter, espaçamentos e raios em `tokens/theme.ts`; `Button`, `Avatar`, `PageHeader`, `Notice` e `EmptyState` são componentes reutilizáveis. `CatalogFilters` contém os controles de descoberta. `LinearGradient` substitui o `backgroundImage` das telas para manter o cabeçalho no Android e web.
- **Mocks explícitos:** quatro pessoas fictícias, quatro categorias e oito produtos. Fotografias que representavam objetos diferentes foram trocadas por ícones de categoria. Dois anúncios usam a data de inicialização para exercitar “Lançados hoje”; o filtro compara o calendário local.
- **Testes:** runner nativo do Node 22.18+ (ou Node 24 LTS), sem dependência adicional. Testes de regras e contrato HTTP, mais roteiro manual para navegação e evidência visual.

## Semântica do protótipo

“Aceita” significa abertura de negociação/chat, e não entrega física concluída. Um produto pode participar de mais de uma conversa; finalizar a troca e reservar/remover produtos são próximos passos. Usuários com cinco ou mais trocas históricas entram no filtro “confiáveis”; essa métrica é fictícia e não constitui verificação de identidade.

## Limites conhecidos e CP6

Não há autenticação, persistência de propostas/mensagens após recarga, tempo real entre dispositivos, cadastro/edição de produtos ou finalização da troca. O banco nesta etapa fornece somente categorias. Evoluir esses pontos antes de gerar o APK final, validar acessibilidade e executar a matriz no Android. Os componentes antigos ainda usam alguns valores de dimensão locais; tokens representam os padrões reutilizados, não cada medida específica de um componente.
