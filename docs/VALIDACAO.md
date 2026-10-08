# Registro de validação — 07/10/2026

## Home com identidade e catálogo real

- Projeto Supabase **Troca Já** conectado: quatro categorias e 20 produtos. Importados 12 registros de demonstração do DummyJSON, preservando os oito anteriores.
- Leitura verificada pelo adaptador real do aplicativo e verificação HTTP das 12 novas imagens aprovada. RLS e permissões públicas mantidas somente para leitura; verificação de segurança do Supabase sem alertas.
- TypeScript, ESLint e 16 testes automatizados aprovados. Exportação web concluída com a configuração real do projeto.
- Edge via Playwright: animação do logo, preferência de redução de movimento e hover dos cards aprovados. Fluxo Ana → proposta com iPad Mini → Bruno aceita → mensagem no chat aprovado, sem erros de execução capturados.
- Home revisada em 390×844, 320×740 e 1366×900; sem transbordamento horizontal na tela de 320 px. Capturas atualizadas: [mobile](evidencias/10-home-identidade-mobile.png), [320 px](evidencias/11-home-identidade-320.png) e [desktop](evidencias/12-home-identidade-desktop.png).

O roteiro `scripts/check-home-identity.cjs` usa o catálogo real desta data e um preview já iniciado na porta 4180. Não escreve no banco: propostas e mensagens do cenário ficam na memória do navegador. Ele depende dos produtos importados e das contas de demonstração atuais; não integra a suíte isolada de testes. A checagem das fotos e da leitura remota pode ser repetida conforme [CATALOGO-INTERNET.md](CATALOGO-INTERNET.md).

Os registros abaixo são históricos e descrevem a etapa anterior à conexão real.

## Atualização: produtos no Supabase

Refatoração validada no Windows com Node **24.19.0** e Microsoft Edge. O Node 22.11 do sistema é anterior ao requisito do projeto; os executáveis de TypeScript, ESLint e testes foram chamados com o runtime Node 24.

- TypeScript (`tsc --noEmit`) e ESLint aprovados.
- 16 testes de domínio/contrato aprovados: incluem mapeamento dos produtos, imagens por URL, paginação, campos inválidos, relacionamentos, falha HTTP/rede e cancelamento.
- Exportação web do modo Supabase aprovada com cache limpo.
- `test:e2e:supabase`: 3 cenários aprovados no Edge com API interceptada: produtos novos em Home/Perfil/propostas/chat; banco vazio; falha HTTP e recuperação por nova tentativa. O fluxo completo monitora erros de execução do navegador.
- Modo local reexportado com cache limpo e 1 cenário existente aprovado no Edge: busca vazia, cancelamento e recusa. As capturas anteriores não foram sobrescritas.
- Guia, schema e seed para os oito produtos entregues. SQL e Storage ainda precisam ser executados/validados em um projeto real; nenhuma credencial real foi fornecida.

Os resultados abaixo registram a validação anterior do protótipo local e suas capturas, preservadas nesta refatoração.

## Registro anterior

Ambiente: Windows, Node 24.16.0, Microsoft Edge via Playwright, viewport 390×844. Foram utilizadas somente contas e dados fictícios.

| Verificação | Resultado |
| --- | --- |
| Instalação pelo lockfile (`npm ci`) | Concluída |
| TypeScript (`npm run typecheck`) | Aprovado, sem erros |
| Lint (`npm run lint`) | Aprovado, sem erros ou avisos de lint |
| Testes de domínio e contrato (`npm test`) | 9 aprovados |
| Exportação web (`npm run export:web`) | Bundle gerado com sucesso |
| Testes no navegador (`npm run test:e2e`, Edge) | 2 aprovados na versão exportada |
| Cores fixas, CSS backgroundImage e `as any` nas telas | Não encontrados; cores do código de interface centralizadas no tema |
| Revisão visual | Sete capturas inspecionadas; altura da barra inferior corrigida e capturas regeneradas |

## Cenários verificados no navegador

1. Contas fictícias, entrada como Ana, filtro de data, categoria e busca.
2. Detalhe/proposta, botão desabilitado sem oferta, envio e bloqueio de duplicidade.
3. Histórico de propostas enviadas/recebidas.
4. Saída e entrada como Bruno mantendo o estado da execução.
5. Aceite pelo receptor com atualização imediata das conversas.
6. Envio de mensagem, retorno à conta de Ana e leitura do mesmo conteúdo.
7. Perfil, indicação explícita de catálogo local e reinicialização da sessão ao recarregar.
8. Busca sem resultado, fechamento/reabertura do modal limpando a seleção.
9. Cancelamento pelo iniciador e recusa pelo receptor, sem adicionar conversas aceitas.

O cenário principal monitora `pageerror` e terminou sem erros de execução capturados. As imagens em `evidencias/` foram obtidas do bundle de produção, sem controles de desenvolvimento do Expo.

## Limites da validação

- A validação inicial do adaptador usou respostas HTTP simuladas; a conexão real foi comprovada na atualização acima.
- Não foram executados emulador Android, dispositivo físico ou build APK. A evidência de simulação desta entrega é a execução web, permitida para CP5.
- A matriz manual completa inclui cenários adicionais ainda não executados no navegador (por exemplo, URLs de chat indisponível). Regras de autorização/status foram verificadas nos testes de domínio.
- O Node emite aviso de detecção de módulo nos testes TypeScript; isso não causa falha. O bundler também informa avisos de variáveis de cor do terminal.
- A instalação reportou vulnerabilidades na árvore de dependências. Não foi aplicada atualização forçada do conjunto Expo/React Native, que exige uma revisão de compatibilidade própria; estes checks não equivalem a auditoria de segurança.

Para repetir a validação, siga [TESTES.md](TESTES.md) e as instruções do README.
