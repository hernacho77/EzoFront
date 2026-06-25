import { motion } from 'framer-motion';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Gamepad2, Library, ShoppingBag, Star, MessageSquare, Shield } from 'lucide-react';
import AnimatedBackground from './AnimatedBackground';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const decoded = token ? parseJwt(token) : null;
  const userRole = decoded?.USER_ROLE || (decoded?.roles && decoded?.roles[0]) || 'ROLE_USER';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-white">
      <AnimatedBackground />

      {/* Persistent Steam-like Top Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 flex items-center justify-between bg-[#171a21]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 shadow-2xl"
      >
        <div className="flex items-center space-x-12">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate(userRole === 'ROLE_ADMIN' ? '/admin/dashboard' : '/menu')}>
            <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
              <Gamepad2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
              EZO
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-2">
            {userRole === 'ROLE_ADMIN' ? (
              <>
                <NavLink 
                  to="/admin/dashboard" 
                  className={({ isActive }) => 
                    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Shield className="w-5 h-5" />
                  <span>Panel Admin</span>
                </NavLink>
                <NavLink 
                  to="/chat" 
                  className={({ isActive }) => 
                    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Chat</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink 
                  to="/menu" 
                  className={({ isActive }) => 
                    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Tienda</span>
                </NavLink>
                <NavLink 
                  to="/library" 
                  className={({ isActive }) => 
                    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Library className="w-5 h-5" />
                  <span>Biblioteca</span>
                </NavLink>
                <NavLink 
                  to="/wishlist" 
                  className={({ isActive }) => 
                    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Star className="w-5 h-5" />
                  <span>Lista de Deseos</span>
                </NavLink>
                <NavLink 
                  to="/chat" 
                  className={({ isActive }) => 
                    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                      isActive ? 'bg-white/10 text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Chat</span>
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-400 hover:text-red-400 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/10"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium hidden sm:block">Salir</span>
          </button>
        </div>
      </motion.nav>

      {/* Page Content */}
      <main className="flex-grow flex flex-col relative z-10 w-full max-w-7xl mx-auto p-6">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="flex-grow flex flex-col h-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
