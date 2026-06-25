import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, User, Search, Circle } from 'lucide-react';
import api from '../api/axiosConfig';

const Chat = () => {
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState({ id: null, username: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Decodificar el JWT para obtener la información del usuario actual
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        setCurrentUser({ id: decoded.jti, username: decoded.sub });
      } catch (e) {
        console.error("Error parsing JWT token", e);
      }
    }
  }, []);

  // Fetch all messages
  const fetchMessages = async () => {
    try {
      const messagesRes = await api.get('/mensajes');
      setMessages(messagesRes.data || []);
    } catch (err) {
      console.error("Error fetching messages from API", err);
    }
  };

  // Fetch Users & Initialize Chat
  useEffect(() => {
    if (!currentUser.username) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // 1. Fetch all users
        const usersRes = await api.get('/usuarios');

        // Filter out the current user
        const otherUsers = usersRes.data.filter(u => {
          const uName = u.nombre_usuario || u.nombreUsuario;
          return uName && uName.toLowerCase() !== currentUser.username.toLowerCase();
        });

        // Map users to UI format
        const formattedFriends = otherUsers.map(u => ({
          id: u.id,
          nombre: `${u.nombre || ''} ${u.apellido || ''}`.trim() || u.nombre_usuario || u.nombreUsuario,
          username: u.nombre_usuario || u.nombreUsuario,
          estado: 'online',
          actividad: u.rol === 'ROLE_ADMIN' ? 'Administrando la plataforma' : 'Buscando ofertas de juegos'
        }));

        setFriends(formattedFriends);
        if (formattedFriends.length > 0) {
          setSelectedFriend(formattedFriends[0]);
        }

        // 2. Fetch messages
        await fetchMessages();
      } catch (err) {
        console.error("Error loading chat component data", err);
        setError('Error al cargar la información del chat');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // Set up polling for messages every 4 seconds to get real-time conversation updates
  useEffect(() => {
    if (!currentUser.id) return;
    const interval = setInterval(() => {
      fetchMessages();
    }, 4000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Handle Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedFriend || !currentUser.id) return;

    const payload = {
      id_usuario_emisor: currentUser.id,
      id_usuario_receptor: selectedFriend.id,
      mensaje: inputText.trim(),
      fecha_emision: new Date().toISOString().split('T')[0]
    };

    try {
      await api.post('/mensajes', payload);
      setInputText('');
      await fetchMessages();
    } catch (err) {
      console.error("Error sending message to API", err);
      setError('Error al enviar el mensaje');
    }
  };

  // Filter messages to get only the conversation between current user and selected friend
  const currentChat = messages.filter(msg => {
    if (!selectedFriend || !currentUser.id) return false;
    const emisorId = msg.emisor?.id;
    const receptorId = msg.receptor?.id;
    return (emisorId === currentUser.id && receptorId === selectedFriend.id) ||
      (emisorId === selectedFriend.id && receptorId === currentUser.id);
  });

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center text-white h-[calc(100vh-120px)] w-full">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400 text-sm">Cargando chats del servidor...</p>
        </div>
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="flex-grow flex items-center justify-center text-white h-[calc(100vh-120px)] w-full p-8 bg-surface/20 border border-white/5 rounded-2xl">
        <div className="text-center max-w-md space-y-4">
          <MessageSquare className="w-12 h-12 text-gray-500 mx-auto" />
          <h3 className="text-xl font-bold text-white">No hay otros usuarios</h3>
          <p className="text-gray-400 text-sm">No existen otros usuarios registrados en el sistema para chatear.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex gap-6 pb-12 h-[calc(100vh-120px)] w-full">
      {/* Left Sidebar: Friends List */}
      <div className="w-full md:w-80 bg-surface/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden flex flex-col shadow-xl">
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-white">Mensajería ({friends.length})</span>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar amigos..."
              className="w-full pl-9 pr-4 py-2 bg-background/50 border border-white/5 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              disabled
            />
          </div>
        </div>

        {/* Friends Item List */}
        <div className="flex-grow overflow-y-auto p-2 space-y-1">
          {friends.map(friend => (
            <button
              key={friend.id}
              onClick={() => setSelectedFriend(friend)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${selectedFriend?.id === friend.id
                  ? 'bg-gradient-to-r from-blue-600/30 to-indigo-600/10 border-l-4 border-blue-500 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-white/10 overflow-hidden">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <Circle
                  className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${friend.estado === 'online' ? 'text-green-500 fill-green-500' : 'text-yellow-500 fill-yellow-500'
                    }`}
                />
              </div>
              <div className="text-left truncate flex-grow">
                <h4 className="font-bold text-sm text-white truncate">{friend.nombre}</h4>
                <p className="text-xs text-gray-500 truncate">{friend.actividad}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Area: Chat Panel */}
      <div className="flex-grow bg-surface/20 backdrop-blur-md rounded-2xl border border-white/5 shadow-xl flex flex-col overflow-hidden">
        {selectedFriend && (
          <>
            {/* Friend Active Header */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-white/10">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{selectedFriend.nombre}</h3>
                <div className="flex items-center space-x-1">
                  <span className={`w-2 h-2 rounded-full inline-block ${selectedFriend.estado === 'online' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                  <span className="text-xs text-gray-500">{selectedFriend.actividad}</span>
                </div>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-6 overflow-y-auto flex flex-col space-y-4">
              {currentChat.length === 0 ? (
                <div className="flex-grow flex items-center justify-center text-gray-500 text-sm">
                  Sin mensajes. Envía un saludo.
                </div>
              ) : (
                currentChat.map((msg, index) => {
                  const isMe = msg.emisor?.id === currentUser.id;
                  const dateStr = msg.fecha_emision || msg.fechaEmision;
                  return (
                    <div
                      key={msg.id || index}
                      className={`flex flex-col max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}
                    >
                      <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${isMe
                          ? 'bg-blue-600/80 text-white rounded-tr-none'
                          : 'bg-white/5 text-gray-300 rounded-tl-none border border-white/5'
                        }`}>
                        {msg.mensaje}
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 px-1">{dateStr}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/5 bg-black/20 flex items-center space-x-3">
              <input
                type="text"
                placeholder={`Escribir a ${selectedFriend.nombre}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="flex-grow py-3 px-4 bg-background/60 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 text-white placeholder-gray-600"
              />
              <button
                type="submit"
                className={`p-3 rounded-xl transition-all ${inputText.trim()
                    ? 'bg-blue-600 hover:bg-blue-500 text-white cursor-pointer'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                  }`}
                disabled={!inputText.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
