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
import { MerchantCommandController } from "../controllers/merchantcommand.controller";
import { MerchantQueryController } from "../controllers/merchantquery.controller";
import { MerchantCommandService } from "../services/merchantcommand.service";
import { MerchantQueryService } from "../services/merchantquery.service";
import { MerchantCommandRepository } from "../repositories/merchantcommand.repository";
import { MerchantQueryRepository } from "../repositories/merchantquery.repository";
import { MerchantRepository } from "../repositories/merchant.repository";
import { MerchantResolver } from "../graphql/merchant.resolver";
import { MerchantAuthGuard } from "../guards/merchantauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Merchant } from "../entities/merchant.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateMerchantHandler } from "../commands/handlers/createmerchant.handler";
import { UpdateMerchantHandler } from "../commands/handlers/updatemerchant.handler";
import { DeleteMerchantHandler } from "../commands/handlers/deletemerchant.handler";
import { GetMerchantByIdHandler } from "../queries/handlers/getmerchantbyid.handler";
import { GetMerchantByFieldHandler } from "../queries/handlers/getmerchantbyfield.handler";
import { GetAllMerchantHandler } from "../queries/handlers/getallmerchant.handler";
import { MerchantCrudSaga } from "../sagas/merchant-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { MerchantInterceptor } from "../interceptors/merchant.interceptor";
import { MerchantLoggingInterceptor } from "../interceptors/merchant.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, Merchant]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [MerchantCommandController, MerchantQueryController],
  providers: [
    //Services
    EventStoreService,
    MerchantQueryService,
    MerchantCommandService,
    //Repositories
    MerchantCommandRepository,
    MerchantQueryRepository,
    MerchantRepository,      
    //Resolvers
    MerchantResolver,
    //Guards
    MerchantAuthGuard,
    //Interceptors
    MerchantInterceptor,
    MerchantLoggingInterceptor,
    //CQRS Handlers
    CreateMerchantHandler,
    UpdateMerchantHandler,
    DeleteMerchantHandler,
    GetMerchantByIdHandler,
    GetMerchantByFieldHandler,
    GetAllMerchantHandler,
    MerchantCrudSaga,
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
    MerchantQueryService,
    MerchantCommandService,
    //Repositories
    MerchantCommandRepository,
    MerchantQueryRepository,
    MerchantRepository,      
    //Resolvers
    MerchantResolver,
    //Guards
    MerchantAuthGuard,
    //Interceptors
    MerchantInterceptor,
    MerchantLoggingInterceptor,
  ],
})
export class MerchantModule {}

