'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  CheckCircle2,
  PauseCircle,
  Search,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  MapPin,
  CalendarDays,
  Clock,
  Wallet,
  ToggleLeft,
  AlertCircle,
} from 'lucide-react';
import {
  Sucursal,
  NuevaSucursal,
} from '@/interfaces/sucursales/sucursal.interface';
import {
  consultarSucursales,
  editarSucursal,
  eliminarSucursal,
} from '@/services/sucursales/sucursales.service';

/* ============================================================
   VALOR INICIAL DEL FORMULARIO DE EDICIÓN
============================================================ */
const formularioVacio: NuevaSucursal = {
  nombreSucursal: '',
  direccion: '',
  fechaApertura: '',
  horaApertura: '',
  presupuestoMensual: 0,
  estado: true,
};

/* ============================================================
   NORMALIZAR FECHA / HORA PARA LOS INPUTS type="date"/"time"
   El backend puede devolver fechas/horas en distintos formatos
   (ISO completo, solo fecha, HH:mm:ss). Estas funciones dejan
   el valor listo para los inputs nativos del navegador.
============================================================ */
function aFechaInput(valor: string): string {
  if (!valor) return '';
  return valor.slice(0, 10);
}

function aHoraInput(valor: string): string {
  if (!valor) return '';
  return valor.slice(0, 5);
}

/* ============================================================
   COMPONENTE PRINCIPAL
============================================================ */
export default function SucursalesConsultaVista() {
  const router = useRouter();

  const [sucursales, setSucursales] = useState<Sucursal[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mensajeCarga, setMensajeCarga] = useState(
    'Cargando sucursales...',
  );
  const [busqueda, setBusqueda] = useState('');

  // Sucursal que se está editando actualmente (null = modal cerrado)
  const [sucursalEditando, setSucursalEditando] =
    useState<Sucursal | null>(null);
  const [formularioEdicion, setFormularioEdicion] =
    useState<NuevaSucursal>(formularioVacio);
  const [guardandoEdicion, setGuardandoEdicion] =
    useState(false);
  const [mensajeEdicion, setMensajeEdicion] = useState<{
    tipo: 'exito' | 'error';
    texto: string;
  } | null>(null);

  // Código de la sucursal que se está eliminando (para desactivar su botón)
  const [eliminandoCodigo, setEliminandoCodigo] =
    useState<number | null>(null);

  /* ==========================================================
     CARGAR SUCURSALES DESDE EL BACKEND
  ========================================================== */
  async function cargarSucursales() {
    try {
      setCargando(true);
      const respuesta = await consultarSucursales();
      setSucursales(respuesta.datos);
      setMensajeCarga(respuesta.mensaje);
    } catch {
      setMensajeCarga(
        'No fue posible consultar las sucursales.',
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarSucursales();
  }, []);

  /* ==========================================================
     BUSCAR (filtro en vivo sobre los datos ya cargados)
  ========================================================== */
  const sucursalesFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return sucursales;

    return sucursales.filter((sucursal) => {
      return (
        sucursal.nombreSucursal
          .toLowerCase()
          .includes(texto) ||
        sucursal.direccion.toLowerCase().includes(texto) ||
        String(sucursal.codigoSucursal).includes(texto)
      );
    });
  }, [busqueda, sucursales]);

  /* ==========================================================
     TARJETAS DE RESUMEN (calculadas con datos reales)
  ========================================================== */
  const totalSucursales = sucursales.length;
  const totalActivas = sucursales.filter(
    (sucursal) => sucursal.estado,
  ).length;
  const totalInactivas = totalSucursales - totalActivas;

  /* ==========================================================
     ELIMINAR SUCURSAL
  ========================================================== */
  async function manejarEliminar(sucursal: Sucursal) {
    const confirmado = window.confirm(
      `¿Deseas eliminar la sucursal "${sucursal.nombreSucursal}"? Esta acción no se puede deshacer.`,
    );
    if (!confirmado) return;

    try {
      setEliminandoCodigo(sucursal.codigoSucursal);
      await eliminarSucursal(sucursal.codigoSucursal);
      setSucursales((anterior) =>
        anterior.filter(
          (s) => s.codigoSucursal !== sucursal.codigoSucursal,
        ),
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'No fue posible eliminar la sucursal.',
      );
    } finally {
      setEliminandoCodigo(null);
    }
  }

  /* ==========================================================
     ABRIR MODAL DE EDICIÓN
  ========================================================== */
  function manejarAbrirEditar(sucursal: Sucursal) {
    setSucursalEditando(sucursal);
    setMensajeEdicion(null);
    setFormularioEdicion({
      nombreSucursal: sucursal.nombreSucursal,
      direccion: sucursal.direccion,
      fechaApertura: aFechaInput(sucursal.fechaApertura),
      horaApertura: aHoraInput(sucursal.horaApertura),
      presupuestoMensual: sucursal.presupuestoMensual,
      estado: sucursal.estado,
    });
  }

  function manejarCerrarEditar() {
    setSucursalEditando(null);
    setMensajeEdicion(null);
  }

  function actualizarCampoEdicion(
    campo: keyof NuevaSucursal,
    valor: string | number | boolean,
  ) {
    setFormularioEdicion((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  /* ==========================================================
     GUARDAR CAMBIOS DE EDICIÓN
  ========================================================== */
  async function manejarGuardarEdicion() {
    if (!sucursalEditando) return;

    if (
      !formularioEdicion.nombreSucursal.trim() ||
      !formularioEdicion.direccion.trim()
    ) {
      setMensajeEdicion({
        tipo: 'error',
        texto:
          'El nombre de la sucursal y la dirección son obligatorios.',
      });
      return;
    }

    try {
      setGuardandoEdicion(true);
      await editarSucursal(
        sucursalEditando.codigoSucursal,
        formularioEdicion,
      );

      // Actualiza la fila en memoria sin recargar toda la tabla.
      setSucursales((anterior) =>
        anterior.map((s) =>
          s.codigoSucursal ===
          sucursalEditando.codigoSucursal
            ? {
                ...s,
                ...formularioEdicion,
              }
            : s,
        ),
      );

      manejarCerrarEditar();
    } catch (error) {
      setMensajeEdicion({
        tipo: 'error',
        texto:
          error instanceof Error
            ? error.message
            : 'No fue posible actualizar la sucursal.',
      });
    } finally {
      setGuardandoEdicion(false);
    }
  }

  return (
    <section className="sucursales-page">
      {/* ======================================================
          ENCABEZADO DE LA PÁGINA
      ====================================================== */}
      <div className="sucursales-hero">
        <div className="sucursales-hero-text">
          <h1>Consulta de sucursales</h1>
          <p>Administra y consulta las sedes del sanatorio.</p>
        </div>
      </div>

      {/* ======================================================
          TARJETAS DE RESUMEN
      ====================================================== */}
      <div className="summary-grid">
        <article className="summary-card">
          <div className="summary-icon summary-icon-blue">
            <Building2
              size={29}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <div className="summary-info">
            <span className="summary-label">
              Sucursales
              <br />
              registradas
            </span>
            <strong className="summary-value">
              {totalSucursales}
            </strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-icon summary-icon-green">
            <CheckCircle2
              size={29}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <div className="summary-info">
            <span className="summary-label">
              Sucursales
              <br />
              activas
            </span>
            <strong className="summary-value">
              {totalActivas}
            </strong>
          </div>
        </article>

        <article className="summary-card">
          <div className="summary-icon summary-icon-yellow">
            <PauseCircle
              size={29}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <div className="summary-info">
            <span className="summary-label">
              Sucursales
              <br />
              inactivas
            </span>
            <strong className="summary-value">
              {totalInactivas}
            </strong>
          </div>
        </article>
      </div>

      {/* ======================================================
          CONTENEDOR DEL LISTADO
      ====================================================== */}
      <section className="branches-panel">
        {/* ====================================================
            CABECERA DEL LISTADO
        ==================================================== */}
        <div className="branches-panel-header">
          <div className="branches-panel-title">
            <div className="branches-title-icon">
              <Building2
                size={25}
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>
            <h2>Listado de sucursales</h2>
          </div>

          {/* CONTROLES */}
          <div className="branches-toolbar">
            {/* BUSCADOR */}
            <div className="branches-search">
              <Search
                size={20}
                strokeWidth={2}
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Buscar por código, nombre o dirección..."
                aria-label="Buscar sucursal"
                value={busqueda}
                onChange={(evento) =>
                  setBusqueda(evento.target.value)
                }
              />
            </div>

            {/* NUEVA SUCURSAL */}
            <button
              type="button"
              className="button-new-branch"
              onClick={() =>
                router.push('/sucursales/agregar')
              }
            >
              <Plus
                size={21}
                strokeWidth={2.3}
                aria-hidden="true"
              />
              <span>Nueva sucursal</span>
            </button>
          </div>
        </div>

        {/* ====================================================
            ESTADO DE CARGA / MENSAJE
        ==================================================== */}
        {cargando && (
          <p style={{ padding: '0 26px 20px', color: '#5675a9' }}>
            {mensajeCarga}
          </p>
        )}
        {!cargando && sucursales.length === 0 && (
          <p style={{ padding: '0 26px 20px', color: '#5675a9' }}>
            {mensajeCarga}
          </p>
        )}

        {/* ====================================================
            TABLA
        ==================================================== */}
        {!cargando && sucursales.length > 0 && (
          <div className="branches-table-container">
            <table className="branches-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Sucursal</th>
                  <th>Dirección</th>
                  <th>Apertura</th>
                  <th>Presupuesto mensual</th>
                  <th>Estado</th>
                  <th className="actions-column">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {sucursalesFiltradas.map((sucursal) => (
                  <tr key={sucursal.codigoSucursal}>
                    <td>{sucursal.codigoSucursal}</td>
                    <td>{sucursal.nombreSucursal}</td>
                    <td>{sucursal.direccion}</td>
                    <td>
                      {aFechaInput(sucursal.fechaApertura)}{' '}
                      {aHoraInput(sucursal.horaApertura)}
                    </td>
                    <td>
                      Q{' '}
                      {Number(
                        sucursal.presupuestoMensual,
                      ).toLocaleString('es-GT', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td>
                      <span
                        className={
                          sucursal.estado
                            ? 'status-badge status-active'
                            : 'status-badge status-inactive'
                        }
                      >
                        <span
                          className="status-dot"
                          aria-hidden="true"
                        />
                        {sucursal.estado
                          ? 'Activa'
                          : 'Inactiva'}
                      </span>
                    </td>
                    {/* ACCIONES */}
                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="action-button action-edit"
                          aria-label={`Editar sucursal ${sucursal.nombreSucursal}`}
                          onClick={() =>
                            manejarAbrirEditar(sucursal)
                          }
                        >
                          <Pencil
                            size={18}
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                        </button>
                        <button
                          type="button"
                          className="action-button action-delete"
                          aria-label={`Eliminar sucursal ${sucursal.nombreSucursal}`}
                          disabled={
                            eliminandoCodigo ===
                            sucursal.codigoSucursal
                          }
                          onClick={() =>
                            manejarEliminar(sucursal)
                          }
                        >
                          <Trash2
                            size={18}
                            strokeWidth={2.2}
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {sucursalesFiltradas.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: 'center',
                        color: '#5675a9',
                        padding: '24px 16px',
                      }}
                    >
                      No se encontraron sucursales con ese
                      criterio de búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ====================================================
            PIE DE LA TABLA
        ==================================================== */}
        {!cargando && sucursales.length > 0 && (
          <div className="branches-table-footer">
            <p>
              Mostrando {sucursalesFiltradas.length} de{' '}
              {sucursales.length} resultados
            </p>
          </div>
        )}
      </section>

      {/* ======================================================
          MODAL DE EDICIÓN
      ====================================================== */}
      {sucursalEditando && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content form-panel">
            <div className="form-panel-header">
              <div className="branches-title-icon">
                <Pencil
                  size={22}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>
              <h2>
                Editar sucursal #
                {sucursalEditando.codigoSucursal}
              </h2>
              <button
                type="button"
                className="modal-close-button"
                aria-label="Cerrar"
                onClick={manejarCerrarEditar}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>

            <div className="form-body">
              {/* NOMBRE */}
              <div className="form-group">
                <label htmlFor="editarNombre">
                  Nombre de la sucursal
                </label>
                <div className="form-input-wrapper">
                  <Building2 size={18} aria-hidden="true" />
                  <input
                    id="editarNombre"
                    type="text"
                    value={formularioEdicion.nombreSucursal}
                    onChange={(evento) =>
                      actualizarCampoEdicion(
                        'nombreSucursal',
                        evento.target.value,
                      )
                    }
                  />
                </div>
              </div>

              {/* DIRECCIÓN */}
              <div className="form-group">
                <label htmlFor="editarDireccion">
                  Dirección
                </label>
                <div className="form-input-wrapper">
                  <MapPin size={18} aria-hidden="true" />
                  <input
                    id="editarDireccion"
                    type="text"
                    value={formularioEdicion.direccion}
                    onChange={(evento) =>
                      actualizarCampoEdicion(
                        'direccion',
                        evento.target.value,
                      )
                    }
                  />
                </div>
              </div>

              {/* FECHA DE APERTURA */}
              <div className="form-group">
                <label htmlFor="editarFecha">
                  Fecha de apertura
                </label>
                <div className="form-input-wrapper">
                  <CalendarDays size={18} aria-hidden="true" />
                  <input
                    id="editarFecha"
                    type="date"
                    value={formularioEdicion.fechaApertura}
                    onChange={(evento) =>
                      actualizarCampoEdicion(
                        'fechaApertura',
                        evento.target.value,
                      )
                    }
                  />
                </div>
              </div>

              {/* HORA DE APERTURA */}
              <div className="form-group">
                <label htmlFor="editarHora">
                  Hora de apertura
                </label>
                <div className="form-input-wrapper">
                  <Clock size={18} aria-hidden="true" />
                  <input
                    id="editarHora"
                    type="time"
                    value={formularioEdicion.horaApertura}
                    onChange={(evento) =>
                      actualizarCampoEdicion(
                        'horaApertura',
                        evento.target.value,
                      )
                    }
                  />
                </div>
              </div>

              {/* PRESUPUESTO MENSUAL */}
              <div className="form-group">
                <label htmlFor="editarPresupuesto">
                  Presupuesto mensual (Q)
                </label>
                <div className="form-input-wrapper">
                  <Wallet size={18} aria-hidden="true" />
                  <input
                    id="editarPresupuesto"
                    type="number"
                    min={0}
                    step="0.01"
                    value={
                      formularioEdicion.presupuestoMensual
                    }
                    onChange={(evento) =>
                      actualizarCampoEdicion(
                        'presupuestoMensual',
                        Number(evento.target.value),
                      )
                    }
                  />
                </div>
              </div>

              {/* ESTADO */}
              <div className="form-group">
                <label htmlFor="editarEstado">Estado</label>
                <button
                  type="button"
                  id="editarEstado"
                  className={
                    formularioEdicion.estado
                      ? 'form-switch form-switch-on'
                      : 'form-switch'
                  }
                  onClick={() =>
                    actualizarCampoEdicion(
                      'estado',
                      !formularioEdicion.estado,
                    )
                  }
                  aria-pressed={formularioEdicion.estado}
                >
                  <ToggleLeft size={20} aria-hidden="true" />
                  <span>
                    {formularioEdicion.estado
                      ? 'Activa'
                      : 'Inactiva'}
                  </span>
                </button>
              </div>

              {mensajeEdicion && (
                <div
                  className={
                    mensajeEdicion.tipo === 'exito'
                      ? 'form-message form-message-success'
                      : 'form-message form-message-error'
                  }
                  role="status"
                >
                  {mensajeEdicion.tipo === 'exito' ? (
                    <CheckCircle2
                      size={18}
                      aria-hidden="true"
                    />
                  ) : (
                    <AlertCircle
                      size={18}
                      aria-hidden="true"
                    />
                  )}
                  <span>{mensajeEdicion.texto}</span>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="button-cancel"
                  onClick={manejarCerrarEditar}
                  disabled={guardandoEdicion}
                >
                  <span>Cancelar</span>
                </button>
                <button
                  type="button"
                  className="button-new-branch"
                  onClick={manejarGuardarEdicion}
                  disabled={guardandoEdicion}
                >
                  <Save size={19} aria-hidden="true" />
                  <span>
                    {guardandoEdicion
                      ? 'Guardando...'
                      : 'Guardar cambios'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
