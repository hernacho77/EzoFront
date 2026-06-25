import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Edit2, Plus, X, Trash2, MessageSquare, Star, Layers, User, Calendar } from "lucide-react";
export const ComentariosTable = () => {
  const [comentarios, setComentarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formIdArticulo, setFormIdArticulo] = useState("");
  const [formIdUsuario, setFormIdUsuario] = useState("");
  const [formPuntuacion, setFormPuntuacion] = useState(5);
  const [formTextoComentario, setFormTextoComentario] = useState("");
  const [formFecha, setFormFecha] = useState("");
  useEffect(() => {
    cargarComentarios();
  }, []);
  const cargarComentarios = async () => {
    try {
      const response = await api.get("/comentarios", {
        params: { page: 0, size: 100 }
        // Cargamos una buena cantidad para el panel de administración
      });
      if (response.data && response.data.content) {
        setComentarios(response.data.content);
      } else {
        setComentarios(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("\xBFSeguro que deseas eliminar permanentemente este comentario?")) {
      try {
        await api.delete("/comentarios/delete", {
          data: { id }
        });
        alert("Comentario eliminado correctamente.");
        cargarComentarios();
      } catch (err) {
        console.error("Error al eliminar comentario:", err);
        alert("No se pudo eliminar el comentario.");
      }
    }
  };
  const handleEdit = (com) => {
    setEditingId(com.id);
    setFormIdArticulo(com.id_articulo || com.idArticulo || "");
    setFormIdUsuario(com.id_usuario || com.idUsuario || "");
    setFormPuntuacion(com.puntuacion);
    setFormTextoComentario(com.comentario);
    setFormFecha(com.fecha || (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    setIsModalOpen(true);
  };
  const handleNew = () => {
    setEditingId(null);
    setFormIdArticulo("");
    setFormIdUsuario("");
    setFormPuntuacion(5);
    setFormTextoComentario("");
    setFormFecha((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      id: editingId || null,
      id_articulo: formIdArticulo,
      id_usuario: formIdUsuario,
      puntuacion: formPuntuacion,
      comentario: formTextoComentario,
      fecha: formFecha
    };
    try {
      if (editingId) {
        await api.put("/comentarios", payload);
        alert("Comentario actualizado con \xE9xito.");
      } else {
        await api.post("/comentarios", payload);
        alert("Comentario guardado con \xE9xito.");
      }
      setIsModalOpen(false);
      cargarComentarios();
    } catch (err) {
      console.error("Error al procesar el comentario:", err);
      alert("Error en el servidor. Revisa los UUIDs ingresados.");
    }
  };
  return <div className="space-y-4">
      {
    /* ENCABEZADO */
  }
      <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md p-4 border border-white/5 rounded">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide font-mono">Moderación de Comentarios y Reseñas</h3>
          <p className="text-xs text-gray-500">Gestión de opiniones, valoraciones con estrellas y feedback de los usuarios.</p>
        </div>
        <button
    onClick={handleNew}
    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium text-xs px-3 py-2 rounded transition shadow-lg"
  >
          <Plus size={14} /> Crear Reseña
        </button>
      </div>

      {
    /* TABLA ESTILO VORTEX */
  }
      <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-mono border-b border border-white/5 uppercase tracking-wider text-[10px]">
              <th className="p-3 font-bold w-1/4">Comentario / Reseña</th>
              <th className="p-3 font-bold text-center">Puntuación</th>
              <th className="p-3 font-bold">Fecha</th>
              <th className="p-3 font-bold">ID Artículo</th>
              <th className="p-3 font-bold">ID Usuario</th>
              <th className="p-3 font-bold text-center w-40">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
            {comentarios.length === 0 ? <tr>
                <td colSpan={6} className="p-8 text-center text-gray-600 italic">
                  No hay comentarios registrados en la plataforma.
                </td>
              </tr> : comentarios.map((com) => <tr key={com.id} className="hover:bg-white/10 transition">
                  <td className="p-3 font-sans max-w-xs break-words">
                    <div className="text-white flex items-start gap-1.5">
                      <MessageSquare size={13} className="text-blue-400 mt-0.5 shrink-0" />
                      <p className="line-clamp-2 text-gray-200">{com.comentario}</p>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="inline-flex items-center gap-1 bg-[#252525] px-2 py-0.5 rounded border border-white/10 text-amber-400 font-bold">
                      <Star size={11} fill="currentColor" /> {com.puntuacion}/5
                    </div>
                  </td>
                  <td className="p-3 text-gray-400 whitespace-nowrap">{com.fecha}</td>
                  <td className="p-3 text-gray-500 text-[11px] select-all">{com.id_articulo || com.idArticulo}</td>
                  <td className="p-3 text-blue-400 text-[11px] select-all">{com.id_usuario || com.idUsuario}</td>
                  <td className="p-3 text-center space-x-2">
                    <button
    onClick={() => handleEdit(com)}
    className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 bg-white/10 border border-white/5 hover:bg-white/15 border border-white/10 rounded px-2 py-1 transition text-[11px]"
  >
                      <Edit2 size={12} /> Editar
                    </button>
                    <button
    onClick={() => handleDelete(com.id)}
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
    /* MODAL CREAR/EDITAR */
  }
      {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-surface/50 backdrop-blur-md border border-white/5 w-full max-w-md rounded shadow-2xl overflow-hidden font-sans">
            
            <div className="bg-white/5 px-4 py-3 border-b border border-white/5 flex justify-between items-center">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase">
                {editingId ? "Modificar Rese\xF1a" : "A\xF1adir Nueva Rese\xF1a"}
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-4">
              
              {
    /* IDs Relacionales */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <Layers size={12} className="text-blue-400" /> ID del Artículo (UUID) *
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

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                  <User size={12} className="text-blue-400" /> ID del Usuario Autor (UUID) *
                </label>
                <input
    type="text"
    required
    value={formIdUsuario}
    onChange={(e) => setFormIdUsuario(e.target.value)}
    placeholder="Pegar el UUID del usuario"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary transition"
  />
              </div>

              {
    /* Fila: Valoración y Fecha */
  }
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                    <Star size={12} className="text-blue-400" /> Puntuación *
                  </label>
                  <select
    value={formPuntuacion}
    onChange={(e) => setFormPuntuacion(Number(e.target.value))}
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none"
  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                    <option value={3}>⭐⭐⭐ (3/5)</option>
                    <option value={2}>⭐⭐ (2/5)</option>
                    <option value={1}>⭐ (1/5)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400 flex items-center gap-1">
                    <Calendar size={12} className="text-blue-400" /> Fecha *
                  </label>
                  <input
    type="date"
    required
    value={formFecha}
    onChange={(e) => setFormFecha(e.target.value)}
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-3 py-2 text-xs font-mono text-white focus:outline-none"
  />
                </div>
              </div>

              {
    /* Texto del Comentario */
  }
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono tracking-wide uppercase text-gray-400">Texto de la Reseña *</label>
                <textarea
    required
    rows={3}
    value={formTextoComentario}
    onChange={(e) => setFormTextoComentario(e.target.value)}
    placeholder="Escribe el cuerpo de la reseña o comentario..."
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
                  {editingId ? "Actualizar Rese\xF1a" : "Publicar Rese\xF1a"}
                </button>
              </div>
            </form>

          </div>
        </div>}
    </div>;
};
