import {
  RespuestaSucursales,
  NuevaSucursal,
  RespuestaAgregarSucursal,
  RespuestaOperacionSucursal,
  RespuestaBuscarSucursal,
} from '@/interfaces/sucursales/sucursal.interface';

const API_URL = 'http://localhost:3000/api';

export async function consultarSucursales():
  Promise<RespuestaSucursales> {
  const respuesta = await fetch(
    `${API_URL}/sucursalesConsultar`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  );

  if (!respuesta.ok) {
    throw new Error('Error al consultar las sucursales.');
  }

  return respuesta.json();
}

/* ============================================================
   FUNCIONALIDAD: AGREGAR SUCURSAL
   Envía los datos del formulario al backend NestJS
   (POST /api/sucursalesAgregar).
============================================================ */
export async function agregarSucursal(
  datos: NuevaSucursal,
): Promise<RespuestaAgregarSucursal> {
  const respuesta = await fetch(
    `${API_URL}/sucursalesAgregar`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    },
  );

  const cuerpo = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      cuerpo?.mensaje || 'Error al registrar la sucursal.',
    );
  }

  return cuerpo;
}

/* ============================================================
   FUNCIONALIDAD: BUSCAR SUCURSAL POR CÓDIGO
   (GET /api/sucursalesBuscar/:codigoSucursal)
============================================================ */
export async function buscarSucursalPorCodigo(
  codigoSucursal: number,
): Promise<RespuestaBuscarSucursal> {
  const respuesta = await fetch(
    `${API_URL}/sucursalesBuscar/${codigoSucursal}`,
    {
      method: 'GET',
      cache: 'no-store',
    },
  );

  const cuerpo = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      cuerpo?.mensaje || 'No se encontró la sucursal.',
    );
  }

  return cuerpo;
}

/* ============================================================
   FUNCIONALIDAD: EDITAR SUCURSAL
   (PUT /api/sucursalesEditar/:codigoSucursal)
============================================================ */
export async function editarSucursal(
  codigoSucursal: number,
  datos: NuevaSucursal,
): Promise<RespuestaOperacionSucursal> {
  const respuesta = await fetch(
    `${API_URL}/sucursalesEditar/${codigoSucursal}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    },
  );

  const cuerpo = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      cuerpo?.mensaje || 'Error al actualizar la sucursal.',
    );
  }

  return cuerpo;
}

/* ============================================================
   FUNCIONALIDAD: ELIMINAR SUCURSAL
   (DELETE /api/sucursalesEliminar/:codigoSucursal)
============================================================ */
export async function eliminarSucursal(
  codigoSucursal: number,
): Promise<RespuestaOperacionSucursal> {
  const respuesta = await fetch(
    `${API_URL}/sucursalesEliminar/${codigoSucursal}`,
    {
      method: 'DELETE',
    },
  );

  const cuerpo = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      cuerpo?.mensaje || 'Error al eliminar la sucursal.',
    );
  }

  return cuerpo;
}
