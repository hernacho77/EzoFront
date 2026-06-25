import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Library as LibraryIcon, Play, Clock, Trophy } from 'lucide-react';
import api from '../api/axiosConfig';

import { getCoverUrl } from '../utils/coverHelper';

const Library = () => {
  const [purchasedGames, setPurchasedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const [copiasRes, articlesRes] = await Promise.all([
          api.get('/copias/mis-copias?size=1000').catch(err => {
            console.warn("Error fetching copies:", err);
            return { data: { content: [] } };
          }),
          api.get('/articulos?size=1000').catch(err => {
            console.warn("Error fetching articles:", err);
            return { data: { content: [] } };
          })
        ]);

        const userCopies = Array.isArray(copiasRes.data)
          ? copiasRes.data
          : (copiasRes.data && Array.isArray(copiasRes.data.content) ? copiasRes.data.content : []);

        const gamesCatalog = Array.isArray(articlesRes.data)
          ? articlesRes.data
          : (articlesRes.data && Array.isArray(articlesRes.data.content) ? articlesRes.data.content : []);

        const gamesMap = new Map();
        userCopies.forEach(copy => {
          const isActivo = copy.estado === 'ACTIVO' || copy.estado === 'activo';
          if (isActivo) {
            const articleId = copy.id_articulo || copy.idArticulo;
            if (articleId && !gamesMap.has(articleId)) {
              const matchedGame = gamesCatalog.find(g => g.id === articleId);
              if (matchedGame) {
                gamesMap.set(articleId, {
                  ...matchedGame,
                  fechaCompra: copy.created_date || copy.createdDate || null,
                  copiaCodigo: copy.codigo_unico || copy.codigoUnico
                });
              } else {
                gamesMap.set(articleId, {
                  id: articleId,
                  nombre: copy.nombre_articulo || copy.nombreArticulo || "Juego Adquirido",
                  tipo: copy.tipo || "DIGITAL",
                  fechaCompra: null,
                  copiaCodigo: copy.codigo_unico || copy.codigoUnico
                });
              }
            }
          }
        });

        const gamesList = Array.from(gamesMap.values());
        setPurchasedGames(gamesList);

        if (gamesList.length > 0) {
          setSelectedGame(gamesList[0]);
        }
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar tus juegos.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLibrary();
  }, []);

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 pb-12 h-[calc(100vh-100px)]">
      {/* Left Sidebar: Game List */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-surface/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden flex flex-col shadow-xl">
        <div className="p-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center space-x-2 text-white font-semibold">
            <LibraryIcon className="w-5 h-5 text-gray-400" />
            <span>Colección ({purchasedGames.length})</span>
          </div>
        </div>

        <div className="overflow-y-auto flex-grow custom-scrollbar p-2 space-y-1">
          {purchasedGames.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No tienes juegos en tu biblioteca. ¡Ve a la tienda a comprar algunos!
            </div>
          ) : (
            purchasedGames.map(game => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game)}
                className={`w-full text-left flex items-center space-x-3 p-2 rounded-lg transition-colors ${selectedGame?.id === game.id
                  ? 'bg-gradient-to-r from-blue-600/40 to-indigo-600/10 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }`}
              >
                <div className="w-8 h-8 rounded bg-gray-800 flex-shrink-0 overflow-hidden">
                  <img src={getCoverUrl(game.nombre)} alt="icon" className="w-full h-full object-cover" />
                </div>
                <span className="truncate text-sm font-medium">{game.nombre}</span>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Right Content: Selected Game Details */}
      <div className="w-full md:w-2/3 lg:w-3/4 bg-surface/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl overflow-hidden relative flex flex-col">
        {selectedGame ? (
          <>
            {/* Hero Banner for Selected Game */}
            <div className="h-64 relative w-full flex-shrink-0">
              <img
                src={getCoverUrl(selectedGame.nombre)}
                alt={selectedGame.nombre}
                className="w-full h-full object-cover filter blur-[2px] opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12141a] via-[#12141a]/60 to-transparent"></div>

              <div className="absolute bottom-6 left-8 flex items-end space-x-6">
                <div className="w-32 h-48 rounded-xl shadow-2xl overflow-hidden border-2 border-white/10 hidden sm:block">
                  <img src={getCoverUrl(selectedGame.nombre)} alt="cover" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">{selectedGame.nombre}</h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>{selectedGame.publisher?.nombre || "Indie Studio"}</span>
                    <span>•</span>
                    <span>Adquirido: {selectedGame.fechaCompra || "Recientemente"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions & Info */}
            <div className="p-8 flex-grow flex flex-col">
              <div className="grid grid-cols-3 gap-8 text-gray-300 flex-grow">
                <div className="col-span-2">
                  <h3 className="text-white font-bold mb-3 border-b border-white/5 pb-2">Acerca del juego</h3>
                  <p className="leading-relaxed text-gray-400">
                    {selectedGame.descripcion || "Sumérgete en este fantástico mundo. ¡Gracias por tu compra!"}
                  </p>
                </div>
                <div className="col-span-1 bg-white/5 p-4 rounded-xl border border-white/5 h-fit">
                  <h4 className="text-white font-semibold mb-3">Detalles Técnicos</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between"><span className="text-gray-500">Género</span> <span>{selectedGame.tipo}</span></li>
                    <li className="flex justify-between"><span className="text-gray-500">Tamaño</span> <span>{selectedGame.tamano || "45 GB"}</span></li>
                    <li className="flex justify-between"><span className="text-gray-500">Multijugador</span> <span>Sí</span></li>
                    {selectedGame.copiaCodigo && (
                      <li className="flex flex-col pt-2 border-t border-white/5">
                        <span className="text-gray-500 text-xs">Clave de Activación</span>
                        <span className="text-blue-400 font-mono text-xs break-all mt-1">{selectedGame.copiaCodigo}</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
            <LibraryIcon className="w-24 h-24 mb-4 opacity-20" />
            <p className="text-xl">Selecciona un juego para ver los detalles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
