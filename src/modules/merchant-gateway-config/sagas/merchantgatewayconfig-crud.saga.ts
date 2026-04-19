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


import { Injectable, Logger } from '@nestjs/common';
import { Saga, CommandBus, EventBus, ofType } from '@nestjs/cqrs';
import { Observable, map, tap } from 'rxjs';
import {
  MerchantGatewayConfigCreatedEvent,
  MerchantGatewayConfigUpdatedEvent,
  MerchantGatewayConfigDeletedEvent,
  MerchantGatewayConfigActivatedEvent,
  MerchantGatewayConfigDeactivatedEvent,
} from '../events/exporting.event';
import {
  SagaMerchantGatewayConfigFailedEvent
} from '../events/merchantgatewayconfig-failed.event';
import {
  CreateMerchantGatewayConfigCommand,
  UpdateMerchantGatewayConfigCommand,
  DeleteMerchantGatewayConfigCommand
} from '../commands/exporting.command';

//Logger - Codetrace
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

@Injectable()
export class MerchantGatewayConfigCrudSaga {
  private readonly logger = new Logger(MerchantGatewayConfigCrudSaga.name);

  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus
  ) {}

  // Reacción a evento de creación
  @Saga()
  onMerchantGatewayConfigCreated = ($events: Observable<MerchantGatewayConfigCreatedEvent>) => {
    return $events.pipe(
      ofType(MerchantGatewayConfigCreatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para creación de MerchantGatewayConfig: ${event.aggregateId}`);
        void this.handleMerchantGatewayConfigCreated(event);
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
  onMerchantGatewayConfigUpdated = ($events: Observable<MerchantGatewayConfigUpdatedEvent>) => {
    return $events.pipe(
      ofType(MerchantGatewayConfigUpdatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para actualización de MerchantGatewayConfig: ${event.aggregateId}`);
        void this.handleMerchantGatewayConfigUpdated(event);
      }),
      map(() => null)
    );
  };

  // Reacción a evento de eliminación
  @Saga()
  onMerchantGatewayConfigDeleted = ($events: Observable<MerchantGatewayConfigDeletedEvent>) => {
    return $events.pipe(
      ofType(MerchantGatewayConfigDeletedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para eliminación de MerchantGatewayConfig: ${event.aggregateId}`);
        void this.handleMerchantGatewayConfigDeleted(event);
      }),
      map(() => null),
      map(event => {
        // Ejemplo: Ejecutar comando de compensación
        // return this.commandBus.execute(new CompensateDeleteCommand(...));
        return null;
      })
    );
  };

  @Saga()
  onMerchantGatewayConfigActivated = ($events: Observable<MerchantGatewayConfigActivatedEvent>) => {
    return $events.pipe(
      ofType(MerchantGatewayConfigActivatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio MerchantGatewayConfigActivated: ${event.aggregateId}`);
      }),
      map(() => null)
    );
  };

  @Saga()
  onMerchantGatewayConfigDeactivated = ($events: Observable<MerchantGatewayConfigDeactivatedEvent>) => {
    return $events.pipe(
      ofType(MerchantGatewayConfigDeactivatedEvent),
      tap(event => {
        this.logger.log(`Saga iniciada para evento de dominio MerchantGatewayConfigDeactivated: ${event.aggregateId}`);
      }),
      map(() => null)
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
      .registerClient(MerchantGatewayConfigCrudSaga.name)
      .get(MerchantGatewayConfigCrudSaga.name),
  })
  private async handleMerchantGatewayConfigCreated(event: MerchantGatewayConfigCreatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga MerchantGatewayConfig Created completada: ${event.aggregateId}`);
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
      .registerClient(MerchantGatewayConfigCrudSaga.name)
      .get(MerchantGatewayConfigCrudSaga.name),
  })
  private async handleMerchantGatewayConfigUpdated(event: MerchantGatewayConfigUpdatedEvent): Promise<void> {
    try {
      this.logger.log(`Saga MerchantGatewayConfig Updated completada: ${event.aggregateId}`);
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
      .registerClient(MerchantGatewayConfigCrudSaga.name)
      .get(MerchantGatewayConfigCrudSaga.name),
  })
  private async handleMerchantGatewayConfigDeleted(event: MerchantGatewayConfigDeletedEvent): Promise<void> {
    try {
      this.logger.log(`Saga MerchantGatewayConfig Deleted completada: ${event.aggregateId}`);
    } catch (error: any) {
      this.handleSagaError(error, event);
    }
  }

  // Método para manejo de errores en sagas
  private handleSagaError(error: Error, event: any) {
    this.logger.error(`Error en saga para evento ${event.constructor.name}: ${error.message}`);
    this.eventBus.publish(new SagaMerchantGatewayConfigFailedEvent( error,event));
  }
}
