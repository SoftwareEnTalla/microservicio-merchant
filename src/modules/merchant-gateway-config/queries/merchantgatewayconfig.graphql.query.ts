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

import { Query, Resolver, Args } from '@nestjs/graphql'; 
import { MerchantGatewayConfigDto } from '../dtos/all-dto';
import { MerchantGatewayConfigGraphqlService } from '../services/merchantgatewayconfig.graphql.service';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => MerchantGatewayConfigDto)
export class MerchantGatewayConfigGraphqlQuery {
  constructor(private readonly service: MerchantGatewayConfigGraphqlService) {}

  @Query(() => [MerchantGatewayConfigDto], { name: 'findAllMerchantGatewayConfigs' })
  async findAll(): Promise<MerchantGatewayConfigDto[]> {
    return this.service.findAll();
  }

  @Query(() => MerchantGatewayConfigDto, { name: 'findMerchantGatewayConfigById' })
  async findById(
    @Args('id', { type: () => String }) id: string
  ): Promise<MerchantGatewayConfigDto> {
    const result = await this.service.findById(id);
    if (!result) {
      throw new NotFoundException("MerchantGatewayConfig con id " + id + " no encontrado");
    }
    return result;
  }
}
