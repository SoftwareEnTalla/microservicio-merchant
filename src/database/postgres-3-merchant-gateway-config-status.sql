-- ====================================================================
-- merchant_gateway_config_status_base_entity
-- NOMENCLADOR GESTIONABLE
-- Generado a partir de la promocion de enums inline a entidades XML
-- (regla seccion 4.9.6 de docs/help.md). CRUD CQRS completo.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ====================================================================
INSERT INTO "merchant_gateway_config_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('NOT_CONFIGURED', 'Not Configured', '', '{}'::jsonb, 'system', TRUE, 'merchantgatewayconfigstatus'),
  ('ONBOARDING', 'Onboarding', '', '{}'::jsonb, 'system', TRUE, 'merchantgatewayconfigstatus'),
  ('ACTIVE', 'Active', '', '{}'::jsonb, 'system', TRUE, 'merchantgatewayconfigstatus'),
  ('SUSPENDED', 'Suspended', '', '{}'::jsonb, 'system', TRUE, 'merchantgatewayconfigstatus'),
  ('ERROR', 'Error', '', '{}'::jsonb, 'system', TRUE, 'merchantgatewayconfigstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
