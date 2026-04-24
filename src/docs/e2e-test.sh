#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════
# Test E2E completo — merchant-service (puerto 3011)
# Módulos: merchants, merchantgatewayconfigs, catalogsynclogs, catalog-client
# ═══════════════════════════════════════════════════════════════
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/../../../sources/e2e-common.sh"

BASE_URL="${BASE_URL:-http://localhost:3011/api}"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  TEST E2E — Merchant Microservice — 100% UH + Swagger        ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo -e "  Base URL: $BASE_URL | Unique: $UNIQUE"

log_step 0 "Pre-flight"
RESP=$(do_get "$BASE_URL/merchants/query/count" "$AUTH"); CODE=$(extract_code "$RESP")
if [[ "$CODE" =~ ^(200|201|500)$ ]]; then log_ok "Service UP ($CODE)"; else log_fail "Service NO responde ($CODE)"; exit 1; fi

log_step 1 "UH-1 Merchant"
P=$(cat <<EOF
{"name":"E2E Merchant ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"MRC-${UNIQUE}","legalName":"E2E SA","status":"ACTIVE",
 "taxId":"TAX-${UNIQUE}","riskLevel":"LOW","metadata":{"e2e":true}}
EOF
)
smoke_module "merchants" "$P"

log_step 2 "UH-2 MerchantGatewayConfig"
P=$(cat <<EOF
{"name":"E2E MGC ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"code":"MGC-${UNIQUE}","merchantId":"00000000-0000-0000-0000-000000000001",
 "gatewayId":"00000000-0000-0000-0000-000000000002","status":"ENABLED","metadata":{"e2e":true}}
EOF
)
smoke_module "merchantgatewayconfigs" "$P"

log_step 3 "UH-3 CatalogSyncLog"
P=$(cat <<EOF
{"name":"E2E Log ${UNIQUE}","creationDate":"${TIMESTAMP}","modificationDate":"${TIMESTAMP}",
 "isActive":true,"categoryCode":"risk-level","triggeredBy":"e2e-test",
 "itemsAddedCount":0,"itemsUpdatedCount":0,"itemsRemovedCount":0,
 "outcome":"SUCCESS","syncedAt":"${TIMESTAMP}","metadata":{"e2e":true}}
EOF
)
smoke_module "catalogsynclogs" "$P"

log_step 4 "UH-4 catalog-client"
smoke_catalog_client

log_step 5 "Kafka probe"
if command -v kcat >/dev/null 2>&1; then
  KT=$(kcat -b localhost:29092 -L 2>/dev/null | grep -Eo 'topic "[^"]*merchant[^"]*"' | head -10 || true)
  if [[ -n "$KT" ]]; then log_ok "Kafka topics merchant.* detectados"; else log_warn "Sin topics merchant.*"; fi
else log_warn "kcat no instalado — skipping"; fi

log_step 6 "Semantic search (pgvector + IA)"
# Por defecto semanticSearch=true; permite TEXTUAL_FALLBACK cuando no hay matches
SEM_RESP=$(do_get "$BASE_URL/merchants/query/semantic-search?q=E2E%20Merchant" "$AUTH")
SEM_CODE=$(extract_code "$SEM_RESP")
if [[ "$SEM_CODE" =~ ^(200|201)$ ]]; then
  MODE=$(echo "$SEM_RESP" | sed -n 's/.*"searchMode":"\([^"]*\)".*/\1/p' | head -1)
  if [[ "$MODE" =~ ^(SEMANTIC|TEXTUAL|TEXTUAL_FALLBACK)$ ]]; then
    log_ok "semantic-search OK ($SEM_CODE, mode=$MODE)"
  else
    log_fail "semantic-search no devolvió searchMode esperado"
  fi
else
  log_fail "semantic-search respondió $SEM_CODE"
fi

# Forzar modo textual: semanticSearch=false
SEM_TXT=$(do_get "$BASE_URL/merchants/query/semantic-search?q=E2E&semanticSearch=false" "$AUTH")
SEM_TXT_CODE=$(extract_code "$SEM_TXT")
SEM_TXT_MODE=$(echo "$SEM_TXT" | sed -n 's/.*"searchMode":"\([^"]*\)".*/\1/p' | head -1)
if [[ "$SEM_TXT_CODE" =~ ^(200|201)$ && "$SEM_TXT_MODE" == "TEXTUAL" ]]; then
  log_ok "semantic-search semanticSearch=false -> TEXTUAL"
else
  log_fail "semantic-search semanticSearch=false code=$SEM_TXT_CODE mode=$SEM_TXT_MODE"
fi

print_summary "merchant-service"
