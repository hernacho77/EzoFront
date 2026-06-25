import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { ChevronLeft, ChevronRight, Plus, CheckSquare, Square, Trash2 } from "lucide-react";
export const ArticulosTable = ({ fromDate, toDate }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formNombre, setFormNombre] = useState("");
  const [formPrecio, setFormPrecio] = useState("");
  const [formTipo, setFormTipo] = useState("JUEGO");
  const [formDescripcion, setFormDescripcion] = useState("");
  const [formTamano, setFormTamano] = useState("");
  const [formFechaLanzamiento, setFormFechaLanzamiento] = useState("");
  const [formDisponible, setFormDisponible] = useState(true);
  const [formPublisherId, setFormPublisherId] = useState("");
  const [formDeveloperId, setFormDeveloperId] = useState("");
  const [formColeccionId, setFormColeccionId] = useState("");
  const [publishers, setPublishers] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [colecciones, setColecciones] = useState([]);
  const cargarArticulos = () => {
    setLoading(true);
    api.get(`/articulos?page=${page}&size=${pageSize}&from=${fromDate}&to=${toDate}`).then((res) => {
      setData(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setTotalElements(res.data.totalElements || 0);
      setLoading(false);
    }).catch(() => setLoading(false));
  };
  useEffect(() => {
    Promise.all([
      api.get("/publishers").catch(() => ({ data: { content: [] } })),
      api.get("/developers").catch(() => ({ data: { content: [] } })),
      api.get("/colecciones").catch(() => ({ data: { content: [] } }))
    ]).then(([resPub, resDev, resCol]) => {
      setPublishers(resPub.data.content || []);
      setDevelopers(resDev.data.content || []);
      setColecciones(resCol.data.content || []);
    });
  }, []);
  useEffect(() => {
    cargarArticulos();
  }, [page, pageSize, fromDate, toDate]);
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormNombre("");
    setFormPrecio("");
    setFormTipo("JUEGO");
    setFormDescripcion("");
    setFormTamano("");
    setFormFechaLanzamiento((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
    setFormDisponible(true);
    setFormPublisherId("");
    setFormDeveloperId("");
    setFormColeccionId("");
    setIsModalOpen(true);
  };
  const handleOpenEdit = (articulo) => {
    setEditingId(articulo.id);
    setFormNombre(articulo.nombre || "");
    setFormPrecio(articulo.precio ? articulo.precio.toString() : "");
    setFormTipo(articulo.tipo || "");
    setFormDescripcion(articulo.descripcion || "");
    setFormTamano(articulo.tamano || "");
    setFormFechaLanzamiento(articulo.fecha_lanzamiento || articulo.fechaLanzamiento || "");
    setFormDisponible(articulo.disponible ?? true);
    const publisherId = articulo.id_publisher || // Opción 1: snake_case plano
    articulo.idPublisher || // Opción 2: camelCase plano
    articulo.publisher && articulo.publisher.id || // Opción 3: Objeto relación anidado
    "";
    setFormPublisherId(publisherId);
    const developerId = articulo.id_developer || articulo.idDeveloper || articulo.developer && articulo.developer.id || "";
    setFormDeveloperId(developerId);
    const coleccionId = articulo.id_coleccion || articulo.idColeccion || articulo.coleccion && articulo.coleccion.id || "";
    setFormColeccionId(coleccionId);
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (!formFechaLanzamiento || formFechaLanzamiento.trim() === "") {
      alert("La fecha de lanzamiento es obligatoria.");
      return;
    }
    const payload = {
      id: editingId || null,
      nombre: formNombre ? formNombre.trim() : "",
      precio: parseFloat(formPrecio) || 0,
      tipo: formTipo || "",
      descripcion: formDescripcion || "",
      tamano: formTamano || "",
      // ✅ Habla snake_case (gracias a tus @JsonProperty)
      fecha_lanzamiento: formFechaLanzamiento,
      // ✅ Aseguramos que siempre sea un booleano explícito (true/false)
      disponible: !!formDisponible,
      // ✅ Si los IDs opcionales están vacíos, mandamos null limpio
      id_publisher: formPublisherId || null,
      id_developer: formDeveloperId || null,
      id_coleccion: formColeccionId || null
    };
    try {
      if (editingId) {
        await api.put(`/articulos/${editingId}`, payload);
        alert("Art\xEDculo actualizado correctamente");
      } else {
        await api.post("/articulos", payload);
        alert("Art\xEDculo creado con \xE9xito.");
      }
      setIsModalOpen(false);
      cargarArticulos();
    } catch (err) {
      console.error("Error devuelto por la API:", err);
      alert("Error al procesar la solicitud. Revisa la consola del servidor.");
    }
  };
  const handleDelete = async (id, nombre) => {
    if (window.confirm(`\xBFEst\xE1s seguro de que deseas eliminar permanentemente el objeto "${nombre}"?`)) {
      try {
        await api.delete("/articulos/delete", {
          data: {
            idRequestDto: id,
            // Nombre del parámetro exacto que mapea tu controlador
            id
          }
        });
        alert("Art\xEDculo eliminado con \xE9xito del sistema.");
        cargarArticulos();
      } catch (err) {
        console.error("Error al eliminar:", err);
        alert("No se pudo eliminar el art\xEDculo. Revisa la consola.");
      }
    }
  };
  return <div className="space-y-4">
      <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md p-4 border border-white/5 rounded">
        <span className="text-xs text-gray-400 font-mono">Registros: <b>{totalElements}</b></span>
        <button onClick={handleOpenCreate} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs px-4 py-2 rounded flex items-center gap-1.5 hover:from-blue-500 hover:to-indigo-500 transition uppercase tracking-wider">
          <Plus size={14} strokeWidth={3} /> Añadir Artículo
        </button>
      </div>

      <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded overflow-hidden">
        {loading ? <div className="p-10 text-center text-xs font-mono text-blue-400">Cargando catálogo...</div> : <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#202020] border-b border border-white/5 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3 w-32">ID</th>
                <th className="p-3">Nombre</th>
                <th className="p-3 w-20 text-center">Disp.</th>
                <th className="p-3 w-24 text-center">Tipo</th>
                <th className="p-3 w-24 text-right">Precio</th>
                <th className="p-3 w-32 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-gray-300">
              {data.map((art) => <tr key={art.id} className="hover:bg-white/10 transition">
                  <td className="p-3 text-blue-400 font-semibold">{art.id.substring(0, 8)}...</td>
                  <td className="p-3 font-sans font-bold text-white">{art.nombre}</td>
                  <td className="p-3 text-center">
                    {art.disponible ? <span className="text-emerald-500">Sí</span> : <span className="text-red-500">No</span>}
                  </td>
                  <td className="p-3 text-center">
                    <span className="text-[10px] border border-white/10 px-2 py-0.5 rounded-full bg-background/50">{art.tipo}</span>
                  </td>
                  <td className="p-3 text-right font-bold">${Number(art.precio).toFixed(2)}</td>
                  
                  {
    /* ACCIONES CRUD COMBINADAS (MODIFICAR Y ELIMINAR ESTILO DJANGO ACTIONS) */
  }
                  <td className="p-3 text-center font-sans">
                    <div className="flex items-center justify-center gap-3">
                      <button
    onClick={() => handleOpenEdit(art)}
    className="text-blue-400 hover:underline font-medium text-[11px]"
  >
                        Modificar
                      </button>
                      <button
    onClick={() => handleDelete(art.id, art.nombre)}
    className="text-red-500 hover:text-red-400 transition"
    title="Eliminar registro permanentemente"
  >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>)}
            </tbody>
          </table>}
      </div>

      {
    /* PAGINACIÓN */
  }
      <div className="flex justify-between items-center text-xs text-gray-400 font-mono">
        <div>Página {page + 1} de {totalPages || 1}</div>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-2 bg-surface/50 backdrop-blur-md border border-white/5 rounded disabled:opacity-30"><ChevronLeft size={14} /></button>
          <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-2 bg-surface/50 backdrop-blur-md border border-white/5 rounded disabled:opacity-30"><ChevronRight size={14} /></button>
        </div>
      </div>

      {
    /* FORMULARIO EXTENDIDO EN MODAL */
  }
      {isModalOpen && <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-surface/50 backdrop-blur-md border border-white/5 w-full max-w-2xl rounded shadow-2xl my-8">
            <div className="bg-white/5 p-4 border-b border border-white/5 text-sm font-bold text-gray-300 uppercase">
              {editingId ? "Modificar Art\xEDculo" : "A\xF1adir Art\xEDculo"}
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs font-sans">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">Nombre</label>
                  <input type="text" required value={formNombre} onChange={(e) => setFormNombre(e.target.value)} className="w-full bg-background/80 backdrop-blur-xl border border-white/5 border border-white/10 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">Precio (USD)</label>
                  <input type="number" step="0.01" required value={formPrecio} onChange={(e) => setFormPrecio(e.target.value)} className="w-full bg-background/80 backdrop-blur-xl border border-white/5 border border-white/10 rounded p-2 text-white font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">Tipo</label>
                  <select value={formTipo} onChange={(e) => setFormTipo(e.target.value)} className="w-full bg-background/80 backdrop-blur-xl border border-white/5 border border-white/10 rounded p-2 text-white">
                    <option value="JUEGO">JUEGO</option>
                    <option value="COLECCIONABLE">COLECCIONABLE</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">Tamaño</label>
                  <input type="text" value={formTamano} onChange={(e) => setFormTamano(e.target.value)} className="w-full bg-background/80 backdrop-blur-xl border border-white/5 border border-white/10 rounded p-2 text-white" placeholder="Ej: 50GB" />
                </div>
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">Fecha Lanzamiento</label>
                  <input type="date" required value={formFechaLanzamiento} onChange={(e) => setFormFechaLanzamiento(e.target.value)} className="w-full bg-background/80 backdrop-blur-xl border border-white/5 border border-white/10 rounded p-2 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border border-white/5 pt-4">
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">Publisher</label>
                  <select value={formPublisherId} onChange={(e) => setFormPublisherId(e.target.value)} className="w-full bg-background/80 backdrop-blur-xl border border-white/5 border border-white/10 rounded p-2 text-white">
                    <option value="">-- Ninguno --</option>
                    {publishers.map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">Developer</label>
                  <select value={formDeveloperId} onChange={(e) => setFormDeveloperId(e.target.value)} className="w-full bg-background/80 backdrop-blur-xl border border-white/5 border border-white/10 rounded p-2 text-white">
                    <option value="">-- Ninguno --</option>
                    {developers.map((d) => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 uppercase text-[10px] mb-1">Colección</label>
                  <select value={formColeccionId} onChange={(e) => setFormColeccionId(e.target.value)} className="w-full bg-background/80 backdrop-blur-xl border border-white/5 border border-white/10 rounded p-2 text-white">
                    <option value="">-- Ninguno --</option>
                    {colecciones.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 uppercase text-[10px] mb-1">Descripción</label>
                <textarea rows={3} value={formDescripcion} onChange={(e) => setFormDescripcion(e.target.value)} className="w-full bg-background/80 backdrop-blur-xl border border-white/5 border border-white/10 rounded p-2 text-white" placeholder="Sinopsis del artículo..." />
              </div>

              <div className="flex items-center gap-2 cursor-pointer select-none text-gray-300" onClick={() => setFormDisponible(!formDisponible)}>
                {formDisponible ? <CheckSquare size={16} className="text-blue-400" /> : <Square size={16} />}
                <span>Objeto disponible para la venta en el catálogo público</span>
              </div>

              <div className="bg-[#202020] p-4 -mx-6 -mb-6 flex justify-end gap-2 border-t border border-white/5 rounded-b">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-800 text-gray-400 rounded hover:bg-gray-700 uppercase tracking-wider font-bold">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded font-black uppercase tracking-wider">Guardar Cambios</button>
              </div>
            </form>
          </div>
        </div>}
    </div>;
};
