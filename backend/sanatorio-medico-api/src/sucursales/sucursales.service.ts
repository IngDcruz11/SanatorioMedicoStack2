import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class SucursalesService {
  constructor(
    private readonly databaseService: DatabaseService,
  ) {}

  // ============================================================
  // FUNCIONALIDAD: CONSULTAR SUCURSALES
  // ============================================================
  async consultar() {
    try {
      const resultado = await this.databaseService.query(`
        SELECT
          codigosucursal       AS "codigoSucursal",
          nombresucursal       AS "nombreSucursal",
          direccion            AS "direccion",
          fechaapertura        AS "fechaApertura",
          horaapertura         AS "horaApertura",
          presupuestomensual   AS "presupuestoMensual",
          estado               AS "estado"
        FROM Usp_Sucursales_Consultar();
      `);

      return {
        exito: 1,
        mensaje: 'Sucursales consultadas correctamente.',
        datos: resultado.rows,
      };
    } catch (error) {
      const mensaje =
        error instanceof Error
          ? error.message
          : 'Error desconocido al consultar las sucursales.';

      throw new InternalServerErrorException({
        exito: 0,
        mensaje: mensaje,
      });
    }
  }

  // ============================================================
  // FUNCIONALIDAD: BUSCAR SUCURSAL
  // ============================================================
  async buscar(codigoSucursal: number) {
    try {
      if (!Number.isInteger(codigoSucursal) || codigoSucursal <= 0) {
        throw new BadRequestException({
          exito: 0,
          mensaje: 'El código de sucursal debe ser un número entero mayor que cero.',
        });
      }

      const resultado = await this.databaseService.query(
        `
          SELECT
            codigosucursal       AS "codigoSucursal",
            nombresucursal       AS "nombreSucursal",
            direccion            AS "direccion",
            fechaapertura        AS "fechaApertura",
            horaapertura         AS "horaApertura",
            presupuestomensual   AS "presupuestoMensual",
            estado               AS "estado"
          FROM Usp_Sucursales_Buscar($1);
        `,
        [codigoSucursal],
      );

      return {
        exito: 1,
        mensaje: 'Sucursal encontrada correctamente.',
        datos: resultado.rows,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      const mensajeCompleto =
        error instanceof Error
          ? error.message
          : 'Error desconocido al buscar la sucursal.';

      const mensaje =
        mensajeCompleto.includes('No se encontró el registro solicitado.')
          ? 'No se encontró el registro solicitado.'
          : mensajeCompleto;

      throw new InternalServerErrorException({
        exito: 0,
        mensaje: mensaje,
      });
    }
  }

  // ============================================================
  // FUNCIONALIDAD: AGREGAR SUCURSAL
  // ============================================================
  async agregar(datos: {
    nombreSucursal: string;
    direccion: string;
    fechaApertura: string;
    horaApertura: string;
    presupuestoMensual: number;
    estado: boolean;
  }) {
    try {
      const {
        nombreSucursal,
        direccion,
        fechaApertura,
        horaApertura,
        presupuestoMensual,
        estado,
      } = datos ?? {};

      if (!nombreSucursal || !direccion) {
        throw new BadRequestException({
          exito: 0,
          mensaje: 'El nombre de la sucursal y la dirección son obligatorios.',
        });
      }

      const resultado = await this.databaseService.query(
        `SELECT * FROM Usp_Sucursales_Agregar($1, $2, $3, $4, $5, $6);`,
        [
          nombreSucursal,
          direccion,
          fechaApertura,
          horaApertura,
          presupuestoMensual,
          estado,
        ],
      );

      return {
        exito: 1,
        mensaje: resultado.rows[0]?.mensaje || 'Sucursal registrada correctamente.',
        codigoSucursal: resultado.rows[0]?.codigosucursal,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      const mensaje =
        error instanceof Error
          ? error.message
          : 'Error desconocido al registrar la sucursal.';

      throw new InternalServerErrorException({
        exito: 0,
        mensaje: mensaje,
      });
    }
  }

  // ============================================================
  // FUNCIONALIDAD: EDITAR SUCURSAL
  // ============================================================
  async editar(
    codigoSucursal: number,
    datos: {
      nombreSucursal: string;
      direccion: string;
      fechaApertura: string;
      horaApertura: string;
      presupuestoMensual: number;
      estado: boolean;
    },
  ) {
    try {
      if (!Number.isInteger(codigoSucursal) || codigoSucursal <= 0) {
        throw new BadRequestException({
          exito: 0,
          mensaje: 'El código de sucursal debe ser un número entero mayor que cero.',
        });
      }

      const {
        nombreSucursal,
        direccion,
        fechaApertura,
        horaApertura,
        presupuestoMensual,
        estado,
      } = datos ?? {};

      const resultado = await this.databaseService.query(
        `SELECT * FROM Usp_Sucursales_Editar($1, $2, $3, $4, $5, $6, $7);`,
        [
          codigoSucursal,
          nombreSucursal,
          direccion,
          fechaApertura,
          horaApertura,
          presupuestoMensual,
          estado,
        ],
      );

      return {
        exito: 1,
        mensaje: resultado.rows[0]?.mensaje || 'Sucursal actualizada correctamente.',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      const mensaje =
        error instanceof Error
          ? error.message
          : 'Error desconocido al actualizar la sucursal.';

      throw new InternalServerErrorException({
        exito: 0,
        mensaje: mensaje,
      });
    }
  }

  // ============================================================
  // FUNCIONALIDAD: ELIMINAR SUCURSAL
  // ============================================================
  async eliminar(codigoSucursal: number) {
    try {
      if (!Number.isInteger(codigoSucursal) || codigoSucursal <= 0) {
        throw new BadRequestException({
          exito: 0,
          mensaje: 'El código de sucursal debe ser un número entero mayor que cero.',
        });
      }

      const resultado = await this.databaseService.query(
        `SELECT * FROM Usp_Sucursales_Eliminar($1);`,
        [codigoSucursal],
      );

      return {
        exito: 1,
        mensaje: resultado.rows[0]?.mensaje || 'Sucursal eliminada correctamente.',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      const mensaje =
        error instanceof Error
          ? error.message
          : 'Error desconocido al eliminar la sucursal.';

      throw new InternalServerErrorException({
        exito: 0,
        mensaje: mensaje,
      });
    }
  }
}