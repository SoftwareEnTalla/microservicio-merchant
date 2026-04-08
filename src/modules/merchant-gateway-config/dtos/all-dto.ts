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
export class BaseMerchantGatewayConfigDto {
  @ApiProperty({
    type: () => String,
    description: 'Nombre de instancia CreateMerchantGatewayConfig',
    example: 'Nombre de instancia CreateMerchantGatewayConfig',
    nullable: false,
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  name: string = '';

  // Propiedades predeterminadas de la clase CreateMerchantGatewayConfigDto según especificación del sistema

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de creación de la instancia (CreateMerchantGatewayConfig).',
    example: 'Fecha de creación de la instancia (CreateMerchantGatewayConfig).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  creationDate: Date = new Date(); // Fecha de creación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => Date,
    description: 'Fecha de actualización de la instancia (CreateMerchantGatewayConfig).',
    example: 'Fecha de actualización de la instancia (CreateMerchantGatewayConfig).',
    nullable: false,
  })
  @IsDate()
  @IsNotEmpty()
  @Field(() => Date, { nullable: false })
  modificationDate: Date = new Date(); // Fecha de modificación por defecto, con precisión hasta milisegundos

  @ApiProperty({
    type: () => String,
    description:
      'Usuario que realiza la creación de la instancia (CreateMerchantGatewayConfig).',
    example:
      'Usuario que realiza la creación de la instancia (CreateMerchantGatewayConfig).',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  createdBy?: string; // Usuario que crea el objeto

  @ApiProperty({
    type: () => Boolean,
    description: 'Estado de activación de la instancia (CreateMerchantGatewayConfig).',
    example: 'Estado de activación de la instancia (CreateMerchantGatewayConfig).',
    nullable: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  @Field(() => Boolean, { nullable: false })
  isActive: boolean = false; // Por defecto, el objeto no está activo

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código de la configuración de pasarela',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código de la configuración de pasarela', nullable: false })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Comercio asociado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Comercio asociado', nullable: false })
  merchantId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Pasarela asociada',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Pasarela asociada', nullable: false })
  gatewayId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de configuración para la pasarela',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de configuración para la pasarela', nullable: false })
  status!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Prioridad de visualización al cliente',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Prioridad de visualización al cliente', nullable: false })
  displayPriority!: number;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Monedas aceptadas por el comercio en esta pasarela',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Monedas aceptadas por el comercio en esta pasarela', nullable: true })
  acceptedCurrencies?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Métodos de pago aceptados para esta pasarela',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Métodos de pago aceptados para esta pasarela', nullable: true })
  acceptedPaymentMethodTypes?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Modo de liquidación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Modo de liquidación', nullable: false })
  settlementMode!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Descriptor principal de pagos',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Descriptor principal de pagos', nullable: true })
  descriptorName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Descriptor secundario',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Descriptor secundario', nullable: true })
  softDescriptor?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Notas operativas',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Notas operativas', nullable: true })
  operationalNotes?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de configuración',
  })
  @IsObject()
  @IsOptional()
  @Field(() => String, { description: 'Metadatos de configuración', nullable: true })
  metadata?: Record<string, any> = {};

  // Constructor
  constructor(partial: Partial<BaseMerchantGatewayConfigDto>) {
    Object.assign(this, partial);
  }
}




@InputType()
export class MerchantGatewayConfigDto extends BaseMerchantGatewayConfigDto {
  // Propiedades específicas de la clase MerchantGatewayConfigDto en cuestión

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
  constructor(partial: Partial<MerchantGatewayConfigDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<MerchantGatewayConfigDto>): MerchantGatewayConfigDto {
    const instance = new MerchantGatewayConfigDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 




@InputType()
export class MerchantGatewayConfigValueInput {
  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Campo de filtro',
  })
  @Field({ nullable: false })
  fieldName: string = 'id';

  @ApiProperty({
    type: () => MerchantGatewayConfigDto,
    nullable: false,
    description: 'Valor del filtro',
  })
  @Field(() => MerchantGatewayConfigDto, { nullable: false })
  fieldValue: any; // Permite cualquier tipo
} 




@ObjectType()
export class MerchantGatewayConfigOutPutDto extends BaseMerchantGatewayConfigDto {
  // Propiedades específicas de la clase MerchantGatewayConfigOutPutDto en cuestión

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
  constructor(partial: Partial<MerchantGatewayConfigOutPutDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<MerchantGatewayConfigOutPutDto>): MerchantGatewayConfigOutPutDto {
    const instance = new MerchantGatewayConfigOutPutDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateMerchantGatewayConfigDto extends BaseMerchantGatewayConfigDto {
  // Propiedades específicas de la clase CreateMerchantGatewayConfigDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a crear',
    example:
      'Se proporciona un identificador de CreateMerchantGatewayConfig a crear \(opcional\) ',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  id?: string;

  // Constructor
  constructor(partial: Partial<CreateMerchantGatewayConfigDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<CreateMerchantGatewayConfigDto>): CreateMerchantGatewayConfigDto {
    const instance = new CreateMerchantGatewayConfigDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
}



@InputType()
export class CreateOrUpdateMerchantGatewayConfigDto {
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
    type: () => CreateMerchantGatewayConfigDto,
    description: 'Instancia CreateMerchantGatewayConfig o UpdateMerchantGatewayConfig',
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Field(() => CreateMerchantGatewayConfigDto, { nullable: true })
  input?: CreateMerchantGatewayConfigDto | UpdateMerchantGatewayConfigDto; // Asegúrate de que esto esté correcto
}



@InputType()
export class DeleteMerchantGatewayConfigDto {
  // Propiedades específicas de la clase DeleteMerchantGatewayConfigDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a eliminar',
    example: 'Se proporciona un identificador de DeleteMerchantGatewayConfig a eliminar',
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
      'Se proporciona una lista de identificadores de DeleteMerchantGatewayConfig a eliminar',
    default: [],
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  ids?: string[];
}



@InputType()
export class UpdateMerchantGatewayConfigDto extends BaseMerchantGatewayConfigDto {
  // Propiedades específicas de la clase UpdateMerchantGatewayConfigDto en cuestión

  @ApiProperty({
    type: () => String,
    description: 'Identificador de instancia a actualizar',
    example: 'Se proporciona un identificador de UpdateMerchantGatewayConfig a actualizar',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { nullable: false })
  id!: string;

  // Constructor
  constructor(partial: Partial<UpdateMerchantGatewayConfigDto>) {
    super(partial);
    Object.assign(this, partial);
  }

  // Método estático para construir la instancia
  static build(data: Partial<UpdateMerchantGatewayConfigDto>): UpdateMerchantGatewayConfigDto {
    const instance = new UpdateMerchantGatewayConfigDto(data);
    instance.creationDate = new Date(); // Actualiza la fecha de creación al momento de la creación
    instance.modificationDate = new Date(); // Actualiza la fecha de modificación al momento de la creación
    return instance;
  }
} 

