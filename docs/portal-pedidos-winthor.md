# Portal de Pedidos B2B — Tróia / WinThor

**Situação:** protótipo em desenvolvimento na branch feat/portal-pedidos-winthor. Não homologado; não está publicado; não existe conexão real com o WinThor nem Oracle.

## Objetivo

Construir uma jornada de pedidos B2B para clientes autenticados: consultar catálogo, preços e estoque autorizados por cliente, montar carrinho, enviar solicitação, passar por aprovação e integrar através do serviço oficial WinThor. Manter o identificador do pedido ERP e acompanhar críticas, faturamento e cancelamentos mediante APIs homologadas.

## O que o protótipo já faz

- Interface responsiva em pedidos/public: produtos, busca, cliente fictício, carrinho, quantidades, totais, solicitação e histórico.
- Servidor Node 22+ somente em localhost. Rotas: GET /health, GET /api/catalog, GET /api/customers, GET /api/orders, GET /api/orders/:id, POST /api/orders e POST /api/orders/:id/approve.
- Cálculos e quantidades validados no servidor; preços e SKUs são **fictícios**, não os preços reais da Tróia.
- Chave de idempotência para evitar duplicidade na instância local. Reutilização da mesma chave com conteúdo diferente retorna conflito.
- Persistência local em pedidos/.runtime/orders.json, ignorada no Git. Uso apenas para desenvolvimento em processo único.
- Aprovação separada com ORDERS_OPERATOR_TOKEN; não existe botão de aprovação para o cliente.
- Adapter WinThor usando endpoint HTTPS configurável, token, host autorizado e timeout. Escritas DESABILITADAS; o mapper padrão interrompe a operação até homologação.
- Adapter opcional Oracle READ ONLY: só consulta uma interface própria pré-aprovada no banco, e apenas se explicitamente habilitado. Driver oracledb não instalado.
- Testes automatizados usando Node test runner e GitHub Actions.

### Estados

pending_approval -> sending -> simulated (demo) ou submitted (somente possível após implementação/homologação de integração). Em falha: sync_failed. Não há reenvio automático; em timeout deve-se conciliar com o ERP antes de qualquer nova tentativa.

## Como testar localmente

Use Node.js 22+:

1. git checkout feat/portal-pedidos-winthor
2. cd pedidos
3. npm run check
4. npm test
5. npm run dev
6. Abrir http://127.0.0.1:8787

Nenhuma senha Oracle é necessária. O serviço local só aceita loopback. A aplicação demonstrativa não cobra, reserva estoque, fatura nem transmite pedidos reais.

Exemplo de POST de pedido (todos dados fictícios):

    curl -X POST http://127.0.0.1:8787/api/orders -H 'Content-Type: application/json' -H 'Idempotency-Key: DEMO_KEY_00001' -d '{"customerId":"demo-c1","items":[{"sku":"DEMO-PIL-001","quantity":2}]}'

Não conecte esse protótipo ao subdomínio de produção troia.pixelinfinite.com.br.

## Estratégia WinThor

O serviço oficial winthor-pedido-venda existe, mas versões, APIs instaladas, autenticação e mapeamento variam. A documentação WinThor de pedidos menciona cliente/ID, região de preço, plano de pagamento, RCA e registros em PCLOGPEDIDOAPI. É necessário identificar versão, WTA/API Gateway, a API realmente habilitada, contrato Swagger/Postman da instalação e infraestrutura de homologação.

**Importante:** as APIs gerais de integração da TOTVS mencionam restrição para B2C no módulo distribuição. Validar com a TOTVS e equipe da Tróia se essa integração atende ao fluxo **B2B** e em qual rotina/módulo. A rotina 2699 é alternativa somente quando instalada e formalmente aprovada.

Não escrever diretamente nas tabelas de pedido do WinThor, nem invocar packages, procedures, functions, triggers e views internos da TOTVS: a própria TOTVS desautoriza o uso desses objetos por terceiros. A conexão Oracle não equivale a autorização de manipular o ERP.

## Oracle: interface opcional de leitura

O OracleCatalogReadAdapter é somente um contrato de exemplo. Requer driver oracledb, usuário com mínimo privilégio, rede privada e view de integração pertencente à empresa, cujas colunas deverão ser aprovadas com o DBA: SKU, NOME, MARCA, CATEGORIA, UNIDADE, PRECO_CENTAVOS e ATIVO. Nenhum dado real da Tróia foi consultado.

Preferir os serviços oficiais WinThor para produtos, preços, estoque e clientes. Nunca expor o Oracle ao navegador ou à internet.

## Requisitos mínimos antes de homologação e produção

1. Consentimento/autorização da empresa e responsável técnico WinThor/Oracle.
2. Versão e módulos WinThor, WTA/Gateway, URL/contrato de homologação, escopos e autenticação.
3. Mapeamento comercial: codcli, vendedor/RCA, filial atual Brasília, tabela/região de preço, condição/plano de pagamento, tributação, quantidade/unidade, descontos e regras de corte.
4. Disponibilidade real/estoque, bloqueio financeiro/crédito, frete, validade de preços e pedido mínimo.
5. Definir se entra no ERP como orçamento, pré-pedido ou pedido de venda e quem aprova.
6. Gestão de identidade B2B, usuários por CNPJ, permissões, auditoria e LGPD.
7. Backend de produção com banco transacional, unicidade de idempotência, fila/outbox, retries seguros, observabilidade e reconciliação manual.
8. Não guardar credenciais em código, GitHub ou cliente web. Usar cofre de segredos e canais criptografados.
9. Homologação ponta a ponta com TOTVS antes de qualquer envio de pedidos reais.

## Fontes oficiais TOTVS consultadas

- https://tdn.totvs.com/pages/viewpage.action?pageId=632099891 — API de integração de pedido.
- https://centraldeatendimento.totvs.com/hc/pt-br/articles/40916341521687-WINT-Como-realizar-a-integra%C3%A7%C3%A3o-de-Pedidos-via-API-com-o-Sistema-Winthor
- https://centraldeatendimento.totvs.com/hc/pt-br/articles/15615773269655-WINT-Como-realizar-integra%C3%A7%C3%A3o-com-terceiros
- https://centraldeatendimento.totvs.com/hc/pt-br/articles/360028851851-WINT-Como-realizar-a-integra%C3%A7%C3%A3o-E-commerce-padr%C3%A3o-Via-rotina-2699-WinThor-x-E-commerce
- https://tdn.totvs.com/pages/viewpage.action?pageId=573185595 — catálogo de APIs e ressalva B2C.

As referências descrevem o produto TOTVS, não a instalação específica da Tróia.
