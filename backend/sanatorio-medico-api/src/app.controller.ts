import { Controller, Get } from '@nestjs/common';
import { DatabaseService } from './database/database.service.js';

@Controller()
export class AppController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('database/test')
  async probarConexion() {
    const conexion = await this.databaseService.probarConexion();

    return {
      exito: conexion ? 1 : 0,
      mensaje: conexion
        ? 'Conexión con PostgreSQL realizada correctamente.'
        : 'No fue posible conectar con PostgreSQL.',
    };
  }
}
