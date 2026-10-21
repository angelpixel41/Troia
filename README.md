# Tróia Distribuição — Site institucional

Site institucional responsivo da **Tróia Distribuição**, voltado a clientes empresariais e parceiros comerciais em Brasília, Distrito Federal.

## Executar localmente

O site é estático (HTML, CSS e JavaScript sem build). Execute `python -m http.server 8080` na pasta do repositório e acesse `http://localhost:8080`. Use um servidor HTTP local porque os recursos usam caminhos absolutos.

## Publicação atual — Cloudflare Workers

O domínio `troia.pixelinfinite.com.br` usa o Worker `troia`. Publique pelo PowerShell com `./tools/deploy.ps1`. O push ao GitHub não publica automaticamente. Consulte `docs/redesign-20261021.md`.

## Conteúdo e identidade

- O conteúdo combina informações institucionais do LinkedIn, registros empresariais e marcas citadas pelo solicitante.
- Logotipo fornecido pelo responsável no chat, reproduzido como imagem raster, sem recriação. O favicon usa recorte do emblema original. O arquivo original possui a inscrição geográfica legada `DF-GO`; será necessário obter da empresa a arte oficial atualizada sem essa inscrição para substituir o arquivo futuramente.
- Os nomes **Pilão, Marilan, Veja e Reckitt** aparecem como referências ao portfólio informado; não se declara exclusividade ou contrato formal.
- Fotografias de logística são **ilustrativas** (Unsplash), não representam instalações, pessoas ou veículos da Tróia.
- Não há carrinho nem catálogo/SKU/tabela de preços inventados. O formulário comercial é uma simulação local: valida campos e apresenta confirmação demonstrativa, sem enviar e-mails, fazer requisições ou armazenar dados.
- Antes do lançamento oficial, obtenha aprovação dos responsáveis pelos dados de contato, endereço, uso dos logotipos das marcas e texto do portfólio. Veja `docs/validacao-publicacao.md`.

## Fontes públicas consultadas (09/10/2026)

- [LinkedIn — Tróia Distribuição](https://br.linkedin.com/company/troiadistribuicao) (descrição e slogan; geografia anterior está desatualizada).
- [Casa dos Dados — CNPJ 30.687.910/0001-55](https://casadosdados.com.br/solucao/cnpj/troia-distribuicao-de-alimentos-ltda-30687910000155).
- [Instagram oficial](https://www.instagram.com/troiadistribuicao/).
- Declarações do solicitante sobre marcas distribuídas.

## Domínio de lançamento

- Domínio escolhido: **https://troia.pixelinfinite.com.br**.
- Não modificar registros DNS do domínio raiz `pixelinfinite.com.br`.
- Os metadados SEO, canonical, schema.org, sitemap e robots foram ajustados para o subdomínio.
- Os e-mails comerciais terminados em `@troiadistribuicao.com.br` permanecem inalterados (devem ser confirmados com a empresa).

## Estrutura

- `index.html` — homepage institucional e metadados SEO.
- `styles.css` — base visual e responsividade.
- `design.css` — direção editorial, vitrine e refinamento responsivo.
- `wrangler.jsonc` e `tools/deploy.ps1` — publicação no Worker existente.
- `script.js` — menu mobile, navegação e validação local do formulário de demonstração.
- `assets/troia-logo-original.webp` — imagem do logotipo fornecida pela empresa (inclui inscrição legada na imagem).
- `assets/troia-emblem-favicon.webp` — recorte do emblema do logotipo utilizado no favicon.
- `robots.txt` e `sitemap.xml` — descoberta de conteúdo.
- `docs/validacao-publicacao.md` — pendências de conteúdo, branding e lançamento.

## Manutenção

Sem framework e sem dependências externas obrigatórias para renderizar. As fontes usam CDN externa; imagens de produto e fotografia ilustrativa são servidas localmente. Os contatos no HTML devem ser revistos por um representante da empresa antes de vincular o domínio oficial.

## Atualização de unidade (09/10/2026)

O responsável confirmou que **a única sede/atuação apresentada publicamente é Brasília/DF**. Removidas as alegações de unidade em Goiânia/GO e do mapa de duas unidades. Registros públicos antigos não devem ser usados para atribuir filiais atuais à empresa.

## Vitrine visual (09/10/2026)

- Seção de marcas reformulada com cards responsivos de produtos **Pilão**, **Marilan** e **Veja**. São imagens de embalagens reais obtidas em páginas de varejistas; **não** implicam que todas as variantes estejam em estoque ou que a Tróia represente oficialmente todas as linhas.
- URLs e respectivas origens: [Pilão 500 g](https://marche.com.br/products/cafe-pilao-torrado-e-moido-tradicional-abre-fecha-500g); [Marilan Maizena 300 g](https://www.savegnago.com.br/biscoito-marilan-maizena-300g/p); [Veja Limpeza Pesada 500 ml](https://mercado.carrefour.com.br/limpador-para-limpeza-pesada-original-veja-500ml-182621/p).
- As imagens dos três produtos são armazenadas localmente em `assets/products/`, em WebP com transparência. Confirmar permissão de uso das fotos para marketing com as marcas e, quando autorizado, salvar cópias otimizadas sob controle da empresa; links externos podem mudar.

## Localização confirmada pelo responsável (09/10/2026)

- Destino exato fornecido para navegação: **https://maps.app.goo.gl/6m6P86gjo4dtgm1T8**. O link substitui a busca aproximada por um endereço genérico do SIA.
- Nenhuma numeração ou CEP específicos são exibidos/publicados como endereço físico operacional até confirmação de que o endereço no cadastro coincide com o marcador enviado.
