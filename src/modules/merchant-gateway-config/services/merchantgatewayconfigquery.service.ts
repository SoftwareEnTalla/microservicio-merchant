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
import { FindManyOptions } from "typeorm";
import { MerchantGatewayConfig } from "../entities/merchant-gateway-config.entity";
import { BaseEntity } from "../entities/base.entity";
import { MerchantGatewayConfigQueryRepository } from "../repositories/merchantgatewayconfigquery.repository";
import { MerchantGatewayConfigResponse, MerchantGatewayConfigsResponse } from "../types/merchantgatewayconfig.types";
import { Helper } from "src/common/helpers/helpers";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
//import { Cacheable } from "../decorators/cache.decorator";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { ModuleRef } from "@nestjs/core";
import { logger } from '@core/logs/logger';



@Injectable()
export class MerchantGatewayConfigQueryService implements OnModuleInit{
  // Private properties
  readonly #logger = new Logger(MerchantGatewayConfigQueryService.name);
  private readonly loggerClient = LoggerClient.getInstance();

  constructor(private readonly repository: MerchantGatewayConfigQueryRepository,
  private moduleRef: ModuleRef
  ) {
    this.validate();
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
  private validate(): void {
    try {
      const entityInstance = Object.create(MerchantGatewayConfig.prototype);
      if (!(entityInstance instanceof BaseEntity)) {
        let sms = `El tipo ${MerchantGatewayConfig.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`;
        logger.info(sms);
        throw new Error(sms);
      }
    } catch (error) {
      // Imprimir error
      logger.error(error);
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
      .registerClient(MerchantGatewayConfigQueryService.name)
      .get(MerchantGatewayConfigQueryService.name),
  })
  async findAll(
    options?: FindManyOptions<MerchantGatewayConfig>,
    paginationArgs?: PaginationArgs
  ): Promise<MerchantGatewayConfigsResponse<MerchantGatewayConfig>> {
    try {
      const merchantgatewayconfigs = await this.repository.findAll(options);
      // Devolver respuesta
      logger.info("sms");
      return {
        ok: true,
        message: "Listado de merchantgatewayconfigs obtenido con éxito",
        data: merchantgatewayconfigs,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          merchantgatewayconfigs.length
        ),
        count: merchantgatewayconfigs.length,
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
      .registerClient(MerchantGatewayConfigQueryService.name)
      .get(MerchantGatewayConfigQueryService.name),
  })
  async findById(id: string): Promise<MerchantGatewayConfigResponse<MerchantGatewayConfig>> {
    try {
      const merchantgatewayconfig = await this.repository.findOne({
        where: { id },
        relations: [],
      });
      // Respuesta si el merchantgatewayconfig no existe
      if (!merchantgatewayconfig)
        throw new NotFoundException(
          "MerchantGatewayConfig no encontrado para el id solicitado"
        );
      // Devolver merchantgatewayconfig
      return {
        ok: true,
        message: "MerchantGatewayConfig obtenido con éxito",
        data: merchantgatewayconfig,
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
      .registerClient(MerchantGatewayConfigQueryService.name)
      .get(MerchantGatewayConfigQueryService.name),
  })
  async findByField(
    field: string,
    value: any,
    paginationArgs?: PaginationArgs
  ): Promise<MerchantGatewayConfigsResponse<MerchantGatewayConfig>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({
        where: { [field]: value },
        skip:
          ((paginationArgs ? paginationArgs.page : 1) - 1) *
          (paginationArgs ? paginationArgs.size : 25),
        take: paginationArgs ? paginationArgs.size : 25,
      });

      // Respuesta si el merchantgatewayconfig no existe
      if (!entities)
        throw new NotFoundException(
          "MerchantGatewayConfigs no encontrados para la propiedad y valor especificado"
        );
      // Devolver merchantgatewayconfig
      return {
        ok: true,
        message: "MerchantGatewayConfigs obtenidos con éxito.",
        data: entities,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          lenght
        ),
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
      .registerClient(MerchantGatewayConfigQueryService.name)
      .get(MerchantGatewayConfigQueryService.name),
  })
  async findWithPagination(
    options: FindManyOptions<MerchantGatewayConfig>,
    paginationArgs?: PaginationArgs
  ): Promise<MerchantGatewayConfigsResponse<MerchantGatewayConfig>> {
    try {
      const entities = await this.repository.findWithPagination(
        options,
        paginationArgs ? paginationArgs.page : 1,
        paginationArgs ? paginationArgs.size : 25
      );

      // Respuesta si el merchantgatewayconfig no existe
      if (!entities)
        throw new NotFoundException("Entidades MerchantGatewayConfigs no encontradas.");
      // Devolver merchantgatewayconfig
      return {
        ok: true,
        message: "MerchantGatewayConfig obtenido con éxito.",
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
      .registerClient(MerchantGatewayConfigQueryService.name)
      .get(MerchantGatewayConfigQueryService.name),
  })
  async count(): Promise<number> {
    return this.repository.count();
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
  async findAndCount(
    where?: Record<string, any>,
    paginationArgs?: PaginationArgs
  ): Promise<MerchantGatewayConfigsResponse<MerchantGatewayConfig>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({
        where: where,
      });

      // Respuesta si el merchantgatewayconfig no existe
      if (!entities)
        throw new NotFoundException(
          "Entidades MerchantGatewayConfigs no encontradas para el criterio especificado."
        );
      // Devolver merchantgatewayconfig
      return {
        ok: true,
        message: "MerchantGatewayConfigs obtenidos con éxito.",
        data: entities,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          lenght
        ),
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
      .registerClient(MerchantGatewayConfigQueryService.name)
      .get(MerchantGatewayConfigQueryService.name),
  })
  async findOne(where?: Record<string, any>): Promise<MerchantGatewayConfigResponse<MerchantGatewayConfig>> {
    try {
      const entity = await this.repository.findOne({
        where: where,
      });

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
      .registerClient(MerchantGatewayConfigQueryService.name)
      .get(MerchantGatewayConfigQueryService.name),
  })
  async findOneOrFail(
    where?: Record<string, any>
  ): Promise<MerchantGatewayConfigResponse<MerchantGatewayConfig> | Error> {
    try {
      const entity = await this.repository.findOne({
        where: where,
      });

      // Respuesta si el merchantgatewayconfig no existe
      if (!entity)
        return new NotFoundException("Entidad MerchantGatewayConfig no encontrada.");
      // Devolver merchantgatewayconfig
      return {
        ok: true,
        message: "MerchantGatewayConfig obtenido con éxito.",
        data: entity,
      };
    } catch (error) {
      // Imprimir error
      logger.error(error);
      // Lanzar error
      return Helper.throwCachedError(error);
    }
  }
}



