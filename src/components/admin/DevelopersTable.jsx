import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Edit2, Plus, X, Globe, Calendar, Type, Trash2 } from "lucide-react";
export const DevelopersTable = () => {
  const [developers, setDevelopers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formNombre, setFormNombre] = useState("");
  const [formIdPais, setFormIdPais] = useState("");
  const [formFechaFundacion, setFormFechaFundacion] = useState("");
  useEffect(() => {
    cargarDevelopers();
  }, []);
  const cargarDevelopers = async () => {
    try {
      const response = await api.get("/developers", {
        params: { page: 0, size: 100 }
      });
      if (response.data && response.data.content) {
        setDevelopers(response.data.content);
      } else {
        setDevelopers(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error("Error al cargar developers:", err);
    }
  };
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`\xBFEst\xE1s seguro de eliminar permanentemente al desarrollador "${nombre}"?`)) {
      try {
        await api.post("/developers/delete", {
          id
          // Mapea directamente a IdRequestDto.getId()
        });
        alert("Desarrollador eliminado correctamente.");
        cargarDevelopers();
      } catch (err) {
        console.error("Error al eliminar developer:", err);
        alert("No se pudo eliminar el registro.");
      }
    }
  };
  const handleEdit = (dev) => {
    setEditingId(dev.id);
    setFormNombre(dev.nombre || "");
    setFormIdPais(dev.id_pais || dev.idPais || dev.pais?.id || "");
    setFormFechaFundacion(dev.fechaFundacion || dev.fecha_fundacion || "");
    setIsModalOpen(true);
  };
  const handleNew = () => {
    setEditingId(null);
    setFormNombre("");
    setFormIdPais("");
    setFormFechaFundacion("");
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingId || null,
      nombre: formNombre,
      id_pais: formIdPais || null,
      idPais: formIdPais || null,
      // LocalDate espera estrictamente un formato YYYY-MM-DD (el input type="date" se encarga)
      fechaFundacion: formFechaFundacion || null,
      fecha_fundacion: formFechaFundacion || null
    };
    try {
      if (editingId) {
        await api.put(`/developers/${editingId}`, payload);
        alert("Desarrollador modificado correctamente (Endpoint PUT listo).");
      } else {
        await api.post("/developers", payload);
        alert("Desarrollador guardado correctamente.");
      }
      setIsModalOpen(false);
      cargarDevelopers();
    } catch (err) {
      console.error("Error al procesar developer:", err);
      alert("Error en la solicitud. Verifica los datos.");
    }
  };
  return <div className="space-y-4">
      {
    /* HEADER DE LA SECCIÓN */
  }
      <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md p-4 border border-white/5 rounded">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide font-mono">Registros de Desarrolladores (Developers)</h3>
          <p className="text-xs text-gray-500">Módulos operativos conectados a la base de datos.</p>
        </div>
        <button
    onClick={handleNew}
    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium text-xs px-3 py-2 rounded transition shadow-lg"
  >
          <Plus size={14} /> Nuevo Developer
        </button>
      </div>

      {
    /* TABLA OSCURA TIPO STEAM */
  }
      <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-mono border-b border border-white/5 uppercase tracking-wider text-[10px]">
              <th className="p-3 font-bold">ID (UUID)</th>
              <th className="p-3 font-bold">Nombre de Empresa</th>
              <th className="p-3 font-bold">País Relacionado</th>
              <th className="p-3 font-bold">Fecha Fundación</th>
              <th className="p-3 font-bold text-center w-40">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
            {developers.length === 0 ? <tr>
                <td colSpan={5} className="p-8 text-center text-gray-600 italic">
                  No se encontraron estudios desarrolladores registrados.
                </td>
              </tr> : developers.map((dev) => <tr key={dev.id} className="hover:bg-white/10 transition">
                  <td className="p-3 text-gray-500 text-[11px] select-all">{dev.id}</td>
                  <td className="p-3 font-sans font-medium text-white">{dev.nombre}</td>
                  <td className="p-3 text-gray-400">{dev.pais?.nombre || dev.id_pais || "No asignado"}</td>
                  <td className="p-3 text-blue-400">{dev.fechaFundacion || dev.fecha_fundacion || "N/A"}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
    onClick={() => handleEdit(dev)}
    className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 bg-white/10 border border-white/5 hover:bg-white/15 border border-white/10 rounded px-2 py-1 transition text-[11px]"
  >
                      <Edit2 size={12} /> Editar
                    </button>
                    <button
    onClick={() => handleDelete(dev.id, dev.nombre)}
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
                {editingId ? "Modificar Developer" : "Registrar Nuevo Developer"}
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
                  <Type size={12} className="text-blue-400" /> Nombre del Estudio *
                </label>
                <input
    type="text"
    required
    value={formNombre}
    onChange={(e) => setFormNombre(e.target.value)}
    placeholder="Ej. Valve, Rockstar Games, CD Projekt..."
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition"
  />
              </div>

              {
    /* Campo: ID País */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <Globe size={12} className="text-blue-400" /> ID del País (UUID)
                </label>
                <input
    type="text"
    value={formIdPais}
    onChange={(e) => setFormIdPais(e.target.value)}
    placeholder="Pegar UUID del País correspondiente"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary transition"
  />
              </div>

              {
    /* Campo: Fecha Fundación (LocalDate nativa) */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <Calendar size={12} className="text-blue-400" /> Fecha de Fundación
                </label>
                <input
    type="date"
    value={formFechaFundacion}
    onChange={(e) => setFormFechaFundacion(e.target.value)}
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition font-mono"
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
                  {editingId ? "Guardar Cambios" : "Crear Registro"}
                </button>
              </div>
            </form>

          </div>
        </div>}
    </div>;
};
