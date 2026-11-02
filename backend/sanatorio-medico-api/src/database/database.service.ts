import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import pg from 'pg';

const { Pool } = pg;

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool: pg.Pool;

  onModuleInit() {
    this.pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sanatorio_medico',
    });
  }

  async query(text: string, params?: any[]) {
    return this.pool.query(text, params);
  }

  async probarConexion() {
    try {
      const res = await this.pool.query('SELECT NOW()');
      return {
        exito: 1,
        mensaje: 'Conexión a la base de datos exitosa.',
        fechaServidor: res.rows[0].now,
      };
    } catch (error) {
      const mensaje = error instanceof Error ? error.message : 'Error desconocido al conectar.';
      return {
        exito: 0,
        mensaje: `Error al conectar a la base de datos: ${mensaje}`,
      };
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}