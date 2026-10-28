# TP3 — Catálogo carregado e filtrável

## Executar

Na raiz do projeto:

```sh
npm ci
npm run typecheck
npm run build
python3 -m http.server 8000 --directory src
```

Abra http://localhost:8000/. Não abra o HTML diretamente com `file://`, pois o catálogo usa `fetch`. Depois de alterar TypeScript, compile novamente; `npm run watch` pode fazer isso automaticamente.

## Organização

- `src/ateliers.json`: 12 oficinas, com `id`, título (`nom`), nível, preço numérico em euros, vagas (`places`), formador e informações da ficha. As seis oficinas antigas conservam seus dados e programas; as novas são fichas de consulta.
- `src/ts/ateliers.ts`: `chargerAteliers(signal)` usa `async/await`, `fetch`, `response.ok` e validação do JSON. Distingue erros de conexão, HTTP e formato; permite cancelamento.
- `src/ts/catalogue.ts`: reutiliza a construção das cartas antigas; centraliza os filtros em `filtres` e `mettreAJourFiltres`. Renderiza carregamento, vazio, erro e sucesso. Abre fichas com `dialog` e devolve o foco ao botão de origem.
- `src/ts/types.ts`: mantém os tipos antigos e acrescenta `AtelierCatalogue` e `FiltresAteliers`. O preço do catálogo é numérico para ordenar corretamente.
- `src/index.html`: controles com rótulos, contador `aria-live`, mensagens, botão de nova tentativa e ficha acessível.
- `src/css/base.css`: estilos dos filtros e espaço reservado, preservando cartas e carrossel.
- `src/js/main.js`: conserva formulário e carrossel; a construção das cartas passa ao TypeScript. Atualiza as setas após cada renderização e tolera listas vazias.
- `src/js/generated/ateliers.js` e `catalogue.js`: gerados pelo compilador; não editar manualmente.
- `tests/tp3-browser.mjs`: testes no Chrome, sem biblioteca adicional.
- `tests/tp2-browser.mjs`: expectativa atualizada de seis para doze cartas para continuar verificando as funcionalidades anteriores.
- `README.md`: instruções atualizadas e link para este guia.

Os filtros trabalham localmente: digitar não repete o download. Uma nova tentativa cancela uma requisição anterior; `pagehide` cancela ao sair. No retorno pelo cache de navegação, um carregamento interrompido é reiniciado. Uma resposta antiga não substitui uma resposta recente.

As vagas são dados demonstrativos do JSON, sem sincronização com inscrições. O fluxo antigo de inscrição e seu armazenamento permanecem preservados. A oficina sobre React já existia no projeto; nenhuma implementação React foi adicionada.

## Testes manuais e capturas para entrega

Abra as ferramentas de desenvolvimento do navegador (DevTools), aba Network/Réseau. Mantenha “Disable cache” marcado durante os testes.

1. **Sucesso:** conexão normal, recarregue a página. Capture o catálogo com o contador de 12 oficinas.
2. **Filtros:** pesquise `Joseph`, combine com nível `Intermédiaire` e alterne o preço crescente/decrescente. Capture os controles e os resultados. “Tous les niveaux” significa sem filtro; “Tous niveaux” é a classificação de uma oficina.
3. **Vazio:** pesquise `zzzzzz`. Capture a mensagem útil e o contador zero. Use “Réinitialiser les filtres” para voltar.
4. **Carregamento:** selecione Slow 3G na aba Network e recarregue. Capture “Chargement des ateliers…” com o espaço reservado antes de terminar. Volte para No throttling.
5. **HTTP 404:** renomeie temporariamente `src/ateliers.json` para `src/ateliers-test.json`. Recarregue, capture a mensagem HTTP 404 com “Réessayer”, sem indicador de carregamento. Restaure o nome original e clique “Réessayer”: as 12 oficinas devem aparecer.
6. **Sem conexão:** primeiro produza o erro 404 do passo anterior. Restaure o arquivo, selecione Offline na aba Network e clique “Réessayer”. Assim a página já está aberta e somente a requisição JSON falha. Capture a mensagem de conexão, o botão e a ausência do carregamento. Volte para No throttling e clique “Réessayer”; capture o sucesso recuperado. Recarregar toda a página em Offline pode mostrar a página de erro do próprio navegador, e não o estado da aplicação.
7. **Teclado:** use Tab/Shift+Tab, digite na pesquisa, use as setas dos seletores e Enter em “Voir la fiche”. Capture a ficha com o foco visível. Teste Escape e “Retour au catalogue”: o foco volta à carta, mantendo os filtros. Nas seis oficinas antigas, confira o acesso ao programa e às inscrições.
8. **Cancelamento:** com Slow 3G, navegue para outra página antes do JSON terminar (ative Preserve log). A requisição pendente deve ser cancelada. Volte ao catálogo e confira que o carregamento funciona.
9. **Mobile:** capture o catálogo em 375 px, sem rolagem horizontal da página (o carrossel continua horizontal).

Entregue principalmente as capturas de sucesso, filtros/ordenação, carregamento, vazio, erro de conexão, erro 404, recuperação e ficha pelo teclado. A captura mobile complementa a demonstração. Capturas antigas do repositório documentam versões anteriores.

## Testes automatizados executados

- `npm run typecheck` e `npm run build`: passaram.
- `tests/tp3-browser.mjs`: passaram sucesso, pesquisa por formador, nível, ordenações, vazio, abertura e retorno da ficha por teclado, falha de conexão, HTTP 404, JSON inválido, nova tentativa, chamada de cancelamento em `pagehide`, retomada em `pageshow` e ausência de transbordamento em 375/768/1440 px.
- Falhas de conexão e 404 foram injetadas no navegador somente para `ateliers.json`, sem alterar os dados de produção. O teste de cancelamento dispara eventos de ciclo de vida controlados; o teste manual acima verifica uma navegação real.
- Os testes anteriores verificam menus, modais, formulário, contas e inscrições em um perfil isolado do Chrome.

Para repetir, use Node.js com `WebSocket` global (22 ou superior), servidor na porta 8000 e Chrome em perfil temporário. No macOS, em outro terminal:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --remote-debugging-port=9223 --user-data-dir=/tmp/skillhub-tp3-tests about:blank
```

Depois:

```sh
node tests/tp3-browser.mjs
node tests/tp2-browser.mjs
node tests/tp2-browser-extra.mjs
```

Os dois testes TP2 devem rodar nessa ordem; utilizam contas fictícias e limpam o armazenamento do perfil de teste. Feche o Chrome de teste depois. Não use seu perfil pessoal.

## Atualização — pesquisa automática com debounce

A pesquisa aplica os resultados automaticamente 500 ms depois da última letra digitada. Cada nova letra reinicia a espera. Não existe botão Rechercher e não é necessário pressionar Enter. Os resultados anteriores continuam visíveis durante a espera; nível e ordenação atualizam imediatamente.

Redefinir os filtros ou sair da página cancela a espera. O filtro continua local, sem novos downloads. As sugestões de títulos aparecem em uma lista personalizada abaixo do campo, sem a seta nativa. Após 500 ms, use ↑/↓ e Enter ou clique numa sugestão para aplicar o título. Escape, Tab ou um clique fora fecham a lista. A pesquisa continua funcionando sem selecionar uma sugestão.
