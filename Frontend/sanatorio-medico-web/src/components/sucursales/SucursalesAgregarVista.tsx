'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  MapPin,
  CalendarDays,
  Clock,
  Wallet,
  ToggleLeft,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { NuevaSucursal } from '@/interfaces/sucursales/sucursal.interface';
import { agregarSucursal } from '@/services/sucursales/sucursales.service';

/* ============================================================
   VALOR INICIAL DEL FORMULARIO
============================================================ */
const valoresIniciales: NuevaSucursal = {
  nombreSucursal: '',
  direccion: '',
  fechaApertura: '',
  horaApertura: '',
  presupuestoMensual: 0,
  estado: true,
};

/* ============================================================
   COMPONENTE PRINCIPAL
============================================================ */
export default function SucursalesAgregarVista() {
  const router = useRouter();

  const [formulario, setFormulario] =
    useState<NuevaSucursal>(valoresIniciales);
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState<{
    tipo: 'exito' | 'error';
    texto: string;
  } | null>(null);

  /* ==========================================================
     ACTUALIZAR CAMPOS DE TEXTO / FECHA / HORA / NÚMERO
  ========================================================== */
  function actualizarCampo(
    campo: keyof NuevaSucursal,
    valor: string | number | boolean,
  ) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  }

  /* ==========================================================
     ENVIAR FORMULARIO
  ========================================================== */
  async function manejarEnvio(
    evento: FormEvent<HTMLFormElement>,
  ) {
    evento.preventDefault();
    setMensaje(null);

    if (
      !formulario.nombreSucursal.trim() ||
      !formulario.direccion.trim()
    ) {
      setMensaje({
        tipo: 'error',
        texto:
          'El nombre de la sucursal y la dirección son obligatorios.',
      });
      return;
    }

    try {
      setEnviando(true);

      const respuesta = await agregarSucursal(formulario);

      setMensaje({
        tipo: 'exito',
        texto:
          respuesta.mensaje ||
          'Sucursal registrada correctamente.',
      });
      setFormulario(valoresIniciales);

      // Redirige a la pantalla de consulta después de mostrar el mensaje.
      setTimeout(() => {
        router.push('/sucursales/consultar');
      }, 1200);
    } catch (error) {
      setMensaje({
        tipo: 'error',
        texto:
          error instanceof Error
            ? error.message
            : 'No fue posible registrar la sucursal.',
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="sucursales-page">
      {/* ======================================================
          ENCABEZADO DE LA PÁGINA
      ====================================================== */}
      <div className="sucursales-hero">
        <div className="sucursales-hero-text">
          <h1>Agregar sucursal</h1>
          <p>Registra una nueva sede del sanatorio.</p>
        </div>
      </div>

      {/* ======================================================
          PANEL DEL FORMULARIO
      ====================================================== */}
      <section className="form-panel">
        <div className="form-panel-header">
          <div className="branches-title-icon">
            <Building2
              size={25}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <h2>Datos de la sucursal</h2>
        </div>

        <form
          className="form-body"
          onSubmit={manejarEnvio}
          noValidate
        >
          {/* NOMBRE */}
          <div className="form-group">
            <label htmlFor="nombreSucursal">
              Nombre de la sucursal
            </label>
            <div className="form-input-wrapper">
              <Building2
                size={18}
                strokeWidth={2}
                aria-hidden="true"
              />
              <input
                id="nombreSucursal"
                name="nombreSucursal"
                type="text"
                placeholder="Ej. Central"
                value={formulario.nombreSucursal}
                onChange={(evento) =>
                  actualizarCampo(
                    'nombreSucursal',
                    evento.target.value,
                  )
                }
                required
              />
            </div>
          </div>

          {/* DIRECCIÓN */}
          <div className="form-group">
            <label htmlFor="direccion">Dirección</label>
            <div className="form-input-wrapper">
              <MapPin
                size={18}
                strokeWidth={2}
                aria-hidden="true"
              />
              <input
                id="direccion"
                name="direccion"
                type="text"
                placeholder="Ej. Ciudad de Guatemala"
                value={formulario.direccion}
                onChange={(evento) =>
                  actualizarCampo(
                    'direccion',
                    evento.target.value,
                  )
                }
                required
              />
            </div>
          </div>

          {/* FECHA DE APERTURA */}
          <div className="form-group">
            <label htmlFor="fechaApertura">
              Fecha de apertura
            </label>
            <div className="form-input-wrapper">
              <CalendarDays
                size={18}
                strokeWidth={2}
                aria-hidden="true"
              />
              <input
                id="fechaApertura"
                name="fechaApertura"
                type="date"
                value={formulario.fechaApertura}
                onChange={(evento) =>
                  actualizarCampo(
                    'fechaApertura',
                    evento.target.value,
                  )
                }
                required
              />
            </div>
          </div>

          {/* HORA DE APERTURA */}
          <div className="form-group">
            <label htmlFor="horaApertura">
              Hora de apertura
            </label>
            <div className="form-input-wrapper">
              <Clock
                size={18}
                strokeWidth={2}
                aria-hidden="true"
              />
              <input
                id="horaApertura"
                name="horaApertura"
                type="time"
                value={formulario.horaApertura}
                onChange={(evento) =>
                  actualizarCampo(
                    'horaApertura',
                    evento.target.value,
                  )
                }
                required
              />
            </div>
          </div>

          {/* PRESUPUESTO MENSUAL */}
          <div className="form-group">
            <label htmlFor="presupuestoMensual">
              Presupuesto mensual (Q)
            </label>
            <div className="form-input-wrapper">
              <Wallet
                size={18}
                strokeWidth={2}
                aria-hidden="true"
              />
              <input
                id="presupuestoMensual"
                name="presupuestoMensual"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                value={formulario.presupuestoMensual}
                onChange={(evento) =>
                  actualizarCampo(
                    'presupuestoMensual',
                    Number(evento.target.value),
                  )
                }
                required
              />
            </div>
          </div>

          {/* ESTADO */}
          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <button
              type="button"
              id="estado"
              className={
                formulario.estado
                  ? 'form-switch form-switch-on'
                  : 'form-switch'
              }
              onClick={() =>
                actualizarCampo('estado', !formulario.estado)
              }
              aria-pressed={formulario.estado}
            >
              <ToggleLeft
                size={20}
                strokeWidth={2}
                aria-hidden="true"
              />
              <span>
                {formulario.estado ? 'Activa' : 'Inactiva'}
              </span>
            </button>
          </div>

          {/* MENSAJE DE RESULTADO */}
          {mensaje && (
            <div
              className={
                mensaje.tipo === 'exito'
                  ? 'form-message form-message-success'
                  : 'form-message form-message-error'
              }
              role="status"
            >
              {mensaje.tipo === 'exito' ? (
                <CheckCircle2 size={18} aria-hidden="true" />
              ) : (
                <AlertCircle size={18} aria-hidden="true" />
              )}
              <span>{mensaje.texto}</span>
            </div>
          )}

          {/* ACCIONES */}
          <div className="form-actions">
            <button
              type="button"
              className="button-cancel"
              onClick={() =>
                router.push('/sucursales/consultar')
              }
              disabled={enviando}
            >
              <ArrowLeft
                size={19}
                strokeWidth={2}
                aria-hidden="true"
              />
              <span>Cancelar</span>
            </button>
            <button
              type="submit"
              className="button-new-branch"
              disabled={enviando}
            >
              <Save
                size={19}
                strokeWidth={2.2}
                aria-hidden="true"
              />
              <span>
                {enviando
                  ? 'Guardando...'
                  : 'Guardar sucursal'}
              </span>
            </button>
          </div>
        </form>
      </section>
    </section>
  );
}
