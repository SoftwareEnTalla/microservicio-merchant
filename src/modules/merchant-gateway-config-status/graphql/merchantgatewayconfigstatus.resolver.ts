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
import { MerchantGatewayConfigStatus } from "../entities/merchant-gateway-config-status.entity";

//Definición de comandos
import {
  CreateMerchantGatewayConfigStatusCommand,
  UpdateMerchantGatewayConfigStatusCommand,
  DeleteMerchantGatewayConfigStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { MerchantGatewayConfigStatusQueryService } from "../services/merchantgatewayconfigstatusquery.service";


import { MerchantGatewayConfigStatusResponse, MerchantGatewayConfigStatussResponse } from "../types/merchantgatewayconfigstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateMerchantGatewayConfigStatusDto, 
CreateOrUpdateMerchantGatewayConfigStatusDto, 
MerchantGatewayConfigStatusValueInput, 
MerchantGatewayConfigStatusDto, 
CreateMerchantGatewayConfigStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => MerchantGatewayConfigStatus)
export class MerchantGatewayConfigStatusResolver {

   //Constructor del resolver de MerchantGatewayConfigStatus
  constructor(
    private readonly service: MerchantGatewayConfigStatusQueryService,
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
      .registerClient(MerchantGatewayConfigStatusResolver.name)

      .get(MerchantGatewayConfigStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => MerchantGatewayConfigStatusResponse<MerchantGatewayConfigStatus>)
  async createMerchantGatewayConfigStatus(
    @Args("input", { type: () => CreateMerchantGatewayConfigStatusDto }) input: CreateMerchantGatewayConfigStatusDto
  ): Promise<MerchantGatewayConfigStatusResponse<MerchantGatewayConfigStatus>> {
    return this.commandBus.execute(new CreateMerchantGatewayConfigStatusCommand(input));
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
      .registerClient(MerchantGatewayConfigStatusResolver.name)

      .get(MerchantGatewayConfigStatusResolver.name),
    })
  @Mutation(() => MerchantGatewayConfigStatusResponse<MerchantGatewayConfigStatus>)
  async updateMerchantGatewayConfigStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateMerchantGatewayConfigStatusDto
  ): Promise<MerchantGatewayConfigStatusResponse<MerchantGatewayConfigStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateMerchantGatewayConfigStatusCommand(payLoad, {
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
      .registerClient(MerchantGatewayConfigStatusResolver.name)

      .get(MerchantGatewayConfigStatusResolver.name),
    })
  @Mutation(() => MerchantGatewayConfigStatusResponse<MerchantGatewayConfigStatus>)
  async createOrUpdateMerchantGatewayConfigStatus(
    @Args("data", { type: () => CreateOrUpdateMerchantGatewayConfigStatusDto })
    data: CreateOrUpdateMerchantGatewayConfigStatusDto
  ): Promise<MerchantGatewayConfigStatusResponse<MerchantGatewayConfigStatus>> {
    if (data.id) {
      const existingMerchantGatewayConfigStatus = await this.service.findById(data.id);
      if (existingMerchantGatewayConfigStatus) {
        return this.commandBus.execute(
          new UpdateMerchantGatewayConfigStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateMerchantGatewayConfigStatusDto | UpdateMerchantGatewayConfigStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateMerchantGatewayConfigStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateMerchantGatewayConfigStatusDto | UpdateMerchantGatewayConfigStatusDto).createdBy ||
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
      .registerClient(MerchantGatewayConfigStatusResolver.name)

      .get(MerchantGatewayConfigStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteMerchantGatewayConfigStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteMerchantGatewayConfigStatusCommand(id));
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
      .registerClient(MerchantGatewayConfigStatusResolver.name)

      .get(MerchantGatewayConfigStatusResolver.name),
    })
  // Queries
  @Query(() => MerchantGatewayConfigStatussResponse<MerchantGatewayConfigStatus>)
  async merchantgatewayconfigstatuss(
    options?: FindManyOptions<MerchantGatewayConfigStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<MerchantGatewayConfigStatussResponse<MerchantGatewayConfigStatus>> {
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
      .registerClient(MerchantGatewayConfigStatusResolver.name)

      .get(MerchantGatewayConfigStatusResolver.name),
    })
  @Query(() => MerchantGatewayConfigStatussResponse<MerchantGatewayConfigStatus>)
  async merchantgatewayconfigstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<MerchantGatewayConfigStatusResponse<MerchantGatewayConfigStatus>> {
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
      .registerClient(MerchantGatewayConfigStatusResolver.name)

      .get(MerchantGatewayConfigStatusResolver.name),
    })
  @Query(() => MerchantGatewayConfigStatussResponse<MerchantGatewayConfigStatus>)
  async merchantgatewayconfigstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => MerchantGatewayConfigStatusValueInput }) value: MerchantGatewayConfigStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<MerchantGatewayConfigStatussResponse<MerchantGatewayConfigStatus>> {
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
      .registerClient(MerchantGatewayConfigStatusResolver.name)

      .get(MerchantGatewayConfigStatusResolver.name),
    })
  @Query(() => MerchantGatewayConfigStatussResponse<MerchantGatewayConfigStatus>)
  async merchantgatewayconfigstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<MerchantGatewayConfigStatussResponse<MerchantGatewayConfigStatus>> {
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
      .registerClient(MerchantGatewayConfigStatusResolver.name)

      .get(MerchantGatewayConfigStatusResolver.name),
    })
  @Query(() => Number)
  async totalMerchantGatewayConfigStatuss(): Promise<number> {
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
      .registerClient(MerchantGatewayConfigStatusResolver.name)

      .get(MerchantGatewayConfigStatusResolver.name),
    })
  @Query(() => MerchantGatewayConfigStatussResponse<MerchantGatewayConfigStatus>)
  async searchMerchantGatewayConfigStatuss(
    @Args("where", { type: () => MerchantGatewayConfigStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<MerchantGatewayConfigStatussResponse<MerchantGatewayConfigStatus>> {
    const merchantgatewayconfigstatuss = await this.service.findAndCount(where);
    return merchantgatewayconfigstatuss;
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
      .registerClient(MerchantGatewayConfigStatusResolver.name)

      .get(MerchantGatewayConfigStatusResolver.name),
    })
  @Query(() => MerchantGatewayConfigStatusResponse<MerchantGatewayConfigStatus>, { nullable: true })
  async findOneMerchantGatewayConfigStatus(
    @Args("where", { type: () => MerchantGatewayConfigStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<MerchantGatewayConfigStatusResponse<MerchantGatewayConfigStatus>> {
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
      .registerClient(MerchantGatewayConfigStatusResolver.name)

      .get(MerchantGatewayConfigStatusResolver.name),
    })
  @Query(() => MerchantGatewayConfigStatusResponse<MerchantGatewayConfigStatus>)
  async findOneMerchantGatewayConfigStatusOrFail(
    @Args("where", { type: () => MerchantGatewayConfigStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<MerchantGatewayConfigStatusResponse<MerchantGatewayConfigStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

