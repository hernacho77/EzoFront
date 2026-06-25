import { useState } from "react";

import { ArticulosTable } from "../components/admin/ArticulosTable";
import { PublishersTable } from "../components/admin/PublishersTable";
import { DevelopersTable } from "../components/admin/DevelopersTable";
import { ColeccionesTable } from "../components/admin/ColeccionesTable";
import { PaisesTable } from "../components/admin/PaisesTable";
import { FacturasTable } from "../components/admin/FacturasTable";
import { DatosFacturaTable } from "../components/admin/DatosFacturaTable";
import { MetodosPagoTable } from "../components/admin/MetodosPagoTable";
import { CopiasTable } from "../components/admin/CopiasTable";
import { IntercambiosTable } from "../components/admin/IntercambiosTable";
import { ComentariosTable } from "../components/admin/ComentariosTable";
import { MensajesTable } from "../components/admin/MensajesTable";
import { UsuariosTable } from "../components/admin/UsuariosTable";
import {
  Folder,
  Layers,
  Users,
  Database,
  Calendar,
  MessageSquare,
  CreditCard,
  Globe,
  Bookmark,
  FileText,
  Clipboard,
  RefreshCw
} from "lucide-react";
export const AdminDashboard = () => {
  const [currentModel, setCurrentModel] = useState("articulos");
  const [fromDate, setFromDate] = useState("2000-01-01");
  const [toDate, setToDate] = useState((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
  const getBtnClass = (model) => `w-full flex items-center justify-between p-2 rounded text-xs font-medium transition ${currentModel === model ? "bg-white/10 border border-white/5 text-white border-l-2 border-primary font-bold" : "text-gray-400 hover:bg-white/10"}`;
  return <>
      
      <div className="flex min-h-[calc(100vh-120px)] bg-background/30 backdrop-blur-xl border border-white/5 border border-white/5 rounded shadow-2xl overflow-hidden">
        
        {
    /* SIDEBAR COMPACTO CON SCROLL POR SI ACASO */
  }
        <aside className="w-64 bg-surface/50 backdrop-blur-md border-r border-r border border-white/5 p-4 flex flex-col justify-between flex-shrink-0 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar">
          <div>
            <div className="flex items-center gap-2 px-2 py-3 border-b border border-white/5 mb-4">
              <Database className="text-blue-400" size={18} />
              <span className="font-mono text-xs tracking-wider text-gray-400 font-bold uppercase">Sitio de Administración</span>
            </div>

            {
    /* SECCIÓN: TIENDA & INVENTARIO */
  }
            <div className="mb-4">
              <h4 className="text-[10px] font-black tracking-widest text-blue-400 uppercase px-2 mb-1.5">Tienda & Inventario</h4>
              <div className="space-y-0.5">
                <button onClick={() => setCurrentModel("articulos")} className={getBtnClass("articulos")}>
                  <span className="flex items-center gap-2"><Layers size={14} /> Artículos</span>
                </button>
                <button onClick={() => setCurrentModel("copia")} className={getBtnClass("copia")}>
                  <span className="flex items-center gap-2"><Folder size={14} /> Copias (Stock)</span>
                </button>
                <button onClick={() => setCurrentModel("coleccion")} className={getBtnClass("coleccion")}>
                  <span className="flex items-center gap-2"><Bookmark size={14} /> Colecciones</span>
                </button>
              </div>
            </div>

            {
    /* SECCIÓN: ENTIDADES RELACIONADAS */
  }
            <div className="mb-4">
              <h4 className="text-[10px] font-black tracking-widest text-gray-500 uppercase px-2 mb-1.5">Entidades Core</h4>
              <div className="space-y-0.5">
                <button onClick={() => setCurrentModel("publisher")} className={getBtnClass("publisher")}>
                  <span className="flex items-center gap-2"><Globe size={14} /> Publishers</span>
                </button>
                <button onClick={() => setCurrentModel("developer")} className={getBtnClass("developer")}>
                  <span className="flex items-center gap-2"><Clipboard size={14} /> Developers</span>
                </button>
                <button onClick={() => setCurrentModel("pais")} className={getBtnClass("pais")}>
                  <span className="flex items-center gap-2"><Globe size={14} /> Países</span>
                </button>
              </div>
            </div>

            {
    /* SECCIÓN: TRANSACCIONES & OPERACIONES */
  }
            <div className="mb-4">
              <h4 className="text-[10px] font-black tracking-widest text-gray-500 uppercase px-2 mb-1.5">Facturación & Tráfico</h4>
              <div className="space-y-0.5">
                <button onClick={() => setCurrentModel("factura")} className={getBtnClass("factura")}>
                  <span className="flex items-center gap-2"><FileText size={14} /> Facturas</span>
                </button>
                <button onClick={() => setCurrentModel("datosFactura")} className={getBtnClass("datosFactura")}>
                  <span className="flex items-center gap-2"><FileText size={14} /> Datos Factura</span>
                </button>
                <button onClick={() => setCurrentModel("metodoPago")} className={getBtnClass("metodoPago")}>
                  <span className="flex items-center gap-2"><CreditCard size={14} /> Métodos de Pago</span>
                </button>
                <button onClick={() => setCurrentModel("intercambio")} className={getBtnClass("intercambio")}>
                  <span className="flex items-center gap-2"><RefreshCw size={14} /> Intercambios</span>
                </button>
              </div>
            </div>

            {
    /* SECCIÓN: COMUNIDAD */
  }
            <div className="mb-4">
              <h4 className="text-[10px] font-black tracking-widest text-gray-500 uppercase px-2 mb-1.5">Social & Mensajería</h4>
              <div className="space-y-0.5">
                <button onClick={() => setCurrentModel("comentario")} className={getBtnClass("comentario")}>
                  <span className="flex items-center gap-2"><MessageSquare size={14} /> Comentarios</span>
                </button>
                <button onClick={() => setCurrentModel("mensaje")} className={getBtnClass("mensaje")}>
                  <span className="flex items-center gap-2"><MessageSquare size={14} /> Mensajes</span>
                </button>
              </div>
            </div>

            {
    /* SECCIÓN: SEGURIDAD */
  }
            <div>
              <h4 className="text-[10px] font-black tracking-widest text-red-500/70 uppercase px-2 mb-1.5">Seguridad</h4>
              <button onClick={() => setCurrentModel("usuarios")} className={getBtnClass("usuarios")}>
                <span className="flex items-center gap-2"><Users size={14} /> Usuarios</span>
              </button>
            </div>
          </div>
          <div className="text-[10px] text-gray-600 font-mono pt-3 mt-4 border-t border-gray-900 flex-shrink-0">EZO Admin v1.0.0</div>
        </aside>

        {
    /* CONTENIDO DE MODELOS DILUIDO */
  }
        <main className="flex-1 bg-background/20 p-6 flex flex-col overflow-y-auto max-h-[calc(100vh-120px)]">
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-bold tracking-wide text-white capitalize">
                Panel de Gestión: <span className="text-blue-400 text-base font-mono">/api/v1/{currentModel.toLowerCase()}</span>
              </h2>
            </div>

            {
    /* Barra de filtros de fecha */
  }
            <div className="bg-surface/50 backdrop-blur-md border border-white/5 p-3 rounded mb-4 flex items-center gap-4 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1 text-blue-400 font-bold uppercase text-[10px]"><Calendar size={14} /> Rango de creación:</span>
              <div className="flex items-center gap-2">
                <label>Desde:</label>
                <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="bg-background/50 border border-white/10 rounded px-2 py-0.5 text-white text-xs focus:outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <label>Hasta:</label>
                <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="bg-background/50 border border-white/10 rounded px-2 py-0.5 text-white text-xs focus:outline-none" />
              </div>
            </div>

            {
    /* INYECCIÓN CONDICIONAL DE TODAS LAS TABLAS */
  }
            {currentModel === "articulos" && <ArticulosTable fromDate={fromDate} toDate={toDate} />}
            {currentModel === "publisher" && <PublishersTable />}
            {currentModel === "developer" && <DevelopersTable />}
            {currentModel === "coleccion" && <ColeccionesTable />}
            {currentModel === "pais" && <PaisesTable />}
            {currentModel === "factura" && <FacturasTable />}
            {currentModel === "datosFactura" && <DatosFacturaTable />}
            {currentModel === "metodoPago" && <MetodosPagoTable />}
            {currentModel === "copia" && <CopiasTable />}
            {currentModel === "intercambio" && <IntercambiosTable />}
            {currentModel === "comentario" && <ComentariosTable />}
            {currentModel === "mensaje" && <MensajesTable />}
            {currentModel === "usuarios" && <UsuariosTable />}
            
          </div>
        </main>
      </div>
    </>;
};
