import {
  Search,
  UserRound,
  LogOut,
  Cross,
} from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      {/* =====================================================
          IDENTIDAD DEL SISTEMA
      ===================================================== */}
      <div className="app-brand">
        <div
          className="app-brand-icon"
          aria-hidden="true"
        >
          <Cross size={25} strokeWidth={3} />
        </div>
        <span className="app-brand-name">
          SANATORIO MÉDICO
        </span>
      </div>

      {/* =====================================================
          BÚSQUEDA GENERAL DEL SISTEMA
          Por el momento será únicamente visual.
      ===================================================== */}
      <div className="app-header-search">
        <Search
          className="app-header-search-icon"
          size={20}
          strokeWidth={2}
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Buscar en el sistema..."
          aria-label="Buscar en el sistema"
        />
      </div>

      {/* =====================================================
          INFORMACIÓN DEL USUARIO
      ===================================================== */}
      <div className="app-header-user">
        <button
          type="button"
          className="header-user-button"
          aria-label="Opciones del usuario"
        >
          <span className="header-user-avatar">
            <UserRound
              size={21}
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>
          <span className="header-user-text">
            Usuario
          </span>
        </button>

        {/* SEPARADOR */}
        <div
          className="header-separator"
          aria-hidden="true"
        />

        {/* BOTÓN SALIR */}
        <button
          type="button"
          className="header-exit-button"
          aria-label="Salir del sistema"
        >
          <LogOut
            className="header-exit-icon"
            size={21}
            strokeWidth={2}
            aria-hidden="true"
          />
          <span className="header-exit-text">
            Salir
          </span>
        </button>
      </div>
    </header>
  );
}
