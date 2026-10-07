# Testes do Checkpoint 5

## Ambiente

Node 22.18+ ou 24 LTS, `npm ci`, `npm run check`, `npm run web`. O navegador é uma forma de simulação aceita no documento do CP5. Para Android, executar `npm run android` com emulador/dispositivo disponível.

Os testes automatizados cobrem o fluxo de proposta → aceite → mensagem, imutabilidade dos mocks, acesso por participante, cancelamento, recusa, oferta vazia/duplicada, disponibilidade, filtros e erros do catálogo remoto. As chamadas de rede nesses testes são simuladas; não validam um projeto Supabase real.

Para a automação do navegador, execute `npx playwright install chromium` uma vez e depois `npm run test:e2e`. No Windows com Edge instalado, defina `$env:PLAYWRIGHT_CHANNEL='msedge'` no PowerShell antes do comando para utilizar esse navegador. Os dois cenários exportam e testam a versão web em `localhost:4173`; o cenário principal atualiza as sete capturas do README. Execute sem variáveis Supabase para reproduzir as asserções do modo mock.

## Roteiro manual reproduzível

Comece recarregando o app. A recarga restaura os dados iniciais.

| ID | Ação | Resultado esperado |
| --- | --- | --- |
| M01 | Abrir app sem sessão e entrar como Ana | Contas fictícias identificadas; Home exibe saudação e produtos de outros usuários |
| M02 | Filtrar Jogos, Destaques e buscar PS5 | PS5 aparece; busca inexistente mostra estado vazio |
| M03 | Voltar a Todas/Todos e selecionar Lançados hoje | PS5 e bicicleta aparecem no dia em que o app foi carregado |
| M04 | Abrir PS5, fechar e reabrir | Seleção vazia; envio desabilitado até escolher produto |
| M05 | Oferecer Nintendo Switch pelo PS5 e enviar | Aviso de sucesso; proposta pendente aparece em Trocas |
| M06 | Repetir a mesma proposta | Erro de duplicidade no modal, sem duplicar o histórico |
| M07 | Perfil → Sair → Entrar como Bruno | Mesmos dados da execução, agora na perspectiva do receptor |
| M08 | Trocas → Aceitar proposta de Ana | Status aceito; nova conversa aparece em Negociações |
| M09 | Abrir conversa e enviar “Vamos trocar na faculdade?” | Mensagem aparece; voltar/reabrir preserva a mensagem |
| M10 | Sair e entrar como Ana, abrir conversa | Mensagem de Bruno aparece do lado recebido |
| M11 | Criar outra proposta e cancelar como iniciador | Histórico mostra Cancelada; nenhum chat novo |
| M12 | Recusar proposta pendente como receptor | Histórico mostra Recusada; nenhum chat novo |
| M13 | Abrir URL de chat desconhecido, pendente ou de terceiros | Estado indisponível; não permite enviar mensagens |
| M14 | Sair e usar voltar/URL de uma tela interna | Acesso retorna à seleção de conta |
| M15 | Recarregar navegador | Sessão e alterações mockadas são reiniciadas, como informado no login |
| M16 | Configurar Supabase conforme SUPABASE.md | Perfil mostra conexão; alteração do nome de categoria no banco aparece na Home |
| M17 | Usar chave inválida ou bloquear a consulta | Aviso de falha, categorias locais e botão de nova tentativa |
| M18 | Abrir em viewport 390×844 e testar teclado/rolagem | Botões, modal, filtros e mensagens acessíveis sem cortes |

## Registro da execução

Consultar [VALIDACAO.md](VALIDACAO.md) para os comandos e cenários efetivamente verificados nesta refatoração. Não marcar a matriz inteira como aprovada sem executar os casos. Para novas execuções, registrar data, sistema/navegador, IDs, resultado, responsável e captura.
