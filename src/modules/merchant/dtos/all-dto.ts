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
export class BaseMerchantDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateMerchant',
    example: 'Nombre de instancia CreateMerchant',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateMerchantDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateMerchant).',
    example: 'Fecha de creación de la instancia (CreateMerchant).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateMerchant).',
    example: 'Fecha de actualización de la instancia (CreateMerchant).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateMerchant).',
    example:
      'Usuario que realiza la creación de la instancia (CreateMerchant).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateMerchant).',
    example: 'Estado de activación de la instancia (CreateMerchant).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Referencia canónica al user del microservicio security',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Referencia canónica al user del microservicio security', nullable: false })
  userId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código comercial usado para identificación y QR',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código comercial usado para identificación y QR', nullable: false })
  merchantCode!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Nombre visible del comercio',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Nombre visible del comercio', nullable: false })
  displayName!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Representante legal del comercio',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Representante legal del comercio', nullable: true })
  legalRepresentative?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Razón social del comercio',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Razón social del comercio', nullable: true })
  legalName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Identificador fiscal',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Identificador fiscal', nullable: true })
  fiscalIdentifier?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de aprobación operativa',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de aprobación operativa', nullable: false })
  approvalStatus!: string;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Cuentas bancarias del comercio',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Cuentas bancarias del comercio', nullable: true })
  bankAccounts?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Medios de cobro del comercio',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Medios de cobro del comercio', nullable: true })
  collectionMethods?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos del comercio',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos del comercio', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseMerchantDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class MerchantDto extends BaseMerchantDto {
  // Propiedades específicas de la clase MerchantDto en cuestión

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
  constructor(partial: Partial<MerchantDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<MerchantDto>): MerchantDto {
    const instance = new MerchantDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class MerchantValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => MerchantDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => MerchantDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class MerchantOutPutDto extends BaseMerchantDto {
  // Propiedades específicas de la clase MerchantOutPutDto en cuestión

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
  constructor(partial: Partial<MerchantOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<MerchantOutPutDto>): MerchantOutPutDto {
    const instance = new MerchantOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateMerchantDto extends BaseMerchantDto {
  // Propiedades específicas de la clase CreateMerchantDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateMerchant a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateMerchantDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateMerchantDto>): CreateMerchantDto {
    const instance = new CreateMerchantDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateMerchantDto {
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
    type: () => CreateMerchantDto,
    description: 'Instancia CreateMerchant o UpdateMerchant',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateMerchantDto, { nullable: true })
  input?: CreateMerchantDto | UpdateMerchantDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteMerchantDto {
  // Propiedades específicas de la clase DeleteMerchantDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteMerchant a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteMerchant a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateMerchantDto extends BaseMerchantDto {
  // Propiedades específicas de la clase UpdateMerchantDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateMerchant a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateMerchantDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateMerchantDto>): UpdateMerchantDto {
    const instance = new UpdateMerchantDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

