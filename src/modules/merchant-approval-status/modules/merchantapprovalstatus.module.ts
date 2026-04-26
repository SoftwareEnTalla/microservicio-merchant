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
import { MerchantApprovalStatusCommandController } from "../controllers/merchantapprovalstatuscommand.controller";
import { MerchantApprovalStatusQueryController } from "../controllers/merchantapprovalstatusquery.controller";
import { MerchantApprovalStatusCommandService } from "../services/merchantapprovalstatuscommand.service";
import { MerchantApprovalStatusQueryService } from "../services/merchantapprovalstatusquery.service";

import { MerchantApprovalStatusCommandRepository } from "../repositories/merchantapprovalstatuscommand.repository";
import { MerchantApprovalStatusQueryRepository } from "../repositories/merchantapprovalstatusquery.repository";
import { MerchantApprovalStatusRepository } from "../repositories/merchantapprovalstatus.repository";
import { MerchantApprovalStatusResolver } from "../graphql/merchantapprovalstatus.resolver";
import { MerchantApprovalStatusAuthGuard } from "../guards/merchantapprovalstatusauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MerchantApprovalStatus } from "../entities/merchant-approval-status.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateMerchantApprovalStatusHandler } from "../commands/handlers/createmerchantapprovalstatus.handler";
import { UpdateMerchantApprovalStatusHandler } from "../commands/handlers/updatemerchantapprovalstatus.handler";
import { DeleteMerchantApprovalStatusHandler } from "../commands/handlers/deletemerchantapprovalstatus.handler";
import { GetMerchantApprovalStatusByIdHandler } from "../queries/handlers/getmerchantapprovalstatusbyid.handler";
import { GetMerchantApprovalStatusByFieldHandler } from "../queries/handlers/getmerchantapprovalstatusbyfield.handler";
import { GetAllMerchantApprovalStatusHandler } from "../queries/handlers/getallmerchantapprovalstatus.handler";
import { MerchantApprovalStatusCrudSaga } from "../sagas/merchantapprovalstatus-crud.saga";

import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { MerchantApprovalStatusInterceptor } from "../interceptors/merchantapprovalstatus.interceptor";
import { MerchantApprovalStatusLoggingInterceptor } from "../interceptors/merchantapprovalstatus.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, MerchantApprovalStatus]), // Incluir BaseEntity para herencia
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
  controllers: [MerchantApprovalStatusCommandController, MerchantApprovalStatusQueryController],
  providers: [
    //Services
    EventStoreService,
    MerchantApprovalStatusQueryService,
    MerchantApprovalStatusCommandService,
  
    //Repositories
    MerchantApprovalStatusCommandRepository,
    MerchantApprovalStatusQueryRepository,
    MerchantApprovalStatusRepository,      
    //Resolvers
    MerchantApprovalStatusResolver,
    //Guards
    MerchantApprovalStatusAuthGuard,
    //Interceptors
    MerchantApprovalStatusInterceptor,
    MerchantApprovalStatusLoggingInterceptor,
    //CQRS Handlers
    CreateMerchantApprovalStatusHandler,
    UpdateMerchantApprovalStatusHandler,
    DeleteMerchantApprovalStatusHandler,
    GetMerchantApprovalStatusByIdHandler,
    GetMerchantApprovalStatusByFieldHandler,
    GetAllMerchantApprovalStatusHandler,
    MerchantApprovalStatusCrudSaga,
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
    MerchantApprovalStatusQueryService,
    MerchantApprovalStatusCommandService,
  
    //Repositories
    MerchantApprovalStatusCommandRepository,
    MerchantApprovalStatusQueryRepository,
    MerchantApprovalStatusRepository,      
    //Resolvers
    MerchantApprovalStatusResolver,
    //Guards
    MerchantApprovalStatusAuthGuard,
    //Interceptors
    MerchantApprovalStatusInterceptor,
    MerchantApprovalStatusLoggingInterceptor,
  ],
})
export class MerchantApprovalStatusModule {}

