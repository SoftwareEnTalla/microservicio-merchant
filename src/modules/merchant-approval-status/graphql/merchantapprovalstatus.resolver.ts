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
import { MerchantApprovalStatus } from "../entities/merchant-approval-status.entity";

//Definición de comandos
import {
  CreateMerchantApprovalStatusCommand,
  UpdateMerchantApprovalStatusCommand,
  DeleteMerchantApprovalStatusCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { MerchantApprovalStatusQueryService } from "../services/merchantapprovalstatusquery.service";


import { MerchantApprovalStatusResponse, MerchantApprovalStatussResponse } from "../types/merchantapprovalstatus.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateMerchantApprovalStatusDto, 
CreateOrUpdateMerchantApprovalStatusDto, 
MerchantApprovalStatusValueInput, 
MerchantApprovalStatusDto, 
CreateMerchantApprovalStatusDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => MerchantApprovalStatus)
export class MerchantApprovalStatusResolver {

   //Constructor del resolver de MerchantApprovalStatus
  constructor(
    private readonly service: MerchantApprovalStatusQueryService,
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
      .registerClient(MerchantApprovalStatusResolver.name)

      .get(MerchantApprovalStatusResolver.name),
    })
  // Mutaciones
  @Mutation(() => MerchantApprovalStatusResponse<MerchantApprovalStatus>)
  async createMerchantApprovalStatus(
    @Args("input", { type: () => CreateMerchantApprovalStatusDto }) input: CreateMerchantApprovalStatusDto
  ): Promise<MerchantApprovalStatusResponse<MerchantApprovalStatus>> {
    return this.commandBus.execute(new CreateMerchantApprovalStatusCommand(input));
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
      .registerClient(MerchantApprovalStatusResolver.name)

      .get(MerchantApprovalStatusResolver.name),
    })
  @Mutation(() => MerchantApprovalStatusResponse<MerchantApprovalStatus>)
  async updateMerchantApprovalStatus(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateMerchantApprovalStatusDto
  ): Promise<MerchantApprovalStatusResponse<MerchantApprovalStatus>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateMerchantApprovalStatusCommand(payLoad, {
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
      .registerClient(MerchantApprovalStatusResolver.name)

      .get(MerchantApprovalStatusResolver.name),
    })
  @Mutation(() => MerchantApprovalStatusResponse<MerchantApprovalStatus>)
  async createOrUpdateMerchantApprovalStatus(
    @Args("data", { type: () => CreateOrUpdateMerchantApprovalStatusDto })
    data: CreateOrUpdateMerchantApprovalStatusDto
  ): Promise<MerchantApprovalStatusResponse<MerchantApprovalStatus>> {
    if (data.id) {
      const existingMerchantApprovalStatus = await this.service.findById(data.id);
      if (existingMerchantApprovalStatus) {
        return this.commandBus.execute(
          new UpdateMerchantApprovalStatusCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateMerchantApprovalStatusDto | UpdateMerchantApprovalStatusDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateMerchantApprovalStatusCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateMerchantApprovalStatusDto | UpdateMerchantApprovalStatusDto).createdBy ||
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
      .registerClient(MerchantApprovalStatusResolver.name)

      .get(MerchantApprovalStatusResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteMerchantApprovalStatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteMerchantApprovalStatusCommand(id));
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
      .registerClient(MerchantApprovalStatusResolver.name)

      .get(MerchantApprovalStatusResolver.name),
    })
  // Queries
  @Query(() => MerchantApprovalStatussResponse<MerchantApprovalStatus>)
  async merchantapprovalstatuss(
    options?: FindManyOptions<MerchantApprovalStatus>,
    paginationArgs?: PaginationArgs
  ): Promise<MerchantApprovalStatussResponse<MerchantApprovalStatus>> {
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
      .registerClient(MerchantApprovalStatusResolver.name)

      .get(MerchantApprovalStatusResolver.name),
    })
  @Query(() => MerchantApprovalStatussResponse<MerchantApprovalStatus>)
  async merchantapprovalstatus(
    @Args("id", { type: () => String }) id: string
  ): Promise<MerchantApprovalStatusResponse<MerchantApprovalStatus>> {
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
      .registerClient(MerchantApprovalStatusResolver.name)

      .get(MerchantApprovalStatusResolver.name),
    })
  @Query(() => MerchantApprovalStatussResponse<MerchantApprovalStatus>)
  async merchantapprovalstatussByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => MerchantApprovalStatusValueInput }) value: MerchantApprovalStatusValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<MerchantApprovalStatussResponse<MerchantApprovalStatus>> {
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
      .registerClient(MerchantApprovalStatusResolver.name)

      .get(MerchantApprovalStatusResolver.name),
    })
  @Query(() => MerchantApprovalStatussResponse<MerchantApprovalStatus>)
  async merchantapprovalstatussWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<MerchantApprovalStatussResponse<MerchantApprovalStatus>> {
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
      .registerClient(MerchantApprovalStatusResolver.name)

      .get(MerchantApprovalStatusResolver.name),
    })
  @Query(() => Number)
  async totalMerchantApprovalStatuss(): Promise<number> {
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
      .registerClient(MerchantApprovalStatusResolver.name)

      .get(MerchantApprovalStatusResolver.name),
    })
  @Query(() => MerchantApprovalStatussResponse<MerchantApprovalStatus>)
  async searchMerchantApprovalStatuss(
    @Args("where", { type: () => MerchantApprovalStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<MerchantApprovalStatussResponse<MerchantApprovalStatus>> {
    const merchantapprovalstatuss = await this.service.findAndCount(where);
    return merchantapprovalstatuss;
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
      .registerClient(MerchantApprovalStatusResolver.name)

      .get(MerchantApprovalStatusResolver.name),
    })
  @Query(() => MerchantApprovalStatusResponse<MerchantApprovalStatus>, { nullable: true })
  async findOneMerchantApprovalStatus(
    @Args("where", { type: () => MerchantApprovalStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<MerchantApprovalStatusResponse<MerchantApprovalStatus>> {
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
      .registerClient(MerchantApprovalStatusResolver.name)

      .get(MerchantApprovalStatusResolver.name),
    })
  @Query(() => MerchantApprovalStatusResponse<MerchantApprovalStatus>)
  async findOneMerchantApprovalStatusOrFail(
    @Args("where", { type: () => MerchantApprovalStatusDto, nullable: false })
    where: Record<string, any>
  ): Promise<MerchantApprovalStatusResponse<MerchantApprovalStatus> | Error> {
    return this.service.findOneOrFail(where);
  }
}

