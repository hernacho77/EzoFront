import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Plus, X, Trash2, ArrowLeftRight, Calendar, User, Layers, Check, AlertCircle } from "lucide-react";
export const IntercambiosTable = () => {
  const [intercambios, setIntercambios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [selectedIntercambio, setSelectedIntercambio] = useState(null);
  const [formArticuloOrigen, setFormArticuloOrigen] = useState("");
  const [formCantOrigen, setFormCantOrigen] = useState(1);
  const [formArticuloDestino, setFormArticuloDestino] = useState("");
  const [formCantDestino, setFormCantDestino] = useState(1);
  const [formNombreUserOrigen, setFormNombreUserOrigen] = useState("");
  const [formNombreUserDestino, setFormNombreUserDestino] = useState("");
  const [formAceptado, setFormAceptado] = useState(true);
  const [formResUserOrigen, setFormResUserOrigen] = useState("");
  const [formResUserDestino, setFormResUserDestino] = useState("");
  useEffect(() => {
    cargarIntercambios();
  }, []);
  const cargarIntercambios = async () => {
    try {
      const response = await api.get("/intercambios");
      if (Array.isArray(response.data)) {
        setIntercambios(response.data);
      } else {
        setIntercambios([]);
      }
    } catch (err) {
      console.error("Error al cargar intercambios:", err);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("\xBFSeguro que deseas eliminar el registro de este intercambio?")) {
      try {
        await api.delete("/intercambios/delete", { data: { id } });
        alert("Intercambio eliminado de los registros.");
        cargarIntercambios();
      } catch (err) {
        console.error("Error al eliminar intercambio:", err);
        alert("No se pudo eliminar el registro.");
      }
    }
  };
  const handleProponer = async (e) => {
    e.preventDefault();
    const payload = {
      articuloOrigen: formArticuloOrigen,
      cantOrigen: Number(formCantOrigen),
      articuloDestino: formArticuloDestino,
      cantDestino: Number(formCantDestino),
      nombreUsuarioOrigen: formNombreUserOrigen,
      nombreUsuarioDestino: formNombreUserDestino
    };
    try {
      await api.post("/intercambios/proponer", payload);
      alert("Intercambio propuesto exitosamente a trav\xE9s del procedimiento.");
      setIsModalOpen(false);
      cargarIntercambios();
    } catch (err) {
      console.error("Error al proponer intercambio:", err);
      alert("Error al procesar la propuesta. Verifica que los nombres de usuario y art\xEDculos existan.");
    }
  };
  const handleOpenResponder = (intercambio) => {
    setSelectedIntercambio(intercambio);
    setFormResUserOrigen(intercambio.usuario_origen?.nickname || "");
    setFormResUserDestino(intercambio.usuario_destino?.nickname || "");
    setFormAceptado(true);
    setIsResponseModalOpen(true);
  };
  const handleResponder = async (e) => {
    e.preventDefault();
    if (!selectedIntercambio) return;
    const payload = {
      aceptado: formAceptado,
      idIntercambio: selectedIntercambio.id,
      usuarioOrigen: formResUserOrigen,
      usuarioDestino: formResUserDestino
    };
    try {
      await api.post("/intercambios/responder", payload);
      alert("Respuesta de intercambio procesada y guardada correctamente.");
      setIsResponseModalOpen(false);
      setSelectedIntercambio(null);
      cargarIntercambios();
    } catch (err) {
      console.error("Error al responder intercambio:", err);
      alert("No se pudo procesar la respuesta transaccional.");
    }
  };
  const handleNewProposal = () => {
    setFormArticuloOrigen("");
    setFormCantOrigen(1);
    setFormArticuloDestino("");
    setFormCantDestino(1);
    setFormNombreUserOrigen("");
    setFormNombreUserDestino("");
    setIsModalOpen(true);
  };
  return <div className="space-y-4">
      {
    /* ENCABEZADO */
  }
      <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md p-4 border border-white/5 rounded">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide font-mono">Transacciones de Intercambio</h3>
          <p className="text-xs text-gray-500">Monitoreo de solicitudes, trueques y ejecuciones transaccionales entre usuarios.</p>
        </div>
        <button
    onClick={handleNewProposal}
    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium text-xs px-3 py-2 rounded transition shadow-lg font-sans"
  >
          <Plus size={14} /> Proponer Trueque
        </button>
      </div>

      {
    /* TABLA ESTILO VORTEX */
  }
      <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-mono border-b border border-white/5 uppercase tracking-wider text-[10px]">
              <th className="p-3 font-bold">Fecha Propuesta</th>
              <th className="p-3 font-bold">Origen (Cant.)</th>
              <th className="p-3 font-bold">Destino (Cant.)</th>
              <th className="p-3 font-bold">Estado Actual</th>
              <th className="p-3 font-bold">Fecha Completado</th>
              <th className="p-3 font-bold text-center w-48">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
            {intercambios.length === 0 ? <tr>
                <td colSpan={6} className="p-8 text-center text-gray-600 italic">
                  No hay solicitudes de intercambio activas en el sistema.
                </td>
              </tr> : intercambios.map((i) => <tr key={i.id} className="hover:bg-white/10 transition">
                  <td className="p-3 text-gray-400 flex items-center gap-1.5">
                    <Calendar size={12} className="text-blue-400" /> {i.fecha}
                  </td>
                  <td className="p-3 font-sans">
                    <span className="text-white font-medium block">{i.usuario_origen?.nickname || "Usuario Origen"}</span>
                    <span className="text-[11px] text-gray-500 font-mono">Ofrece: {i.cantidad_origen} unidades</span>
                  </td>
                  <td className="p-3 font-sans">
                    <span className="text-white font-medium block">{i.usuario_destino?.nickname || "Usuario Destino"}</span>
                    <span className="text-[11px] text-gray-500 font-mono">Solicita: {i.cantidad_destino} unidades</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] rounded border ${i.estado === "PENDIENTE" ? "bg-amber-950/30 text-amber-400 border-amber-900" : i.estado === "ACEPTADO" || i.estado === "COMPLETADO" ? "bg-green-950/30 text-green-400 border-green-900" : "bg-red-950/30 text-red-400 border-red-900"}`}>
                      {i.estado}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{i.fecha_completado || "\u2014"}</td>
                  <td className="p-3 text-center space-x-1.5">
                    {i.estado === "PENDIENTE" && <button
    onClick={() => handleOpenResponder(i)}
    className="inline-flex items-center gap-1 text-white bg-green-800 hover:bg-green-700 rounded px-2 py-1 transition text-[11px] font-sans font-medium"
  >
                        <Check size={12} /> Responder
                      </button>}
                    <button
    onClick={() => handleDelete(i.id)}
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
    /* MODAL 1: PROPONER INTERCAMBIO (/proponer) */
  }
      {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface/50 backdrop-blur-md border border-white/5 w-full max-w-lg rounded shadow-2xl overflow-hidden font-sans my-8">
            <div className="bg-white/5 px-4 py-3 border-b border border-white/5 flex justify-between items-center">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase flex items-center gap-1.5">
                <ArrowLeftRight size={14} /> Proponer Nuevo Intercambio Comercial
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition"><X size={16} /></button>
            </div>

            <form onSubmit={handleProponer} className="p-4 space-y-4">
              {
    /* Sección: Emisor / Origen */
  }
              <div className="bg-[#151515] p-3 border border-white/5 rounded space-y-3">
                <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase block">PARTE EMISORA (ORIGEN)</span>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 flex items-center gap-1"><User size={11} /> Nickname de Usuario Origen *</label>
                  <input type="text" required value={formNombreUserOrigen} onChange={(e) => setFormNombreUserOrigen(e.target.value)} placeholder="Ej. alex_vortex" className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] uppercase text-gray-400 flex items-center gap-1"><Layers size={11} /> Nombre/ID Artículo Origen *</label>
                    <input type="text" required value={formArticuloOrigen} onChange={(e) => setFormArticuloOrigen(e.target.value)} placeholder="Ej. Elden Ring" className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-400A">Cantidad *</label>
                    <input type="number" min={1} required value={formCantOrigen} onChange={(e) => setFormCantOrigen(Number(e.target.value))} className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                </div>
              </div>

              {
    /* Sección: Receptor / Destino */
  }
              <div className="bg-[#151515] p-3 border border-white/5 rounded space-y-3">
                <span className="text-[10px] font-mono font-bold tracking-wider text-amber-500 uppercase block">PARTE RECEPTORA (DESTINO)</span>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-gray-400 flex items-center gap-1"><User size={11} /> Nickname de Usuario Destino *</label>
                  <input type="text" required value={formNombreUserDestino} onChange={(e) => setFormNombreUserDestino(e.target.value)} placeholder="Ej. samus_99" className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2 space-y-1">
                    <label className="text-[10px] uppercase text-gray-400 flex items-center gap-1"><Layers size={11} /> Nombre/ID Artículo Destino *</label>
                    <input type="text" required value={formArticuloDestino} onChange={(e) => setFormArticuloDestino(e.target.value)} placeholder="Ej. Cyberpunk 2077" className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-gray-400">Cantidad *</label>
                    <input type="number" min={1} required value={formCantDestino} onChange={(e) => setFormCantDestino(Number(e.target.value))} className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none" />
                  </div>
                </div>
              </div>

              {
    /* Botones Acciones */
  }
              <div className="pt-2 flex justify-end gap-2 border-t border border-white/5 text-xs">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white/10 border border-white/5 hover:bg-white/15 text-gray-300 px-3 py-2 rounded transition">Cancelar</button>
                <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium px-4 py-2 rounded transition shadow-md">Lanzar Propuesta</button>
              </div>
            </form>
          </div>
        </div>}

      {
    /* MODAL 2: RESPONDER A SOLICITUD DE INTERCAMBIO (/responder) */
  }
      {isResponseModalOpen && selectedIntercambio && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface/50 backdrop-blur-md border border-white/5 w-full max-w-md rounded shadow-2xl overflow-hidden font-sans">
            <div className="bg-white/5 px-4 py-3 border-b border border-white/5 flex justify-between items-center">
              <span className="text-xs font-mono font-bold tracking-wider text-green-400 uppercase flex items-center gap-1.5">
                <AlertCircle size={14} /> Dictaminar Estado de Propuesta
              </span>
              <button onClick={() => setIsResponseModalOpen(false)} className="text-gray-500 hover:text-white transition"><X size={16} /></button>
            </div>

            <form onSubmit={handleResponder} className="p-4 space-y-4">
              <div className="text-xs text-gray-400 bg-background/80 border border-white/5 p-3 rounded border border-white/5 space-y-1">
                <p><strong>ID Intercambio:</strong> <span className="font-mono text-gray-500">{selectedIntercambio.id}</span></p>
                <p><strong>Intercambio entre:</strong> {selectedIntercambio.usuario_origen?.nickname || "Origen"} e {selectedIntercambio.usuario_destino?.nickname || "Destino"}</p>
              </div>

              {
    /* Campo de Selección de Decisión */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400">Resolución de la Propuesta *</label>
                <select
    value={formAceptado ? "true" : "false"}
    onChange={(e) => setFormAceptado(e.target.value === "true")}
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-green-500"
  >
                  <option value="true">ACEPTAR (Aprobar y Ejecutar Transferencia)</option>
                  <option value="false">RECHAZAR (Cancelar Intercambio)</option>
                </select>
              </div>

              {
    /* Botones de Envío */
  }
              <div className="pt-2 flex justify-end gap-2 border-t border border-white/5 text-xs">
                <button type="button" onClick={() => setIsResponseModalOpen(false)} className="bg-white/10 border border-white/5 hover:bg-white/15 text-gray-300 px-3 py-2 rounded transition">Cancelar</button>
                <button type="submit" className="bg-green-700 hover:bg-green-600 text-white font-medium px-4 py-2 rounded transition shadow-md">Procesar Dictamen</button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
