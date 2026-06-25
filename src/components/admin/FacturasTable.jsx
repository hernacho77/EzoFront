import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Plus, X, Trash2, FileText, Calendar, User, CreditCard, Layers } from "lucide-react";
export const FacturasTable = () => {
  const [facturas, setFacturas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formNumeroFactura, setFormNumeroFactura] = useState("");
  const [formRazonSocialEmp, setFormRazonSocialEmp] = useState("");
  const [formIdUsuario, setFormIdUsuario] = useState("");
  const [formFechaEmision, setFormFechaEmision] = useState("");
  const [formNitEmpresa, setFormNitEmpresa] = useState("");
  const [formIdMetodoPago, setFormIdMetodoPago] = useState("");
  const [formIdDatosFactura, setFormIdDatosFactura] = useState("");
  const [formArticuloId, setFormArticuloId] = useState("");
  const [formCantidad, setFormCantidad] = useState(1);
  useEffect(() => {
    cargarFacturas();
  }, []);
  const cargarFacturas = async () => {
    try {
      const response = await api.get("/facturas", {
        params: { page: 0, size: 100 }
      });
      if (response.data && response.data.content) {
        setFacturas(response.data.content);
      } else {
        setFacturas(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error("Error al cargar facturas:", err);
    }
  };
  const handleDelete = async (id, numero) => {
    if (window.confirm(`\xBFSeguro que deseas eliminar permanentemente la factura N\xB0 ${numero}?`)) {
      try {
        await api.delete("/facturas/delete", {
          data: { id }
        });
        alert("Factura eliminada correctamente.");
        cargarFacturas();
      } catch (err) {
        console.error("Error al eliminar factura:", err);
        alert("No se pudo eliminar la factura.");
      }
    }
  };
  const handleNew = () => {
    setFormNumeroFactura("");
    setFormRazonSocialEmp("");
    setFormIdUsuario("");
    setFormFechaEmision((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    setFormNitEmpresa("");
    setFormIdMetodoPago("");
    setFormIdDatosFactura("");
    setFormArticuloId("");
    setFormCantidad(1);
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      id: null,
      numero_factura: formNumeroFactura,
      razon_social_emp: formRazonSocialEmp,
      id_usuario: formIdUsuario || null,
      fecha_emision: formFechaEmision,
      // LocalDate nativo YYYY-MM-DD
      nit_empresa: formNitEmpresa,
      id_metodo_pago: formIdMetodoPago || null,
      id_datos_factura: formIdDatosFactura || null,
      // Se inyecta la lista con al menos un detalle para pasar el @NotEmpty del backend
      detalles: [
        {
          id_articulo: formArticuloId || null,
          cantidad: Number(formCantidad)
        }
      ]
    };
    try {
      await api.post("/facturas", payload);
      alert("Factura generada y guardada correctamente.");
      setIsModalOpen(false);
      cargarFacturas();
    } catch (err) {
      console.error("Error al guardar factura. Payload:", payload, err);
      alert("Error en el servidor. Verifica que los UUIDs de usuario, m\xE9todo de pago y art\xEDculo sean v\xE1lidos.");
    }
  };
  return <div className="space-y-4">
      {
    /* ENCABEZADO */
  }
      <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md p-4 border border-white/5 rounded">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide font-mono">Registro e Historial de Facturas</h3>
          <p className="text-xs text-gray-500">Comprobantes fiscales y transacciones emitidas del sistema.</p>
        </div>
        <button
    onClick={handleNew}
    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium text-xs px-3 py-2 rounded transition shadow-lg"
  >
          <Plus size={14} /> Emitir Factura
        </button>
      </div>

      {
    /* TABLA ESTILO VORTEX */
  }
      <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-mono border-b border border-white/5 uppercase tracking-wider text-[10px]">
              <th className="p-3 font-bold">N° Factura</th>
              <th className="p-3 font-bold">Razón Social Empresa</th>
              <th className="p-3 font-bold">NIT Empresa</th>
              <th className="p-3 font-bold">Fecha Emisión</th>
              <th className="p-3 font-bold">ID Usuario</th>
              <th className="p-3 font-bold text-center w-24">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
            {facturas.length === 0 ? <tr>
                <td colSpan={6} className="p-8 text-center text-gray-600 italic">
                  No se encontraron facturas registradas en el sistema.
                </td>
              </tr> : facturas.map((fac) => <tr key={fac.id} className="hover:bg-white/10 transition">
                  <td className="p-3 text-white font-bold">{fac.numero_factura || fac.numeroFactura}</td>
                  <td className="p-3 font-sans text-gray-300">{fac.razon_social_emp || fac.razonSocialEmp}</td>
                  <td className="p-3 text-gray-400">{fac.nit_empresa || fac.nitEmpresa}</td>
                  <td className="p-3 text-blue-400">{fac.fecha_emision || fac.fechaEmision}</td>
                  <td className="p-3 text-gray-500 text-[11px] select-all">{fac.id_usuario || fac.idUsuario || "N/A"}</td>
                  <td className="p-3 text-center">
                    <button
    onClick={() => handleDelete(fac.id, fac.numero_factura || fac.numeroFactura || "")}
    className="inline-flex items-center gap-1 text-gray-400 hover:text-red-500 bg-white/10 border border-white/5 hover:bg-red-950/30 border border-white/10 hover:border-red-900 rounded px-2 py-1 transition text-[11px]"
  >
                      <Trash2 size={12} /> Eliminar
                    </button>
                  </td>
                </tr>)}
          </tbody>
        </table>
      </div>

      {
    /* MODAL EMISIÓN DE FACTURA */
  }
      {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface/50 backdrop-blur-md border border-white/5 w-full max-w-lg rounded shadow-2xl overflow-hidden font-sans my-8">
            
            <div className="bg-white/5 px-4 py-3 border-b border border-white/5 flex justify-between items-center">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase">
                Emitir Nueva Factura Comercial
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
              
              {
    /* Grupo: Datos de la Factura */
  }
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                    <FileText size={11} className="text-blue-400" /> N° Factura *
                  </label>
                  <input type="text" required value={formNumeroFactura} onChange={(e) => setFormNumeroFactura(e.target.value)} placeholder="Ej. FAC-00234" className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary transition" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                    <Calendar size={11} className="text-blue-400" /> Fecha Emisión *
                  </label>
                  <input type="date" required value={formFechaEmision} onChange={(e) => setFormFechaEmision(e.target.value)} className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary transition font-mono" />
                </div>
              </div>

              {
    /* Grupo: Empresa Emisora */
  }
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wide uppercase text-gray-400">Razón Social Empresa *</label>
                  <input type="text" required value={formRazonSocialEmp} onChange={(e) => setFormRazonSocialEmp(e.target.value)} placeholder="Ej. Vortex Store S.R.L." className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary transition" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wide uppercase text-gray-400">NIT Empresa *</label>
                  <input type="text" required value={formNitEmpresa} onChange={(e) => setFormNitEmpresa(e.target.value)} placeholder="Ej. 1020304050" className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary transition" />
                </div>
              </div>

              <hr className="border border-white/5 my-2" />

              {
    /* Relaciones UUID */
  }
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <User size={11} className="text-blue-400" /> ID del Usuario Cliente (UUID) *
                </label>
                <input type="text" required value={formIdUsuario} onChange={(e) => setFormIdUsuario(e.target.value)} placeholder="Pegar UUID del usuario receptor" className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-primary transition" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                    <CreditCard size={11} className="text-blue-400" /> ID Método Pago *
                  </label>
                  <input type="text" required value={formIdMetodoPago} onChange={(e) => setFormIdMetodoPago(e.target.value)} placeholder="UUID Método Pago" className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-primary transition" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wide uppercase text-gray-400">ID Datos Facturación *</label>
                  <input type="text" required value={formIdDatosFactura} onChange={(e) => setFormIdDatosFactura(e.target.value)} placeholder="UUID Perfil Datos" className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-primary transition" />
                </div>
              </div>

              <hr className="border border-white/5 my-2" />

              {
    /* SECCIÓN DETALLES (Mínimo un artículo obligatorio) */
  }
              <div className="bg-[#151515] p-3 border border-white/5 rounded space-y-2">
                <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase block">
                  Línea de Detalle de Compra (Obligatorio)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[9px] font-mono tracking-wide text-gray-500 uppercase flex items-center gap-1">
                      <Layers size={10} /> ID Artículo (UUID) *
                    </label>
                    <input type="text" required value={formArticuloId} onChange={(e) => setFormArticuloId(e.target.value)} placeholder="UUID del Artículo" className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2 py-1 text-[11px] font-mono text-white focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono tracking-wide text-gray-500 uppercase">Cantidad *</label>
                    <input type="number" min={1} required value={formCantidad} onChange={(e) => setFormCantidad(Number(e.target.value))} className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2 py-1 text-[11px] text-white focus:outline-none" />
                  </div>
                </div>
              </div>

              {
    /* Botones de Acción */
  }
              <div className="pt-3 flex justify-end gap-2 border-t border border-white/5 text-xs">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white/10 border border-white/5 hover:bg-white/15 text-gray-300 px-3 py-1.5 rounded transition">
                  Cancelar
                </button>
                <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium px-4 py-1.5 rounded transition shadow-md">
                  Emitir Factura
                </button>
              </div>
            </form>

          </div>
        </div>}
    </div>;
};
