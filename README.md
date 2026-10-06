# Site da Mapa's

Site institucional da Mapa's e páginas públicas dos apps (políticas de privacidade e termos), publicado pelo GitHub Pages em https://matheusmapa.github.io/apps/.

As páginas são geradas: não edite os `.html` direto, edite a fonte e rode o build.

## Onde fica cada coisa

| O quê | Arquivo |
|---|---|
| Dados da empresa (CNPJ, razão social), endereço do site, apps, status, textos | `_build/data.mjs` |
| Política e termos de cada app | `_build/legal/<app>-privacy.html`, `_build/legal/<app>-terms.html` |
| Modelos das páginas | `_build/build.mjs` |
| Visual | `assets/css/site.css` |
| Ícones, screenshots e imagem de compartilhamento | `_build/images.py`, que lê de `D:\Novo Projeto\<pasta do app>\assets` |

Pastas que começam com `_` não são publicadas pelo GitHub Pages.

## Comandos

```bash
python _build/images.py      # só quando ícones ou screenshots mudarem
node _build/build.mjs        # gera todas as páginas, o sitemap.xml e o robots.txt
node _build/check-links.mjs  # confere se nenhum link interno quebrou
node _build/serve.mjs        # prévia em http://localhost:4173/apps/
```

Depois é só fazer commit e push. O GitHub Pages publica em um ou dois minutos.

## Tarefas comuns

- **App publicado na Play:** em `data.mjs`, troque `status` do app para `"live"`. O card passa a mostrar o selo "Disponível no Google Play" com o link.
- **Preencher CNPJ e razão social:** campos `cnpj` e `legalName` em `COMPANY`. Aparecem no rodapé, na página Sobre e nos dados estruturados.
- **Domínio próprio:** troque `SITE_URL` em `data.mjs`, rode o build, crie o arquivo `CNAME` com o domínio e configure o DNS (veja abaixo).
- **Novo app:** adicione em `APPS`, inclua a pasta em `_build/images.py`, escreva `_build/legal/<slug>-privacy.html` e `-terms.html` e rode os comandos.

## URLs que não podem quebrar

As fichas da Play Store e os apps apontam para estes endereços. Eles continuam existindo no mesmo caminho:

- `/studz/`, `/studz/privacy.html`, `/studz/terms.html`
- `/geladeira/`, `/geladeira/privacy.html`, `/geladeira/terms.html`
- `/lacre/privacy.html`, `/folga/privacy.html`, `/constante/privacy.html`
- âncoras `#exclusao` (como apagar os dados) e `#en` (versão em inglês) em cada política

## Domínio próprio

Com um domínio (ex.: `mapas.com.br`) apontado pra este repositório, o GitHub redireciona sozinho `matheusmapa.github.io/apps/...` para `mapas.com.br/...`, mantendo o caminho. Os links antigos continuam funcionando.

1. Compre o domínio no registro.br.
2. No DNS do domínio, crie 4 registros `A` para `185.199.108.153`, `185.199.109.153`, `185.199.110.153` e `185.199.111.153`, e um `CNAME` de `www` para `matheusmapa.github.io`.
3. Em GitHub → repositório `apps` → Settings → Pages → Custom domain, informe o domínio e marque "Enforce HTTPS".
4. Troque `SITE_URL` em `_build/data.mjs`, rode o build e faça push.

## Verificação no Google Search Console

1. Em https://search.google.com/search-console, entre com a mesma conta da Play Console e adicione uma propriedade do tipo **Prefixo do URL** com o endereço do site (com `/apps/` no fim, enquanto estiver no github.io).
2. Escolha o método **Arquivo HTML** e baixe o arquivo `googleXXXXXXXX.html`.
3. Coloque o arquivo na raiz deste repositório, faça commit e push, e clique em Verificar. O build não mexe em arquivos `google*.html`.
4. Na Play Console → Conta de desenvolvedor → Sobre você → Site, cole o mesmo endereço.
