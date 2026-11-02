'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  FileText,
  Plus,
  Users,
  Stethoscope,
  CalendarDays,
  UserRound,
  Settings,
  ChevronDown,
} from 'lucide-react';

export default function Sidebar() {
  // ============================================================
  // OBTENER LA RUTA ACTUAL DEL SISTEMA
  // ============================================================
  const pathname = usePathname();

  // ============================================================
  // ESTADO DEL SUBMENÚ SUCURSALES
  // ============================================================
  // true  = submenú abierto
  // false = submenú cerrado
  const [sucursalesAbierto, setSucursalesAbierto] =
    useState(true);

  // ============================================================
  // DETERMINAR QUÉ OPCIÓN ESTÁ ACTIVA
  // ============================================================
  const dashboardActivo =
    pathname === '/';
  const consultarActivo =
    pathname === '/sucursales/consultar';
  const agregarActivo =
    pathname === '/sucursales/agregar';

  return (
    <aside className="sidebar">
      {/* =====================================================
          MENÚ PRINCIPAL
      ===================================================== */}
      <nav
        className="sidebar-menu"
        aria-label="Menú principal"
      >
        {/* ===================================================
            DASHBOARD
        =================================================== */}
        <Link
          href="/"
          className={
            dashboardActivo
              ? 'sidebar-link sidebar-link-active'
              : 'sidebar-link'
          }
        >
          <LayoutDashboard
            size={21}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>
            Dashboard
          </span>
        </Link>

        {/* ===================================================
            MÓDULO SUCURSALES
        =================================================== */}
        <div className="sidebar-module">
          {/* BOTÓN PRINCIPAL DEL MÓDULO */}
          <button
            type="button"
            className="sidebar-module-title"
            onClick={() =>
              setSucursalesAbierto(
                !sucursalesAbierto
              )
            }
            aria-expanded={sucursalesAbierto}
            aria-controls="submenu-sucursales"
          >
            <Building2
              size={21}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>
              Sucursales
            </span>
            <ChevronDown
              className={
                sucursalesAbierto
                  ? 'sidebar-arrow sidebar-arrow-open'
                  : 'sidebar-arrow'
              }
              size={18}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>

          {/* =================================================
              SUBMENÚ DE SUCURSALES
          ================================================= */}
          {sucursalesAbierto && (
            <div
              id="submenu-sucursales"
              className="sidebar-submenu"
            >
              {/* =============================================
                  CONSULTAR
              ============================================= */}
              <Link
                href="/sucursales/consultar"
                className={
                  consultarActivo
                    ? 'sidebar-sublink sidebar-sublink-active'
                    : 'sidebar-sublink'
                }
              >
                <FileText
                  size={19}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span>
                  Consultar
                </span>
              </Link>

              {/* =============================================
                  AGREGAR
              ============================================= */}
              <Link
                href="/sucursales/agregar"
                className={
                  agregarActivo
                    ? 'sidebar-sublink sidebar-sublink-active'
                    : 'sidebar-sublink'
                }
              >
                <Plus
                  size={20}
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
                <span>
                  Agregar
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* ===================================================
            SEPARADOR
        =================================================== */}
        <div
          className="sidebar-divider"
          aria-hidden="true"
        />

        {/* ===================================================
            PACIENTES
        =================================================== */}
        <Link
          href="#"
          className="sidebar-link"
        >
          <Users
            size={21}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>
            Pacientes
          </span>
        </Link>

        {/* ===================================================
            MÉDICOS
        =================================================== */}
        <Link
          href="#"
          className="sidebar-link"
        >
          <Stethoscope
            size={21}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>
            Médicos
          </span>
        </Link>

        {/* ===================================================
            CITAS
        =================================================== */}
        <Link
          href="#"
          className="sidebar-link"
        >
          <CalendarDays
            size={21}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>
            Citas
          </span>
        </Link>

        {/* ===================================================
            USUARIOS
        =================================================== */}
        <Link
          href="#"
          className="sidebar-link"
        >
          <UserRound
            size={21}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>
            Usuarios
          </span>
        </Link>
      </nav>

      {/* =====================================================
          PIE DEL SIDEBAR
      ===================================================== */}
      <div className="sidebar-footer">
        {/* ===================================================
            CONFIGURACIÓN
        =================================================== */}
        <Link
          href="#"
          className="sidebar-link"
        >
          <Settings
            size={21}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span>
            Configuración
          </span>
        </Link>
      </div>
    </aside>
  );
}
