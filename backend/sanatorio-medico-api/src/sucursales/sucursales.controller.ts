import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { SucursalesService } from './sucursales.service.js';

@Controller('api')
export class SucursalesController {
  constructor(
    private readonly sucursalesService: SucursalesService,
  ) {}

  // ============================================================
  // GET: CONSULTAR TODAS LAS SUCURSALES
  // ============================================================
  @Get('sucursalesConsultar')
  async consultar() {
    return this.sucursalesService.consultar();
  }

  // ============================================================
  // GET: BUSCAR SUCURSAL POR CÓDIGO
  // ============================================================
  @Get('sucursalesBuscar/:codigoSucursal')
  async buscar(
    @Param('codigoSucursal', ParseIntPipe)
    codigoSucursal: number,
  ) {
    return this.sucursalesService.buscar(codigoSucursal);
  }

  // ============================================================
  // POST: AGREGAR SUCURSAL
  // ============================================================
  @Post('sucursalesAgregar')
  async agregar(
    @Body()
    body: {
      nombreSucursal: string;
      direccion: string;
      fechaApertura: string;
      horaApertura: string;
      presupuestoMensual: number;
      estado: boolean;
    },
  ) {
    return this.sucursalesService.agregar(body);
  }

  // ============================================================
  // PUT: EDITAR SUCURSAL
  // ============================================================
  @Put('sucursalesEditar/:codigoSucursal')
  async editar(
    @Param('codigoSucursal', ParseIntPipe)
    codigoSucursal: number,
    @Body()
    body: {
      nombreSucursal: string;
      direccion: string;
      fechaApertura: string;
      horaApertura: string;
      presupuestoMensual: number;
      estado: boolean;
    },
  ) {
    return this.sucursalesService.editar(codigoSucursal, body);
  }

  // ============================================================
  // DELETE: ELIMINAR SUCURSAL
  // ============================================================
  @Delete('sucursalesEliminar/:codigoSucursal')
  async eliminar(
    @Param('codigoSucursal', ParseIntPipe)
    codigoSucursal: number,
  ) {
    return this.sucursalesService.eliminar(codigoSucursal);
  }
}