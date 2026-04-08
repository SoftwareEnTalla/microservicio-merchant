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


import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { CreateMerchantGatewayConfigDto, UpdateMerchantGatewayConfigDto } from "../dtos/all-dto";
import { createUnionType } from "@nestjs/graphql";

@ValidatorConstraint({ name: "isCreateOrUpdateMerchantGatewayConfigDtoType", async: false })
export class IsMerchantGatewayConfigTypeConstraint implements ValidatorConstraintInterface {
  validate(value: any) {
    // Verifica si el valor es un objeto y tiene la estructura esperada
    return (
      value instanceof CreateMerchantGatewayConfigDto || value instanceof UpdateMerchantGatewayConfigDto
    );
  }

  defaultMessage() {
    return "El valor debe ser un objeto de tipo CreateMerchantGatewayConfigDto o UpdateMerchantGatewayConfigDto";
  }
}

export function isCreateOrUpdateMerchantGatewayConfigDtoType(
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsMerchantGatewayConfigTypeConstraint,
    });
  };
}

// Crear un tipo de unión para GraphQL
export const MerchantGatewayConfigUnion = createUnionType({
  name: 'MerchantGatewayConfigUnion',
  types: () => [CreateMerchantGatewayConfigDto, UpdateMerchantGatewayConfigDto] as const,
});

