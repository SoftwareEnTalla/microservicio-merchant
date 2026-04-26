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


import { ObjectType, Field } from "@nestjs/graphql";
import { GQResponseBase } from "src/common/types/common.types";
import { MerchantGatewayConfigStatus } from "../entities/merchant-gateway-config-status.entity";
import { ApiProperty } from "@nestjs/swagger";

@ObjectType({ description: "Respuesta de merchantgatewayconfigstatus" })
export class MerchantGatewayConfigStatusResponse<T extends MerchantGatewayConfigStatus> extends GQResponseBase {
  @ApiProperty({ type: MerchantGatewayConfigStatus,nullable:false,description:"Datos de respuesta de MerchantGatewayConfigStatus" })
  @Field(() => MerchantGatewayConfigStatus, { description: "Instancia de MerchantGatewayConfigStatus", nullable: true })
  data?: T;


}

@ObjectType({ description: "Respuesta de merchantgatewayconfigstatuss" })
export class MerchantGatewayConfigStatussResponse<T extends MerchantGatewayConfigStatus> extends GQResponseBase {
  @ApiProperty({ type: [MerchantGatewayConfigStatus],nullable:false,description:"Listado de MerchantGatewayConfigStatus",default:[] })
  @Field(() => [MerchantGatewayConfigStatus], { description: "Listado de MerchantGatewayConfigStatus", nullable: false,defaultValue:[] })
  data: T[] = [];

  @ApiProperty({ type: Number,nullable:false,description:"Cantidad de MerchantGatewayConfigStatus",default:0 })
  @Field(() => Number, { description: "Cantidad de MerchantGatewayConfigStatus", nullable: false,defaultValue:0 })
  count: number = 0;
}






