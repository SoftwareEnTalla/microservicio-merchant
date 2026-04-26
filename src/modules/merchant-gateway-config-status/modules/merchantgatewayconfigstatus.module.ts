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


import { Module } from "@nestjs/common";
import { MerchantGatewayConfigStatusCommandController } from "../controllers/merchantgatewayconfigstatuscommand.controller";
import { MerchantGatewayConfigStatusQueryController } from "../controllers/merchantgatewayconfigstatusquery.controller";
import { MerchantGatewayConfigStatusCommandService } from "../services/merchantgatewayconfigstatuscommand.service";
import { MerchantGatewayConfigStatusQueryService } from "../services/merchantgatewayconfigstatusquery.service";

import { MerchantGatewayConfigStatusCommandRepository } from "../repositories/merchantgatewayconfigstatuscommand.repository";
import { MerchantGatewayConfigStatusQueryRepository } from "../repositories/merchantgatewayconfigstatusquery.repository";
import { MerchantGatewayConfigStatusRepository } from "../repositories/merchantgatewayconfigstatus.repository";
import { MerchantGatewayConfigStatusResolver } from "../graphql/merchantgatewayconfigstatus.resolver";
import { MerchantGatewayConfigStatusAuthGuard } from "../guards/merchantgatewayconfigstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MerchantGatewayConfigStatus } from "../entities/merchant-gateway-config-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateMerchantGatewayConfigStatusHandler } from "../commands/handlers/createmerchantgatewayconfigstatus.handler";
import { UpdateMerchantGatewayConfigStatusHandler } from "../commands/handlers/updatemerchantgatewayconfigstatus.handler";
import { DeleteMerchantGatewayConfigStatusHandler } from "../commands/handlers/deletemerchantgatewayconfigstatus.handler";
import { GetMerchantGatewayConfigStatusByIdHandler } from "../queries/handlers/getmerchantgatewayconfigstatusbyid.handler";
import { GetMerchantGatewayConfigStatusByFieldHandler } from "../queries/handlers/getmerchantgatewayconfigstatusbyfield.handler";
import { GetAllMerchantGatewayConfigStatusHandler } from "../queries/handlers/getallmerchantgatewayconfigstatus.handler";
import { MerchantGatewayConfigStatusCrudSaga } from "../sagas/merchantgatewayconfigstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { MerchantGatewayConfigStatusInterceptor } from "../interceptors/merchantgatewayconfigstatus.interceptor";
import { MerchantGatewayConfigStatusLoggingInterceptor } from "../interceptors/merchantgatewayconfigstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, MerchantGatewayConfigStatus]), // Incluir BaseEntity para herencia
    CacheModule.registerAsync({
      useFactory: async () => {
        try {
          const store = await redisStore({
            socket: { host: process.env.REDIS_HOST || "data-center-redis", port: parseInt(process.env.REDIS_PORT || "6379", 10) },
            ttl: parseInt(process.env.REDIS_TTL || "60", 10),
          });
          return { store: store as any, isGlobal: true };
        } catch {
          return { isGlobal: true }; // fallback in-memory
        }
      },
    }),
  ],
  controllers: [MerchantGatewayConfigStatusCommandController, MerchantGatewayConfigStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    MerchantGatewayConfigStatusQueryService,
    MerchantGatewayConfigStatusCommandService,
  
    //Repositories
    MerchantGatewayConfigStatusCommandRepository,
    MerchantGatewayConfigStatusQueryRepository,
    MerchantGatewayConfigStatusRepository,      
    //Resolvers
    MerchantGatewayConfigStatusResolver,
    //Guards
    MerchantGatewayConfigStatusAuthGuard,
    //Interceptors
    MerchantGatewayConfigStatusInterceptor,
    MerchantGatewayConfigStatusLoggingInterceptor,
    //CQRS Handlers
    CreateMerchantGatewayConfigStatusHandler,
    UpdateMerchantGatewayConfigStatusHandler,
    DeleteMerchantGatewayConfigStatusHandler,
    GetMerchantGatewayConfigStatusByIdHandler,
    GetMerchantGatewayConfigStatusByFieldHandler,
    GetAllMerchantGatewayConfigStatusHandler,
    MerchantGatewayConfigStatusCrudSaga,
    //Configurations
    {
      provide: 'EVENT_SOURCING_CONFIG',
      useFactory: () => ({
        enabled: process.env.EVENT_SOURCING_ENABLED !== 'false',
        kafkaEnabled: process.env.KAFKA_ENABLED !== 'false',
        eventStoreEnabled: process.env.EVENT_STORE_ENABLED === 'true',
        publishEvents: true,
        useProjections: true,
        topics: EVENT_TOPICS
      })
    },
  ],
  exports: [
    CqrsModule,
    KafkaModule,
    //Services
    EventStoreService,
    MerchantGatewayConfigStatusQueryService,
    MerchantGatewayConfigStatusCommandService,
  
    //Repositories
    MerchantGatewayConfigStatusCommandRepository,
    MerchantGatewayConfigStatusQueryRepository,
    MerchantGatewayConfigStatusRepository,      
    //Resolvers
    MerchantGatewayConfigStatusResolver,
    //Guards
    MerchantGatewayConfigStatusAuthGuard,
    //Interceptors
    MerchantGatewayConfigStatusInterceptor,
    MerchantGatewayConfigStatusLoggingInterceptor,
  ],
})
export class MerchantGatewayConfigStatusModule {}

