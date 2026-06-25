import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Edit2, Plus, X, Trash2, Mail, UserPlus, Calendar, MessageSquare, Key } from "lucide-react";
export const MensajesTable = () => {
  const [mensajes, setMensajes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formIdUsuarioEmisor, setFormIdUsuarioEmisor] = useState("");
  const [formIdUsuarioReceptor, setFormIdUsuarioReceptor] = useState("");
  const [formTextoMensaje, setFormTextoMensaje] = useState("");
  const [formFechaEmision, setFormFechaEmision] = useState("");
  useEffect(() => {
    cargarMensajes();
  }, []);
  const cargarMensajes = async () => {
    try {
      const response = await api.get("/mensajes");
      if (Array.isArray(response.data)) {
        setMensajes(response.data);
      } else {
        setMensajes([]);
      }
    } catch (err) {
      console.error("Error al cargar mensajes:", err);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("\xBFSeguro que deseas eliminar permanentemente este mensaje?")) {
      try {
        await api.delete(`/mensajes/delete/${id}`);
        alert("Mensaje eliminado correctamente.");
        cargarMensajes();
      } catch (err) {
        console.error("Error al eliminar mensaje:", err);
        alert("No se pudo eliminar el mensaje.");
      }
    }
  };
  const handleEdit = (msg) => {
    setEditingId(msg.id);
    setFormIdUsuarioEmisor(msg.emisor?.id || "");
    setFormIdUsuarioReceptor(msg.receptor?.id || "");
    setFormTextoMensaje(msg.mensaje || "");
    setFormFechaEmision(msg.fecha_emision || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    setIsModalOpen(true);
  };
  const handleNew = () => {
    setEditingId(null);
    setFormIdUsuarioEmisor("");
    setFormIdUsuarioReceptor("");
    setFormTextoMensaje("");
    setFormFechaEmision((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingId || null,
      id_usuario_emisor: formIdUsuarioEmisor,
      id_usuario_receptor: formIdUsuarioReceptor,
      mensaje: formTextoMensaje,
      fecha_emision: formFechaEmision
    };
    try {
      if (editingId) {
        await api.put("/mensajes", payload);
        alert("Mensaje modificado con \xE9xito.");
      } else {
        await api.post("/mensajes", payload);
        alert("Mensaje enviado correctamente.");
      }
      setIsModalOpen(false);
      cargarMensajes();
    } catch (err) {
      console.error("Error al guardar mensaje:", err);
      alert("Error en la solicitud. Verifica los UUIDs ingresados.");
    }
  };
  return <div className="space-y-4">
      {
    /* ENCABEZADO */
  }
      <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md p-4 border border-white/5 rounded">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide font-mono">Bitácora de Mensajería Interna</h3>
          <p className="text-xs text-gray-500">Historial completo de interacciones de chat y comunicaciones directas.</p>
        </div>
        <button
    onClick={handleNew}
    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium text-xs px-3 py-2 rounded transition shadow-lg"
  >
          <Plus size={14} /> Redactar Mensaje
        </button>
      </div>

      {
    /* TABLA DE RENDERIZADO */
  }
      <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-mono border-b border border-white/5 uppercase tracking-wider text-[10px]">
              <th className="p-3 font-bold">ID Mensaje</th>
              <th className="p-3 font-bold w-1/4">Contenido del Mensaje</th>
              <th className="p-3 font-bold">Fecha Emisión</th>
              <th className="p-3 font-bold">ID Emisor</th>
              <th className="p-3 font-bold">ID Receptor</th>
              <th className="p-3 font-bold text-center w-36">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
            {mensajes.length === 0 ? <tr>
                <td colSpan={6} className="p-8 text-center text-gray-600 italic">
                  No se registran mensajes en el sistema de chat.
                </td>
              </tr> : mensajes.map((msg) => <tr key={msg.id} className="hover:bg-white/10 transition">
                  {
    /* ID Mensaje */
  }
                  <td className="p-3 text-gray-500 text-[11px] select-all font-mono">{msg.id}</td>
                  
                  {
    /* Mensaje & Nicknames reales de la API */
  }
                  <td className="p-3 font-sans max-w-xs break-words">
                    <div className="text-white flex items-start gap-1.5">
                      <Mail size={13} className="text-blue-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-gray-200 line-clamp-2">{msg.mensaje}</p>
                        <span className="text-[10px] font-mono text-blue-400 block mt-0.5">
                          {msg.emisor?.nombre_usuario || "??"} ➔ {msg.receptor?.nombre_usuario || "??"}
                        </span>
                      </div>
                    </div>
                  </td>

                  {
    /* Fecha Emisión (Con mejor control visual para valores nulos) */
  }
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-gray-500" /> 
                      {msg.fecha_emision ? <span className="text-white">{msg.fecha_emision}</span> : <span className="text-amber-500/80 italic text-[11px] bg-amber-950/20 px-1.5 py-0.5 rounded border border-amber-900/30">
                          null (Sin fecha)
                        </span>}
                    </div>
                  </td>

                  {
    /* ID Emisor e ID Receptor extraídos directamente del objeto real */
  }
                  <td className="p-3 text-gray-400 text-[11px] select-all font-mono">{msg.emisor?.id || "\u2014"}</td>
                  <td className="p-3 text-gray-400 text-[11px] select-all font-mono">{msg.receptor?.id || "\u2014"}</td>
                  
                  {
    /* Botones */
  }
                  <td className="p-3 text-center space-x-2">
                    <button
    onClick={() => handleEdit(msg)}
    className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 bg-white/10 border border-white/5 hover:bg-white/15 border border-white/10 rounded px-2 py-1 transition text-[11px]"
  >
                      <Edit2 size={12} /> Editar
                    </button>
                    <button
    onClick={() => handleDelete(msg.id)}
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
    /* MODAL CORREGIDO */
  }
      {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface/50 backdrop-blur-md border border-white/5 w-full max-w-md rounded shadow-2xl overflow-hidden font-sans">
            
            <div className="bg-white/5 px-4 py-3 border-b border border-white/5 flex justify-between items-center">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase">
                {editingId ? "Modificar Mensaje Hist\xF3rico" : "Inyectar Nuevo Mensaje"}
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-4">
              
              {
    /* ID Mensaje (Edición) */
  }
              {editingId && <div className="space-y-1.5 opacity-70">
                  <label className="text-[11px] font-mono tracking-wide uppercase text-gray-500 flex items-center gap-1">
                    <Key size={12} /> ID del Mensaje (Solo Lectura)
                  </label>
                  <input
    type="text"
    disabled
    value={editingId}
    className="w-full bg-white/5 border border-white/5 rounded px-3 py-2 text-xs font-mono text-gray-400 outline-none select-all"
  />
                </div>}

              {
    /* ID Emisor */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <UserPlus size={12} className="text-blue-400" /> ID Usuario Emisor (UUID) *
                </label>
                <input
    type="text"
    required
    value={formIdUsuarioEmisor}
    onChange={(e) => setFormIdUsuarioEmisor(e.target.value)}
    placeholder="Pegar el UUID del emisor"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary transition"
  />
              </div>

              {
    /* ID Receptor */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <UserPlus size={12} className="text-amber-500" /> ID Usuario Receptor (UUID) *
                </label>
                <input
    type="text"
    required
    value={formIdUsuarioReceptor}
    onChange={(e) => setFormIdUsuarioReceptor(e.target.value)}
    placeholder="Pegar el UUID del receptor"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary transition"
  />
              </div>

              {
    /* Fecha Emisión */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <Calendar size={12} className="text-blue-400" /> Fecha de Emisión *
                </label>
                <input
    type="date"
    required
    value={formFechaEmision}
    onChange={(e) => setFormFechaEmision(e.target.value)}
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary transition"
  />
              </div>

              {
    /* Contenido */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <MessageSquare size={12} className="text-blue-400" /> Contenido del Mensaje *
                </label>
                <textarea
    required
    rows={3}
    value={formTextoMensaje}
    onChange={(e) => setFormTextoMensaje(e.target.value)}
    placeholder="Escribe el texto del chat..."
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition resize-none font-sans"
  />
              </div>

              {
    /* Botones */
  }
              <div className="pt-2 flex justify-end gap-2 border-t border border-white/5 text-xs">
                <button
    type="button"
    onClick={() => setIsModalOpen(false)}
    className="bg-white/10 border border-white/5 hover:bg-white/15 text-gray-300 px-3 py-2 rounded transition"
  >
                  Cancelar
                </button>
                <button
    type="submit"
    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium px-4 py-2 rounded transition shadow-md"
  >
                  {editingId ? "Guardar Cambios" : "Enviar Mensaje"}
                </button>
              </div>
            </form>

          </div>
        </div>}
    </div>;
};
