import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, Gamepad2, Calendar, Phone } from 'lucide-react';
import Button from '../components/Button';
import api from '../api/axiosConfig';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Estados para Registro
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regNombre, setRegNombre] = useState('');
  const [regApellido, setRegApellido] = useState('');
  const [regFechaNacimiento, setRegFechaNacimiento] = useState('');
  const [regTelefono, setRegTelefono] = useState('');

  const [regSuccess, setRegSuccess] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username.length < 3 || username.length > 20) {
      setError('El usuario debe tener entre 3 y 20 caracteres.');
      return;
    }
    if (password.length < 8 || password.length > 20) {
      setError('La contraseña debe tener entre 8 y 20 caracteres.');
      return;
    }
    setIsLoading(true);
    setError('');
    setRegSuccess('');
    try {
      const response = await api.post('/auth', { username, password });
      if (response.data && response.data.access_token) {
        const token = response.data.access_token;
        localStorage.setItem('token', token);
        const decoded = parseJwt(token);
        const userRole = decoded?.USER_ROLE || (decoded?.roles && decoded?.roles[0]) || 'ROLE_USER';

        setTimeout(() => {
          if (userRole === 'ROLE_ADMIN') {
            navigate('/admin/dashboard', { replace: true });
          } else {
            navigate('/menu', { replace: true });
          }
        }, 500);
      }
    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regUsername.length < 3 || regUsername.length > 20) {
      setError('El usuario debe tener entre 3 y 20 caracteres.');
      return;
    }
    if (regFechaNacimiento) {
      const year = parseInt(regFechaNacimiento.split('-')[0], 10);
      if (year < 1950 || year > 2020) {
        setError('La fecha de nacimiento debe estar entre los años 1950 y 2020.');
        return;
      }
    }
    const phoneRegex = /^\d{8}$/;
    if (!phoneRegex.test(regTelefono)) {
      setError('El teléfono debe tener exactamente 8 números.');
      return;
    }
    setIsLoading(true);
    setError('');
    setRegSuccess('');
    try {
      await api.post('/usuarios', {
        nombre_usuario: regUsername,
        email: regEmail,
        password: "EzoPassword123",
        nombre: regNombre,
        apellido: regApellido,
        fecha_nacimiento: regFechaNacimiento,
        telefono: regTelefono,
        rol: "ROLE_USER",
        email_verificado: false,
        activo: true
      });
      setRegSuccess('¡Usuario registrado correctamente! La contraseña temporal ha sido enviada a tu correo.');
      setIsRegisterMode(false);
      setUsername(regUsername); // Auto-fill login username
      setPassword('');
      clearRegisterFields();
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'No se pudo registrar el usuario. Inténtalo de nuevo.';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const clearRegisterFields = () => {
    setRegUsername('');
    setRegEmail('');
    setRegPassword('');
    setRegNombre('');
    setRegApellido('');
    setRegFechaNacimiento('');
    setRegTelefono('');
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError('');
    setRegSuccess('');
    clearRegisterFields();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-background p-4"
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={`w-full ${isRegisterMode ? 'max-w-lg' : 'max-w-md'} bg-surface p-8 rounded-2xl shadow-2xl border border-white/5 relative overflow-hidden`}
      >
        {/* Decorative background glows */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-3xl"></div>

        <div className="text-center mb-6 relative z-10">
          <motion.div
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-14 h-14 bg-primary/10 rounded-2xl mx-auto flex items-center justify-center mb-3"
          >
            <Gamepad2 className="w-7 h-7 text-primary" />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            {isRegisterMode ? 'Crear Cuenta' : 'Bienvenido'}
          </h1>
          <p className="text-gray-400 text-xs">
            {isRegisterMode ? 'Regístrate para comenzar en EZO' : 'Inicia sesión para acceder a EZO'}
          </p>
        </div>

        {regSuccess && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-400 text-xs text-center mb-4 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20"
          >
            {regSuccess}
          </motion.p>
        )}

        {!isRegisterMode ? (
          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1">Usuario</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-background/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-gray-600 text-sm"
                  placeholder="Ingresa tu usuario"
                  minLength={3}
                  maxLength={20}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300 ml-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-background/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-gray-600 text-sm"
                  placeholder="••••••••"
                  minLength={8}
                  maxLength={20}
                  required
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-accent text-xs text-center"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" disabled={isLoading} className="mt-6">
              {isLoading ? 'Conectando...' : 'Entrar'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 relative z-10">
            {/* Grid de 2 Columnas para campos de datos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300 ml-1">Usuario</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-background/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-gray-600 text-sm"
                    placeholder="Elige un usuario"
                    minLength={3}
                    maxLength={20}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300 ml-1">Correo Electrónico</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-background/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-gray-600 text-sm"
                    placeholder="ejemplo@correo.com"
                    maxLength={100}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300 ml-1">Nombre</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={regNombre}
                    onChange={(e) => setRegNombre(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-background/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-gray-600 text-sm"
                    placeholder="Tu nombre"
                    maxLength={50}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300 ml-1">Apellido</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={regApellido}
                    onChange={(e) => setRegApellido(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-background/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-gray-600 text-sm"
                    placeholder="Tu apellido"
                    maxLength={50}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300 ml-1">Fecha Nacimiento</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="date"
                    value={regFechaNacimiento}
                    onChange={(e) => setRegFechaNacimiento(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-background/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-gray-600 text-sm text-gray-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300 ml-1">Teléfono</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="tel"
                    value={regTelefono}
                    onChange={(e) => setRegTelefono(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-9 pr-3 py-2 bg-background/50 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all placeholder-gray-600 text-sm"
                    placeholder="Número de 8 dígitos"
                    maxLength={8}
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-accent text-xs text-center"
              >
                {error}
              </motion.p>
            )}

            <Button type="submit" disabled={isLoading} className="mt-6">
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </form>
        )}

        <div className="mt-4 text-center relative z-10">
          <button
            onClick={toggleMode}
            className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
          >
            {isRegisterMode ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;

