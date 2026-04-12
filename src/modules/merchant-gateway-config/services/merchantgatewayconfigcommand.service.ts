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


import { Injectable, Logger, NotFoundException, OnModuleInit } from "@nestjs/common";
import { DeleteResult, UpdateResult } from "typeorm";
import { MerchantGatewayConfig } from "../entities/merchant-gateway-config.entity";
import { CreateMerchantGatewayConfigDto, UpdateMerchantGatewayConfigDto, DeleteMerchantGatewayConfigDto } from "../dtos/all-dto";
 
import { generateCacheKey } from "src/utils/functions";
import { MerchantGatewayConfigCommandRepository } from "../repositories/merchantgatewayconfigcommand.repository";
import { MerchantGatewayConfigQueryRepository } from "../repositories/merchantgatewayconfigquery.repository";
import { Cacheable } from "../decorators/cache.decorator";
import { MerchantGatewayConfigResponse, MerchantGatewayConfigsResponse } from "../types/merchantgatewayconfig.types";
import { Helper } from "src/common/helpers/helpers";
//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { CommandBus } from "@nestjs/cqrs";
import { EventStoreService } from "../shared/event-store/event-store.service";
import { KafkaEventPublisher } from "../shared/adapters/kafka-event-publisher";
import { ModuleRef } from "@nestjs/core";
import { MerchantGatewayConfigQueryService } from "./merchantgatewayconfigquery.service";
import { BaseEvent } from "../events/base.event";
import { MerchantGatewayConfigActivatedEvent } from '../events/merchantgatewayconfigactivated.event';
import { MerchantGatewayConfigDeactivatedEvent } from '../events/merchantgatewayconfigdeactivated.event';

@Injectable()
export class MerchantGatewayConfigCommandService implements OnModuleInit {
  // Private properties
  readonly #logger = new Logger(MerchantGatewayConfigCommandService.name);
  //Constructo del servicio MerchantGatewayConfigCommandService
  constructor(
    private readonly repository: MerchantGatewayConfigCommandRepository,
    private readonly queryRepository: MerchantGatewayConfigQueryRepository,
    private readonly commandBus: CommandBus,
    private readonly eventStore: EventStoreService,
    private readonly eventPublisher: KafkaEventPublisher,
    private moduleRef: ModuleRef
  ) {
    //Inicialice aquí propiedades o atributos
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(MerchantGatewayConfigQueryService.name)
      .get(MerchantGatewayConfigQueryService.name),
  })
  onModuleInit() {
    //Se ejecuta en la inicialización del módulo
  }

  private dslValue(entityData: Record<string, any>, currentData: Record<string, any>, inputData: Record<string, any>, field: string): any {
    return entityData?.[field] ?? currentData?.[field] ?? inputData?.[field];
  }

  private async publishDslDomainEvents(events: BaseEvent[]): Promise<void> {
    for (const event of events) {
      await this.eventPublisher.publish(event as any);
      if (process.env.EVENT_STORE_ENABLED === "true") {
        await this.eventStore.appendEvent('merchant-gateway-config-' + event.aggregateId, event);
      }
    }
  }

  private async applyDslServiceRules(
    operation: "create" | "update" | "delete",
    inputData: Record<string, any>,
    entity?: MerchantGatewayConfig | null,
    current?: MerchantGatewayConfig | null,
    publishEvents: boolean = true,
  ): Promise<void> {
    const entityData = ((entity ?? {}) as Record<string, any>);
    const currentData = ((current ?? {}) as Record<string, any>);
    const pendingEvents: BaseEvent[] = [];
    if (operation === 'update') {
      // Regla de servicio: active-config-requires-active-flag
      // Una configuración activa debe tener indicador de activación verdadero.
      if (!(this.dslValue(entityData, currentData, inputData, 'status') === 'ACTIVE' && this.dslValue(entityData, currentData, inputData, 'isActive') === true)) {
        throw new Error('MERCHANT_GATEWAY_001: No se puede marcar una configuración como activa sin isActive=true');
      }

      // Regla de servicio: suspended-config-cannot-be-exposed
      // Una pasarela suspendida no debe exponerse al cliente.
      if (!(this.dslValue(entityData, currentData, inputData, 'status') !== 'SUSPENDED')) {
        logger.warn('MERCHANT_GATEWAY_002: Una configuración suspendida no debe exponerse al checkout');
      }

      // Regla de servicio: merchant-gateway-config-activated-emits-domain-event
      // Cuando una configuración de pasarela queda activa para el comercio debe emitirse un evento que permita actualizar catálogos de checkout y decisiones de payment.
      if (this.dslValue(entityData, currentData, inputData, 'status') === 'ACTIVE' && this.dslValue(entityData, currentData, inputData, 'isActive') === true) {
        pendingEvents.push(MerchantGatewayConfigActivatedEvent.create(
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'merchant-gateway-config-update'),
          (entity ?? current ?? inputData ?? {}) as any,
          String(entityData['createdBy'] ?? currentData['createdBy'] ?? inputData?.createdBy ?? 'system'),
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'merchant-gateway-config-update')
        ));
      }

      // Regla de servicio: merchant-gateway-config-deactivated-emits-domain-event
      // Cuando una configuración deja de estar activa debe emitirse un evento para impedir nuevas operaciones de cobro dependientes de esa pasarela.
      if (this.dslValue(entityData, currentData, inputData, 'isActive') === false) {
        pendingEvents.push(MerchantGatewayConfigDeactivatedEvent.create(
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'merchant-gateway-config-update'),
          (entity ?? current ?? inputData ?? {}) as any,
          String(entityData['createdBy'] ?? currentData['createdBy'] ?? inputData?.createdBy ?? 'system'),
          String(entityData['id'] ?? currentData['id'] ?? inputData?.id ?? 'merchant-gateway-config-update')
        ));
      }

      // Regla de servicio: merchant-gateway-config-updated-emits-domain-event
      // Cuando una configuración operativa cambia debe emitirse un evento para recalcular disponibilidad, límites y comportamiento del checkout.

    }
    if (publishEvents) {
      await this.publishDslDomainEvents(pendingEvents);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(MerchantGatewayConfigCommandService.name)
      .get(MerchantGatewayConfigCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<CreateMerchantGatewayConfigDto>("createMerchantGatewayConfig", args[0], args[1]),
    ttl: 60,
  })
  async create(
    createMerchantGatewayConfigDtoInput: CreateMerchantGatewayConfigDto
  ): Promise<MerchantGatewayConfigResponse<MerchantGatewayConfig>> {
    try {
      logger.info("Receiving in service:", createMerchantGatewayConfigDtoInput);
      const candidate = MerchantGatewayConfig.fromDto(createMerchantGatewayConfigDtoInput);
      await this.applyDslServiceRules("create", createMerchantGatewayConfigDtoInput as Record<string, any>, candidate, null, false);
      const entity = await this.repository.create(candidate);
      await this.applyDslServiceRules("create", createMerchantGatewayConfigDtoInput as Record<string, any>, entity, null, true);
      logger.info("Entity created on service:", entity);
      // Respuesta si el merchantgatewayconfig no existe
      if (!entity)
        throw new NotFoundException("Entidad MerchantGatewayConfig no encontrada.");
      // Devolver merchantgatewayconfig
      return {
        ok: true,
        message: "MerchantGatewayConfig obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      logger.info("Error creating entity on service:", error);
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(MerchantGatewayConfigCommandService.name)
      .get(MerchantGatewayConfigCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<MerchantGatewayConfig>("createMerchantGatewayConfigs", args[0], args[1]),
    ttl: 60,
  })
  async bulkCreate(
    createMerchantGatewayConfigDtosInput: CreateMerchantGatewayConfigDto[]
  ): Promise<MerchantGatewayConfigsResponse<MerchantGatewayConfig>> {
    try {
      const entities = await this.repository.bulkCreate(
        createMerchantGatewayConfigDtosInput.map((entity) => MerchantGatewayConfig.fromDto(entity))
      );

      // Respuesta si el merchantgatewayconfig no existe
      if (!entities)
        throw new NotFoundException("Entidades MerchantGatewayConfigs no encontradas.");
      // Devolver merchantgatewayconfig
      return {
        ok: true,
        message: "MerchantGatewayConfigs creados con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(MerchantGatewayConfigCommandService.name)
      .get(MerchantGatewayConfigCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateMerchantGatewayConfigDto>("updateMerchantGatewayConfig", args[0], args[1]),
    ttl: 60,
  })
  async update(
    id: string,
    partialEntity: UpdateMerchantGatewayConfigDto
  ): Promise<MerchantGatewayConfigResponse<MerchantGatewayConfig>> {
    try {
      const currentEntity = await this.queryRepository.findById(id);
      const candidate = Object.assign(new MerchantGatewayConfig(), currentEntity ?? {}, partialEntity);
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, candidate, currentEntity, false);
      const entity = await this.repository.update(
        id,
        candidate
      );
      await this.applyDslServiceRules("update", partialEntity as Record<string, any>, entity, currentEntity, true);
      // Respuesta si el merchantgatewayconfig no existe
      if (!entity)
        throw new NotFoundException("Entidades MerchantGatewayConfigs no encontradas.");
      // Devolver merchantgatewayconfig
      return {
        ok: true,
        message: "MerchantGatewayConfig actualizada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }


  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(MerchantGatewayConfigCommandService.name)
      .get(MerchantGatewayConfigCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<UpdateMerchantGatewayConfigDto>("updateMerchantGatewayConfigs", args[0]),
    ttl: 60,
  })
  async bulkUpdate(
    partialEntity: UpdateMerchantGatewayConfigDto[]
  ): Promise<MerchantGatewayConfigsResponse<MerchantGatewayConfig>> {
    try {
      const entities = await this.repository.bulkUpdate(
        partialEntity.map((entity) => MerchantGatewayConfig.fromDto(entity))
      );
      // Respuesta si el merchantgatewayconfig no existe
      if (!entities)
        throw new NotFoundException("Entidades MerchantGatewayConfigs no encontradas.");
      // Devolver merchantgatewayconfig
      return {
        ok: true,
        message: "MerchantGatewayConfigs actualizadas con éxito.",
        data: entities,
        count: entities.length,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

   @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(MerchantGatewayConfigCommandService.name)
      .get(MerchantGatewayConfigCommandService.name),
  })
  @Cacheable({
    key: (args) =>
      generateCacheKey<DeleteMerchantGatewayConfigDto>("deleteMerchantGatewayConfig", args[0], args[1]),
    ttl: 60,
  })
  async delete(id: string): Promise<MerchantGatewayConfigResponse<MerchantGatewayConfig>> {
    try {
      const entity = await this.queryRepository.findById(id);
      // Respuesta si el merchantgatewayconfig no existe
      if (!entity)
        throw new NotFoundException("Instancias de MerchantGatewayConfig no encontradas.");

      await this.applyDslServiceRules("delete", { id }, entity, entity, false);

      const result = await this.repository.delete(id);
      await this.applyDslServiceRules("delete", { id }, entity, entity, true);
      // Devolver merchantgatewayconfig
      return {
        ok: true,
        message: "Instancia de MerchantGatewayConfig eliminada con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }

  @LogExecutionTime({
    layer: "service",
    callback: async (logData, client) => {
      // Puedes usar el cliente proporcionado o ignorarlo y usar otro
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
      .registerClient(MerchantGatewayConfigCommandService.name)
      .get(MerchantGatewayConfigCommandService.name),
  })
  @Cacheable({
    key: (args) => generateCacheKey<string[]>("deleteMerchantGatewayConfigs", args[0]),
    ttl: 60,
  })
  async bulkDelete(ids: string[]): Promise<DeleteResult> {
    return await this.repository.bulkDelete(ids);
  }
}

