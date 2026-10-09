# Validação editorial e checklist de publicação

**Levantamento:** 09/10/2026  
**Status:** MVP institucional implementado. A publicação no domínio oficial **não foi executada**.

## Identidade e mídia

- [ ] Solicitar arquivo **oficial** do logotipo da Tróia (SVG/PNG vetorial) e manual com cores, tipografia e usos.
- [x] Substituído o wordmark tipográfico e o favicon pelos arquivos derivados da imagem oficial enviada pelo responsável, preservando a arte do emblema.
- [ ] Obter versão atualizada em SVG/PNG HD sem a inscrição geográfica antiga `DF-GO` que ainda está na imagem original; não inventar símbolo ou redesenhar a marca.
- [ ] Solicitar fotos **autorizadas** do centro de distribuição, frota, equipe e fachadas. No momento as fotos do site são externas e ilustrativas (Unsplash); não representam a Tróia.
- [ ] Solicitar artes oficiais das marcas exibidas (**Pilão, Marilan, Veja, Reckitt**) e aprovação para uso público no site. Os nomes exibidos no MVP são texto estilizado, não reproduções fiéis dos logotipos.
- [ ] Confirmar outras marcas do mix, SKUs, categorias e política de disponibilidade. Não sugerir distribuição exclusiva.

## Dados empresariais — correção importante

**Empresa vinculada ao domínio e às redes:** 
- Tróia Distribuição de Alimentos Ltda — CNPJ **30.687.910/0001-55**, aberta em 13/06/2018, sede Brasília/DF.
- **Situação operacional corrigida pelo responsável:** apenas Brasília/DF. Referências comerciais anteriores a Goiânia/GO não devem ser tratadas como atuais.
- Fontes: [Casa dos Dados](https://casadosdados.com.br/solucao/cnpj/troia-distribuicao-de-alimentos-ltda-30687910000155), [LinkedIn da empresa](https://br.linkedin.com/company/troiadistribuicao) e confirmação operacional direta do responsável (esta última prevalece sobre dados antigos de diretórios).

> Atenção: um relatório preliminar havia associado indevidamente o nome "Tróia" à UNIEX AÇÚCAR DO BRASIL S/A, CNPJ 54.892.488/0004-80. **Não usar esse dado no site.** A correspondência pública consistente com o domínio, a marca e o LinkedIn é a Tróia Distribuição de Alimentos Ltda.

## Informações que precisam de aprovação

- [ ] Confirmar **telefone comercial** (61) 3042-9190, apresentado em cadastros empresariais. É número fixo: **não divulgar como WhatsApp sem teste e confirmação**.
- [ ] Confirmar se o e-mail comercial \`comercial@troiadistribuicao.com.br\` (citado em cadastros públicos) continua recebendo mensagens e atende à matriz. Substituir por contato oficial preferido, se houver.
- [ ] Confirmar endereço e horário de visita da unidade em Brasília. O cadastro oficial indica SIA Trecho 17 Rua 04 Lote 255 e Rua 08 Lote 30/50, Brasília/DF; LinkedIn lista SIA Trecho 17 Rua 08, 105 (CEP diferente).
- [x] Retiradas a segunda localização, indicação de filial e a referência à cidade de Goiânia da página pública.
- [ ] Validar a cobertura efetiva em Brasília/DF. Não divulgar atendimento em Goiás ou prazos/frete de entrega sem confirmação comercial.
- [ ] Confirmar segmentos exatos atendidos (atacado, varejo, food service, suplementação) e revisar textos da homepage.
- [ ] Atualizar política de privacidade caso sejam introduzidos backend, cookies analíticos, formulário coletor de leads ou CRM. O MVP **não armazena os dados digitados**.
- [ ] Aprovar menção às marcas, seu uso visual e descrições (Pilão/Marilan/Veja/Reckitt foram indicadas pelo solicitante; a relação contratual não foi comprovada publicamente).

## Checklist técnico

- [x] HTML semântico e um único H1
- [x] Navegação responsiva com menu mobile e Escape
- [x] Links comerciais e formulário que prepara e-mail **sem prometer envio automático**
- [x] Acessibilidade básica: labels, skip link, foco visível, \`prefers-reduced-motion\`
- [x] Metadados, canonical, dados estruturados, robots e sitemap
- [x] Página 404, headers de segurança e navegação por âncoras
- [ ] Testar visualmente em desktop/tablet/celular em uma URL de preview (incluindo disponibilidade das imagens externas)
- [ ] Confirmar SPF/DKIM/DMARC do domínio para operação do e-mail (configuração fora do site)
- [ ] Publicar no provedor de hospedagem e apontar DNS com autorização do responsável pelo domínio
- [ ] Testar SSL, links, e-mail e Search Console após publicação

## Como publicar com Cloudflare Pages

1. Crie projeto Pages conectando o repositório \`angelpixel41/Troia\`, branch de produção \`main\`.
2. Sem build command, framework \`None\`, pasta de saída **\`.\`** (raiz).
3. Verifique primeiro a URL temporária \`*.pages.dev\`.
4. Depois de aprovar o conteúdo, vincule o domínio \`troiadistribuicao.com.br\` e configure o DNS/SSL. Não alterar DNS sem autorização.
5. Faça revalidação dos dados e materiais de identidade visual antes de anunciar oficialmente.

## Referências editoriais

- [LinkedIn institucional](https://br.linkedin.com/company/troiadistribuicao) — posicionamento "Construindo Grandes Marcas" e segmentos; cobertura geográfica desatualizada foi retirada.
- [Registro público da matriz](https://casadosdados.com.br/solucao/cnpj/troia-distribuicao-de-alimentos-ltda-30687910000155).
- [Instagram indicado como oficial](https://www.instagram.com/troiadistribuicao/).
- [Licença Unsplash](https://unsplash.com/license) — fotografias ilustrativas.

## Domínio de lançamento definido em 09/10/2026

O solicitante escolheu **https://troia.pixelinfinite.com.br** para esta publicação. Por isso, canonical, Open Graph, JSON-LD, sitemap.xml e robots.txt devem referenciar o subdomínio e não o domínio institucional anterior. A caixa de e-mail de atendimento da Tróia **não** deve mudar por causa da hospedagem.

## Correção prioritária: Brasília/DF

Em 09/10/2026, o responsável informou que a filial de Goiânia não existe mais. É incorreto apresentar o endereço, o mapa, a cobertura ou o atendimento de Goiás como atuais. O site deve apresentar **exclusivamente Brasília/DF**. O logotipo original contém ainda a inscrição histórica `DF-GO`: manter o arquivo fiel à arte enviada, mas solicitar arte oficial atualizada ao responsável.

## Atualização de localização e vitrine de produtos (09/10/2026)

- [x] Botão de localização atualizado para o ponto exato fornecido pelo responsável: https://maps.app.goo.gl/6m6P86gjo4dtgm1T8.
- [x] Removidos do JSON-LD os campos de endereço físico e CEP derivados exclusivamente de cadastros que apontavam local impreciso. Brasília/DF permanece como localização institucional confirmada.
- [x] Criada vitrine editorial com imagens de embalagens Pilão, Marilan e Veja, fonte em páginas de varejo identificadas no README.
- [ ] Confirmar autorização/licenciamento das imagens de produtos para exibição comercial no website.
- [ ] Confirmar quais linhas específicas realmente integram o mix atual; vitrine é demonstrativa, não catálogo de SKUs.
- [ ] Informar endereço escrito exato e referência para visita caso desejem publicar texto de endereço além do link de Maps.
