# Tróia Distribuição — Site institucional

Site institucional responsivo da **Tróia Distribuição**, voltado a clientes empresariais e parceiros comerciais no Distrito Federal e em Goiás.

## Executar localmente

O site é estático (HTML, CSS e JavaScript sem build). Execute `python -m http.server 8080` na pasta do repositório e acesse `http://localhost:8080`. Use um servidor HTTP local porque os recursos usam caminhos absolutos.

## Publicar no Cloudflare Pages

1. Cloudflare > Workers & Pages > Create > Connect to Git > `angelpixel41/Troia`.
2. Framework: **None**. Build command: **(vazio)**. Output directory: **.** (raiz do repositório).
3. Adicione o domínio `troiadistribuicao.com.br` em Custom domains **somente após autorizar a substituição do site atual** e configurar o DNS do domínio.
4. Merges em `main` farão novos deploys. Um preview no `*.pages.dev` pode ser validado antes de apontar o domínio.

## Conteúdo e identidade

- O conteúdo combina informações institucionais do LinkedIn, registros empresariais e marcas citadas pelo solicitante.
- **O logotipo oficial e um manual de identidade visual não estavam acessíveis publicamente**. Por isso, a assinatura no cabeçalho é **tipográfica provisória**, sem inventar símbolo. Paleta editorial provisória centralizada nas variáveis de `styles.css`. Troque quando receber os arquivos oficiais.
- Os nomes **Pilão, Marilan, Veja e Reckitt** aparecem como referências ao portfólio informado; não se declara exclusividade ou contrato formal.
- Fotografias de logística são **ilustrativas** (Unsplash), não representam instalações, pessoas ou veículos da Tróia.
- Não há carrinho nem catálogo/SKU/tabela de preços inventados. Pedidos de orçamento abrem o cliente de e-mail do visitante. Sem backend, não são registrados ou enviados automaticamente.
- Antes do lançamento oficial, obtenha aprovação dos responsáveis pelos dados de contato, endereço, uso dos logotipos das marcas e texto do portfólio. Veja `docs/validacao-publicacao.md`.

## Fontes públicas consultadas (09/10/2026)

- [LinkedIn — Tróia Distribuição](https://br.linkedin.com/company/troiadistribuicao) (descrição, slogan, DF e GO).
- [Casa dos Dados — CNPJ 30.687.910/0001-55](https://casadosdados.com.br/solucao/cnpj/troia-distribuicao-de-alimentos-ltda-30687910000155).
- [Registro da filial em Goiânia — CNPJ 30.687.910/0002-36](https://consultacnpj.com/cnpj/troia-distribuicao-e-logistica-de-alimentos-ltda-troia-distribuicao-e-logistica-30687910000236).
- [Instagram oficial](https://www.instagram.com/troiadistribuicao/).
- Declarações do solicitante sobre marcas distribuídas.

## Estrutura

- `index.html` — homepage institucional e metadados SEO.
- `styles.css` — design system, responsividade e acessibilidade.
- `script.js` — menu mobile, navegação e geração de e-mail pré-preenchido.
- `assets/favicon.svg` — favicon **tipográfico neutro** provisório.
- `robots.txt` e `sitemap.xml` — descoberta de conteúdo.
- `docs/validacao-publicacao.md` — pendências de conteúdo, branding e lançamento.

## Manutenção

Sem framework e sem dependências externas obrigatórias para renderizar. Fontes e imagens ilustrativas usam CDN externas. Os contatos no HTML devem ser revistos por um representante da empresa antes de vincular o domínio oficial.
