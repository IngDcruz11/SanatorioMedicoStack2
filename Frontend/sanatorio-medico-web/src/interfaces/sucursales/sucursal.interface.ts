export interface Sucursal {
  codigoSucursal: number;
  nombreSucursal: string;
  direccion: string;
  fechaApertura: string;
  horaApertura: string;
  presupuestoMensual: number;
  estado: boolean;
}

export interface RespuestaSucursales {
  exito: number;
  mensaje: string;
  datos: Sucursal[];
}

/* ============================================================
   PANTALLA: AGREGAR SUCURSAL
   Datos que envía el formulario (no incluye codigoSucursal,
   ese lo genera el backend).
============================================================ */
export interface NuevaSucursal {
  nombreSucursal: string;
  direccion: string;
  fechaApertura: string;
  horaApertura: string;
  presupuestoMensual: number;
  estado: boolean;
}

export interface RespuestaAgregarSucursal {
  exito: number;
  mensaje: string;
  codigoSucursal?: number;
}

/* ============================================================
   PANTALLA: EDITAR / ELIMINAR / BUSCAR SUCURSAL
============================================================ */
export interface RespuestaOperacionSucursal {
  exito: number;
  mensaje: string;
}

export interface RespuestaBuscarSucursal {
  exito: number;
  mensaje: string;
  datos: Sucursal[];
}
