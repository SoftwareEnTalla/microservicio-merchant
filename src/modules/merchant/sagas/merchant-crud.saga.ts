/*
 * Copyright (c) 2026 SoftwarEnTalla
 * Licencia: MIT
 * Contacto: softwarentalla@gmail.com
 * CEOs: 
 *       Persy Morell Guerra      Email: pmorellpersi@gmail.com  Phone : +53-5336-4654 Linkedin: https://www.linkedin.com/in/persy-morell-guerra-288943357/
 *       Dailyn García Domínguez  Email: dailyngd@gmail.com      Phone : +53-5432-0312 Linkedin: https://www.linkedin.com/in/dailyn-dominguez-3150799b/
 *
 * CTO: Persy Morell Guerra
 * COO: Dailyn García Domínguez and Persy Morell Guerra
 * CFO: Dailyn García Domínguez and Persy Morell Guerra
 *
 * Repositories: 
 *               https://github.com/SoftwareEnTalla 
 *
 *               https://github.com/apokaliptolesamale?tab=repositories
 *
 *
 * Social Networks:
 *
 *              https://x.com/SoftwarEnTalla
 *
 *              https://www.facebook.com/profile.php?id=61572625716568
 *
 *              https://www.instagram.com/softwarentalla/
 *              
 *
 *
 */


import { Injectable, Logger, Optional } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  MerchantCreatedEvent,
  MerchantUpdatedEvent,
  MerchantDeletedEvent,

} from '../events/exporting.event';
import {
  SagaMerchantFailedEvent
} from '../events/merchant-failed.event';
import {
  CreateMerchantCommand,
  UpdateMerchantCommand,
  DeleteMerchantCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';
import { CatalogSyncLog } from '../../catalog-sync-log/entities/catalog-sync-log.entity';

@Injectable()
export class MerchantCrudSaga {
  private readonly logger = new Logger(MerchantCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    @Optional() @InjectDataSource() private readonly dataSource: DataSource | undefined,
  ) {}

  // Reacción a evento de creación
  @Saga()
  onMerchantCreated = ($events: Observable<MerchantCreatedEvent>) => {
    return $events.pipe(
      ofType(MerchantCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de Merchant: ${event.aggregateId}`);
        void this.handleMerchantCreated(event);
      }),
      map(() => null),
      map(event => {
        // Ejecutar comandos adicionales si es necesario
        return null;
      })
    );
  };

  // Reacción a evento de actualización
  @Saga()
  onMerchantUpdated = ($events: Observable<MerchantUpdatedEvent>) => {
    return $events.pipe(
      ofType(MerchantUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de Merchant: ${event.aggregateId}`);
        void this.handleMerchantUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onMerchantDeleted = ($events: Observable<MerchantDeletedEvent>) => {
    return $events.pipe(
      ofType(MerchantDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de Merchant: ${event.aggregateId}`);
        void this.handleMerchantDeleted(event);
      }),
      map(() => null),
      map(event => {
        // Ejemplo: Ejecutar comando de compensación
        // return this.commandBus.execute(new CompensateDeleteCommand(...));
        return null;
      })
    );
  };



  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantCrudSaga.name)
      .get(MerchantCrudSaga.name),
  })
  private async handleMerchantCreated(event: MerchantCreatedEvent): Promise<void> {
    try {
      await this.persistLifecycleSnapshot('CREATED', event);
      this.logger.log(`Saga Merchant Created completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }


  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantCrudSaga.name)
      .get(MerchantCrudSaga.name),
  })
  private async handleMerchantUpdated(event: MerchantUpdatedEvent): Promise<void> {
    try {
      await this.persistLifecycleSnapshot('UPDATED', event);
      this.logger.log(`Saga Merchant Updated completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }


  @LogExecutionTime({
    layer: 'saga',
    callback: async (logData, client) => {
      try {
        logger.info('Codetrace saga event:', [logData, client]);
        return await client.send(logData);
      } catch (error) {
        logger.info('Error enviando traza de saga:', logData);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantCrudSaga.name)
      .get(MerchantCrudSaga.name),
  })
  private async handleMerchantDeleted(event: MerchantDeletedEvent): Promise<void> {
    try {
      await this.persistLifecycleSnapshot('DELETED', event);
      this.logger.log(`Saga Merchant Deleted completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaMerchantFailedEvent( error,event));
  }

  private async persistLifecycleSnapshot(
    action: 'CREATED' | 'UPDATED' | 'DELETED',
    event: MerchantCreatedEvent | MerchantUpdatedEvent | MerchantDeletedEvent,
  ): Promise<void> {
    const dataSource = this.resolveDataSource();
    if (!dataSource) {
      this.logger.warn(`Saga Merchant sin DataSource para persistir lifecycle snapshot de ${event.aggregateId}`);
      return;
    }

    const snapshot = this.extractSnapshot(event);
    const readinessStage = this.deriveReadinessStage(snapshot, action);
    const metadata = (event as any)?.payload?.metadata || {};
    const repository = dataSource.getRepository(CatalogSyncLog);

    await repository.save(
      repository.create({
        name: `Merchant lifecycle ${action.toLowerCase()} ${event.aggregateId}`,
        description: `Snapshot operativo generado por MerchantCrudSaga tras ${action.toLowerCase()} de merchant.`,
        categoryCode: 'MERCHANT_LIFECYCLE',
        triggeredBy: `MERCHANT_SAGA_${action}`,
        itemsAddedCount: action === 'CREATED' ? 1 : 0,
        itemsUpdatedCount: action === 'UPDATED' ? 1 : 0,
        itemsRemovedCount: action === 'DELETED' ? 1 : 0,
        diffSnapshot: {
          added: action === 'CREATED' ? [event.aggregateId] : [],
          updated: action === 'UPDATED' ? [event.aggregateId] : [],
          removed: action === 'DELETED' ? [event.aggregateId] : [],
        },
        reason: `Merchant ${event.aggregateId} ${action.toLowerCase()} y quedó en ${readinessStage}.`,
        catalogVersion: 'merchant-saga-v1',
        catalogHash: String(metadata.correlationId || event.aggregateId).slice(0, 80),
        durationMs: 0,
        outcome: readinessStage,
        syncedAt: new Date(),
        metadata: {
          merchantId: event.aggregateId,
          approvalStatus: snapshot?.approvalStatus || null,
          hasBankAccounts: this.hasStructuredContent(snapshot?.bankAccounts),
          hasCollectionMethods: this.hasStructuredContent(snapshot?.collectionMethods),
          readinessStage,
          correlationId: metadata.correlationId || null,
        },
        createdBy: metadata.initiatedBy || 'system',
        isActive: true,
      } as any),
    );
  }

  private extractSnapshot(event: MerchantCreatedEvent | MerchantUpdatedEvent | MerchantDeletedEvent): Record<string, any> {
    return (event as any)?.payload?.instance || {};
  }

  private deriveReadinessStage(snapshot: Record<string, any>, action: 'CREATED' | 'UPDATED' | 'DELETED'): string {
    if (action === 'DELETED') {
      return 'MERCHANT_DELETED';
    }

    const approvalStatus = String(snapshot?.approvalStatus || 'PENDING').toUpperCase();
    if (!['APPROVED', 'ACTIVE', 'ENABLED'].includes(approvalStatus)) {
      return 'PENDING_APPROVAL';
    }
    if (!this.hasStructuredContent(snapshot?.bankAccounts) || !this.hasStructuredContent(snapshot?.collectionMethods)) {
      return 'PROFILE_INCOMPLETE';
    }

    return 'READY_FOR_GATEWAY_CONFIG';
  }

  private hasStructuredContent(value: unknown): boolean {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (value && typeof value === 'object') {
      return Object.keys(value as Record<string, unknown>).length > 0;
    }

    return Boolean(value);
  }

  private resolveDataSource(): DataSource | null {
    if (this.dataSource?.isInitialized) {
      return this.dataSource;
    }

    return null;
  }
}
