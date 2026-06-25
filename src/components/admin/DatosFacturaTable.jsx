import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Edit2, Plus, X, Trash2, FileText, User, Hash, MapPin } from "lucide-react";
export const DatosFacturaTable = () => {
  const [perfiles, setPerfiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formIdUsuario, setFormIdUsuario] = useState("");
  const [formNit, setFormNit] = useState("");
  const [formRazonSocial, setFormRazonSocial] = useState("");
  const [formDireccion, setFormDireccion] = useState("");
  useEffect(() => {
    cargarPerfiles();
  }, []);
  const cargarPerfiles = async () => {
    try {
      const response = await api.get("/datos-factura");
      if (Array.isArray(response.data)) {
        setPerfiles(response.data);
      } else {
        setPerfiles([]);
      }
    } catch (err) {
      console.error("Error al cargar datos de factura:", err);
    }
  };
  const handleDelete = async (id, razonSocial) => {
    if (window.confirm(`\xBFSeguro que deseas eliminar el perfil de facturaci\xF3n de "${razonSocial}"?`)) {
      try {
        await api.delete("/datos-factura/delete", {
          data: { id }
        });
        alert("Perfil de facturaci\xF3n eliminado.");
        cargarPerfiles();
      } catch (err) {
        console.error("Error al eliminar datos de factura:", err);
        alert("No se pudo eliminar el registro.");
      }
    }
  };
  const handleEdit = (perfil) => {
    setEditingId(perfil.id);
    setFormIdUsuario(perfil.id_usuario || perfil.idUsuario || "");
    setFormNit(perfil.nit || "");
    setFormRazonSocial(perfil.razon_social || perfil.razonSocial || "");
    setFormDireccion(perfil.direccion || "");
    setIsModalOpen(true);
  };
  const handleNew = () => {
    setEditingId(null);
    setFormIdUsuario("");
    setFormNit("");
    setFormRazonSocial("");
    setFormDireccion("");
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingId || null,
      id_usuario: formIdUsuario || null,
      nit: formNit || null,
      razon_social: formRazonSocial,
      direccion: formDireccion
    };
    try {
      if (editingId) {
        await api.put(`/datos-factura/${editingId}`, payload);
        alert("Datos de factura modificados (Endpoint PUT listo).");
      } else {
        await api.post("/datos-factura", payload);
        alert("Perfil de facturaci\xF3n guardado correctamente.");
      }
      setIsModalOpen(false);
      cargarPerfiles();
    } catch (err) {
      console.error("Error al procesar datos de factura:", err);
      alert("Error en el servidor. Verifica que el ID de Usuario sea un UUID v\xE1lido.");
    }
  };
  return <div className="space-y-4">
      {
    /* ENCABEZADO */
  }
      <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md p-4 border border-white/5 rounded">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide font-mono">Perfiles de Facturación de Clientes</h3>
          <p className="text-xs text-gray-500">Datos fiscales de usuarios (NIT, Razón Social y Direcciones de emisión).</p>
        </div>
        <button
    onClick={handleNew}
    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium text-xs px-3 py-2 rounded transition shadow-lg"
  >
          <Plus size={14} /> Nuevo Perfil
        </button>
      </div>

      {
    /* TABLA ESTILO VORTEX */
  }
      <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-mono border-b border border-white/5 uppercase tracking-wider text-[10px]">
              <th className="p-3 font-bold">ID Perfil</th>
              <th className="p-3 font-bold">Razón Social</th>
              <th className="p-3 font-bold">NIT / CI</th>
              <th className="p-3 font-bold">Dirección de Envío</th>
              <th className="p-3 font-bold">ID Usuario Dueño</th>
              <th className="p-3 font-bold text-center w-40">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
            {perfiles.length === 0 ? <tr>
                <td colSpan={6} className="p-8 text-center text-gray-600 italic">
                  No se encontraron datos de facturación registrados.
                </td>
              </tr> : perfiles.map((p) => <tr key={p.id} className="hover:bg-white/10 transition">
                  <td className="p-3 text-gray-500 text-[11px] select-all">{p.id}</td>
                  <td className="p-3 font-sans font-medium text-white">{p.razon_social || p.razonSocial}</td>
                  <td className="p-3 text-gray-400">{p.nit || "S/N"}</td>
                  <td className="p-3 text-gray-400 font-sans">{p.direccion}</td>
                  <td className="p-3 text-blue-400 text-[11px] select-all">{p.id_usuario || p.idUsuario}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
    onClick={() => handleEdit(p)}
    className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 bg-white/10 border border-white/5 hover:bg-white/15 border border-white/10 rounded px-2 py-1 transition text-[11px]"
  >
                      <Edit2 size={12} /> Editar
                    </button>
                    <button
    onClick={() => handleDelete(p.id, p.razon_social || p.razonSocial || "")}
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
                {editingId ? "Modificar Perfil Fiscal" : "Registrar Perfil Fiscal"}
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-4">
              
              {
    /* Campo: ID Usuario */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <User size={12} className="text-blue-400" /> ID del Usuario Asociado (UUID) *
                </label>
                <input
    type="text"
    required
    value={formIdUsuario}
    onChange={(e) => setFormIdUsuario(e.target.value)}
    placeholder="Pegar el UUID del usuario cliente"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary transition"
  />
              </div>

              {
    /* Fila: Razón Social y NIT */
  }
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                    <FileText size={12} className="text-blue-400" /> Razón Social *
                  </label>
                  <input
    type="text"
    required
    value={formRazonSocial}
    onChange={(e) => setFormRazonSocial(e.target.value)}
    placeholder="Nombre o Empresa"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition"
  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                    <Hash size={12} className="text-blue-400" /> NIT / CI
                  </label>
                  <input
    type="text"
    value={formNit}
    onChange={(e) => setFormNit(e.target.value)}
    placeholder="Ej. 4593020"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-primary transition"
  />
                </div>
              </div>

              {
    /* Campo: Dirección */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <MapPin size={12} className="text-blue-400" /> Dirección Fiscal *
                </label>
                <input
    type="text"
    required
    value={formDireccion}
    onChange={(e) => setFormDireccion(e.target.value)}
    placeholder="Ej. Av. Principal N° 450, Piso 2"
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
