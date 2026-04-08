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
import { MerchantGatewayConfig } from '../entities/merchant-gateway-config.entity';
import { MerchantGatewayConfigQueryRepository } from './merchantgatewayconfigquery.repository';
import { generateCacheKey } from 'src/utils/functions';
import { Cacheable } from '../decorators/cache.decorator';
import {MerchantGatewayConfigRepository} from './merchantgatewayconfig.repository';

//Logger
import { LogExecutionTime } from 'src/common/logger/loggers.functions';
import { LoggerClient } from 'src/common/logger/logger.client';
import { logger } from '@core/logs/logger';

//Events and EventHandlers
import { IEventHandler, EventsHandler } from '@nestjs/cqrs';
import { MerchantGatewayConfigCreatedEvent } from '../events/merchantgatewayconfigcreated.event';
import { MerchantGatewayConfigUpdatedEvent } from '../events/merchantgatewayconfigupdated.event';
import { MerchantGatewayConfigDeletedEvent } from '../events/merchantgatewayconfigdeleted.event';


//Enfoque Event Sourcing
import { CommandBus } from '@nestjs/cqrs';
import { EventStoreService } from '../shared/event-store/event-store.service';
import { KafkaEventPublisher } from '../shared/adapters/kafka-event-publisher';
import { BaseEvent } from '../events/base.event';

//Event Sourcing Config
import { EventSourcingHelper } from '../shared/decorators/event-sourcing.helper';
import { EventSourcingConfigOptions } from '../shared/decorators/event-sourcing.decorator';


@EventsHandler(MerchantGatewayConfigCreatedEvent, MerchantGatewayConfigUpdatedEvent, MerchantGatewayConfigDeletedEvent)
@Injectable()
export class MerchantGatewayConfigCommandRepository implements IEventHandler<BaseEvent>{

  //Constructor del repositorio de datos: MerchantGatewayConfigCommandRepository
  constructor(
    @InjectRepository(MerchantGatewayConfig)
    private readonly repository: Repository<MerchantGatewayConfig>,
    private readonly merchantgatewayconfigRepository: MerchantGatewayConfigQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
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
      .registerClient(MerchantGatewayConfigRepository.name)
      .get(MerchantGatewayConfigRepository.name),
  })
  private validate(): void {
    const entityInstance = Object.create(MerchantGatewayConfig.prototype);

    if (!(entityInstance instanceof BaseEntity)) {
      throw new Error(
        `El tipo ${MerchantGatewayConfig.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`
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
      .registerClient(MerchantGatewayConfigRepository.name)
      .get(MerchantGatewayConfigRepository.name),
  })
  async handle(event: any) {
    // Solo manejar eventos si las proyecciones están habilitadas
    if (!this.shouldUseProjections()) {
      logger.debug('Projections are disabled, skipping event handling');
      return false;
    }
    
    logger.info('Ready to handle MerchantGatewayConfig event on repository:', event);
    switch (event.constructor.name) {
      case 'MerchantGatewayConfigCreatedEvent':
        return await this.onMerchantGatewayConfigCreated(event);
      case 'MerchantGatewayConfigUpdatedEvent':
        return await this.onMerchantGatewayConfigUpdated(event);
      case 'MerchantGatewayConfigDeletedEvent':
        return await this.onMerchantGatewayConfigDeleted(event);

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
      .registerClient(MerchantGatewayConfigRepository.name)
      .get(MerchantGatewayConfigRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<MerchantGatewayConfig>('createMerchantGatewayConfig', args[0], args[1]),
    ttl: 60,
  })
  private async onMerchantGatewayConfigCreated(event: MerchantGatewayConfigCreatedEvent) {
    logger.info('Ready to handle onMerchantGatewayConfigCreated event on repository:', event);
    const entity = new MerchantGatewayConfig();
    entity.id = event.aggregateId;
    Object.assign(entity, event.payload.instance);
    // Asegurar que el tipo discriminador esté establecido
    if (!entity.type) {
      entity.type = 'merchantgatewayconfig';
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
      .registerClient(MerchantGatewayConfigRepository.name)
      .get(MerchantGatewayConfigRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<MerchantGatewayConfig>('updateMerchantGatewayConfig', args[0], args[1]),
    ttl: 60,
  })
  private async onMerchantGatewayConfigUpdated(event: MerchantGatewayConfigUpdatedEvent) {
    logger.info('Ready to handle onMerchantGatewayConfigUpdated event on repository:', event);
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
      .registerClient(MerchantGatewayConfigRepository.name)
      .get(MerchantGatewayConfigRepository.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<MerchantGatewayConfig>('deleteMerchantGatewayConfig', args[0], args[1]),
    ttl: 60,
  })
  private async onMerchantGatewayConfigDeleted(event: MerchantGatewayConfigDeletedEvent) {
    logger.info('Ready to handle onMerchantGatewayConfigDeleted event on repository:', event);
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
      .registerClient(MerchantGatewayConfigRepository.name)
      .get(MerchantGatewayConfigRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<MerchantGatewayConfig>('createMerchantGatewayConfig',args[0], args[1]), ttl: 60 })
  async create(entity: MerchantGatewayConfig): Promise<MerchantGatewayConfig> {
    logger.info('Ready to create MerchantGatewayConfig on repository:', entity);
    
    // Asegurar que el tipo discriminador esté establecido antes de guardar
    if (!entity.type) {
      entity.type = 'merchantgatewayconfig';
    }
    
    const result = await this.repository.save(entity);
    logger.info('New instance of MerchantGatewayConfig was created with id:'+ result.id+' on repository:', result);
    
    // Publicar evento solo si Event Sourcing está habilitado
    if (this.shouldPublishEvent()) {
      this.eventPublisher.publish(new MerchantGatewayConfigCreatedEvent(result.id, {
        instance: result,
        metadata: {
          initiatedBy: result.creator,
          correlationId: result.id,
        },
      }));
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
      .registerClient(MerchantGatewayConfigRepository.name)
      .get(MerchantGatewayConfigRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<MerchantGatewayConfig[]>('createMerchantGatewayConfigs',args[0], args[1]), ttl: 60 })
  async bulkCreate(entities: MerchantGatewayConfig[]): Promise<MerchantGatewayConfig[]> {
    logger.info('Ready to create MerchantGatewayConfig on repository:', entities);
    
    // Asegurar que el tipo discriminador esté establecido para todas las entidades
    entities.forEach(entity => {
      if (!entity.type) {
        entity.type = 'merchantgatewayconfig';
      }
    });
    
    const result = await this.repository.save(entities);
    logger.info('New '+entities.length+' instances of MerchantGatewayConfig was created on repository:', result);
    
    // Publicar eventos solo si Event Sourcing está habilitado
    if (this.shouldPublishEvent()) {
      this.eventPublisher.publishAll(result.map((el)=>new MerchantGatewayConfigCreatedEvent(el.id, {
        instance: el,
        metadata: {
          initiatedBy: el.creator,
          correlationId: el.id,
        },
      })));
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
      .registerClient(MerchantGatewayConfigRepository.name)
      .get(MerchantGatewayConfigRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<MerchantGatewayConfig>('updateMerchantGatewayConfig',args[0], args[1]), ttl: 60 })
  async update(
    id: string,
    partialEntity: Partial<MerchantGatewayConfig>
  ): Promise<MerchantGatewayConfig | null> {
    logger.info('Ready to update MerchantGatewayConfig on repository:', partialEntity);
    let result = await this.repository.update(id, partialEntity);
    logger.info('update MerchantGatewayConfig on repository was successfully :', partialEntity);
    let instance=await this.merchantgatewayconfigRepository.findById(id);
    logger.info('Updated instance of MerchantGatewayConfig with id: ${id} was finded on repository:', instance);
    
    if(instance && this.shouldPublishEvent()) {
      logger.info('Ready to publish or fire event MerchantGatewayConfigUpdatedEvent on repository:', instance);
      this.eventPublisher.publish(new MerchantGatewayConfigUpdatedEvent(instance.id, {
          instance: instance,
          metadata: {
            initiatedBy: instance.createdBy || 'system',
            correlationId: id,
          },
        }));
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
      .registerClient(MerchantGatewayConfigRepository.name)
      .get(MerchantGatewayConfigRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<MerchantGatewayConfig[]>('updateMerchantGatewayConfigs',args[0], args[1]), ttl: 60 })
  async bulkUpdate(entities: Partial<MerchantGatewayConfig>[]): Promise<MerchantGatewayConfig[]> {
    const updatedEntities: MerchantGatewayConfig[] = [];
    logger.info('Ready to update '+entities.length+' entities on repository:', entities);
    
    for (const entity of entities) {
      if (entity.id) {
        const updatedEntity = await this.update(entity.id, entity);
        if (updatedEntity) {
          updatedEntities.push(updatedEntity);
          if (this.shouldPublishEvent()) {
            this.eventPublisher.publish(new MerchantGatewayConfigUpdatedEvent(updatedEntity.id, {
                instance: updatedEntity,
                metadata: {
                  initiatedBy: updatedEntity.createdBy || 'system',
                  correlationId: entity.id,
                },
              }));
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
      .registerClient(MerchantGatewayConfigRepository.name)
      .get(MerchantGatewayConfigRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string>('deleteMerchantGatewayConfig',args[0]), ttl: 60 })
  async delete(id: string): Promise<DeleteResult> {
     logger.info('Ready to delete entity with id: ${id} on repository:', id);
     const entity = await this.merchantgatewayconfigRepository.findOne({ id });
     if(!entity){
      throw new NotFoundException(`No se encontro el id: ${id}`);
     }
     const result = await this.repository.delete({ id });
     logger.info('Entity deleted with id: ${id} on repository:', result);
     
     if (this.shouldPublishEvent()) {
       logger.info('Ready to publish/fire MerchantGatewayConfigDeletedEvent on repository:', result);
       this.eventPublisher.publish(new MerchantGatewayConfigDeletedEvent(id, {
        instance: entity,
        metadata: {
          initiatedBy: entity.createdBy || 'system',
          correlationId: entity.id,
        },
      }));
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
      .registerClient(MerchantGatewayConfigRepository.name)
      .get(MerchantGatewayConfigRepository.name),
  })
  @Cacheable({ key: (args) => generateCacheKey<string[]>('deleteMerchantGatewayConfigs',args[0]), ttl: 60 })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    logger.info('Ready to delete '+ids.length+' entities on repository:', ids);
    const result = await this.repository.delete(ids);
    logger.info('Already deleted '+ids.length+' entities on repository:', result);
    
    if (this.shouldPublishEvent()) {
      logger.info('Ready to publish/fire MerchantGatewayConfigDeletedEvent on repository:', result);
      this.eventPublisher.publishAll(ids.map(async (id) => {
          const entity = await this.merchantgatewayconfigRepository.findOne({ id });
          if(!entity){
            throw new NotFoundException(`No se encontro el id: ${id}`);
          }
          return new MerchantGatewayConfigDeletedEvent(id, {
            instance: entity,
            metadata: {
              initiatedBy: entity.createdBy || 'system',
              correlationId: entity.id,
            },
          });
        }));
    }
    return result;
  }
}


