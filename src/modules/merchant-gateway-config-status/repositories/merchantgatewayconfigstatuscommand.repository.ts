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
import { Injectable, NotFoundException, Optional, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeleteResult,
  Repository,
  UpdateResult,
} from 'typeorm';


import { BaseEntity } from '../entities/base.entity';
import { MerchantGatewayConfigStatus } from '../entities/merchant-gateway-config-status.entity';
import { MerchantGatewayConfigStatusQueryRepository } from './merchantgatewayconfigstatusquery.repository';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {MerchantGatewayConfigStatusRepository} from './merchantgatewayconfigstatus.repository';

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

//Events and EventHandlers
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { MerchantGatewayConfigStatusCreatedEvent } from '../events/merchantgatewayconfigstatuscreated.event';
import { MerchantGatewayConfigStatusUpdatedEvent } from '../events/merchantgatewayconfigstatusupdated.event';
import { MerchantGatewayConfigStatusDeletedEvent } from '../events/merchantgatewayconfigstatusdeleted.event';


//Enfoque Event Sourcing
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { EventStoreService } from '../shared/event-store/event-store.service';
import { KafkaEventPublisher } from '../shared/adapters/kafka-event-publisher';
import { BaseEvent } from '../events/base.event';

//Event Sourcing Config
import { EventSourcingHelper } from '../shared/decorators/event-sourcing.helper';
import { EventSourcingConfigOptions } from '../shared/decorators/event-sourcing.decorator';


@EventsHandler(MerchantGatewayConfigStatusCreatedEvent, MerchantGatewayConfigStatusUpdatedEvent, MerchantGatewayConfigStatusDeletedEvent)
@Injectable()
export class MerchantGatewayConfigStatusCommandRepository implements IEventHandler<BaseEvent>{

  //Constructor del repositorio de datos: MerchantGatewayConfigStatusCommandRepository
  constructor(
    @InjectRepository(MerchantGatewayConfigStatus)
    private readonly repository: Repository<MerchantGatewayConfigStatus>,
    private readonly merchantgatewayconfigstatusRepository: MerchantGatewayConfigStatusQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private readonly eventBus: EventBus,
    @Optional() @Inject('EVENT_SOURCING_CONFIG') 
    private readonly eventSourcingConfig: EventSourcingConfigOptions = EventSourcingHelper.getDefaultConfig()
  ) {
    this.validate();
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantGatewayConfigStatusRepository.name)
      .get(MerchantGatewayConfigStatusRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(MerchantGatewayConfigStatus.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${MerchantGatewayConfigStatus.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
      );
    }
  }

  // Helper para determinar si usar Event Sourcing
  private shouldPublishEvent(): boolean {
    return EventSourcingHelper.shouldPublishEvents(this.eventSourcingConfig);
  }

  private shouldUseProjections(): boolean {
    return EventSourcingHelper.shouldUseProjections(this.eventSourcingConfig);
  }


  // ----------------------------
  // MÉTODOS DE PROYECCIÓN (Event Handlers) para enfoque Event Sourcing
  // ----------------------------

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantGatewayConfigStatusRepository.name)
      .get(MerchantGatewayConfigStatusRepository.name),
  })
  async handle(event: any) {
    // Solo manejar eventos si las proyecciones están habilitadas
    if (!this.shouldUseProjections()) {
      logger.debug('Projections are disabled, skipping event handling');
      return false;
    }
    
    logger.info('Ready to handle MerchantGatewayConfigStatus event on repository:', event);
    switch (event.constructor.name) {
      case 'MerchantGatewayConfigStatusCreatedEvent':
        return await this.onMerchantGatewayConfigStatusCreated(event);
      case 'MerchantGatewayConfigStatusUpdatedEvent':
        return await this.onMerchantGatewayConfigStatusUpdated(event);
      case 'MerchantGatewayConfigStatusDeletedEvent':
        return await this.onMerchantGatewayConfigStatusDeleted(event);

    }
    return false;
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantGatewayConfigStatusRepository.name)
      .get(MerchantGatewayConfigStatusRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<MerchantGatewayConfigStatus>('createMerchantGatewayConfigStatus', args[0], args[1]),
    ttl: 60,
  })
  private async onMerchantGatewayConfigStatusCreated(event: MerchantGatewayConfigStatusCreatedEvent) {
    logger.info('Ready to handle onMerchantGatewayConfigStatusCreated event on repository:', event);
    const entity = new MerchantGatewayConfigStatus();
    entity.id = event.aggregateId;
    Object.assign(entity, event.payload.instance);
    // Asegurar que el tipo discriminador esté establecido
    if (!entity.type) {
      entity.type = 'merchantgatewayconfigstatus';
    }
    logger.info('Ready to save entity from event\'s payload:', entity);
    return await this.repository.save(entity);
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantGatewayConfigStatusRepository.name)
      .get(MerchantGatewayConfigStatusRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<MerchantGatewayConfigStatus>('updateMerchantGatewayConfigStatus', args[0], args[1]),
    ttl: 60,
  })
  private async onMerchantGatewayConfigStatusUpdated(event: MerchantGatewayConfigStatusUpdatedEvent) {
    logger.info('Ready to handle onMerchantGatewayConfigStatusUpdated event on repository:', event);
    return await this.repository.update(
      event.aggregateId,
      event.payload.instance
    );
  }

  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantGatewayConfigStatusRepository.name)
      .get(MerchantGatewayConfigStatusRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<MerchantGatewayConfigStatus>('deleteMerchantGatewayConfigStatus', args[0], args[1]),
    ttl: 60,
  })
  private async onMerchantGatewayConfigStatusDeleted(event: MerchantGatewayConfigStatusDeletedEvent) {
    logger.info('Ready to handle onMerchantGatewayConfigStatusDeleted event on repository:', event);
    return await this.repository.delete(event.aggregateId);
  }



  // ----------------------------
  // MÉTODOS CRUD TRADICIONALES (Compatibilidad)
  // ----------------------------
 
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantGatewayConfigStatusRepository.name)
      .get(MerchantGatewayConfigStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<MerchantGatewayConfigStatus>('createMerchantGatewayConfigStatus',args[0], args[1]), ttl: 60 })
  async create(entity: MerchantGatewayConfigStatus): Promise<MerchantGatewayConfigStatus> {
    logger.info('Ready to create MerchantGatewayConfigStatus on repository:', entity);
    
    // Asegurar que el tipo discriminador esté establecido antes de guardar
    if (!entity.type) {
      entity.type = 'merchantgatewayconfigstatus';
    }
    
    const result = await this.repository.save(entity);
    logger.info('New instance of MerchantGatewayConfigStatus was created with id:'+ result.id+' on repository:', result);
    
    // Publicar evento al EventBus local (sagas) y a Kafka si está habilitado
    if (this.shouldPublishEvent()) {
      const event = new MerchantGatewayConfigStatusCreatedEvent(result.id, {
        instance: result,
        metadata: {
          initiatedBy: result.creator,
          correlationId: result.id,
        },
      });
      this.eventBus.publish(event);
      this.eventPublisher.publish(event);
    }
    return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantGatewayConfigStatusRepository.name)
      .get(MerchantGatewayConfigStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<MerchantGatewayConfigStatus[]>('createMerchantGatewayConfigStatuss',args[0], args[1]), ttl: 60 })
  async bulkCreate(entities: MerchantGatewayConfigStatus[]): Promise<MerchantGatewayConfigStatus[]> {
    logger.info('Ready to create MerchantGatewayConfigStatus on repository:', entities);
    
    // Asegurar que el tipo discriminador esté establecido para todas las entidades
    entities.forEach(entity => {
      if (!entity.type) {
        entity.type = 'merchantgatewayconfigstatus';
      }
    });
    
    const result = await this.repository.save(entities);
    logger.info('New '+entities.length+' instances of MerchantGatewayConfigStatus was created on repository:', result);
    
    // Publicar eventos al EventBus local (sagas) y a Kafka si está habilitado
    if (this.shouldPublishEvent()) {
      const events = result.map((el) => new MerchantGatewayConfigStatusCreatedEvent(el.id, {
        instance: el,
        metadata: {
          initiatedBy: el.creator,
          correlationId: el.id,
        },
      }));
      events.forEach(event => this.eventBus.publish(event));
      this.eventPublisher.publishAll(events);
    }
    return result;
  }

  
  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantGatewayConfigStatusRepository.name)
      .get(MerchantGatewayConfigStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<MerchantGatewayConfigStatus>('updateMerchantGatewayConfigStatus',args[0], args[1]), ttl: 60 })
  async update(
    id: string,
    partialEntity: Partial<MerchantGatewayConfigStatus>
  ): Promise<MerchantGatewayConfigStatus | null> {
    logger.info('Ready to update MerchantGatewayConfigStatus on repository:', partialEntity);
    let result = await this.repository.update(id, partialEntity);
    logger.info('update MerchantGatewayConfigStatus on repository was successfully :', partialEntity);
    let instance=await this.merchantgatewayconfigstatusRepository.findById(id);
    logger.info('Updated instance of MerchantGatewayConfigStatus with id: ${id} was finded on repository:', instance);
    
    if(instance && this.shouldPublishEvent()) {
      logger.info('Ready to publish or fire event MerchantGatewayConfigStatusUpdatedEvent on repository:', instance);
      const event = new MerchantGatewayConfigStatusUpdatedEvent(instance.id, {
          instance: instance,
          metadata: {
            initiatedBy: instance.createdBy || 'system',
            correlationId: id,
          },
        });
      this.eventBus.publish(event);
      this.eventPublisher.publish(event);
    }   
    return instance;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantGatewayConfigStatusRepository.name)
      .get(MerchantGatewayConfigStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<MerchantGatewayConfigStatus[]>('updateMerchantGatewayConfigStatuss',args[0], args[1]), ttl: 60 })
  async bulkUpdate(entities: Partial<MerchantGatewayConfigStatus>[]): Promise<MerchantGatewayConfigStatus[]> {
    const updatedEntities: MerchantGatewayConfigStatus[] = [];
    logger.info('Ready to update '+entities.length+' entities on repository:', entities);
    
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
          if (this.shouldPublishEvent()) {
            const updateEvent = new MerchantGatewayConfigStatusUpdatedEvent(updatedEntity.id, {
                instance: updatedEntity,
                metadata: {
                  initiatedBy: updatedEntity.createdBy || 'system',
                  correlationId: entity.id,
                },
              });
            this.eventBus.publish(updateEvent);
            this.eventPublisher.publish(updateEvent);
          }
        }
      }
    }
    logger.info('Already updated '+updatedEntities.length+' entities on repository:', updatedEntities);
    return updatedEntities;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantGatewayConfigStatusRepository.name)
      .get(MerchantGatewayConfigStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string>('deleteMerchantGatewayConfigStatus',args[0]), ttl: 60 })
  async delete(id: string): Promise<DeleteResult> {
     logger.info('Ready to delete entity with id: ${id} on repository:', id);
     const entity = await this.merchantgatewayconfigstatusRepository.findOne({ id });
     if(!entity){
      throw new NotFoundException(`No se encontro el id: ${id}`);
     }
     const result = await this.repository.delete({ id });
     logger.info('Entity deleted with id: ${id} on repository:', result);
     
     if (this.shouldPublishEvent()) {
       logger.info('Ready to publish/fire MerchantGatewayConfigStatusDeletedEvent on repository:', result);
       const event = new MerchantGatewayConfigStatusDeletedEvent(id, {
        instance: entity,
        metadata: {
          initiatedBy: entity.createdBy || 'system',
          correlationId: entity.id,
        },
      });
       this.eventBus.publish(event);
       this.eventPublisher.publish(event);
     }
     return result;
  }


  @LogExecutionTime({
    layer: 'repository',
    callback: async (logData, client) => {
      try{
        logger.info('Información del cliente y datos a enviar:',[logData,client]);
        return await client.send(logData);
      }
      catch(error){
        logger.info('Ha ocurrido un error al enviar la traza de log: ', logData);
        logger.info('ERROR-LOG: ', error);
        throw error;
      }
    },
    client: LoggerClient.getInstance()
      .registerClient(MerchantGatewayConfigStatusRepository.name)
      .get(MerchantGatewayConfigStatusRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string[]>('deleteMerchantGatewayConfigStatuss',args[0]), ttl: 60 })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
    const result = await this.repository.delete(ids);
    logger.info('Already deleted '+ids.length+' entities on repository:', result);
    
    if (this.shouldPublishEvent()) {
      logger.info('Ready to publish/fire MerchantGatewayConfigStatusDeletedEvent on repository:', result);
      const deleteEvents = await Promise.all(ids.map(async (id) => {
          const entity = await this.merchantgatewayconfigstatusRepository.findOne({ id });
          if(!entity){
            throw new NotFoundException(`No se encontro el id: ${id}`);
          }
          return new MerchantGatewayConfigStatusDeletedEvent(id, {
            instance: entity,
            metadata: {
              initiatedBy: entity.createdBy || 'system',
              correlationId: entity.id,
            },
          });
        }));
      deleteEvents.forEach(event => this.eventBus.publish(event));
      this.eventPublisher.publishAll(deleteEvents);
    }
    return result;
  }
}


