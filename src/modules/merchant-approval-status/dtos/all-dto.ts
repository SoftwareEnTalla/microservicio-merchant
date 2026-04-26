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
export class BaseMerchantApprovalStatusDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateMerchantApprovalStatus',
    example: 'Nombre de instancia CreateMerchantApprovalStatus',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateMerchantApprovalStatusDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateMerchantApprovalStatus).',
    example: 'Fecha de creación de la instancia (CreateMerchantApprovalStatus).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateMerchantApprovalStatus).',
    example: 'Fecha de actualización de la instancia (CreateMerchantApprovalStatus).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateMerchantApprovalStatus).',
    example:
      'Usuario que realiza la creación de la instancia (CreateMerchantApprovalStatus).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateMerchantApprovalStatus).',
    example: 'Estado de activación de la instancia (CreateMerchantApprovalStatus).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código del nomenclador',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código del nomenclador', nullable: false })
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
    description: 'Configuración adicional',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Configuración adicional', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseMerchantApprovalStatusDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class MerchantApprovalStatusDto extends BaseMerchantApprovalStatusDto {
  // Propiedades específicas de la clase MerchantApprovalStatusDto en cuestión

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
  constructor(partial: Partial<MerchantApprovalStatusDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<MerchantApprovalStatusDto>): MerchantApprovalStatusDto {
    const instance = new MerchantApprovalStatusDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class MerchantApprovalStatusValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => MerchantApprovalStatusDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => MerchantApprovalStatusDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class MerchantApprovalStatusOutPutDto extends BaseMerchantApprovalStatusDto {
  // Propiedades específicas de la clase MerchantApprovalStatusOutPutDto en cuestión

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
  constructor(partial: Partial<MerchantApprovalStatusOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<MerchantApprovalStatusOutPutDto>): MerchantApprovalStatusOutPutDto {
    const instance = new MerchantApprovalStatusOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateMerchantApprovalStatusDto extends BaseMerchantApprovalStatusDto {
  // Propiedades específicas de la clase CreateMerchantApprovalStatusDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateMerchantApprovalStatus a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateMerchantApprovalStatusDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateMerchantApprovalStatusDto>): CreateMerchantApprovalStatusDto {
    const instance = new CreateMerchantApprovalStatusDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateMerchantApprovalStatusDto {
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
    type: () => CreateMerchantApprovalStatusDto,
    description: 'Instancia CreateMerchantApprovalStatus o UpdateMerchantApprovalStatus',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateMerchantApprovalStatusDto, { nullable: true })
  input?: CreateMerchantApprovalStatusDto | UpdateMerchantApprovalStatusDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteMerchantApprovalStatusDto {
  // Propiedades específicas de la clase DeleteMerchantApprovalStatusDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteMerchantApprovalStatus a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteMerchantApprovalStatus a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateMerchantApprovalStatusDto extends BaseMerchantApprovalStatusDto {
  // Propiedades específicas de la clase UpdateMerchantApprovalStatusDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateMerchantApprovalStatus a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateMerchantApprovalStatusDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateMerchantApprovalStatusDto>): UpdateMerchantApprovalStatusDto {
    const instance = new UpdateMerchantApprovalStatusDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 



