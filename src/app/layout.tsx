import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MultiBranch POS",
  description: "Sistema de Ventas Multi-sucursal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-slate-50`}>
        <div className="flex">
          {/* Menú Lateral */}
          <Sidebar />
          
          {/* Contenedor de Contenido Principal */}
          <main className="flex-1 ml-64 min-h-screen">
            <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 flex items-center px-8 justify-end">
              {/* Aquí irá luego el perfil de usuario y notificaciones */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600">Usuario Administrador</span>
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                  AD
                </div>
              </div>
            </header>
            <div className="p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
