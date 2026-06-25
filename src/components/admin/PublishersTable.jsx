import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Edit2, Plus, X, Globe, Calendar, Type } from "lucide-react";
export const PublishersTable = () => {
  const [publishers, setPublishers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formNombre, setFormNombre] = useState("");
  const [formIdPais, setFormIdPais] = useState("");
  const [formFechaFundacion, setFormFechaFundacion] = useState("");
  useEffect(() => {
    cargarPublishers();
  }, []);
  const cargarPublishers = async () => {
    try {
      const response = await api.get("/publishers", {
        params: { page: 0, size: 100 }
      });
      if (response.data && response.data.content) {
        setPublishers(response.data.content);
      } else {
        setPublishers(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error("Error al cargar publishers:", err);
    }
  };
  const handleEdit = (pub) => {
    setEditingId(pub.id);
    setFormNombre(pub.nombre_editorial || pub.nombre || "");
    setFormIdPais(pub.id_pais || pub.idPais || "");
    setFormFechaFundacion(pub.fechaFundacion || pub.fecha_fundacion || "");
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
      nombre_editorial: formNombre,
      // @JsonProperty("nombre_editorial")
      id_pais: formIdPais || null,
      // Mapeado a private UUID id_pais;
      fechaFundacion: formFechaFundacion || null
      // Mapeado a private String fechaFundacion;
    };
    try {
      if (editingId) {
        await api.put(`/publishers/${editingId}`, payload);
        alert("Editor actualizado correctamente.");
      } else {
        await api.post("/publishers", payload);
        alert("Editor creado con \xE9xito.");
      }
      setIsModalOpen(false);
      cargarPublishers();
    } catch (err) {
      console.error("Error al guardar el publisher. Payload enviado:", payload, err);
      alert("Error en el servidor al procesar el Publisher.");
    }
  };
  return <div className="space-y-4">
      {
    /* ENCABEZADO DE SECCIÓN */
  }
      <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md p-4 border border-white/5 rounded">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide font-mono">Registros de Editoriales</h3>
          <p className="text-xs text-gray-500">Lista completa de publishers mapeados en el sistema.</p>
        </div>
        <button
    onClick={handleNew}
    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium text-xs px-3 py-2 rounded transition shadow-lg"
  >
          <Plus size={14} /> Nuevo Publisher
        </button>
      </div>

      {
    /* TABLA ESTILIZADA AL ESTILO VORTEX / STEAM */
  }
      <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-mono border-b border border-white/5 uppercase tracking-wider text-[10px]">
              <th className="p-3 font-bold">ID (UUID)</th>
              <th className="p-3 font-bold">Nombre Editorial</th>
              <th className="p-3 font-bold">ID País</th>
              <th className="p-3 font-bold">Fundación</th>
              <th className="p-3 font-bold text-center w-24">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
            {publishers.length === 0 ? <tr>
                <td colSpan={5} className="p-8 text-center text-gray-600 italic">
                  No se encontraron editoriales registradas.
                </td>
              </tr> : publishers.map((pub) => <tr key={pub.id} className="hover:bg-white/10 transition">
                  <td className="p-3 text-gray-500 text-[11px] select-all">{pub.id}</td>
                  <td className="p-3 font-sans font-medium text-white">{pub.nombre_editorial || pub.nombre}</td>
                  <td className="p-3 text-gray-400">{pub.id_pais || "N/A"}</td>
                  <td className="p-3 text-blue-400">{pub.fechaFundacion || "N/A"}</td>
                  <td className="p-3 text-center">
                    <button
    onClick={() => handleEdit(pub)}
    className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 bg-white/10 border border-white/5 hover:bg-white/15 border border-white/10 rounded px-2 py-1 transition text-[11px]"
  >
                      <Edit2 size={12} /> Editar
                    </button>
                  </td>
                </tr>)}
          </tbody>
        </table>
      </div>

      {
    /* MODAL OSCURO COMPLETAMENTE DISEÑADO */
  }
      {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-surface/50 backdrop-blur-md border border-white/5 w-full max-w-md rounded shadow-2xl overflow-hidden font-sans">
            
            {
    /* Cabecera Modal */
  }
            <div className="bg-white/5 px-4 py-3 border-b border border-white/5 flex justify-between items-center">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase">
                {editingId ? "Modificar Publisher" : "Registrar Nuevo Publisher"}
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            {
    /* Formulario HTML */
  }
            <form onSubmit={handleSave} className="p-4 space-y-4">
              {
    /* Campo: Nombre Editorial */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <Type size={12} className="text-blue-400" /> Nombre de la Editorial *
                </label>
                <input
    type="text"
    required
    value={formNombre}
    onChange={(e) => setFormNombre(e.target.value)}
    placeholder="Ej. Electronic Arts, Bethesda..."
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
    /* Campo: Fecha Fundación */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <Calendar size={12} className="text-blue-400" /> Fecha de Fundación
                </label>
                <input
    type="text"
    value={formFechaFundacion}
    onChange={(e) => setFormFechaFundacion(e.target.value)}
    placeholder="Ej. 1982-05-28 o Año"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition"
  />
              </div>

              {
    /* Botones de Acción */
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
