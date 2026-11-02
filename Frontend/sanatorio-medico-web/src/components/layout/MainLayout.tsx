import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="app-container">
      {/* =====================================================
          ENCABEZADO PRINCIPAL
      ===================================================== */}
      <Header />

      {/* =====================================================
          CUERPO DEL SISTEMA
      ===================================================== */}
      <div className="app-body">
        {/* MENÚ LATERAL */}
        <Sidebar />

        {/* CONTENIDO DE LA PÁGINA */}
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
}
