import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Edit2, Plus, X, Trash2, CreditCard, Type } from "lucide-react";
export const MetodosPagoTable = () => {
  const [metodos, setMetodos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formNombreMetodo, setFormNombreMetodo] = useState("");
  useEffect(() => {
    cargarMetodos();
  }, []);
  const cargarMetodos = async () => {
    try {
      const response = await api.get("/metodos-pago");
      if (Array.isArray(response.data)) {
        setMetodos(response.data);
      } else {
        setMetodos([]);
      }
    } catch (err) {
      console.error("Error al cargar m\xE9todos de pago:", err);
    }
  };
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`\xBFSeguro que deseas eliminar el m\xE9todo de pago "${nombre}"?`)) {
      try {
        await api.delete("/metodos-pago/delete", {
          data: { id }
        });
        alert(`M\xE9todo de pago eliminado correctamente.`);
        cargarMetodos();
      } catch (err) {
        console.error("Error al eliminar m\xE9todo de pago:", err);
        alert("No se pudo eliminar el registro.");
      }
    }
  };
  const handleEdit = (metodo) => {
    setEditingId(metodo.id);
    setFormNombreMetodo(metodo.nombre_metodo || "");
    setIsModalOpen(true);
  };
  const handleNew = () => {
    setEditingId(null);
    setFormNombreMetodo("");
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingId || null,
      nombre_metodo: formNombreMetodo
    };
    try {
      if (editingId) {
        await api.put(`/metodos-pago/${editingId}`, payload);
        alert("M\xE9todo de pago modificado (Endpoint PUT listo).");
      } else {
        await api.post("/metodos-pago", payload);
        alert("M\xE9todo de pago guardado correctamente.");
      }
      setIsModalOpen(false);
      cargarMetodos();
    } catch (err) {
      console.error("Error al procesar m\xE9todo de pago:", err);
      alert("Error en la solicitud. Int\xE9ntalo de nuevo.");
    }
  };
  return <div className="space-y-4">
      {
    /* ENCABEZADO */
  }
      <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md p-4 border border-white/5 rounded">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide font-mono">Pasarelas y Métodos de Pago</h3>
          <p className="text-xs text-gray-500">Opciones de pago disponibles para los usuarios en la tienda.</p>
        </div>
        <button
    onClick={handleNew}
    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium text-xs px-3 py-2 rounded transition shadow-lg"
  >
          <Plus size={14} /> Nuevo Método
        </button>
      </div>

      {
    /* TABLA ESTILO VORTEX */
  }
      <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-mono border-b border border-white/5 uppercase tracking-wider text-[10px]">
              <th className="p-3 font-bold">ID Método (UUID)</th>
              <th className="p-3 font-bold">Nombre del Método de Pago</th>
              <th className="p-3 font-bold text-center w-40">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
            {metodos.length === 0 ? <tr>
                <td colSpan={3} className="p-8 text-center text-gray-600 italic">
                  No se encontraron métodos de pago registrados.
                </td>
              </tr> : metodos.map((m) => <tr key={m.id} className="hover:bg-white/10 transition">
                  <td className="p-3 text-gray-500 text-[11px] select-all">{m.id}</td>
                  <td className="p-3 font-sans font-medium text-white flex items-center gap-2">
                    <CreditCard size={13} className="text-blue-400" /> {m.nombre_metodo}
                  </td>
                  <td className="p-3 text-center space-x-2">
                    <button
    onClick={() => handleEdit(m)}
    className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 bg-white/10 border border-white/5 hover:bg-white/15 border border-white/10 rounded px-2 py-1 transition text-[11px]"
  >
                      <Edit2 size={12} /> Editar
                    </button>
                    <button
    onClick={() => handleDelete(m.id, m.nombre_metodo)}
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
                {editingId ? "Modificar M\xE9todo" : "Registrar Nuevo M\xE9todo"}
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-4">
              {
    /* Campo: Nombre del Método */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <Type size={12} className="text-blue-400" /> Denominación del Método *
                </label>
                <input
    type="text"
    required
    maxLength={25}
    value={formNombreMetodo}
    onChange={(e) => setFormNombreMetodo(e.target.value)}
    placeholder="Ej. Tarjeta de Crédito, PayPal, QR..."
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition"
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
