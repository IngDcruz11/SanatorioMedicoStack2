import { Module } from '@nestjs/common';
import { SucursalesController } from './sucursales.controller.js';
import { SucursalesService } from './sucursales.service.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [SucursalesController],
  providers: [SucursalesService],
  exports: [SucursalesService],
})
export class SucursalesModule {}