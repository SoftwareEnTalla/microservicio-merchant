-- ════════════════════════════════════════════════════════════════════
-- merchant_approval_status_base_entity
-- NOMENCLADOR PROPIO DEL MICROSERVICIO
-- Justificación: único consumidor en el ecosistema. Si en el futuro
-- aparece un segundo consumidor, se promueve a catalog-service según
-- la regla §4.9.6 de docs/help.md.
-- Idempotente: INSERT ... ON CONFLICT (code) DO UPDATE.
-- ════════════════════════════════════════════════════════════════════
INSERT INTO "merchant_approval_status_base_entity" ("code", "displayName", "description", "metadata", "createdBy", "isActive", "type")
VALUES
  ('DRAFT', 'Borrador', 'Comercio en preparación', jsonb_build_object('description','Comercio en preparación'), 'system', TRUE, 'merchantapprovalstatus'),
  ('PENDING', 'Pendiente', 'Pendiente de revisión', jsonb_build_object('description','Pendiente de revisión'), 'system', TRUE, 'merchantapprovalstatus'),
  ('APPROVED', 'Aprobado', 'Comercio aprobado y operativo', jsonb_build_object('description','Comercio aprobado y operativo'), 'system', TRUE, 'merchantapprovalstatus'),
  ('REJECTED', 'Rechazado', 'Solicitud rechazada', jsonb_build_object('description','Solicitud rechazada'), 'system', TRUE, 'merchantapprovalstatus'),
  ('SUSPENDED', 'Suspendido', 'Operaciones suspendidas', jsonb_build_object('description','Operaciones suspendidas'), 'system', TRUE, 'merchantapprovalstatus')
ON CONFLICT ("code") DO UPDATE SET
  "displayName"      = EXCLUDED."displayName",
  "description"      = EXCLUDED."description",
  "metadata"         = EXCLUDED."metadata",
  "isActive"           = TRUE,
  "modificationDate" = NOW();
