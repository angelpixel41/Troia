# Tróia Distribuição — Site institucional

Site institucional responsivo da **Tróia Distribuição**, voltado a clientes empresariais e parceiros comerciais em Brasília, Distrito Federal.

## Executar localmente

O site é estático (HTML, CSS e JavaScript sem build). Execute `python -m http.server 8080` na pasta do repositório e acesse `http://localhost:8080`. Use um servidor HTTP local porque os recursos usam caminhos absolutos.

## Publicar no Cloudflare Pages

1. Cloudflare > Workers & Pages > Create > Connect to Git > `angelpixel41/Troia`.
2. Framework: **None**. Build command: **(vazio)**. Output directory: **.** (raiz do repositório).
3. Adicione o subdomínio `troia.pixelinfinite.com.br` em **Custom domains** do projeto Pages, mantendo o site principal `pixelinfinite.com.br` intacto. Se a zona estiver no mesmo Cloudflare, o DNS CNAME será sugerido automaticamente.
4. Merges em `main` farão novos deploys. Valide primeiro o preview `*.pages.dev` antes de ativar o subdomínio.

## Conteúdo e identidade

- O conteúdo combina informações institucionais do LinkedIn, registros empresariais e marcas citadas pelo solicitante.
- Logotipo fornecido pelo responsável no chat, reproduzido como imagem raster, sem recriação. O favicon usa recorte do emblema original. O arquivo original possui a inscrição geográfica legada `DF-GO`; será necessário obter da empresa a arte oficial atualizada sem essa inscrição para substituir o arquivo futuramente.
- Os nomes **Pilão, Marilan, Veja e Reckitt** aparecem como referências ao portfólio informado; não se declara exclusividade ou contrato formal.
- Fotografias de logística são **ilustrativas** (Unsplash), não representam instalações, pessoas ou veículos da Tróia.
- Não há carrinho nem catálogo/SKU/tabela de preços inventados. Pedidos de orçamento abrem o cliente de e-mail do visitante. Sem backend, não são registrados ou enviados automaticamente.
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
- `styles.css` — design system, responsividade e acessibilidade.
- `script.js` — menu mobile, navegação e geração de e-mail pré-preenchido.
- `assets/troia-logo-original.webp` — imagem do logotipo fornecida pela empresa (inclui inscrição legada na imagem).
- `assets/troia-emblem-favicon.webp` — recorte do emblema do logotipo utilizado no favicon.
- `robots.txt` e `sitemap.xml` — descoberta de conteúdo.
- `docs/validacao-publicacao.md` — pendências de conteúdo, branding e lançamento.

## Manutenção

Sem framework e sem dependências externas obrigatórias para renderizar. Fontes e imagens ilustrativas usam CDN externas. Os contatos no HTML devem ser revistos por um representante da empresa antes de vincular o domínio oficial.

## Atualização de unidade (09/10/2026)

O responsável confirmou que **a única sede/atuação apresentada publicamente é Brasília/DF**. Removidas as alegações de unidade em Goiânia/GO e do mapa de duas unidades. Registros públicos antigos não devem ser usados para atribuir filiais atuais à empresa.

## Vitrine visual (09/10/2026)

- Seção de marcas reformulada com cards responsivos de produtos **Pilão**, **Marilan** e **Veja**. São imagens de embalagens reais obtidas em páginas de varejistas; **não** implicam que todas as variantes estejam em estoque ou que a Tróia represente oficialmente todas as linhas.
- URLs e respectivas origens: [Pilão 500 g](https://marche.com.br/products/cafe-pilao-torrado-e-moido-tradicional-abre-fecha-500g); [Marilan Maizena 300 g](https://www.savegnago.com.br/biscoito-marilan-maizena-300g/p); [Veja Limpeza Pesada 500 ml](https://mercado.carrefour.com.br/limpador-para-limpeza-pesada-original-veja-500ml-182621/p).
- As imagens são carregadas dos sites citados (hotlinks). Confirmar permissão de uso das fotos para marketing com as marcas e, quando autorizado, salvar cópias otimizadas sob controle da empresa; links externos podem mudar.

## Localização confirmada pelo responsável (09/10/2026)

- Destino exato fornecido para navegação: **https://maps.app.goo.gl/6m6P86gjo4dtgm1T8**. O link substitui a busca aproximada por um endereço genérico do SIA.
- Nenhuma numeração ou CEP específicos são exibidos/publicados como endereço físico operacional até confirmação de que o endereço no cadastro coincide com o marcador enviado.
