import { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Edit2, Plus, X, Trash2, User, Mail, Shield, CheckCircle, XCircle, Globe, Phone, Calendar, Key } from "lucide-react";
export const UsuariosTable = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formNombreUsuario, setFormNombreUsuario] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formIdPais, setFormIdPais] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [formNombre, setFormNombre] = useState("");
  const [formApellido, setFormApellido] = useState("");
  const [formFechaNacimiento, setFormFechaNacimiento] = useState("");
  const [formTelefono, setFormTelefono] = useState("");
  const [formRol, setFormRol] = useState("ROLE_USER");
  const [formEmailVerificado, setFormEmailVerificado] = useState(false);
  const [formActivo, setFormActivo] = useState(true);
  useEffect(() => {
    cargarUsuarios();
  }, []);
  const cargarUsuarios = async () => {
    try {
      const response = await api.get("/usuarios");
      if (Array.isArray(response.data)) {
        setUsuarios(response.data);
      } else {
        setUsuarios([]);
      }
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm("\xBFSeguro que deseas eliminar permanentemente este usuario? Esta acci\xF3n podr\xEDa fallar si tiene registros vinculados.")) {
      try {
        await api.delete("/usuarios/delete", {
          data: { id }
        });
        alert("Usuario eliminado correctamente.");
        cargarUsuarios();
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
        alert("No se pudo eliminar el usuario. Verifique restricciones de llave for\xE1nea.");
      }
    }
  };
  const handleEdit = (usr) => {
    setEditingId(usr.id);
    setFormNombreUsuario(usr.nombre_usuario || usr.nombreUsuario || "");
    setFormEmail(usr.email || "");
    setFormIdPais(usr.id_pais || usr.idPais || usr.pais?.id || "");
    setFormPassword("");
    setFormNombre(usr.nombre || "");
    setFormApellido(usr.apellido || "");
    setFormFechaNacimiento(usr.fecha_nacimiento || usr.fechaNacimiento || "");
    setFormTelefono(usr.telefono || "");
    setFormRol(usr.rol || "ROLE_USER");
    setFormEmailVerificado(usr.email_verificado ?? usr.emailVerificado ?? false);
    setFormActivo(usr.activo ?? false);
    setIsModalOpen(true);
  };
  const handleNew = () => {
    setEditingId(null);
    setFormNombreUsuario("");
    setFormEmail("");
    setFormIdPais("");
    setFormPassword("");
    setFormNombre("");
    setFormApellido("");
    setFormFechaNacimiento("");
    setFormTelefono("");
    setFormRol("ROLE_USER");
    setFormEmailVerificado(false);
    setFormActivo(true);
    setIsModalOpen(true);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    if (formFechaNacimiento) {
      const year = parseInt(formFechaNacimiento.split('-')[0], 10);
      if (year < 1950 || year > 2020) {
        alert('La fecha de nacimiento debe estar entre los años 1950 y 2020.');
        return;
      }
    }
    const payload = {
      id: editingId || null,
      nombre_usuario: formNombreUsuario,
      email: formEmail,
      id_pais: formIdPais || null,
      password: formPassword || "CambioInternoAdmin123*",
      // Contraseña por defecto si se edita sin rellenar
      nombre: formNombre || null,
      apellido: formApellido || null,
      fecha_nacimiento: formFechaNacimiento,
      telefono: formTelefono,
      rol: formRol,
      fecha_registro: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      // Se envía requerido por el DTO
      email_verificado: formEmailVerificado,
      activo: formActivo
    };
    try {
      if (editingId) {
        await api.put("/usuarios", payload);
        alert("Usuario actualizado con \xE9xito.");
      } else {
        if (!formPassword) {
          alert("La contrase\xF1a es obligatoria para nuevos usuarios.");
          return;
        }
        await api.post("/usuarios", payload);
        alert("Usuario registrado con \xE9xito.");
      }
      setIsModalOpen(false);
      cargarUsuarios();
    } catch (err) {
      console.error("Error al procesar el usuario:", err);
      alert("Error en la solicitud. Aseg\xFArese de que el nombre de usuario o email no est\xE9n duplicados.");
    }
  };
  return <div className="space-y-4">
      {
    /* ENCABEZADO */
  }
      <div className="flex justify-between items-center bg-surface/50 backdrop-blur-md p-4 border border-white/5 rounded">
        <div>
          <h3 className="text-sm font-bold text-white tracking-wide font-mono">Control de Cuentas de Usuario</h3>
          <p className="text-xs text-gray-500">Administración global de perfiles, roles del sistema, credenciales y estados de actividad.</p>
        </div>
        <button
    onClick={handleNew}
    className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:bg-gradient-to-r from-blue-600 to-indigo-600/90 text-white font-medium text-xs px-3 py-2 rounded transition shadow-lg"
  >
          <Plus size={14} /> Crear Usuario
        </button>
      </div>

      {
    /* TABLA */
  }
      <div className="bg-surface/50 backdrop-blur-md border border-white/5 rounded overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-white/5 text-gray-400 font-mono border-b border border-white/5 uppercase tracking-wider text-[10px]">
              <th className="p-3 font-bold">Identidad / Cuenta</th>
              <th className="p-1 font-bold">Email</th>
              <th className="p-1 font-bold">Teléfono</th>
              <th className="p-1 font-bold text-center">Rol</th>
              <th className="p-1 font-bold text-center">Verificado</th>
              <th className="p-1 font-bold text-center">Estado</th>
              <th className="p-2 font-bold text-center w-36">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300 font-mono">
            {usuarios.length === 0 ? <tr>
                <td colSpan={7} className="p-8 text-center text-gray-600 italic">
                  No hay usuarios registrados en el sistema.
                </td>
              </tr> : usuarios.map((usr) => {
    const username = usr.nombre_usuario || usr.nombreUsuario || "\u2014";
    const verificado = usr.email_verificado ?? usr.emailVerificado ?? false;
    return <tr key={usr.id} className="hover:bg-white/10 transition">
                    <td className="p-1">
                      <div className="flex items-start gap-2">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600/10 p-1.5 rounded text-blue-400 mt-0.5">
                          <User size={14} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm font-sans">{username}</p>
                          <p className="text-[10px] text-gray-500 select-all font-mono">{usr.id}</p>
                          {(usr.nombre || usr.apellido) && <span className="text-[11px] text-gray-400 font-sans block mt-0.5">
                              {usr.nombre || ""} {usr.apellido || ""}
                            </span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-1 text-gray-300 select-all font-sans">
                      <div className="flex items-center gap-1">
                        <Mail size={12} className="text-gray-500" /> {usr.email}
                      </div>
                    </td>
                    <td className="p-3 text-gray-400 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Phone size={12} className="text-gray-500" /> {usr.telefono || "\u2014"}
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${usr.rol === "ROLE_ADMIN" ? "bg-purple-950/40 text-purple-400 border-purple-900/40" : "bg-blue-950/40 text-blue-400 border-primary/30"}`}>
                        <Shield size={10} /> {usr.rol}
                      </span>
                    </td>
                    <td className="p-1 text-center">
                      {verificado ? <span className="inline-flex items-center gap-0.5 text-green-400 bg-green-950/20 px-1.5 py-0.5 rounded border border-green-900/30 text-[10px]">
                          <CheckCircle size={10} fill="currentColor" className="text-green-950" /> SÍ
                        </span> : <span className="inline-flex items-center gap-0.5 text-red-400 bg-red-950/20 px-1.5 py-0.5 rounded border border-red-900/30 text-[10px]">
                          <XCircle size={10} fill="currentColor" className="text-red-950" /> NO
                        </span>}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`w-2 h-2 inline-block rounded-full ${usr.activo ? "bg-green-500 shadow-[0_0_6px_#22c55e]" : "bg-gray-600"}`} />
                      <span className="text-[11px] ml-1.5 text-gray-400">{usr.activo ? "Activo" : "Inactivo"}</span>
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
      onClick={() => handleEdit(usr)}
      className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 bg-white/10 border border-white/5 hover:bg-white/15 border border-white/10 rounded px-2 py-1 transition text-[11px]"
    >
                        <Edit2 size={12} /> Editar
                      </button>
                      <button
      onClick={() => handleDelete(usr.id)}
      className="inline-flex items-center gap-1 text-gray-400 hover:text-red-500 bg-white/10 border border-white/5 hover:bg-red-950/30 border border-white/10 hover:border-red-900 rounded px-2 py-1 transition text-[11px]"
    >
                        <Trash2 size={12} /> Eliminar
                      </button>
                    </td>
                  </tr>;
  })}
          </tbody>
        </table>
      </div>

      {
    /* MODAL CREAR / EDITAR */
  }
      {isModalOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface/50 backdrop-blur-md border border-white/5 w-full max-w-lg rounded shadow-2xl overflow-hidden my-8 font-sans">
            
            <div className="bg-white/5 px-4 py-3 border-b border border-white/5 flex justify-between items-center">
              <span className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase">
                {editingId ? "Modificar Registro de Usuario" : "Registrar Nuevo Perfil"}
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto style-scrollbar">
              
              {
    /* Fila 1: Cuenta y Email */
  }
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-400">Nombre de Usuario *</label>
                  <input
    type="text"
    required
    value={formNombreUsuario}
    onChange={(e) => setFormNombreUsuario(e.target.value)}
    placeholder="ej. player_one"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-400">Email Corporativo/Personal *</label>
                  <input
    type="email"
    required
    value={formEmail}
    onChange={(e) => setFormEmail(e.target.value)}
    placeholder="ej. correo@dominio.com"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
  />
                </div>
              </div>

              {
    /* Fila 2: Nombre y Apellido */
  }
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-400">Nombre</label>
                  <input
    type="text"
    value={formNombre}
    onChange={(e) => setFormNombre(e.target.value)}
    placeholder="Nombre físico"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-400">Apellido</label>
                  <input
    type="text"
    value={formApellido}
    onChange={(e) => setFormApellido(e.target.value)}
    placeholder="Apellido físico"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
  />
                </div>
              </div>

              {
    /* Fila 3: Contraseña e ID País */
  }
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-400 flex items-center gap-1">
                    <Key size={11} className="text-blue-400" /> {editingId ? "Nueva Clave (Opcional)" : "Contrase\xF1a *"}
                  </label>
                  <input
    type="password"
    required={!editingId}
    value={formPassword}
    onChange={(e) => setFormPassword(e.target.value)}
    placeholder={editingId ? "Dejar en blanco para no cambiar" : "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"}
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-primary"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-400 flex items-center gap-1">
                    <Globe size={11} className="text-blue-400" /> ID de País (UUID)
                  </label>
                  <input
    type="text"
    value={formIdPais}
    onChange={(e) => setFormIdPais(e.target.value)}
    placeholder="UUID del País vinculante"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
  />
                </div>
              </div>

              {
    /* Fila 4: Teléfono y Fecha de Nacimiento */
  }
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-400 flex items-center gap-1">
                    <Phone size={11} className="text-blue-400" /> Teléfono *
                  </label>
                  <input
    type="text"
    required
    value={formTelefono}
    onChange={(e) => setFormTelefono(e.target.value)}
    placeholder="+591XXXXXXXX"
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-400 flex items-center gap-1">
                    <Calendar size={11} className="text-blue-400" /> Fecha Nacimiento *
                  </label>
                  <input
    type="date"
    required
    value={formFechaNacimiento}
    onChange={(e) => setFormFechaNacimiento(e.target.value)}
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
  />
                </div>
              </div>

              {
    /* Fila 5: Roles y Banderas de Verificación */
  }
              <div className="grid grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-gray-400">Rol Asignado *</label>
                  <select
    value={formRol}
    onChange={(e) => setFormRol(e.target.value)}
    className="w-full bg-background/80 border border-white/5 border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
  >
                    <option value="ROLE_USER">ROLE_USER (Cliente)</option>
                    <option value="ROLE_ADMIN">ROLE_ADMIN (Admin)</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end pb-2 pl-2">
                  <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                    <input
    type="checkbox"
    checked={formEmailVerificado}
    onChange={(e) => setFormEmailVerificado(e.target.checked)}
    className="w-3.5 h-3.5 rounded bg-black border border-white/10 text-blue-400 focus:ring-0"
  />
                    Email Verificado
                  </label>
                </div>

                <div className="flex flex-col justify-end pb-2 pl-2">
                  <label className="inline-flex items-center gap-2 text-xs text-gray-300 cursor-pointer select-none">
                    <input
    type="checkbox"
    checked={formActivo}
    onChange={(e) => setFormActivo(e.target.checked)}
    className="w-3.5 h-3.5 rounded bg-black border border-white/10 text-blue-400 focus:ring-0"
  />
                    Usuario Activo
                  </label>
                </div>
              </div>

              {
    /* Botones de Acción */
  }
              <div className="pt-3 flex justify-end gap-2 border-t border border-white/5 text-xs">
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
                  {editingId ? "Guardar Cambios" : "Registrar Perfil"}
                </button>
              </div>
            </form>

          </div>
        </div>}
    </div>;
};
