# Roadmap e TODO de Desenvolvimento Pink Amazon

## Objetivo

Transformar o escopo funcional descrito em PINK_AMAZON_FEATURES_DETAILED.md em um plano de execucao orientado por maturidade de API, integracao frontend e ordem de entrega.

Este documento considera o estado atual do repositorio e nao apenas o escopo desejado.

## Escala de maturidade da API

- N0: inexistente. Sem model, service ou rota utilizavel.
- N1: estrutura parcial. Existem telas, tipos ou contratos esperados, mas a API real nao sustenta o fluxo.
- N2: backend parcial. Ja existe parte do dominio, mas faltam operacoes, rotas ou alinhamento de contrato.
- N3: funcional. Endpoint util para integracao, com regras principais implementadas.
- N4: pronto para entrega. Backend integrado ao frontend, com testes cobrindo o fluxo principal.

## Leitura executiva

- Catalogo e autenticacao sao hoje os blocos mais maduros.
- Minha Conta existe visualmente no frontend, mas enderecos, favoritos e preferencias ainda estao desalinhados com a API real.
- Checkout, pedidos, pagamentos e frete ainda nao existem de forma funcional no backend.
- O painel admin ja possui varias telas, mas boa parte depende de endpoints ainda inexistentes ou placeholders.
- Antes de acelerar features novas, vale fechar uma fase curta de alinhamento de contrato entre frontend e backend.

## Mapa de funcionalidades x nivel de API

| Area | Funcionalidade | Frontend | Backend/API | Nivel atual | Observacao |
| --- | --- | --- | --- | --- | --- |
| Conta | Criar conta | Tela existe | Registro existe | N2 | Payload do frontend nao bate com o serializer atual de registro |
| Conta | Login | Tela existe | Login JWT existe | N3 | Fluxo principal implementado |
| Conta | Logout | Sim | Sem endpoint dedicado, fluxo local | N1 | Aceitavel para JWT stateless, mas sem invalidacao server-side |
| Conta | Recuperar senha | Nao mapeado no frontend principal | Endpoints existem | N2 | Backend pronto, falta fechar UX completa |
| Conta | Meus dados | Tela existe | GET/PUT de usuario existe | N2 | Frontend mistura campos diferentes dos retornados pela API |
| Conta | Enderecos | Tela existe | CRUD existe em rotas aninhadas por usuario | N1 | Front chama rotas planas e usa campos divergentes |
| Conta | Favoritos | UI parcial/mock | CRUD existe em rotas aninhadas por usuario | N1 | Falta integrar lista, adicionar e remover |
| Conta | Preferencias de notificacao | UI existe | Campo preferences existe | N1 | Frontend mistura preferences com campos top-level |
| Loja | Home com produtos | Sim | Lista de produtos existe | N3 | Ja consumivel no fluxo principal |
| Loja | Categorias | Sim | CRUD de categorias existe | N2 | Cliente chama rota diferente da publicada |
| Loja | Detalhe de produto por id | Sim | Detail por UUID existe | N3 | Fluxo viavel |
| Loja | Detalhe de produto por slug | Parcial | Nao existe rota por slug | N1 | Funcao frontend assume um contrato inexistente |
| Loja | Carrinho | Local | Nao depende de API no MVP | N2 | Pode seguir client-side no inicio |
| Loja | Checkout | Mock visual | Sem dominio de pedido | N0 | Finalizacao hoje nao grava nada |
| Loja | Selecionar endereco no checkout | Nao integrado | Endereco existe, pedido nao | N1 | Depende de pedidos e contrato de checkout |
| Admin | Produtos listar/criar | Telas existem | GET e POST existem | N2 | Falta update/delete no backend |
| Admin | Produtos editar/remover | UI parcial | Sem PUT/PATCH/DELETE de produto | N1 | Fluxo administrativo incompleto |
| Admin | Categorias gerenciar | Tela existe | CRUD existe | N2 | Precisa alinhar endpoint consumido |
| Admin | Inventario | Tela existe | Campo stock existe | N2 | Falta operacao de atualizacao/baixa consistente |
| Admin | Clientes | Tela existe | Listagem admin existe | N2 | Tipos do frontend nao batem com o payload real |
| Admin | Pedidos | Tela existe | Sem models/rotas/views funcionais | N0 | Tela depende de API inexistente |
| Admin | Pagamentos | Tela existe | Sem models/rotas/views funcionais | N0 | Tela depende de dados inexistentes |
| Admin | Promocoes | Placeholder | Nao existe modulo funcional | N0 | Iniciar apenas apos checkout operar |
| Admin | Reviews | Placeholder | Nao existe modulo funcional | N0 | Dependencia direta de pedidos/produtos |
| Admin | Configuracoes | Tela local | Sem backend dedicado | N1 | Pode ficar para fase posterior |

## Principais gaps de contrato encontrados

### 1. Rotas esperadas pelo frontend nao existem com o mesmo formato

- Categorias: o frontend chama /api/v1/categories/, mas a API publicada hoje esta sob /api/v1/products/categories/categories/.
- Enderecos: o frontend chama /api/v1/addresses/..., mas a API atual exige /api/v1/users/{user_id}/addresses/....
- Favoritos: o frontend ainda nao consome /api/v1/users/{user_id}/favorites/.
- Usuario atual: o frontend possui fallback para /api/v1/users/me/, mas essa rota nao existe.
- Produto por slug: o frontend possui helper por slug, mas a API atual so busca por UUID.

### 2. Estruturas de payload divergentes

- Cadastro: o frontend envia username e password_confirm, mas o serializer atual espera password e nao declara esses campos extras.
- Perfil: o frontend usa phone, enquanto o model usa whatsapp.
- Documento: partes do frontend esperam document.doc_number, mas a API atual retorna document como string.
- Preferencias: partes do frontend esperam promo_emails e wishlist_notifications no topo; a API usa preferences.promotional_emails, preferences.order_updates e preferences.wishlist_notifications.
- Endereco: a UI usa recipient e city_name, enquanto a API trabalha com recipient_name e city como string simples.

### 3. Modulos transacionais ainda nao foram iniciados de verdade

- orders
- payments
- shipping

Nos tres modulos ha apenas esqueletos de arquivos. Isso significa que checkout e operacao administrativa dependem primeiro da fundacao desses dominios.

## Roadmap recomendado

## Fase 0 - Alinhamento de contrato e base tecnica

Objetivo: remover quebra de integracao entre frontend e backend antes de expandir escopo.

- Padronizar contratos de usuario, endereco, preferencias e documento.
- Definir uma estrategia unica para usuario atual: criar /users/me/ ou remover fallback do frontend.
- Corrigir o client de categorias para o endpoint real ou simplificar a rota no backend.
- Decidir se produto sera buscado por UUID, slug ou ambos e ajustar API e frontend.
- Fechar contrato de cadastro para evitar campos extras inconsistentes.
- Revisar tipos em lib/users.ts, lib/products.ts e telas admin/minha-conta.

Entrega esperada:

- Frontend e backend compartilham contratos coerentes.
- Login, cadastro, perfil, categorias e listagens basicas operam sem adaptacoes locais improvisadas.

## Fase 1 - MVP de conta e catalogo

Objetivo: consolidar a jornada pre-checkout.

- Finalizar CRUD de enderecos com integracao real na Minha Conta.
- Integrar favoritos completos na Minha Conta e na pagina de produto.
- Finalizar update de perfil e preferencias com feedback de sucesso/erro.
- Completar CRUD administrativo de produtos.
- Ajustar estoque administrativo para refletir o campo stock real.
- Fechar listagem de clientes no admin com tipos corretos.

Entrega esperada:

- Cliente consegue navegar, autenticar, manter perfil e gerenciar enderecos/favoritos.
- Admin consegue operar catalogo e clientes com confianca.

## Fase 2 - Checkout e pedidos

Objetivo: sair do mock e registrar compras reais.

- Modelar Order e OrderItem com snapshot de produto, subtotal, frete, desconto e total.
- Criar endpoints de criar pedido, listar pedidos e detalhar pedido.
- Integrar checkout com selecao de endereco e criacao de pedido.
- Baixar estoque ao confirmar pedido ou reservar conforme regra definida.
- Expor historico de pedidos para Minha Conta.
- Alimentar painel admin de pedidos com dados reais.

Entrega esperada:

- Pedido deixa de ser simulacao visual e passa a existir na base.

## Fase 3 - Pagamentos e frete

Objetivo: fechar o ciclo operacional da compra.

- Modelar Payment e Shipment.
- Definir providers e estados de pagamento.
- Criar endpoint de iniciar pagamento por pedido.
- Adicionar webhook ou mecanismo de confirmacao de pagamento.
- Registrar shipment com tracking_code e status logistico.
- Expor tracking na Minha Conta e no admin.

Entrega esperada:

- Fluxo de pagamento e envio controlado por estado real.

## Fase 4 - Operacao administrativa

Objetivo: transformar o admin em painel operacional e nao apenas visual.

- Filtros e atualizacao de status de pedidos.
- Visao de pagamentos por status, taxa e conciliacao basica.
- Ajustes de inventario com trilha auditavel.
- KPIs do dashboard baseados em dados reais, sem mocks.

Entrega esperada:

- Operacao diaria do e-commerce pode ser acompanhada pelo admin.

## Fase 5 - Marketing e conteudo

Objetivo: ampliar conversao e prova social.

- Modulo de cupons/promocoes.
- Aplicacao de desconto no checkout.
- Modulo de reviews com moderacao.
- Exibicao de reviews na pagina de produto.

Entrega esperada:

- Loja passa a ter instrumentos de conversao e validacao social.

## Fase 6 - Qualidade e sustentacao

Objetivo: reduzir retrabalho e risco de regressao.

- Testes de contrato entre frontend e API.
- Testes de fluxo critico: cadastro, login, endereco, checkout, pedido, pagamento.
- Seeds e fixtures para ambiente de homologacao.
- Observabilidade minima para pedidos, pagamentos e erros de integracao.

## Ordem de prioridade sugerida

1. Fase 0
2. Fase 1
3. Fase 2
4. Fase 3
5. Fase 4
6. Fase 5
7. Fase 6 em paralelo com as fases 2 a 5

## TODO list base para acompanhamento

### Formato sugerido por item

Usar este modelo em tarefa, issue ou card:

- ID: EPIC-XX
- Area: conta | loja | admin | pedidos | pagamentos | shipping | marketing
- Tarefa: descricao objetiva da entrega
- Tipo: backend | frontend | integracao | teste | documentacao
- Prioridade: P0 | P1 | P2
- Dependencias: IDs relacionados
- Nivel alvo: N2 -> N4, por exemplo
- Status: backlog | doing | blocked | review | done
- Criterio de aceite: frase curta verificavel

### Backlog inicial recomendado

#### EPIC-00 - Contrato e integracao base

- [ ] CT-01 Corrigir contrato de cadastro entre auth-context e RegisterSerializer.
- [ ] CT-02 Definir e implementar estrategia para /users/me/.
- [ ] CT-03 Corrigir endpoint de categorias no frontend ou simplificar rota no backend.
- [ ] CT-04 Padronizar document como string ou objeto em toda a aplicacao.
- [ ] CT-05 Padronizar phone/whatsapp em frontend e backend.
- [ ] CT-06 Padronizar preferences no frontend inteiro.
- [ ] CT-07 Alinhar contrato de endereco: nomes de campos e formato de cidade/estado.
- [ ] CT-08 Revisar helpers de API em lib/products.ts, lib/users.ts e lib/orders.ts.

#### EPIC-01 - Conta do cliente

- [ ] AC-01 Integrar update de perfil com payload real da API.
- [ ] AC-02 Integrar leitura e escrita de preferencias.
- [ ] AC-03 Integrar listagem de enderecos usando rotas por usuario.
- [ ] AC-04 Integrar criacao e edicao de endereco.
- [ ] AC-05 Integrar exclusao de endereco.
- [ ] AC-06 Integrar favoritos na Minha Conta.
- [ ] AC-07 Integrar acao de favoritar/desfavoritar na pagina de produto.
- [ ] AC-08 Implementar fluxo de recuperar senha no frontend.

#### EPIC-02 - Catalogo e admin de catalogo

- [ ] CAT-01 Adicionar PUT/PATCH de produto no backend.
- [ ] CAT-02 Adicionar delete logico ou inativacao de produto.
- [ ] CAT-03 Integrar tela de criacao de produto com API real.
- [ ] CAT-04 Integrar tela de edicao de produto com API real.
- [ ] CAT-05 Ajustar inventario admin para editar stock.
- [ ] CAT-06 Validar listagem de categorias no admin com endpoint correto.

#### EPIC-03 - Pedidos e checkout

- [ ] ORD-01 Criar models de Order e OrderItem.
- [ ] ORD-02 Criar serializers e services de pedido.
- [ ] ORD-03 Expor POST /orders/ para criar pedido.
- [ ] ORD-04 Expor GET /orders/ e GET /orders/{id}/.
- [ ] ORD-05 Integrar checkout com criacao real de pedido.
- [ ] ORD-06 Permitir selecao de endereco no checkout.
- [ ] ORD-07 Exibir historico real de pedidos em Minha Conta.
- [ ] ORD-08 Alimentar admin de pedidos com dados reais.

#### EPIC-04 - Pagamentos e frete

- [ ] PAY-01 Criar model de pagamento e estados.
- [ ] PAY-02 Criar endpoint para iniciar pagamento por pedido.
- [ ] PAY-03 Definir integracao inicial: Pix, cartao ou boleto.
- [ ] PAY-04 Tratar confirmacao de pagamento por callback/webhook.
- [ ] SHP-01 Criar model de shipment.
- [ ] SHP-02 Registrar tracking_code e status de envio.
- [ ] SHP-03 Exibir rastreio na Minha Conta.
- [ ] SHP-04 Exibir operacao de envio no admin.

#### EPIC-05 - Admin operacional

- [ ] ADM-01 Atualizar dashboard para consumir dados reais.
- [ ] ADM-02 Permitir mudanca de status de pedido no admin.
- [ ] ADM-03 Consolidar tela de pagamentos com dados reais.
- [ ] ADM-04 Corrigir tipos da tela de clientes conforme payload real.
- [ ] ADM-05 Criar filtros por status, data e cliente.

#### EPIC-06 - Marketing e conteudo

- [ ] MKT-01 Criar dominio de cupons/promocoes.
- [ ] MKT-02 Aplicar desconto no checkout.
- [ ] MKT-03 Criar dominio de reviews.
- [ ] MKT-04 Exibir reviews em produto.
- [ ] MKT-05 Criar moderacao de reviews no admin.

#### EPIC-07 - Testes e qualidade

- [ ] QLT-01 Cobrir contratos de auth, users e catalogo com testes de API.
- [ ] QLT-02 Adicionar testes para enderecos e favoritos.
- [ ] QLT-03 Adicionar testes de pedidos.
- [ ] QLT-04 Adicionar testes de pagamentos e webhooks.
- [ ] QLT-05 Adicionar smoke tests de integracao frontend x backend.

## Criterio de pronto por fase

- Fase 0 pronta quando os contratos principais deixarem de exigir workarounds no frontend.
- Fase 1 pronta quando Minha Conta e admin de catalogo estiverem operacionais com API real.
- Fase 2 pronta quando um pedido puder ser criado, listado e detalhado de ponta a ponta.
- Fase 3 pronta quando pagamento e rastreio alterarem estados reais do pedido.
- Fase 4 pronta quando a operacao administrativa puder acompanhar pedidos, pagamentos e estoque.
- Fase 5 pronta quando cupons e reviews influenciarem a jornada de compra.
- Fase 6 pronta quando os fluxos criticos estiverem cobertos por testes e monitoracao minima.