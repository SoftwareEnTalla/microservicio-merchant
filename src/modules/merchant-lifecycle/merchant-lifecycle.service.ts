import { Injectable, Optional } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

type MerchantLifecycleRow = {
  id: string;
  merchantCode: string | null;
  displayName: string | null;
  approvalStatus: string | null;
  collectionMethods: unknown;
  activeGatewayConfigs: number;
  healthyGatewayConfigs: number;
  gatewayConfigs: number;
  payoutReadinessStage: string;
  creationDate: string | null;
  modificationDate: string | null;
};

@Injectable()
export class MerchantLifecycleService {
  constructor(
    @Optional() @InjectDataSource() private readonly dataSource: DataSource | undefined,
  ) {}

  async getSummary(limit: number = 8): Promise<Record<string, unknown>> {
    const dataSource = this.resolveDataSource();
    if (!dataSource) {
      return {
        ok: true,
        message: 'Resumen táctico de merchant obtenido con éxito.',
        data: {
          totals: {
            totalMerchants: 0,
            approvedMerchants: 0,
            merchantsWithCollectionMethods: 0,
            merchantsWithConfiguredGateway: 0,
            merchantsWithHealthyGateway: 0,
            payoutReadyMerchants: 0,
            blockedMerchants: 0,
            gatewayConfigsTotal: 0,
            activeGatewayConfigs: 0,
            healthyGatewayConfigs: 0,
            approvalRatePercent: 0,
            gatewayHealthPercent: 0,
            operationalEligibilityPercent: 0,
            approvalSlaPercent: 0,
          },
          latest: [],
        },
      };
    }

    const safeLimit = Math.max(1, Math.min(limit, 20));
    const [totals] = await dataSource.query(
      `WITH merchant_rows AS (
         SELECT
           m.id,
           UPPER(COALESCE(m."approvalStatus", 'PENDING')) AS "approvalStatus",
           CASE
             WHEN m."collectionMethods" IS NULL THEN 0
             WHEN m."collectionMethods"::text IN ('{}', '[]', 'null') THEN 0
             ELSE 1
           END AS "collectionMethodCount",
           m."creationDate",
           m."modificationDate"
         FROM merchant_base_entity m
         WHERE COALESCE(m."isActive", true) = true
           AND COALESCE(m.type, 'merchant') = 'merchant'
       ),
       config_rows AS (
         SELECT
           cfg."merchantId" AS id,
           COUNT(*)::int AS "gatewayConfigs",
           COUNT(*) FILTER (WHERE COALESCE(cfg."isActive", false) = true)::int AS "activeGatewayConfigs",
           COUNT(*) FILTER (WHERE COALESCE(cfg."isActive", false) = true AND UPPER(COALESCE(cfg.status, '')) IN ('ACTIVE', 'CONFIGURED', 'ENABLED'))::int AS "healthyGatewayConfigs"
         FROM merchant_gateway_config_base_entity cfg
         WHERE COALESCE(cfg.type, 'merchantgatewayconfig') = 'merchantgatewayconfig'
         GROUP BY cfg."merchantId"
       )
       SELECT
         COUNT(*)::int AS "totalMerchants",
         COUNT(*) FILTER (WHERE mr."approvalStatus" IN ('APPROVED', 'ACTIVE', 'ENABLED'))::int AS "approvedMerchants",
         COUNT(*) FILTER (WHERE mr."collectionMethodCount" > 0)::int AS "merchantsWithCollectionMethods",
         COUNT(*) FILTER (WHERE COALESCE(cr."gatewayConfigs", 0) > 0)::int AS "merchantsWithConfiguredGateway",
         COUNT(*) FILTER (WHERE COALESCE(cr."healthyGatewayConfigs", 0) > 0)::int AS "merchantsWithHealthyGateway",
         COUNT(*) FILTER (
           WHERE mr."approvalStatus" IN ('APPROVED', 'ACTIVE', 'ENABLED')
             AND mr."collectionMethodCount" > 0
             AND COALESCE(cr."healthyGatewayConfigs", 0) > 0
         )::int AS "payoutReadyMerchants",
         COUNT(*) FILTER (
           WHERE NOT (
             mr."approvalStatus" IN ('APPROVED', 'ACTIVE', 'ENABLED')
             AND mr."collectionMethodCount" > 0
             AND COALESCE(cr."healthyGatewayConfigs", 0) > 0
           )
         )::int AS "blockedMerchants",
         COALESCE(SUM(cr."gatewayConfigs"), 0)::int AS "gatewayConfigsTotal",
         COALESCE(SUM(cr."activeGatewayConfigs"), 0)::int AS "activeGatewayConfigs",
         COALESCE(SUM(cr."healthyGatewayConfigs"), 0)::int AS "healthyGatewayConfigs",
         COUNT(*) FILTER (
           WHERE mr."approvalStatus" IN ('APPROVED', 'ACTIVE', 'ENABLED')
             AND COALESCE(mr."modificationDate", mr."creationDate") <= mr."creationDate" + INTERVAL '7 days'
         )::int AS "approvalWithinSlaMerchants"
       FROM merchant_rows mr
       LEFT JOIN config_rows cr ON cr.id = mr.id`,
    );

    const latest = await dataSource.query(
      `WITH config_rows AS (
         SELECT
           cfg."merchantId" AS id,
           COUNT(*)::int AS "gatewayConfigs",
           COUNT(*) FILTER (WHERE COALESCE(cfg."isActive", false) = true)::int AS "activeGatewayConfigs",
           COUNT(*) FILTER (WHERE COALESCE(cfg."isActive", false) = true AND UPPER(COALESCE(cfg.status, '')) IN ('ACTIVE', 'CONFIGURED', 'ENABLED'))::int AS "healthyGatewayConfigs"
         FROM merchant_gateway_config_base_entity cfg
         WHERE COALESCE(cfg.type, 'merchantgatewayconfig') = 'merchantgatewayconfig'
         GROUP BY cfg."merchantId"
       )
       SELECT
         m.id,
         m."merchantCode",
         m."displayName",
         m."approvalStatus",
         m."collectionMethods",
         COALESCE(cr."activeGatewayConfigs", 0)::int AS "activeGatewayConfigs",
         COALESCE(cr."healthyGatewayConfigs", 0)::int AS "healthyGatewayConfigs",
         COALESCE(cr."gatewayConfigs", 0)::int AS "gatewayConfigs",
         CASE
           WHEN UPPER(COALESCE(m."approvalStatus", 'PENDING')) NOT IN ('APPROVED', 'ACTIVE', 'ENABLED') THEN 'PENDING_APPROVAL'
           WHEN m."collectionMethods" IS NULL OR m."collectionMethods"::text IN ('{}', '[]', 'null') THEN 'MISSING_COLLECTION_METHOD'
           WHEN COALESCE(cr."healthyGatewayConfigs", 0) = 0 THEN 'GATEWAY_NOT_READY'
           ELSE 'READY_FOR_PAYOUT'
         END AS "payoutReadinessStage",
         m."creationDate",
         m."modificationDate"
       FROM merchant_base_entity m
       LEFT JOIN config_rows cr ON cr.id = m.id
       WHERE COALESCE(m."isActive", true) = true
         AND COALESCE(m.type, 'merchant') = 'merchant'
       ORDER BY COALESCE(m."modificationDate", m."creationDate") DESC
       LIMIT $1`,
      [safeLimit],
    );

    const totalMerchants = Number(totals?.totalMerchants ?? 0);
    const approvedMerchants = Number(totals?.approvedMerchants ?? 0);
    const payoutReadyMerchants = Number(totals?.payoutReadyMerchants ?? 0);
    const gatewayConfigsTotal = Number(totals?.gatewayConfigsTotal ?? 0);
    const healthyGatewayConfigs = Number(totals?.healthyGatewayConfigs ?? 0);

    return {
      ok: true,
      message: 'Resumen táctico de merchant obtenido con éxito.',
      data: {
        totals: {
          totalMerchants,
          approvedMerchants,
          merchantsWithCollectionMethods: Number(totals?.merchantsWithCollectionMethods ?? 0),
          merchantsWithConfiguredGateway: Number(totals?.merchantsWithConfiguredGateway ?? 0),
          merchantsWithHealthyGateway: Number(totals?.merchantsWithHealthyGateway ?? 0),
          payoutReadyMerchants,
          blockedMerchants: Number(totals?.blockedMerchants ?? 0),
          gatewayConfigsTotal,
          activeGatewayConfigs: Number(totals?.activeGatewayConfigs ?? 0),
          healthyGatewayConfigs,
          approvalRatePercent: totalMerchants > 0 ? Math.round((approvedMerchants / totalMerchants) * 100) : 0,
          gatewayHealthPercent: gatewayConfigsTotal > 0 ? Math.round((healthyGatewayConfigs / gatewayConfigsTotal) * 100) : 0,
          operationalEligibilityPercent: totalMerchants > 0 ? Math.round((payoutReadyMerchants / totalMerchants) * 100) : 0,
          approvalSlaPercent: approvedMerchants > 0 ? Math.round((Number(totals?.approvalWithinSlaMerchants ?? 0) / approvedMerchants) * 100) : 0,
        },
        latest: latest as MerchantLifecycleRow[],
      },
      count: Array.isArray(latest) ? latest.length : 0,
    };
  }

  private resolveDataSource(): DataSource | null {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    return null;
  }
}