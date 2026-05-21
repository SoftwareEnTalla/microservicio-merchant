import { Module } from '@nestjs/common';
import { MerchantLifecycleController } from './merchant-lifecycle.controller';
import { MerchantLifecycleService } from './merchant-lifecycle.service';

@Module({
  controllers: [MerchantLifecycleController],
  providers: [MerchantLifecycleService],
  exports: [MerchantLifecycleService],
})
export class MerchantLifecycleModule {}