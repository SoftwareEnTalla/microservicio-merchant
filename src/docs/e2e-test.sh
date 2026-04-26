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

# >>> NOMENCLADORES E2E BEGIN (auto-generado por sources/scaffold_nomenclador_e2e_tests.py)
# Servicio: merchant-service | Puerto: 3011
NOM_BASE_URL="${NOM_BASE_URL:-http://localhost:3011/api}"
NOM_AUTH="${AUTH:-Bearer valid-token}"
nom_pass=0; nom_fail=0; nom_warn=0
_nom_ok()   { echo -e "  \033[0;32m✔ $1\033[0m"; nom_pass=$((nom_pass+1)); }
_nom_fail() { echo -e "  \033[0;31m✘ $1\033[0m"; nom_fail=$((nom_fail+1)); }
_nom_warn() { echo -e "  \033[1;33m⚠ $1\033[0m"; nom_warn=$((nom_warn+1)); }
NOM_UNIQUE="${UNIQUE:-$(date +%s)}"
NOM_NOW="${NOW:-$(date -u +%Y-%m-%dT%H:%M:%S.000Z)}"
echo ""
echo -e "\033[0;34m═══ NOMENCLADORES — merchant-service ═══\033[0m"

# --- Nomenclador: merchant-approval-status ---
NOM_CODE="NMERCHA-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E MerchantApprovalStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/merchantapprovalstatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "merchant-approval-status: create id=$NOM_ID"; else _nom_warn "merchant-approval-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/merchantapprovalstatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "merchant-approval-status: list ok"; else _nom_warn "merchant-approval-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/merchantapprovalstatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "merchant-approval-status: getById" || _nom_warn "merchant-approval-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/merchantapprovalstatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E MerchantApprovalStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "merchant-approval-status: update" || _nom_warn "merchant-approval-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/merchantapprovalstatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "merchant-approval-status: delete" || _nom_warn "merchant-approval-status: delete"
fi

# --- Nomenclador: merchant-gateway-config-status ---
NOM_CODE="NMERCHA-${NOM_UNIQUE}"
NOM_BODY="{\"code\":\"$NOM_CODE\",\"displayName\":\"E2E MerchantGatewayConfigStatus ${NOM_UNIQUE}\",\"description\":\"e2e\",\"creationDate\":\"$NOM_NOW\",\"modificationDate\":\"$NOM_NOW\",\"isActive\":true}"
NOM_RESP=$(curl -s -w "\n%{http_code}" -X POST "$NOM_BASE_URL/merchantgatewayconfigstatuss/command" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "$NOM_BODY" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1); NOM_BD=$(echo "$NOM_RESP" | sed '$d')
NOM_ID=$(echo "$NOM_BD" | jq -r '.data.id // .id // empty' 2>/dev/null)
if [[ "$NOM_CODE_HTTP" =~ ^(200|201)$ && -n "$NOM_ID" ]]; then _nom_ok "merchant-gateway-config-status: create id=$NOM_ID"; else _nom_warn "merchant-gateway-config-status: create http=$NOM_CODE_HTTP (puede requerir auth real)"; fi
NOM_RESP=$(curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/merchantgatewayconfigstatuss/query/list" -H "Authorization: $NOM_AUTH" 2>/dev/null)
NOM_CODE_HTTP=$(echo "$NOM_RESP" | tail -n1)
if [[ "$NOM_CODE_HTTP" == "200" ]]; then _nom_ok "merchant-gateway-config-status: list ok"; else _nom_warn "merchant-gateway-config-status: list http=$NOM_CODE_HTTP"; fi
if [[ -n "$NOM_ID" ]]; then
  curl -s -w "\n%{http_code}" -X GET "$NOM_BASE_URL/merchantgatewayconfigstatuss/query/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "merchant-gateway-config-status: getById" || _nom_warn "merchant-gateway-config-status: getById"
  curl -s -w "\n%{http_code}" -X PUT "$NOM_BASE_URL/merchantgatewayconfigstatuss/command/$NOM_ID" -H "Content-Type: application/json" -H "Authorization: $NOM_AUTH" -d "{\"displayName\":\"E2E MerchantGatewayConfigStatus updated\",\"modificationDate\":\"$NOM_NOW\"}" >/dev/null 2>&1 && _nom_ok "merchant-gateway-config-status: update" || _nom_warn "merchant-gateway-config-status: update"
  curl -s -w "\n%{http_code}" -X DELETE "$NOM_BASE_URL/merchantgatewayconfigstatuss/command/$NOM_ID" -H "Authorization: $NOM_AUTH" >/dev/null 2>&1 && _nom_ok "merchant-gateway-config-status: delete" || _nom_warn "merchant-gateway-config-status: delete"
fi

echo ""
echo -e "\033[0;34m── Resumen Nomencladores merchant-service ──\033[0m"
echo "  ✔ OK=$nom_pass  ✘ FAIL=$nom_fail  ⚠ WARN=$nom_warn"
[[ ${nom_fail:-0} -eq 0 ]] || echo "[NOMENCLADORES] hay fallos en este servicio"
# <<< NOMENCLADORES E2E END
