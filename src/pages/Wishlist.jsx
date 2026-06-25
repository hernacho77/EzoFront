import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Trash2, Heart } from 'lucide-react';
import api from '../api/axiosConfig';
import { getCoverUrl } from '../utils/coverHelper';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get('/wishlists/mis-wishlist');
        const data = Array.isArray(response.data)
          ? response.data
          : (response.data && Array.isArray(response.data.content) ? response.data.content : []);
        setWishlist(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la lista de deseos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (gameId) => {
    try {
      await api.delete(`/wishlists/remover/${gameId}`);
      setWishlist(prev => prev.filter(item => (item.id_articulo || item.idArticulo) !== gameId));
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el juego de la lista de deseos.');
    }
  };

  const handleBuy = (item) => {
    const game = {
      id: item.id_articulo || item.idArticulo,
      nombre: item.nombre_articulo || item.nombreArticulo || "Juego",
      precio: item.precio_articulo !== undefined ? item.precio_articulo : (item.precioArticulo || 0),
      tipo: 'DIGITAL',
      descripcion: `Juego de tu lista de deseos, agregado el ${item.fecha_agregado || item.fechaAgregado || ''}`
    };
    navigate('/checkout', { state: { game } });
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col pb-12">
      <div className="flex items-center space-x-3 mb-8 border-b border-white/10 pb-4">
        <Star className="w-8 h-8 text-yellow-400 fill-current" />
        <h2 className="text-3xl font-bold text-white">Mi Lista de Deseos</h2>
        <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-medium text-gray-300">
          {wishlist.length} {wishlist.length === 1 ? 'juego' : 'juegos'}
        </span>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-xl text-center mb-8">
          {error}
        </div>
      )}

      {wishlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-surface/30 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl max-w-2xl mx-auto w-full"
        >
          <Heart className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-60 animate-pulse" />
          <h3 className="text-2xl font-bold text-white mb-2">Tu lista está vacía</h3>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            Explora la tienda de EZO y marca tus juegos favoritos con la estrella para guardarlos aquí.
          </p>
          <button
            onClick={() => navigate('/menu')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/25"
          >
            Ir a la Tienda
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map(item => {
            const gameId = item.id_articulo || item.idArticulo;
            const nombre = item.nombre_articulo || item.nombreArticulo || "Juego sin nombre";
            const coverUrl = getCoverUrl(nombre);
            const precioRaw = item.precio_articulo !== undefined ? item.precio_articulo : item.precioArticulo;
            const precio = precioRaw ? Number(precioRaw) : 0;
            const fechaAgregado = item.fecha_agregado || item.fechaAgregado || "Fecha desconocida";

            return (
              <motion.div
                key={gameId}
                whileHover={{ y: -6 }}
                className="bg-[#20232a] rounded-xl overflow-hidden border border-white/5 shadow-lg flex flex-col group relative"
              >
                {/* Cover Image */}
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <img
                    src={coverUrl}
                    alt={nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#20232a] via-[#20232a]/30 to-transparent"></div>

                  {/* Remove Button in corner */}
                  <button
                    onClick={() => handleRemove(gameId)}
                    className="absolute top-3 right-3 bg-red-600/80 hover:bg-red-600 text-white p-2 rounded-lg backdrop-blur-sm border border-white/10 transition-colors shadow-md cursor-pointer"
                    title="Eliminar de la lista"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10">
                    <span className="font-bold text-green-400">${precio.toFixed(2)} USDT</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-white truncate mb-1">{nombre}</h3>
                    <p className="text-xs text-gray-400">Agregado el: {fechaAgregado}</p>
                  </div>

                  <button
                    onClick={() => handleBuy(item)}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Comprar</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
