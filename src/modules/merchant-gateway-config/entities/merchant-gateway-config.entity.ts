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

import { Column, Entity, OneToOne, JoinColumn, ChildEntity, ManyToOne, OneToMany, ManyToMany, JoinTable, Index, Check, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { CreateMerchantGatewayConfigDto, UpdateMerchantGatewayConfigDto, DeleteMerchantGatewayConfigDto } from '../dtos/all-dto';
import { IsBoolean, IsDate, IsInt, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';
import { plainToInstance } from 'class-transformer';
import { Merchant } from '../../merchant/entities/merchant.entity';

@Index('idx_merchant_gateway_config_code', ['code'], { unique: true })
@Index('idx_merchant_gateway_config_merchant_gateway', ['merchantId', 'gatewayId'], { unique: true })
@Unique('uq_merchant_gateway_config_code', ['code'])
@Check('chk_merchant_gateway_priority_non_negative', '"displayPriority" >= 0')
@ChildEntity('merchantgatewayconfig')
@ObjectType()
export class MerchantGatewayConfig extends BaseEntity {
  @ApiProperty({
    type: String,
    nullable: false,
    description: "Nombre de la instancia de MerchantGatewayConfig",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Nombre de la instancia de MerchantGatewayConfig", nullable: false })
  @Column({ type: 'varchar', length: 100, nullable: false, comment: 'Este es un campo para nombrar la instancia MerchantGatewayConfig' })
  private name!: string;

  @ApiProperty({
    type: String,
    description: "Descripción de la instancia de MerchantGatewayConfig",
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: "Descripción de la instancia de MerchantGatewayConfig", nullable: false })
  @Column({ type: 'varchar', length: 255, nullable: false, default: "Sin descripción", comment: 'Este es un campo para describir la instancia MerchantGatewayConfig' })
  private description!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Código de la configuración de pasarela',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Código de la configuración de pasarela', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 60, unique: true, comment: 'Código de la configuración de pasarela' })
  code!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Comercio asociado',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Comercio asociado', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Comercio asociado' })
  merchantId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Pasarela asociada',
  })
  @IsUUID()
  @IsNotEmpty()
  @Field(() => String, { description: 'Pasarela asociada', nullable: false })
  @Column({ type: 'uuid', nullable: false, comment: 'Pasarela asociada' })
  gatewayId!: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Estado de configuración para la pasarela',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Estado de configuración para la pasarela', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'NOT_CONFIGURED', comment: 'Estado de configuración para la pasarela' })
  status!: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
    description: 'Prioridad de visualización al cliente',
  })
  @IsInt()
  @IsNotEmpty()
  @Field(() => Int, { description: 'Prioridad de visualización al cliente', nullable: false })
  @Column({ type: 'int', nullable: false, default: 100, comment: 'Prioridad de visualización al cliente' })
  displayPriority!: number;

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Monedas aceptadas por el comercio en esta pasarela',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Monedas aceptadas por el comercio en esta pasarela', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Monedas aceptadas por el comercio en esta pasarela' })
  acceptedCurrencies?: Record<string, any> = {};

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Métodos de pago aceptados para esta pasarela',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Métodos de pago aceptados para esta pasarela', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Métodos de pago aceptados para esta pasarela' })
  acceptedPaymentMethodTypes?: Record<string, any> = {};

  @ApiProperty({
    type: () => String,
    nullable: false,
    description: 'Modo de liquidación',
  })
  @IsString()
  @IsNotEmpty()
  @Field(() => String, { description: 'Modo de liquidación', nullable: false })
  @Column({ type: 'varchar', nullable: false, length: 255, default: 'AUTOMATIC', comment: 'Modo de liquidación' })
  settlementMode!: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Descriptor principal de pagos',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Descriptor principal de pagos', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Descriptor principal de pagos' })
  descriptorName?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Descriptor secundario',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Descriptor secundario', nullable: true })
  @Column({ type: 'varchar', nullable: true, length: 120, comment: 'Descriptor secundario' })
  softDescriptor?: string = '';

  @ApiProperty({
    type: () => String,
    nullable: true,
    description: 'Notas operativas',
  })
  @IsString()
  @IsOptional()
  @Field(() => String, { description: 'Notas operativas', nullable: true })
  @Column({ type: 'text', nullable: true, comment: 'Notas operativas' })
  operationalNotes?: string = '';

  @ApiProperty({
    type: () => Object,
    nullable: true,
    description: 'Metadatos de configuración',
  })
  @IsObject()
  @IsOptional()
  @Field(() => GraphQLJSON, { description: 'Metadatos de configuración', nullable: true })
  @Column({ type: 'json', nullable: true, comment: 'Metadatos de configuración' })
  metadata?: Record<string, any> = {};

  @ApiProperty({
    type: () => Merchant,
    nullable: false,
    description: 'Relación con Merchant',
  })
  @Field(() => Merchant, { nullable: false })
  @ManyToOne(() => Merchant, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'merchantId' })
  merchant!: Merchant;

  // Referencia externa a PaymentGateway del bounded context payment; se integra vía event-driven sin dependencia ORM directa.

  protected executeDslLifecycle(): void {
    // Rule: active-config-requires-active-flag
    // Una configuración activa debe tener indicador de activación verdadero.
    if (!(this.status === 'ACTIVE' && this.isActive === true)) {
      throw new Error('MERCHANT_GATEWAY_001: No se puede marcar una configuración como activa sin isActive=true');
    }
  }

  // Relación con BaseEntity (opcional, si aplica)
  // @OneToOne(() => BaseEntity, { cascade: true })
  // @JoinColumn()
  // base!: BaseEntity;

  constructor() {
    super();
    this.type = 'merchantgatewayconfig';
  }

  // Getters y Setters
  get getName(): string {
    return this.name;
  }
  set setName(value: string) {
    this.name = value;
  }
  get getDescription(): string {
    return this.description;
  }

  // Métodos abstractos implementados
  async create(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async update(data: any): Promise<BaseEntity> {
    Object.assign(this, data);
    this.executeDslLifecycle();
    this.modificationDate = new Date();
    return this;
  }
  async delete(id: string): Promise<BaseEntity> {
    this.id = id;
    return this;
  }

  // Método estático para convertir DTOs a entidad con sobrecarga
  static fromDto(dto: CreateMerchantGatewayConfigDto): MerchantGatewayConfig;
  static fromDto(dto: UpdateMerchantGatewayConfigDto): MerchantGatewayConfig;
  static fromDto(dto: DeleteMerchantGatewayConfigDto): MerchantGatewayConfig;
  static fromDto(dto: any): MerchantGatewayConfig {
    // plainToInstance soporta todos los DTOs
    return plainToInstance(MerchantGatewayConfig, dto);
  }
}
