# Merchant Microservice — Documentación Completa

> **Versión**: 0.0.1
> **Puerto**: 3011
> **Base URL**: `http://localhost:3011/api`
> **Swagger UI**: `http://localhost:3011/api-docs` (user: `admin`, pass: `admin123`)

---

## Tabla de Contenidos

1. [Historia de Usuario](#1-historia-de-usuario)
2. [Modelo DSL](#2-modelo-dsl)
3. [Arquitectura](#3-arquitectura)
4. [Módulos del Microservicio](#4-módulos-del-microservicio)
5. [Eventos Publicados](#5-eventos-publicados)
6. [Eventos Consumidos](#6-eventos-consumidos)
7. [API REST — Guía Completa Swagger](#7-api-rest--guía-completa-swagger)
8. [Guía para Desarrolladores](#8-guía-para-desarrolladores)
9. [Test E2E con curl](#9-test-e2e-con-curl)
10. [Análisis de Sagas y Eventos (E2E)](#10-análisis-de-sagas-y-eventos-e2e)

---

## 1. Historia de Usuario

### Bounded Context: Merchant

El microservicio **merchant** es dueño del **perfil del comercio**: identificación legal, representantes, cuentas bancarias, métodos de cobro y la **configuración de pasarelas por merchant** (activación, prioridad, monedas y tipos de pago aceptados, modo de liquidación). Referencia (no duplica) a `user` del bounded context security.

### Historias de Usuario Implementadas

| ID | Título | Módulo(s) |
|----|--------|-----------|
| UH-1 | Gestión del perfil Merchant (legal, bancario, aprobación) | merchant |
| UH-2 | Configuración de pasarelas por merchant (prioridad, monedas, métodos, settlement) | merchant-gateway-config |
| UH-3 | Trazabilidad de sincronizaciones con catalog-service | catalog-sync-log |
| UH-4 | Integración con catalog-service (CURRENCY, APPROVAL_STATUS, PAYMENT_METHOD_TYPE, ...) | catalog-client |

### UH-2 — Merchant Gateway Config

**Como** dueño del negocio, **quiero** activar/desactivar pasarelas y definir prioridad, monedas, métodos aceptados y modo de liquidación **para** controlar cómo cobrar a los clientes. Transiciones `created → activated ↔ deactivated → deleted` emiten eventos específicos que consumen payment-service (`payment-merchant-gateway-eligibility`).

---

## 2. Modelo DSL

Los modelos están en `models/merchant/`.

| Modelo XML | Versión | AggregateRoot | ModuleType | Descripción |
|------------|---------|:---:|---|---|
| `merchant.xml` | 1.1.0 | ✓ | aggregate-root | Perfil del comercio (extends user) |
| `merchant-gateway-config.xml` | 1.0.0 | ✗ | entity | Configuración de pasarela por merchant |
| `catalog-sync-log.xml` | 1.0.0 | ✗ | entity | Trazabilidad de sync con catalog |

### Estructura de un modelo DSL

```xml
<domain-model name="merchant-gateway-config" schemaVersion="2.0" version="1.0.0"
              boundedContext="merchant" aggregateRoot="false" moduleType="entity">
  <fields>
    <field name="code" type="string" unique="true"/>
    <field name="merchantId" type="uuid"/>
    <field name="gatewayId" type="uuid"/>
    <field name="status" type="string"/>
    <field name="isActive" type="boolean"/>
    <field name="displayPriority" type="int"/>
    <field name="acceptedCurrencies" type="json"/>
    <field name="acceptedPaymentMethodTypes" type="json"/>
    <field name="settlementMode" type="string"/>
  </fields>
  <domain-events>
    <event name="merchant-gateway-config-activated" version="1.0.0" maxRetries="3" replayable="true"/>
    <event name="merchant-gateway-config-deactivated" version="1.0.0" maxRetries="3" replayable="true"/>
  </domain-events>
</domain-model>
```

---

## 3. Arquitectura

### 3.1 Patrones

| Patrón | Descripción |
|--------|-------------|
| **CQRS** | Command/query separados. |
| **Event Sourcing** | Eventos inmutables en EventStore + Kafka. |
| **Event-Driven** | Cambios de config pasarela → payment-service actualiza elegibilidad. |
| **Saga Pattern** | `MerchantGatewayConfigCrudSaga` escucha 5 eventos (CRUD + activated + deactivated). |
| **DDD** | Aggregates *Merchant*, *MerchantGatewayConfig*. |
| **Catalog-fallback** | Breaker + cache TTL 5 min. |

### 3.2 Arquitectura

```
┌────────────────────────────────────────────────────────────┐
│              MERCHANT MICROSERVICE  (3011)                 │
├────────────────────────────────────────────────────────────┤
│  REST Command / REST Query / GraphQL                       │
│        │              │              │                     │
│   CommandBus      QueryBus      Resolvers                  │
│        │              │                                    │
│   Service ↔ Repository → PostgreSQL (merchant-service)     │
│                                                            │
│  KafkaEventPublisher ─ EventStore ─ KafkaEventSubscriber   │
│                         │                                  │
│                   CatalogClient (breaker + cache)          │
└────────────────────────────────────────────────────────────┘
```

### 3.3 Estructura de carpetas por módulo

```
src/modules/<module>/
├── commands/ controllers/ decorators/ dtos/ entities/
├── events/ (base.event, *.event, event-registry.ts)
├── graphql/ guards/ interceptors/ modules/ queries/
├── repositories/ sagas/ services/ shared/ types/
```

---

## 4. Módulos del Microservicio

### 4.1 Merchant
- **Entidad**: `Merchant` (extends User) — `userId`, `merchantCode`, `displayName`, `legalRepresentative`, `legalName`, `fiscalIdentifier`, `approvalStatus`, `bankAccounts` (json), `collectionMethods` (json), `metadata` (json).

### 4.2 MerchantGatewayConfig
- **Entidad**: `MerchantGatewayConfig` — `code` (unique), `merchantId`, `gatewayId`, `status`, `isActive`, `displayPriority`, `acceptedCurrencies`, `acceptedPaymentMethodTypes`, `settlementMode`, `descriptorName`, `softDescriptor`, `operationalNotes`, `metadata`.

### 4.3 CatalogSyncLog
- **Entidad**: `CatalogSyncLog` — `categoryCode`, `triggeredBy`, `itemsAdded/Updated/RemovedCount`, `diffSnapshot`, `outcome`, `durationMs`, `syncedAt`.

### 4.4 CatalogClient
- Runtime idéntico al resto: `CatalogClientService`, `CatalogSyncService`, `CatalogKafkaConsumer`, `CatalogSyncController` (`/api/catalog-sync/health|status|run`).

---

## 5. Eventos Publicados

| Módulo | Evento | Tópico Kafka | Versión | Replayable |
|--------|--------|--------------|---------|:---:|
| merchant | `MerchantCreatedEvent` | `merchant-created` | 1.0.0 | ✓ |
| merchant | `MerchantUpdatedEvent` | `merchant-updated` | 1.0.0 | ✓ |
| merchant | `MerchantDeletedEvent` | `merchant-deleted` | 1.0.0 | ✓ |
| merchant-gateway-config | `MerchantGatewayConfigCreatedEvent` | `merchant-gateway-config-created` | 1.0.0 | ✓ |
| merchant-gateway-config | `MerchantGatewayConfigUpdatedEvent` | `merchant-gateway-config-updated` | 1.0.0 | ✓ |
| merchant-gateway-config | `MerchantGatewayConfigDeletedEvent` | `merchant-gateway-config-deleted` | 1.0.0 | ✓ |
| merchant-gateway-config | `MerchantGatewayConfigActivatedEvent` | `merchant-gateway-config-activated` | 1.0.0 | ✓ |
| merchant-gateway-config | `MerchantGatewayConfigDeactivatedEvent` | `merchant-gateway-config-deactivated` | 1.0.0 | ✓ |
| catalog-sync-log | `CatalogSyncLogCreatedEvent` | `catalog-sync-log-created` | 1.0.0 | ✓ |
| catalog-sync-log | `CatalogSyncLogUpdatedEvent` | `catalog-sync-log-updated` | 1.0.0 | ✓ |
| catalog-sync-log | `CatalogSyncLogDeletedEvent` | `catalog-sync-log-deleted` | 1.0.0 | ✓ |
| catalog-sync-log | `CatalogSyncCompletedEvent` | `catalog-sync-completed` | 1.0.0 | ✗ |
| catalog-sync-log | `CatalogSyncFailedEvent` | `catalog-sync-failed` | 1.0.0 | ✗ |

Cada topic genera `<topic>-retry` y `<topic>-dlq`.

### Estructura de un evento publicado

```json
{
  "aggregateId": "uuid",
  "timestamp": "2026-04-21T10:00:00.000Z",
  "payload": {
    "instance": { /* Merchant / MerchantGatewayConfig */ },
    "metadata": {
      "initiatedBy": "user-id", "correlationId": "uuid",
      "eventName": "MerchantGatewayConfigActivatedEvent",
      "eventVersion": "1.0.0", "sourceService": "merchant-service",
      "retryCount": 0, "idempotencyKey": "uuid"
    }
  }
}
```

---

## 6. Eventos Consumidos

| Módulo | Evento | Origen | Acción |
|--------|--------|--------|--------|
| catalog-client | `catalog.catalog-item-upserted` | catalog-service | Invalida caché + syncCategory(KAFKA_EVENT) |
| catalog-client | `catalog.catalog-item-deprecated` | catalog-service | Invalida caché + syncCategory(KAFKA_EVENT) |
| * (sagas CRUD) | `Merchant*Event`, `MerchantGatewayConfig*Event` | self (EventBus local) | Hook post-CRUD |

`KAFKA_TRUSTED_PRODUCERS` filtra productores confiables; `EventIdempotencyService` deduplica con TTL (`KAFKA_IDEMPOTENCY_TTL_MS`).

---

## 7. API REST — Guía Completa Swagger

### 7.1 Command CRUD

| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| POST | `/api/<entities>/command` | `CreateXxxDto` | Crear |
| POST | `/api/<entities>/command/bulk` | `CreateXxxDto[]` | Crear múltiples |
| PUT | `/api/<entities>/command/:id` | `UpdateXxxDto` | Actualizar |
| PUT | `/api/<entities>/command/bulk` | `UpdateXxxDto[]` | Actualizar múltiples |
| DELETE | `/api/<entities>/command/:id` | — | Eliminar |
| DELETE | `/api/<entities>/command/bulk` | `DeleteXxxDto[]` | Eliminar múltiples |

### 7.2 Query CRUD

| Método | Ruta | Query Params |
|--------|------|--------------|
| GET | `/api/<entities>/query/list` | `page, size, sort, order, search, initDate, endDate` |
| GET | `/api/<entities>/query/:id` | — |
| GET | `/api/<entities>/query/field/:field` | `value, page, size` |

### 7.3 Catalog-sync

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/catalog-sync/health` | Probe |
| GET | `/api/catalog-sync/status` | Estado + breaker + lastSync |
| POST | `/api/catalog-sync/run?categoryCode=&reason=` | Sync manual |

### 7.4 Prefijos por módulo

| Módulo | Prefijo Command | Prefijo Query | Auth |
|--------|-----------------|---------------|:---:|
| merchant | `/api/merchants/command` | `/api/merchants/query` | Bearer |
| merchant-gateway-config | `/api/merchantgatewayconfigs/command` | `/api/merchantgatewayconfigs/query` | Bearer |
| catalog-sync-log | `/api/catalogsynclogs/command` | `/api/catalogsynclogs/query` | Bearer |
| catalog-client | `/api/catalog-sync` | — | — |

### 7.5 DTOs principales

```json
// CreateMerchantDto
{ "userId":"UUID", "merchantCode":"MER-001", "displayName":"Tienda X",
  "legalRepresentative":"Juan Pérez", "legalName":"Tienda X S.A.",
  "fiscalIdentifier":"RFC-XXXX", "approvalStatus":"PENDING",
  "bankAccounts":[], "collectionMethods":[] }

// CreateMerchantGatewayConfigDto
{ "code":"MGC-001", "merchantId":"UUID", "gatewayId":"UUID", "status":"ACTIVE",
  "isActive":true, "displayPriority":1, "acceptedCurrencies":["MXN","USD"],
  "acceptedPaymentMethodTypes":["CARD","WALLET"], "settlementMode":"DAILY" }
```

---

## 8. Guía para Desarrolladores

### 8.1 Crear un Evento

```typescript
export class MerchantGatewayConfigActivatedEvent extends BaseEvent {
  constructor(public readonly aggregateId: string, public readonly payload: PayloadEvent<MerchantGatewayConfig>) { super(aggregateId); }
  static create(id, instance, userId, correlationId = uuidv4()) {
    return new MerchantGatewayConfigActivatedEvent(id, { instance, metadata: { initiatedBy: userId, correlationId } });
  }
}
```

Registrar en `event-registry.ts` y publicar con dual publish (`eventBus.publish` + `eventPublisher.publish`).

### 8.2 Crear una Saga

```typescript
@Injectable()
export class MerchantGatewayConfigCrudSaga {
  @Saga()
  onActivated = ($e: Observable<MerchantGatewayConfigActivatedEvent>) => $e.pipe(
    ofType(MerchantGatewayConfigActivatedEvent),
    tap(e => this.logger.log(`Gateway activated ${e.aggregateId}`)),
    map(() => null),
  );
}
```

---

## 8.5 Búsqueda semántica (pgvector + IA)

El campo `semanticEmbedding` (tipo `vector`, 1536 dim., OpenAI text-embedding-3-small compatible) se calcula automáticamente al **crear/actualizar** un merchant a partir de `displayName + legalName + slug + code + metadata`. `semanticEmbeddingUpdatedAt` guarda el timestamp del último cálculo. Al actualizar el embedding se publica el evento de dominio `MerchantEmbeddingUpdated` (topic `merchant-embedding-updated`).

### Endpoint

`GET /merchants/query/semantic-search?q=TEXT&semanticSearch=true&similarityThreshold=0.7&limit=25`

| Query param | Tipo | Default | Descripción |
|-------------|------|---------|-------------|
| `q` | string | — (requerido) | Texto a buscar |
| `semanticSearch` | boolean | `true` | Si `false` se fuerza búsqueda textual |
| `similarityThreshold` | number | `0.7` | Umbral de similitud coseno (0..1) |
| `limit` | number | `25` | Máximo de resultados |

La respuesta incluye `searchMode` con tres valores: `SEMANTIC`, `TEXTUAL`, `TEXTUAL_FALLBACK` (cuando no hay matches semánticos sobre el umbral se cae a búsqueda textual sobre los mismos ítems). En modo `SEMANTIC` se devuelve además el array `scores` con la similitud de cada item.

### Implementación técnica

- Columna física: `text` con transformer JSON en TypeORM (evita dependencia directa del tipo `vector` del driver). Una migración posterior puede promover la columna a `VECTOR(1536)` real cuando la infraestructura tenga `pgvector` cargado.
- Servicio: `SemanticSearchService` en `src/shared/semantic-search/`. La implementación por defecto calcula embeddings deterministas basados en hashing (apto para e2e y desarrollo local). Para producción, sustituir `computeEmbedding` por una integración real (p. ej. OpenAI).
- Infraestructura: el contenedor de postgres utiliza la imagen `imresamu/postgis-pgvector:16-3.4` y habilita `CREATE EXTENSION IF NOT EXISTS vector;` en el primer arranque (`data-center/postgres/initdb/01-extensions.sql`).

## 9. Test E2E con curl

```bash
cd merchant-service && env LOG_API_AUTH_TOKEN=valid-token node dist/main.js
bash merchant-service/src/docs/e2e-test.sh
```

Cobertura objetivo 100% UH + Swagger + Kafka:

| Paso | Descripción | Cobertura |
|------|-------------|-----------|
| 0 | Pre-flight health + DB baseline | Infra |
| 1 | Crear merchant → `merchant-created` | `merchant` |
| 2 | Update merchant → `merchant-updated` | Kafka produce |
| 3 | Bulk create merchants | `merchant` |
| 4 | Query list + field + pagination | `merchant` |
| 5 | Crear gateway-config → `merchant-gateway-config-created` | `merchant-gateway-config` |
| 6 | Activate → `merchant-gateway-config-activated` | Kafka produce |
| 7 | Deactivate → `merchant-gateway-config-deactivated` | Kafka produce |
| 8 | Update config (currencies/methods) → `merchant-gateway-config-updated` | Kafka produce |
| 9 | Catalog-sync health + status + run manual | `catalog-client` |
| 10 | GET catalog-sync-log → `catalog-sync-completed` en topic | `catalog-sync-log` |
| 11 | `kcat -L` verifica topics `merchant-*` | Kafka probe |
| 12 | Limpieza | Todos |

Requisitos: merchant-service ↑, PostgreSQL, `curl` + `jq`; `kcat` opcional.

---

## 10. Análisis de Sagas y Eventos (E2E)

### 10.1 Inventario de sagas

| Módulo | Saga | Handlers |
|--------|------|----------|
| merchant | `MerchantCrudSaga` | Created/Updated/Deleted |
| merchant-gateway-config | `MerchantGatewayConfigCrudSaga` | 5 handlers (Created/Updated/Deleted/Activated/Deactivated) |
| catalog-sync-log | `CatalogSyncLogCrudSaga` | Created/Updated/Deleted |

### 10.2 Totales

- **Eventos registrados**: 13 (6 CRUD + 2 estado gateway + 3 sync-log + 2 dominio catalog-sync)
- **Topics Kafka**: 13 main + 13 retry + 13 DLQ = **39**

### 10.3 Dual publish

Requerido para que las sagas `@Saga()` CRUD reaccionen in-process.

---

## 11. Variables de Entorno

| Variable | Uso |
|----------|-----|
| `NODE_ENV` | Entorno |
| `INCLUDING_DATA_BASE_SYSTEM` | Activar PostgreSQL |
| `DB_HOST/PORT/NAME/USERNAME/PASSWORD` | PostgreSQL (merchant-service) |
| `KAFKA_ENABLED` / `KAFKA_BROKERS` / `KAFKA_CLIENT_ID` / `KAFKA_GROUP_ID` | Kafka |
| `KAFKA_IDEMPOTENCY_TTL_MS` | Idempotencia (24h) |
| `EVENT_SOURCING_ENABLED` / `EVENT_STORE_ENABLED` | Event sourcing |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_TTL` | Redis cache |
| `CATALOG_BASE_URL` / `CATALOG_SYNC_INTERVAL_MS` / `CATALOG_REQUEST_TIMEOUT_MS` | CatalogClient |
| `CATALOG_BREAKER_ERROR_THRESHOLD` / `CATALOG_BREAKER_RESET_MS` | Breaker |
| `LOG_API_BASE_URL` / `LOG_EXECUTION_TIME` / `LOG_KAFKA_TOPIC` | Codetrace |
| `APP_NAME` / `PORT` | 3011 |

---

## 12. Build & Run

```bash
cd merchant-service
npm install && npm run build
node dist/main.js
# o docker-compose up merchant-service
```

---

## 13. Integración con catalog-service

Documentación canónica de `CatalogClientModule`: [docs/README-catalog-integration.md](../../../docs/README-catalog-integration.md).
