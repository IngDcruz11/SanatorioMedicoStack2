'use client';

import { useEffect, useState } from 'react';
import { Sucursal } from '@/interfaces/sucursales/sucursal.interface';
import { consultarSucursales } from '@/services/sucursales/sucursales.service';

export default function SucursalesConsultar() {
  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [mensaje, setMensaje] = useState('Cargando sucursales...');

  useEffect(() => {
    async function cargarSucursales() {
      try {
        const respuesta = await consultarSucursales();
        setSucursales(respuesta.datos);
        setMensaje(respuesta.mensaje);
      } catch {
        setMensaje('No fue posible consultar las sucursales.');
      }
    }

    cargarSucursales();
  }, []);

  return (
    <main>
      <h1>Consulta de Sucursales</h1>
      <p>{mensaje}</p>
      <table border={1}>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Fecha Apertura</th>
            <th>Hora Apertura</th>
            <th>Presupuesto Mensual</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {sucursales.map((sucursal) => (
            <tr key={sucursal.codigoSucursal}>
              <td>{sucursal.codigoSucursal}</td>
              <td>{sucursal.nombreSucursal}</td>
              <td>{sucursal.direccion}</td>
              <td>{sucursal.fechaApertura}</td>
              <td>{sucursal.horaApertura}</td>
              <td>{sucursal.presupuestoMensual}</td>
              <td>{sucursal.estado ? 'Activo' : 'Inactivo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
