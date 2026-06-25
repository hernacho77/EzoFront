import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import api from '../api/axiosConfig';
import GameCard from '../components/GameCard';

const MainMenu = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGamesAndWishlist = async () => {
      try {
        const [gamesRes, wishlistRes] = await Promise.all([
          api.get('/articulos'),
          api.get('/wishlists/mis-wishlist').catch(err => ({ data: { content: [] } }))
        ]);

        const gamesData = Array.isArray(gamesRes.data) 
          ? gamesRes.data 
          : (gamesRes.data && Array.isArray(gamesRes.data.content) ? gamesRes.data.content : []);
        setGames(gamesData);

        const wishlistData = Array.isArray(wishlistRes.data)
          ? wishlistRes.data
          : (wishlistRes.data && Array.isArray(wishlistRes.data.content) ? wishlistRes.data.content : []);
        
        const ids = new Set(wishlistData.map(item => item.id_articulo));
        setWishlistIds(ids);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los juegos de la tienda.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGamesAndWishlist();
  }, []);

  const handleToggleWishlist = async (gameId) => {
    try {
      if (wishlistIds.has(gameId)) {
        await api.delete(`/wishlists/remover/${gameId}`);
        setWishlistIds(prev => {
          const next = new Set(prev);
          next.delete(gameId);
          return next;
        });
      } else {
        await api.post('/wishlists/agregar', {
          id_articulo: gameId,
          prioridad: 1
        });
        setWishlistIds(prev => {
          const next = new Set(prev);
          next.add(gameId);
          return next;
        });
      }
    } catch (err) {
      console.error("Error al actualizar la lista de deseos", err);
    }
  };

  const handleBuy = (game) => {
    // Navigate to checkout and pass the selected game via state
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

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-xl text-center mb-8">
          {error}
        </div>
      )}

      {/* Catalog Grid */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-2">Catálogo de Juegos</h3>
        
        {games.length === 0 && !error ? (
          <div className="text-center py-20 text-gray-400">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-xl">No hay juegos disponibles en la tienda en este momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {games.map((game, idx) => (
              <GameCard 
                key={game.id} 
                game={game} 
                onBuy={handleBuy} 
                isWishlisted={wishlistIds.has(game.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainMenu;
