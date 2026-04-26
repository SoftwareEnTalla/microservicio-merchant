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
import { MerchantApprovalStatus } from "../entities/merchant-approval-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { MerchantApprovalStatusQueryRepository } from "../repositories/merchantapprovalstatusquery.repository";
import { MerchantApprovalStatusResponse, MerchantApprovalStatussResponse } from "../types/merchantapprovalstatus.types";
import { Helper } from "src/common/helpers/helpers";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
//import { Cacheable } from "../decorators/cache.decorator";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { ModuleRef } from "@nestjs/core";
import { logger } from '@core/logs/logger';



@Injectable()
export class MerchantApprovalStatusQueryService implements OnModuleInit{
  // Private properties
  readonly #logger = new Logger(MerchantApprovalStatusQueryService.name);
  private readonly loggerClient = LoggerClient.getInstance();

  constructor(private readonly repository: MerchantApprovalStatusQueryRepository,
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
      .registerClient(MerchantApprovalStatusQueryService.name)
      .get(MerchantApprovalStatusQueryService.name),
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
      .registerClient(MerchantApprovalStatusQueryService.name)
      .get(MerchantApprovalStatusQueryService.name),
  })
  private validate(): void {
    try {
      const entityInstance = Object.create(MerchantApprovalStatus.prototype);
      if (!(entityInstance instanceof BaseEntity)) {
        let sms = `El tipo ${MerchantApprovalStatus.name} no extiende de BaseEntity. Asegúrate de que todas las entidades hereden correctamente.`;
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
      .registerClient(MerchantApprovalStatusQueryService.name)
      .get(MerchantApprovalStatusQueryService.name),
  })
  async findAll(
    options?: FindManyOptions<MerchantApprovalStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<MerchantApprovalStatussResponse<MerchantApprovalStatus>> {
    try {
      const merchantapprovalstatuss = await this.repository.findAll(options);
      // Devolver respuesta
      logger.info("sms");
      return {
        ok: true,
        message: "Listado de merchantapprovalstatuss obtenido con éxito",
        data: merchantapprovalstatuss,
        pagination: Helper.getPaginator(
          paginationArgs ? paginationArgs.page : 1,
          paginationArgs ? paginationArgs.size : 25,
          merchantapprovalstatuss.length
        ),
        count: merchantapprovalstatuss.length,
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
      .registerClient(MerchantApprovalStatusQueryService.name)
      .get(MerchantApprovalStatusQueryService.name),
  })
  async findById(id: string): Promise<MerchantApprovalStatusResponse<MerchantApprovalStatus>> {
    try {
      const merchantapprovalstatus = await this.repository.findOne({
        where: { id },
        relations: [],
      });
      // Respuesta si el merchantapprovalstatus no existe
      if (!merchantapprovalstatus)
        throw new NotFoundException(
          "MerchantApprovalStatus no encontrado para el id solicitado"
        );
      // Devolver merchantapprovalstatus
      return {
        ok: true,
        message: "MerchantApprovalStatus obtenido con éxito",
        data: merchantapprovalstatus,
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
      .registerClient(MerchantApprovalStatusQueryService.name)
      .get(MerchantApprovalStatusQueryService.name),
  })
  async findByField(
    field: string,
    value: any,
    paginationArgs?: PaginationArgs
  ): Promise<MerchantApprovalStatussResponse<MerchantApprovalStatus>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount({ [field]: value });

      // Respuesta si el merchantapprovalstatus no existe
      if (!entities)
        throw new NotFoundException(
          "MerchantApprovalStatuss no encontrados para la propiedad y valor especificado"
        );
      // Devolver merchantapprovalstatus
      return {
        ok: true,
        message: "MerchantApprovalStatuss obtenidos con éxito.",
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
      .registerClient(MerchantApprovalStatusQueryService.name)
      .get(MerchantApprovalStatusQueryService.name),
  })
  async findWithPagination(
    options: FindManyOptions<MerchantApprovalStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<MerchantApprovalStatussResponse<MerchantApprovalStatus>> {
    try {
      const entities = await this.repository.findWithPagination(
        options,
        paginationArgs ? paginationArgs.page : 1,
        paginationArgs ? paginationArgs.size : 25
      );

      // Respuesta si el merchantapprovalstatus no existe
      if (!entities)
        throw new NotFoundException("Entidades MerchantApprovalStatuss no encontradas.");
      // Devolver merchantapprovalstatus
      return {
        ok: true,
        message: "MerchantApprovalStatus obtenido con éxito.",
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
      .registerClient(MerchantApprovalStatusQueryService.name)
      .get(MerchantApprovalStatusQueryService.name),
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
      .registerClient(MerchantApprovalStatusQueryService.name)
      .get(MerchantApprovalStatusQueryService.name),
  })
  async findAndCount(
    where?: Record<string, any>,
    paginationArgs?: PaginationArgs
  ): Promise<MerchantApprovalStatussResponse<MerchantApprovalStatus>> {
    try {
      const [entities, lenght] = await this.repository.findAndCount(where);

      // Respuesta si el merchantapprovalstatus no existe
      if (!entities)
        throw new NotFoundException(
          "Entidades MerchantApprovalStatuss no encontradas para el criterio especificado."
        );
      // Devolver merchantapprovalstatus
      return {
        ok: true,
        message: "MerchantApprovalStatuss obtenidos con éxito.",
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
      .registerClient(MerchantApprovalStatusQueryService.name)
      .get(MerchantApprovalStatusQueryService.name),
  })
  async findOne(where?: Record<string, any>): Promise<MerchantApprovalStatusResponse<MerchantApprovalStatus>> {
    try {
      const entity = await this.repository.findOne(where);

      // Respuesta si el merchantapprovalstatus no existe
      if (!entity)
        throw new NotFoundException("Entidad MerchantApprovalStatus no encontrada.");
      // Devolver merchantapprovalstatus
      return {
        ok: true,
        message: "MerchantApprovalStatus obtenido con éxito.",
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
      .registerClient(MerchantApprovalStatusQueryService.name)
      .get(MerchantApprovalStatusQueryService.name),
  })
  async findOneOrFail(
    where?: Record<string, any>
  ): Promise<MerchantApprovalStatusResponse<MerchantApprovalStatus> | Error> {
    try {
      const entity = await this.repository.findOne(where);

      // Respuesta si el merchantapprovalstatus no existe
      if (!entity)
        return new NotFoundException("Entidad MerchantApprovalStatus no encontrada.");
      // Devolver merchantapprovalstatus
      return {
        ok: true,
        message: "MerchantApprovalStatus obtenido con éxito.",
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



