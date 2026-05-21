import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MerchantLifecycleService } from './merchant-lifecycle.service';

@ApiTags('merchant-lifecycle')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Autenticación requerida.' })
@Controller('merchant-lifecycle')
export class MerchantLifecycleController {
  constructor(private readonly service: MerchantLifecycleService) {}

  @Get('summary')
  @ApiOperation({ summary: 'Resumen táctico de readiness, gateways y payout en merchant' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen táctico de merchant.' })
  async getSummary(@Query('limit') limit?: string): Promise<Record<string, unknown>> {
    return this.service.getSummary(Number(limit || 8));
  }
}