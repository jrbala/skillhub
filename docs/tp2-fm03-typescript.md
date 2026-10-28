# FM03 — TP2 : Passer le script de la modale en TypeScript

## Registro antes das correções

Primeira compilação com strict: true, após extrair o bloco original de menu/modal de main.js para interface.ts, sem corrigir sua tipagem. Saída real de npm run typecheck -- --pretty false:

```text

> skillhub@1.0.0 typecheck
> tsc --noEmit --pretty false

node_modules/@typescript/typescript-darwin-arm64/lib/lib.dom.d.ts(43474,13): error TS2451: Cannot redeclare block-scoped variable 'navigation'.
src/ts/interface.ts(1,7): error TS2451: Cannot redeclare block-scoped variable 'navigation'.
src/ts/interface.ts(2,31): error TS2339: Property 'querySelector' does not exist on type 'Navigation'.
src/ts/interface.ts(11,5): error TS7034: Variable 'declencheurModale' implicitly has type 'any' in some locations where its type cannot be determined.
src/ts/interface.ts(16,3): error TS18047: 'liensNavigation' is possibly 'null'.
src/ts/interface.ts(16,19): error TS2339: Property 'hidden' does not exist on type 'Element'.
src/ts/interface.ts(17,14): error TS2339: Property 'querySelectorAll' does not exist on type 'Navigation'.
src/ts/interface.ts(17,80): error TS7006: Parameter 'bouton' implicitly has an 'any' type.
src/ts/interface.ts(19,22): error TS18047: 'liensNavigation' is possibly 'null'.
src/ts/interface.ts(25,55): error TS2339: Property 'open' does not exist on type 'Element'.
src/ts/interface.ts(25,75): error TS2339: Property 'showModal' does not exist on type 'Element'.
src/ts/interface.ts(26,55): error TS2339: Property 'open' does not exist on type 'Element'.
src/ts/interface.ts(26,75): error TS2551: Property 'close' does not exist on type 'Element'. Did you mean 'closest'?
src/ts/interface.ts(38,18): error TS18047: 'event.target' is possibly 'null'.
src/ts/interface.ts(38,31): error TS2339: Property 'closest' does not exist on type 'EventTarget'.
src/ts/interface.ts(39,28): error TS2339: Property 'contains' does not exist on type 'Navigation'.
src/ts/interface.ts(45,24): error TS18047: 'liensNavigation' is possibly 'null'.
src/ts/interface.ts(58,16): error TS18047: 'event.target' is possibly 'null'.
src/ts/interface.ts(58,29): error TS2339: Property 'closest' does not exist on type 'EventTarget'.
src/ts/interface.ts(59,26): error TS2339: Property 'contains' does not exist on type 'Navigation'.
src/ts/interface.ts(60,41): error TS2339: Property 'querySelectorAll' does not exist on type 'Navigation'.
src/ts/interface.ts(71,41): error TS2339: Property 'querySelectorAll' does not exist on type 'Navigation'.
src/ts/interface.ts(88,26): error TS18047: 'liensNavigation' is possibly 'null'.
src/ts/interface.ts(90,39): error TS2339: Property 'querySelectorAll' does not exist on type 'Navigation'.
src/ts/interface.ts(94,49): error TS18047: 'liensNavigation' is possibly 'null'.
src/ts/interface.ts(113,21): error TS2339: Property 'open' does not exist on type 'Element'.
src/ts/interface.ts(116,7): error TS7005: Variable 'declencheurModale' implicitly has an 'any' type.
src/ts/interface.ts(122,12): error TS2339: Property 'focus' does not exist on type 'Element'.

```

- TS2451: a variável global navigation colide com Navigation da API do navegador. Será isolada em uma função e renomeada.
- TS18047: querySelector pode retornar null quando o elemento não existe. Serão adicionadas verificações.
- TS2339 (showModal/open): Element é genérico e não descreve um dialog. Será usado querySelector<HTMLDialogElement>().
- TS7034/TS7005: o compilador não consegue inferir o tipo do disparador inicialmente null. Será declarado HTMLButtonElement | null.
- TS2339 (closest): EventTarget não é necessariamente um elemento HTML. Será verificado com instanceof Element antes de acessar closest.

Este registro foi criado antes das correções. Os números de linha acima pertencem à extração inicial.

## Correções realizadas

- O bloco menu/modal foi extraído de `src/js/main.js` para `src/ts/interface.ts`. Ambos compartilham o estado de interface e o tratamento de Échap; mantê-los juntos preserva essa coordenação. O restante de main.js é idêntico ao início deste TP.
- A função imediatamente executada isola as variáveis; navigation foi renomeada para navigationPrincipale.
- Seletores usam HTMLElement, HTMLButtonElement, HTMLDialogElement e HTMLHeadingElement conforme o elemento. Os seletores de tags como 'a' já têm inferência nativa de HTMLAnchorElement.
- A inicialização verifica os elementos obrigatórios da navegação. Elementos opcionais da modal usam verificações e encadeamento opcional.
- O disparador é HTMLButtonElement | null; instanceof verifica event.target e event.currentTarget antes de acessar suas propriedades.
- aria-controls pode ser null: o código usa uma string vazia como fallback e ignora painéis ausentes. O conjunto de submenus é Set<string>.
- afficherInterface usa uma função seta definida após a verificação dos elementos, permitindo preservar o estreitamento de tipos na função. Nenhuma asserção de não nulidade ou any foi acrescentada.
- `src/ts/types.ts` declara Atelier com todos os campos de stockage.js, os seis identificadores reais, preço textual e estado ouvert; Niveau preserva os cinco rótulos reais, incluindo os pré-requisitos; Inscription corresponde a utilisateurId, atelierId e date ISO. São contratos de tipos, sem conversão do armazenamento nem validação em tempo de execução.

## Compilação e carregamento

TypeScript 7.0.2 instalado como dependência de desenvolvimento, com package-lock.json. tsconfig.json usa strict: true, noEmitOnError: true, alvo ES2020, bibliotecas DOM e somente src/ts como entrada.

```sh
npm ci
npm run typecheck
npm run build
python3 -m http.server 8000 --bind 127.0.0.1 --directory src
```

Para desenvolver: `npm run watch`. Saída em src/js/generated. Não editar essa saída manualmente; recompilar e incluir os arquivos gerados ao publicar com o workflow estático existente.

As dez páginas carregam, nesta ordem, stockage.js, generated/interface.js, main.js e compte.js, todos com defer. O antigo bloco menu/modal foi removido de main.js: nenhum comportamento é executado duas vezes. types.js é uma saída de módulo sem lógica e não é carregado pelas páginas.

## Verificações executadas em 27/10/2026

Testes em Chrome headless, perfil temporário isolado e servidor localhost, com Node.js v26 e DevTools. Foram reaproveitados os percursos do TP1, adaptando as referências às variáveis agora privadas para seletores DOM. Dados fictícios apenas.

| Verificação | Resultado |
| --- | --- |
| npm run build e npm run typecheck | Passaram após as correções |
| node --check nos quatro scripts executados | Passou |
| git diff --check | Passou |
| Comparação do restante de main.js com a cópia feita no início do TP | Formulário, cartões e carrossel idênticos |
| Carregamento nas dez páginas | Uma referência a interface.js e uma a main.js por página |
| Menu mobile e submenus aninhados injetados pelo teste | Entrée, Espace, Tab, Maj+Tab, Échap, âncora e retorno do foco passaram |
| Modal | Abertura, botão fechar, Échap e retorno ao disparador passaram |
| Modal após inscrição | Disparador desativado; foco devolvido ao título |
| Formulário de demonstração | Campos vazios, e-mail inválido, correção, valores preservados e mensagem final passaram |
| Criação de conta | Campos obrigatórios, confirmação diferente, falha de armazenamento e envio duplicado passaram |
| Reserva → criação → login → confirmação | Contexto preservado e inscrição gravada |
| Inscrição já existente | Botão desativado |
| Desinscrição | Cancelamento e confirmação por teclado, foco e armazenamento passaram |
| Responsivo | 375, 768 e 1440 px; ARIA/visibilidade coerentes e seis cartões presentes |
| Menu nas nove páginas públicas e perfil autenticado | Percursos executados |
| 55 Tab e 55 Maj+Tab no início | Nenhum elemento oculto recebeu foco |
| Console nos percursos finais | Nenhuma exceção JavaScript ou console.error |

### Falhas iniciais do piloto e limite do teste de foco

O primeiro piloto selecionou uma página de extensão do Chrome; foi corrigido para selecionar uma aba do tipo page. Depois, a asserção de que cada Tab sempre deixaria document.activeElement dentro do dialog falhou: o Chrome também retornou body como elemento ativo.

A mesma asserção falhou executando a cópia original do TP1 em outro servidor local, antes de qualquer conversão. Portanto, não foi alterado o comportamento nativo da modal. O teste final permite body e verifica que nenhum controle externo recebe foco. Isso não comprova confinamento absoluto do foco na interface do navegador. Abertura, fechamento e restauração do foco foram verificados separadamente.

### Reexecutar os testes de navegador

Com o servidor acima rodando, iniciar Chrome em perfil isolado (comando macOS):

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --remote-debugging-port=9223 --user-data-dir=/tmp/skillhub-tp2-chrome about:blank
```

Em outro terminal, com Node.js que ofereça WebSocket global:

```sh
node tests/tp2-browser.mjs
node tests/tp2-browser-extra.mjs
```

Executar nessa ordem: o segundo usa as inscrições criadas pelo primeiro e fecha o Chrome ao terminar. O primeiro limpa o localStorage da origem no perfil de teste. Resultados escritos em /tmp/tp2-results.json e /tmp/tp2-extra-results.json.

Não houve novo teste manual com leitor de tela nem publicação. CSS, lógica de contas/inscrições e documentação anterior não foram editados neste TP; as alterações locais já existentes foram preservadas. Não há pendência de compilação.
