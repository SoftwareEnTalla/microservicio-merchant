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
import { Merchant } from "../entities/merchant.entity";

//Definición de comandos
import {
  CreateMerchantCommand,
  UpdateMerchantCommand,
  DeleteMerchantCommand,
} from "../commands/exporting.command";

import { CommandBus } from "@nestjs/cqrs";
import { MerchantQueryService } from "../services/merchantquery.service";


import { MerchantResponse, MerchantsResponse } from "../types/merchant.types";
import { FindManyOptions } from "typeorm";
import { PaginationArgs } from "src/common/dto/args/pagination.args";
import { fromObject } from "src/utils/functions";

//Logger
import { LogExecutionTime } from "src/common/logger/loggers.functions";
import { LoggerClient } from "src/common/logger/logger.client";
import { logger } from '@core/logs/logger';

import { v4 as uuidv4 } from "uuid";

//Definición de tdos
import { UpdateMerchantDto, 
CreateOrUpdateMerchantDto, 
MerchantValueInput, 
MerchantDto, 
CreateMerchantDto } from "../dtos/all-dto";
 

//@UseGuards(JwtGraphQlAuthGuard)
@Resolver(() => Merchant)
export class MerchantResolver {

   //Constructor del resolver de Merchant
  constructor(
    private readonly service: MerchantQueryService,
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
      .registerClient(MerchantResolver.name)

      .get(MerchantResolver.name),
    })
  // Mutaciones
  @Mutation(() => MerchantResponse<Merchant>)
  async createMerchant(
    @Args("input", { type: () => CreateMerchantDto }) input: CreateMerchantDto
  ): Promise<MerchantResponse<Merchant>> {
    return this.commandBus.execute(new CreateMerchantCommand(input));
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
      .registerClient(MerchantResolver.name)

      .get(MerchantResolver.name),
    })
  @Mutation(() => MerchantResponse<Merchant>)
  async updateMerchant(
    @Args("id", { type: () => String }) id: string,
    @Args("input") input: UpdateMerchantDto
  ): Promise<MerchantResponse<Merchant>> {
    const payLoad = input;
    return this.commandBus.execute(
      new UpdateMerchantCommand(payLoad, {
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
      .registerClient(MerchantResolver.name)

      .get(MerchantResolver.name),
    })
  @Mutation(() => MerchantResponse<Merchant>)
  async createOrUpdateMerchant(
    @Args("data", { type: () => CreateOrUpdateMerchantDto })
    data: CreateOrUpdateMerchantDto
  ): Promise<MerchantResponse<Merchant>> {
    if (data.id) {
      const existingMerchant = await this.service.findById(data.id);
      if (existingMerchant) {
        return this.commandBus.execute(
          new UpdateMerchantCommand(data, {
            instance: data,
            metadata: {
              initiatedBy:
                (data.input as CreateMerchantDto | UpdateMerchantDto).createdBy ||
                'system',
              correlationId: data.id,
            },
          })
        );
      }
    }
    return this.commandBus.execute(
      new CreateMerchantCommand(data, {
        instance: data,
        metadata: {
          initiatedBy:
            (data.input as CreateMerchantDto | UpdateMerchantDto).createdBy ||
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
      .registerClient(MerchantResolver.name)

      .get(MerchantResolver.name),
    })
  @Mutation(() => Boolean)
  async deleteMerchant(
    @Args("id", { type: () => String }) id: string
  ): Promise<boolean> {
    return this.commandBus.execute(new DeleteMerchantCommand(id));
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
      .registerClient(MerchantResolver.name)

      .get(MerchantResolver.name),
    })
  // Queries
  @Query(() => MerchantsResponse<Merchant>)
  async merchants(
    options?: FindManyOptions<Merchant>,
    paginationArgs?: PaginationArgs
  ): Promise<MerchantsResponse<Merchant>> {
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
      .registerClient(MerchantResolver.name)

      .get(MerchantResolver.name),
    })
  @Query(() => MerchantsResponse<Merchant>)
  async merchant(
    @Args("id", { type: () => String }) id: string
  ): Promise<MerchantResponse<Merchant>> {
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
      .registerClient(MerchantResolver.name)

      .get(MerchantResolver.name),
    })
  @Query(() => MerchantsResponse<Merchant>)
  async merchantsByField(
    @Args("field", { type: () => String }) field: string,
    @Args("value", { type: () => MerchantValueInput }) value: MerchantValueInput,
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<MerchantsResponse<Merchant>> {
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
      .registerClient(MerchantResolver.name)

      .get(MerchantResolver.name),
    })
  @Query(() => MerchantsResponse<Merchant>)
  async merchantsWithPagination(
    @Args("page", { type: () => Number, defaultValue: 1 }) page: number,
    @Args("limit", { type: () => Number, defaultValue: 10 }) limit: number
  ): Promise<MerchantsResponse<Merchant>> {
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
      .registerClient(MerchantResolver.name)

      .get(MerchantResolver.name),
    })
  @Query(() => Number)
  async totalMerchants(): Promise<number> {
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
      .registerClient(MerchantResolver.name)

      .get(MerchantResolver.name),
    })
  @Query(() => MerchantsResponse<Merchant>)
  async searchMerchants(
    @Args("where", { type: () => MerchantDto, nullable: false })
    where: Record<string, any>
  ): Promise<MerchantsResponse<Merchant>> {
    const merchants = await this.service.findAndCount(where);
    return merchants;
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
      .registerClient(MerchantResolver.name)

      .get(MerchantResolver.name),
    })
  @Query(() => MerchantResponse<Merchant>, { nullable: true })
  async findOneMerchant(
    @Args("where", { type: () => MerchantDto, nullable: false })
    where: Record<string, any>
  ): Promise<MerchantResponse<Merchant>> {
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
      .registerClient(MerchantResolver.name)

      .get(MerchantResolver.name),
    })
  @Query(() => MerchantResponse<Merchant>)
  async findOneMerchantOrFail(
    @Args("where", { type: () => MerchantDto, nullable: false })
    where: Record<string, any>
  ): Promise<MerchantResponse<Merchant> | Error> {
    return this.service.findOneOrFail(where);
  }
}

