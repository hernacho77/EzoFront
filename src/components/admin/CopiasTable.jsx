import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Edit2, Plus, X, Trash2, Key, Layers, User } from "lucide-react";
export const CopiasTable = () => {
  const [copias, setCopias] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formIdArticulo, setFormIdArticulo] = useState("");
  const [formCodigoUnico, setFormCodigoUnico] = useState("");
  const [formEstado, setFormEstado] = useState("DISPONIBLE");
  const [formTipo, setFormTipo] = useState("DIGITAL");
  const [formIdUsuario, setFormIdUsuario] = useState("");
  useEffect(() => {
    cargarCopias();
  }, []);
  const cargarCopias = async () => {
    try {
      const response = await api.get("/copias");
      if (Array.isArray(response.data)) {
        setCopias(response.data);
      } else {
        setCopias([]);
      }
    } catch (err) {
      console.error("Error al cargar copias:", err);
    }
  };
  const handleDelete = async (copia) => {
    const codigo = copia.codigo_unico || copia.codigoUnico;
    if (window.confirm(`\xBFSeguro que deseas eliminar la copia con c\xF3digo [${codigo}]?`)) {
      try {
        await api.delete("/copias/delete", {
          data: {
            id: copia.id,
            id_articulo: copia.id_articulo || copia.idArticulo || null,
            codigo_unico: codigo || "",
            estado: copia.estado || "",
            tipo: copia.tipo || "",
            id_usuario: copia.id_usuario || copia.idUsuario || null
          }
        });
        alert("Copia eliminada correctamente.");
        cargarCopias();
      } catch (err) {
        console.error("Error al eliminar copia:", err);
        alert("No se pudo eliminar la copia.");
      }
    }
  };
  const handleEdit = (copia) => {
    setEditingId(copia.id);
    setFormIdArticulo(copia.id_articulo || copia.idArticulo || "");
    setFormCodigoUnico(copia.codigo_unico || copia.codigoUnico || "");
    setFormEstado(copia.estado || "DISPONIBLE");
    setFormTipo(copia.tipo || "DIGITAL");
    setFormIdUsuario(copia.id_usuario || copia.idUsuario || "");
    setIsModalOpen(true);
  };
  const handleNew = () => {
    setEditingId(null);
    setFormIdArticulo("");
    setFormCodigoUnico("");
    setFormEstado("DISPONIBLE");
    setFormTipo("DIGITAL");
    setFormIdUsuario("");
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingId || null,
      id_articulo: formIdArticulo || null,
      codigo_unico: formCodigoUnico,
      estado: formEstado,
      tipo: formTipo,
      id_usuario: formIdUsuario || null
      // Opcional si no se ha vendido o asignado
    };
    try {
      if (editingId) {
        await api.put("/copias", payload);
        alert("Copia actualizada correctamente.");
      } else {
        await api.post("/copias", payload);
        alert("Copia guardada correctamente.");
      }
      setIsModalOpen(false);
      cargarCopias();
    } catch (err) {
      console.error("Error al procesar copia. Payload:", payload, err);
      alert("Error en el servidor. Verifica que los UUIDs de art\xEDculo y usuario sean v\xE1lidos.");
    }
  };
  return <div className="space-y-4">
      {
    /* ENCABEZADO */
  }
      <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md p-4 border border-white/5 rounded">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide font-mono">Inventario de Copias y Licencias</h3>
          <p className="text-xs text-gray-500">Unidades individuales, seriales únicos y estados de propiedad por Artículo.</p>
        </div>
        <button
    onClick={handleNew}
    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium text-xs px-3 py-2 rounded transition shadow-lg"
  >
          <Plus size={14} /> Registrar Copia
        </button>
      </div>

      {
    /* TABLA ESTILO VORTEX */
  }
      <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-mono border-b border border-white/5 uppercase tracking-wider text-[10px]">
              <th className="p-3 font-bold">Código Único (Licencia)</th>
              <th className="p-3 font-bold">Tipo</th>
              <th className="p-3 font-bold">Estado</th>
              <th className="p-3 font-bold">ID Artículo</th>
              <th className="p-3 font-bold">ID Dueño Actual</th>
              <th className="p-3 font-bold text-center w-40">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
            {copias.length === 0 ? <tr>
                <td colSpan={6} className="p-8 text-center text-gray-600 italic">
                  No se encontraron copias registradas en el inventario.
                </td>
              </tr> : copias.map((c) => <tr key={c.id} className="hover:bg-white/10 transition">
                  <td className="p-3 text-white font-bold flex items-center gap-1.5 font-mono">
                    <Key size={12} className="text-blue-400" /> {c.codigo_unico || c.codigoUnico}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] rounded border ${c.tipo === "DIGITAL" ? "bg-blue-950/40 text-blue-400 border-blue-900" : "bg-amber-950/40 text-amber-400 border-amber-900"}`}>
                      {c.tipo}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 text-[10px] rounded border ${c.estado === "DISPONIBLE" ? "bg-green-950/40 text-green-400 border-green-900" : "bg-gray-850 text-gray-400 border border-white/10"}`}>
                      {c.estado}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 text-[11px] select-all">{c.id_articulo || c.idArticulo}</td>
                  <td className="p-3 text-blue-400 text-[11px] select-all">{c.id_usuario || c.idUsuario || "Almac\xE9n / Tienda"}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
    onClick={() => handleEdit(c)}
    className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 bg-white/10 border border-white/5 hover:bg-white/15 border border-white/10 rounded px-2 py-1 transition text-[11px]"
  >
                      <Edit2 size={12} /> Editar
                    </button>
                    <button
    onClick={() => handleDelete(c)}
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
    /* MODAL EDITAR/CREAR */
  }
      {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface/50 backdrop-blur-md border border-white/5 w-full max-w-md rounded shadow-2xl overflow-hidden font-sans">
            
            <div className="bg-white/5 px-4 py-3 border-b border border-white/5 flex justify-between items-center">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase">
                {editingId ? "Modificar Registro de Copia" : "A\xF1adir Copia al Inventario"}
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-4">
              
              {
    /* Campo: Código Único */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <Key size={12} className="text-blue-400" /> Código Único (Serial / CD-Key) *
                </label>
                <input
    type="text"
    required
    value={formCodigoUnico}
    onChange={(e) => setFormCodigoUnico(e.target.value)}
    placeholder="Ej. XXXX-YYYY-ZZZZ-WWWW"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary transition uppercase"
  />
              </div>

              {
    /* Campo: ID Artículo */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <Layers size={12} className="text-blue-400" /> ID del Artículo Relacionado (UUID) *
                </label>
                <input
    type="text"
    required
    value={formIdArticulo}
    onChange={(e) => setFormIdArticulo(e.target.value)}
    placeholder="Pegar el UUID del juego/artículo"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary transition"
  />
              </div>

              {
    /* Fila: Tipo y Estado */
  }
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400">Tipo de Formato *</label>
                  <select
    value={formTipo}
    onChange={(e) => setFormTipo(e.target.value)}
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none"
  >
                    <option value="DIGITAL">DIGITAL (Key)</option>
                    <option value="FISICO">FÍSICO (Disco/Cartucho)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400">Estado Operativo *</label>
                  <select
    value={formEstado}
    onChange={(e) => setFormEstado(e.target.value)}
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none"
  >
                    <option value="DISPONIBLE">DISPONIBLE</option>
                    <option value="VENDIDO">VENDIDO</option>
                    <option value="EN_INTERCAMBIO">EN INTERCAMBIO</option>
                  </select>
                </div>
              </div>

              {
    /* Campo: ID Usuario Propietario */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <User size={12} className="text-blue-400" /> ID Usuario Propietario (Opcional)
                </label>
                <input
    type="text"
    value={formIdUsuario}
    onChange={(e) => setFormIdUsuario(e.target.value)}
    placeholder="Vacío si permanece en stock de tienda"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary transition"
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
                  {editingId ? "Guardar Cambios" : "A\xF1adir al Stock"}
                </button>
              </div>
            </form>

          </div>
        </div>}
    </div>;
};
