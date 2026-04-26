/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 *
 * NomencladorListenersModule — registra los listeners on<Nomenclador>Change
 * para todos los nomencladores referenciados por las entidades de este
 * microservicio. Se importa una sola vez desde app.module.ts.
 *
 * Generado por sources/scaffold_nomenclador_listeners.py — NO editar a mano.
 */

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { OnApprovalStatusChangeListener } from './on-approval-status-change.listener';
import { OnMerchantGatewayConfigStatusChangeListener } from './on-merchant-gateway-config-status-change.listener';
import { OnSettlementModeChangeListener } from './on-settlement-mode-change.listener';

@Module({
  imports: [ConfigModule, CqrsModule],
  providers: [
    OnApprovalStatusChangeListener,
    OnMerchantGatewayConfigStatusChangeListener,
    OnSettlementModeChangeListener,
  ],
  exports: [
    OnApprovalStatusChangeListener,
    OnMerchantGatewayConfigStatusChangeListener,
    OnSettlementModeChangeListener,
  ],
})
export class NomencladorListenersModule {}
