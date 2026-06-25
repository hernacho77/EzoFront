import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import Button from './Button';

import { getCoverUrl } from '../utils/coverHelper';

const GameCard = ({ game, onBuy, isWishlisted, onToggleWishlist }) => {
  const coverUrl = getCoverUrl(game.nombre);


  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-[#20232a] rounded-xl overflow-hidden border border-white/5 shadow-lg flex flex-col"
    >
      {/* Imagen de la portada */}
      <div className="relative aspect-[3/4] z-0 w-full overflow-hidden">
        <img 
          src={coverUrl} 
          alt={game.nombre}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#20232a] via-[#20232a]/40 to-transparent"></div>
        
        {/* Estrella Wishlist */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(game.id); }}
          className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md border border-white/10 transition-all duration-300 z-20 cursor-pointer ${
            isWishlisted 
              ? 'bg-yellow-400/20 text-yellow-400 opacity-100 scale-100' 
              : 'bg-black/60 text-gray-400 opacity-0 group-hover:opacity-100 scale-95 hover:scale-105 hover:text-white'
          }`}
          title={isWishlisted ? "Quitar de lista de deseos" : "Añadir a lista de deseos"}
        >
          <Star className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Tag del precio */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-md border border-white/10 z-10">
          <span className="font-bold text-green-400">${game.precio.toFixed(2)} USDT</span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3 bg-blue-500/80 backdrop-blur-md px-2 py-0.5 rounded text-xs font-semibold text-white uppercase tracking-wider">
          {game.tipo}
        </div>
      </div>

      {/* Content - Nombre del juego y su desarrolladora */}
      <div className="p-5 flex-grow flex flex-col justify-between relative z-10 -mt-10">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 truncate">{game.nombre}</h3>
          <p className="text-sm text-gray-400 mb-3">{game.publisher?.nombre || "Indie Studio"}</p>
          <p className="text-sm text-gray-300 line-clamp-2 mb-4 leading-relaxed">
            {game.descripcion || "Sumérgete en una experiencia increíble y descubre nuevos mundos en este emocionante título."}
          </p>
        </div>

        <Button 
          onClick={() => onBuy(game)} 
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Comprar Ahora</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default GameCard;
