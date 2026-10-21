# Expansão institucional — 21/10/2026

Fonte: https://www.troiadistribuicao.com.br/

## Materiais recuperados

Foram baixadas as 26 imagens da página pública: 18 logotipos de marcas, logotipo institucional, caminhão, fachada/frota, equipe e quatro imagens de categorias. O HTML, CSS e módulos JavaScript referenciados pela página também foram salvos para consulta local. Não houve acesso a dados de candidatos ou áreas autenticadas.

Os arquivos brutos ficam em `assets/original/`, ignorados pelo Git e excluídos da publicação. A entrega inclui um ZIP com os originais e as fontes públicas. As versões usadas no site ficam em `assets/brands/` e `assets/company/`.

Os logotipos foram reduzidos para o tamanho adequado de exibição e codificados em WebP lossless, preservando cores e transparência. As imagens de categoria, equipe e operação usam WebP otimizado. As embalagens Pilão, Marilan e Veja já aprovadas não foram modificadas.

O conjunto publicado dos 18 logotipos ocupa aproximadamente 323 kB. A ilustração de caminhão gerada por IA foi retirada da vitrine e do pacote publicado; a seção de diferenciais foi ajustada para não depender dessa imagem.

## Conteúdo

- Indicadores de mais de 4.000 produtos e 2.000 clientes, conforme o site original.
- Missão, visão e valores recuperados do conteúdo fornecido pelo usuário.
- Quatro segmentos: alimentos, bebidas e consumo, produtos em geral e atendimento a empresas.
- 18 marcas com logotipos reais e busca local por nome, sem diferenciação entre letras acentuadas.
- Diferenciais de logística, qualidade, atendimento e presença regional.
- Carreiras com link para o portal existente em `/vagas` e acesso externo ao painel de RH já divulgado no original.
- WhatsApp comercial `(61) 98100-9944`, telefone e e-mail, conforme o original. O contato usa links diretos, sem formulário de demonstração ou coleta de dados pelo site.

## Geografia

O usuário confirmou nesta conversa a atualização da atuação para **Distrito Federal e Goiás**, substituindo a orientação anterior de limitar a apresentação ao DF. Brasília permanece como a base da operação; não foi inventada uma unidade em Goiânia ou em outra cidade. Conteúdo, visão, indicadores, representação de cobertura e metadados foram atualizados. As imagens de equipe e categorias vêm do site de origem. A arte de caminhão gerada por IA foi removida após solicitação do usuário.

## Arquitetura

A implementação continua estática e sem dependências de JavaScript em produção. Não replica o backend de recrutamento: os botões direcionam ao portal existente. O destino de publicação continua sendo exclusivamente `troia.pixelinfinite.com.br`, pelo Worker `troia`.
