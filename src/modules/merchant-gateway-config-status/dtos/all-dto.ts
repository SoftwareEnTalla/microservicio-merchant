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

import { InputType, Field, Float, Int, ObjectType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  IsUUID,
  ValidateNested,
} from 'class-validator';




@InputType()
export class BaseMerchantGatewayConfigStatusDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateMerchantGatewayConfigStatus',
    example: 'Nombre de instancia CreateMerchantGatewayConfigStatus',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateMerchantGatewayConfigStatusDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateMerchantGatewayConfigStatus).',
    example: 'Fecha de creación de la instancia (CreateMerchantGatewayConfigStatus).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateMerchantGatewayConfigStatus).',
    example: 'Fecha de actualización de la instancia (CreateMerchantGatewayConfigStatus).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateMerchantGatewayConfigStatus).',
    example:
      'Usuario que realiza la creación de la instancia (CreateMerchantGatewayConfigStatus).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateMerchantGatewayConfigStatus).',
    example: 'Estado de activación de la instancia (CreateMerchantGatewayConfigStatus).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Codigo del nomenclador',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Codigo del nomenclador', nullable: false })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre visible',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre visible', nullable: false })
  displayName!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Configuracion adicional',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Configuracion adicional', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseMerchantGatewayConfigStatusDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class MerchantGatewayConfigStatusDto extends BaseMerchantGatewayConfigStatusDto {
  // Propiedades específicas de la clase MerchantGatewayConfigStatusDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<MerchantGatewayConfigStatusDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<MerchantGatewayConfigStatusDto>): MerchantGatewayConfigStatusDto {
    const instance = new MerchantGatewayConfigStatusDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class MerchantGatewayConfigStatusValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => MerchantGatewayConfigStatusDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => MerchantGatewayConfigStatusDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class MerchantGatewayConfigStatusOutPutDto extends BaseMerchantGatewayConfigStatusDto {
  // Propiedades específicas de la clase MerchantGatewayConfigStatusOutPutDto en cuestión

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador único de la instancia',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<MerchantGatewayConfigStatusOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<MerchantGatewayConfigStatusOutPutDto>): MerchantGatewayConfigStatusOutPutDto {
    const instance = new MerchantGatewayConfigStatusOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateMerchantGatewayConfigStatusDto extends BaseMerchantGatewayConfigStatusDto {
  // Propiedades específicas de la clase CreateMerchantGatewayConfigStatusDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateMerchantGatewayConfigStatus a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateMerchantGatewayConfigStatusDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateMerchantGatewayConfigStatusDto>): CreateMerchantGatewayConfigStatusDto {
    const instance = new CreateMerchantGatewayConfigStatusDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateMerchantGatewayConfigStatusDto {
  @ApiProperty({
    type: () => String,
    description: 'Identificador',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  @ApiProperty({
    type: () => CreateMerchantGatewayConfigStatusDto,
    description: 'Instancia CreateMerchantGatewayConfigStatus o UpdateMerchantGatewayConfigStatus',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateMerchantGatewayConfigStatusDto, { nullable: true })
  input?: CreateMerchantGatewayConfigStatusDto | UpdateMerchantGatewayConfigStatusDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteMerchantGatewayConfigStatusDto {
  // Propiedades específicas de la clase DeleteMerchantGatewayConfigStatusDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteMerchantGatewayConfigStatus a eliminar',
    default: '',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id: string = '';

  @ApiProperty({
    type: () => String,
    description: 'Lista de identificadores de instancias a eliminar',
    example:
      'Se proporciona una lista de identificadores de DeleteMerchantGatewayConfigStatus a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateMerchantGatewayConfigStatusDto extends BaseMerchantGatewayConfigStatusDto {
  // Propiedades específicas de la clase UpdateMerchantGatewayConfigStatusDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateMerchantGatewayConfigStatus a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateMerchantGatewayConfigStatusDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateMerchantGatewayConfigStatusDto>): UpdateMerchantGatewayConfigStatusDto {
    const instance = new UpdateMerchantGatewayConfigStatusDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



