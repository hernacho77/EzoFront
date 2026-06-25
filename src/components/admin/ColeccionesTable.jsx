import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Edit2, Plus, X, Trash2, FolderTree, Globe } from "lucide-react";
export const ColeccionesTable = () => {
  const [colecciones, setColecciones] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formNombre, setFormNombre] = useState("");
  const [formIdPublisher, setFormIdPublisher] = useState("");
  useEffect(() => {
    cargarColecciones();
    cargarPublishers();
  }, []);
  const cargarColecciones = async () => {
    try {
      const response = await api.get("/colecciones", {
        params: { page: 0, size: 100 }
      });
      if (response.data && response.data.content) {
        setColecciones(response.data.content);
      } else {
        setColecciones(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error("Error al cargar colecciones:", err);
    }
  };
  const cargarPublishers = async () => {
    try {
      const response = await api.get("/publishers", {
        params: { page: 0, size: 100 }
      });
      if (response.data && response.data.content) {
        setPublishers(response.data.content);
      } else if (Array.isArray(response.data)) {
        setPublishers(response.data);
      }
    } catch (err) {
      console.error("Error al cargar lista de publishers en colecciones:", err);
    }
  };
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`\xBFSeguro que deseas eliminar la colecci\xF3n "${nombre}"?`)) {
      try {
        await api.delete("/colecciones/delete", {
          params: { id }
        });
        alert("Colecci\xF3n eliminada correctamente.");
        cargarColecciones();
      } catch (err) {
        console.error("Error al eliminar colecci\xF3n:", err);
        alert("No se pudo eliminar la colecci\xF3n.");
      }
    }
  };
  const handleEdit = (col) => {
    setEditingId(col.id);
    setFormNombre(col.nombre || "");
    setFormIdPublisher(col.id_publisher || col.idPublisher || col.publisher?.id || "");
    setIsModalOpen(true);
  };
  const handleNew = () => {
    setEditingId(null);
    setFormNombre("");
    setFormIdPublisher("");
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingId || null,
      nombre: formNombre,
      id_publisher: formIdPublisher || null
      // Obligatorio @JsonProperty("id_publisher")
    };
    try {
      if (editingId) {
        await api.put("/colecciones", payload);
        alert("Colecci\xF3n actualizada correctamente.");
      } else {
        await api.post("/colecciones", payload);
        alert("Colecci\xF3n guardada correctamente.");
      }
      setIsModalOpen(false);
      cargarColecciones();
    } catch (err) {
      console.error("Error en la operaci\xF3n de colecciones. Payload:", payload, err);
      alert("Error al procesar la colecci\xF3n. Aseg\xFArate de seleccionar una Editorial.");
    }
  };
  return <div className="space-y-4">
      {
    /* SECCIÓN ENCABEZADO */
  }
      <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md p-4 border border-white/5 rounded">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide font-mono">Gestión de Colecciones (Sagas / Franquicias)</h3>
          <p className="text-xs text-gray-500">Agrupaciones de artículos relacionales por Editorial.</p>
        </div>
        <button
    onClick={handleNew}
    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium text-xs px-3 py-2 rounded transition shadow-lg"
  >
          <Plus size={14} /> Nueva Colección
        </button>
      </div>

      {
    /* TABLA ESTILO VORTEX */
  }
      <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-mono border-b border border-white/5 uppercase tracking-wider text-[10px]">
              <th className="p-3 font-bold">ID Colección</th>
              <th className="p-3 font-bold">Nombre de Colección</th>
              <th className="p-3 font-bold">Publisher Asociado</th>
              <th className="p-3 font-bold text-center w-40">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
            {colecciones.length === 0 ? <tr>
                <td colSpan={4} className="p-8 text-center text-gray-600 italic">
                  No se encontraron colecciones registradas.
                </td>
              </tr> : colecciones.map((col) => <tr key={col.id} className="hover:bg-white/10 transition">
                  <td className="p-3 text-gray-500 text-[11px] select-all">{col.id}</td>
                  <td className="p-3 font-sans font-medium text-white">{col.nombre}</td>
                  <td className="p-3 text-gray-400">
                    {col.publisher?.nombre_editorial || col.publisher?.nombre || col.id_publisher || "No asignado"}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
    onClick={() => handleEdit(col)}
    className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 bg-white/10 border border-white/5 hover:bg-white/15 border border-white/10 rounded px-2 py-1 transition text-[11px]"
  >
                      <Edit2 size={12} /> Editar
                    </button>
                    <button
    onClick={() => handleDelete(col.id, col.nombre)}
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
                {editingId ? "Modificar Colecci\xF3n" : "Registrar Nueva Colecci\xF3n"}
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-4">
              {
    /* Campo: Nombre */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <FolderTree size={12} className="text-blue-400" /> Nombre de Colección *
                </label>
                <input
    type="text"
    required
    value={formNombre}
    onChange={(e) => setFormNombre(e.target.value)}
    placeholder="Ej. Sagas de Star Wars, Bioshock Collection..."
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition"
  />
              </div>

              {
    /* Campo SELECT: Publisher Dinámico */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <Globe size={12} className="text-blue-400" /> Publisher Editorial Relacionado *
                </label>
                <select
    required
    value={formIdPublisher}
    onChange={(e) => setFormIdPublisher(e.target.value)}
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition h-9 font-sans"
  >
                  <option value="" disabled>-- Selecciona un Publisher --</option>
                  {publishers.map((pub) => <option key={pub.id} value={pub.id} className="bg-surface/50 backdrop-blur-md">
                      {pub.nombre_editorial || pub.nombre} ({pub.id.substring(0, 8)}...)
                    </option>)}
                </select>
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
                  {editingId ? "Guardar Cambios" : "Crear Registro"}
                </button>
              </div>
            </form>

          </div>
        </div>}
    </div>;
};
