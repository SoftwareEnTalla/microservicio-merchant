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
import { MerchantGatewayConfigCommandController } from "../controllers/merchantgatewayconfigcommand.controller";
import { MerchantGatewayConfigQueryController } from "../controllers/merchantgatewayconfigquery.controller";
import { MerchantGatewayConfigCommandService } from "../services/merchantgatewayconfigcommand.service";
import { MerchantGatewayConfigQueryService } from "../services/merchantgatewayconfigquery.service";
import { MerchantGatewayConfigCommandRepository } from "../repositories/merchantgatewayconfigcommand.repository";
import { MerchantGatewayConfigQueryRepository } from "../repositories/merchantgatewayconfigquery.repository";
import { MerchantGatewayConfigRepository } from "../repositories/merchantgatewayconfig.repository";
import { MerchantGatewayConfigResolver } from "../graphql/merchantgatewayconfig.resolver";
import { MerchantGatewayConfigAuthGuard } from "../guards/merchantgatewayconfigauthguard.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MerchantGatewayConfig } from "../entities/merchant-gateway-config.entity";
import { BaseEntity } from "../entities/base.entity";
import { CacheModule } from "@nestjs/cache-manager";
import { CqrsModule } from "@nestjs/cqrs";
import { KafkaModule } from "./kafka.module";
import { CreateMerchantGatewayConfigHandler } from "../commands/handlers/createmerchantgatewayconfig.handler";
import { UpdateMerchantGatewayConfigHandler } from "../commands/handlers/updatemerchantgatewayconfig.handler";
import { DeleteMerchantGatewayConfigHandler } from "../commands/handlers/deletemerchantgatewayconfig.handler";
import { GetMerchantGatewayConfigByIdHandler } from "../queries/handlers/getmerchantgatewayconfigbyid.handler";
import { GetMerchantGatewayConfigByFieldHandler } from "../queries/handlers/getmerchantgatewayconfigbyfield.handler";
import { GetAllMerchantGatewayConfigHandler } from "../queries/handlers/getallmerchantgatewayconfig.handler";
import { MerchantGatewayConfigCrudSaga } from "../sagas/merchantgatewayconfig-crud.saga";
import { EVENT_TOPICS } from "../events/event-registry";

//Interceptors
import { MerchantGatewayConfigInterceptor } from "../interceptors/merchantgatewayconfig.interceptor";
import { MerchantGatewayConfigLoggingInterceptor } from "../interceptors/merchantgatewayconfig.logging.interceptor";

//Event-Sourcing dependencies
import { EventStoreService } from "../shared/event-store/event-store.service";

@Module({
  imports: [
    CqrsModule,
    KafkaModule,
    TypeOrmModule.forFeature([BaseEntity, MerchantGatewayConfig]), // Incluir BaseEntity para herencia
    CacheModule.register(), // Importa el módulo de caché
  ],
  controllers: [MerchantGatewayConfigCommandController, MerchantGatewayConfigQueryController],
  providers: [
    //Services
    EventStoreService,
    MerchantGatewayConfigQueryService,
    MerchantGatewayConfigCommandService,
    //Repositories
    MerchantGatewayConfigCommandRepository,
    MerchantGatewayConfigQueryRepository,
    MerchantGatewayConfigRepository,      
    //Resolvers
    MerchantGatewayConfigResolver,
    //Guards
    MerchantGatewayConfigAuthGuard,
    //Interceptors
    MerchantGatewayConfigInterceptor,
    MerchantGatewayConfigLoggingInterceptor,
    //CQRS Handlers
    CreateMerchantGatewayConfigHandler,
    UpdateMerchantGatewayConfigHandler,
    DeleteMerchantGatewayConfigHandler,
    GetMerchantGatewayConfigByIdHandler,
    GetMerchantGatewayConfigByFieldHandler,
    GetAllMerchantGatewayConfigHandler,
    MerchantGatewayConfigCrudSaga,
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
    MerchantGatewayConfigQueryService,
    MerchantGatewayConfigCommandService,
    //Repositories
    MerchantGatewayConfigCommandRepository,
    MerchantGatewayConfigQueryRepository,
    MerchantGatewayConfigRepository,      
    //Resolvers
    MerchantGatewayConfigResolver,
    //Guards
    MerchantGatewayConfigAuthGuard,
    //Interceptors
    MerchantGatewayConfigInterceptor,
    MerchantGatewayConfigLoggingInterceptor,
  ],
})
export class MerchantGatewayConfigModule {}

