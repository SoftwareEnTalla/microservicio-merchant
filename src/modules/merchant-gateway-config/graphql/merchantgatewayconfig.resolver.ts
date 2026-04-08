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


import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";

//Definición de entidades
import { MerchantGatewayConfig } from "../entities/merchant-gateway-config.entity";

//Definición de comandos
import {
  CreateMerchantGatewayConfigCommand,
  UpdateMerchantGatewayConfigCommand,
  DeleteMerchantGatewayConfigCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { MerchantGatewayConfigQueryService } from "../services/merchantgatewayconfigquery.service";


import { MerchantGatewayConfigResponse, MerchantGatewayConfigsResponse } from "../types/merchantgatewayconfig.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateMerchantGatewayConfigDto, 
CreateOrUpdateMerchantGatewayConfigDto, 
MerchantGatewayConfigValueInput, 
MerchantGatewayConfigDto, 
CreateMerchantGatewayConfigDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => MerchantGatewayConfig)
export class MerchantGatewayConfigResolver {

   //Constructor del resolver de MerchantGatewayConfig
  constructor(
    private readonly service: MerchantGatewayConfigQueryService,
    private readonly commandBus: CommandBus
  ) {}

  @LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(MerchantGatewayConfigResolver.name)

      .get(MerchantGatewayConfigResolver.name),
    })
  // Mutaciones
  @Mutation(() => MerchantGatewayConfigResponse<MerchantGatewayConfig>)
  async createMerchantGatewayConfig(
    @Args("input", { type: () => CreateMerchantGatewayConfigDto }) input: CreateMerchantGatewayConfigDto
  ): Promise<MerchantGatewayConfigResponse<MerchantGatewayConfig>> {
    return this.commandBus.execute(new CreateMerchantGatewayConfigCommand(input));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(MerchantGatewayConfigResolver.name)

      .get(MerchantGatewayConfigResolver.name),
    })
  @Mutation(() => MerchantGatewayConfigResponse<MerchantGatewayConfig>)
  async updateMerchantGatewayConfig(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateMerchantGatewayConfigDto
  ): Promise<MerchantGatewayConfigResponse<MerchantGatewayConfig>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateMerchantGatewayConfigCommand(payLoad, {
        instance: payLoad,
        metadata: {
          initiatedBy: payLoad.createdBy || 'system',
          correlationId: payLoad.id,
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(MerchantGatewayConfigResolver.name)

      .get(MerchantGatewayConfigResolver.name),
    })
  @Mutation(() => MerchantGatewayConfigResponse<MerchantGatewayConfig>)
  async createOrUpdateMerchantGatewayConfig(
    @Args("data", { type: () => CreateOrUpdateMerchantGatewayConfigDto })
    data: CreateOrUpdateMerchantGatewayConfigDto
  ): Promise<MerchantGatewayConfigResponse<MerchantGatewayConfig>> {
    if (data.id) {
      const existingMerchantGatewayConfig = await this.service.findById(data.id);
      if (existingMerchantGatewayConfig) {
        return this.commandBus.execute(
          new UpdateMerchantGatewayConfigCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateMerchantGatewayConfigDto | UpdateMerchantGatewayConfigDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateMerchantGatewayConfigCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateMerchantGatewayConfigDto | UpdateMerchantGatewayConfigDto).createdBy ||
            'system',
          correlationId: data.id || uuidv4(),
        },
      })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(MerchantGatewayConfigResolver.name)

      .get(MerchantGatewayConfigResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteMerchantGatewayConfig(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteMerchantGatewayConfigCommand(id));
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(MerchantGatewayConfigResolver.name)

      .get(MerchantGatewayConfigResolver.name),
    })
  // Queries
  @Query(() => MerchantGatewayConfigsResponse<MerchantGatewayConfig>)
  async merchantgatewayconfigs(
    options?: FindManyOptions<MerchantGatewayConfig>,
    paginationArgs?: PaginationArgs
  ): Promise<MerchantGatewayConfigsResponse<MerchantGatewayConfig>> {
    return this.service.findAll(options, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(MerchantGatewayConfigResolver.name)

      .get(MerchantGatewayConfigResolver.name),
    })
  @Query(() => MerchantGatewayConfigsResponse<MerchantGatewayConfig>)
  async merchantgatewayconfig(
    @Args("id", { type: () => String }) id: string
  ): Promise<MerchantGatewayConfigResponse<MerchantGatewayConfig>> {
    return this.service.findById(id);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(MerchantGatewayConfigResolver.name)

      .get(MerchantGatewayConfigResolver.name),
    })
  @Query(() => MerchantGatewayConfigsResponse<MerchantGatewayConfig>)
  async merchantgatewayconfigsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => MerchantGatewayConfigValueInput }) value: MerchantGatewayConfigValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<MerchantGatewayConfigsResponse<MerchantGatewayConfig>> {
    return this.service.findByField(
      field,
      value,
      fromObject.call(PaginationArgs, { page: page, limit: limit })
    );
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(MerchantGatewayConfigResolver.name)

      .get(MerchantGatewayConfigResolver.name),
    })
  @Query(() => MerchantGatewayConfigsResponse<MerchantGatewayConfig>)
  async merchantgatewayconfigsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<MerchantGatewayConfigsResponse<MerchantGatewayConfig>> {
    const paginationArgs = fromObject.call(PaginationArgs, {
      page: page,
      limit: limit,
    });
    return this.service.findWithPagination({}, paginationArgs);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(MerchantGatewayConfigResolver.name)

      .get(MerchantGatewayConfigResolver.name),
    })
  @Query(() => Number)
  async totalMerchantGatewayConfigs(): Promise<number> {
    return this.service.count();
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(MerchantGatewayConfigResolver.name)

      .get(MerchantGatewayConfigResolver.name),
    })
  @Query(() => MerchantGatewayConfigsResponse<MerchantGatewayConfig>)
  async searchMerchantGatewayConfigs(
    @Args("where", { type: () => MerchantGatewayConfigDto, nullable: false })
    where: Record<string, any>
  ): Promise<MerchantGatewayConfigsResponse<MerchantGatewayConfig>> {
    const merchantgatewayconfigs = await this.service.findAndCount(where);
    return merchantgatewayconfigs;
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(MerchantGatewayConfigResolver.name)

      .get(MerchantGatewayConfigResolver.name),
    })
  @Query(() => MerchantGatewayConfigResponse<MerchantGatewayConfig>, { nullable: true })
  async findOneMerchantGatewayConfig(
    @Args("where", { type: () => MerchantGatewayConfigDto, nullable: false })
    where: Record<string, any>
  ): Promise<MerchantGatewayConfigResponse<MerchantGatewayConfig>> {
    return this.service.findOne(where);
  }


@LogExecutionTime({
    layer: 'resolver',
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
      .registerClient(MerchantGatewayConfigResolver.name)

      .get(MerchantGatewayConfigResolver.name),
    })
  @Query(() => MerchantGatewayConfigResponse<MerchantGatewayConfig>)
  async findOneMerchantGatewayConfigOrFail(
    @Args("where", { type: () => MerchantGatewayConfigDto, nullable: false })
    where: Record<string, any>
  ): Promise<MerchantGatewayConfigResponse<MerchantGatewayConfig> | Error> {
    return this.service.findOneOrFail(where);
  }
}

