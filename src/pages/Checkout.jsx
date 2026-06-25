import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { QrCode, CreditCard, ArrowLeft, CheckCircle2, Star } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import Button from '../components/Button';
import api from '../api/axiosConfig';

const STATIC_QR_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWAQMAAAAGz+OhAAAABlBMVEX///8AAABVwtN+AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABF0lEQVRIib2Wsa3DMAxEKbhQqRE0ihYz4ngzj6IRVKowciEpJfj5SBkfocJ6ag4kj7TIl9igcSxNP0PPduk/Z6te0oFWen5IvtsLhyWc6VgAyeh5B3YmUy2xitCZpaGGzmSee8VRq/1Rj2vZ6DVlKuSz/65l7+im4l9cyFTLmUwO8Ij1pofFrNGGp2GAxFYplvBWUL0MdesUtrVyOjZjmZbAYYs1mmmJuHub4/dsTTac9UX9i1lfEhM/EXjnnsKgeR7+dRBYzJaCjWjsmCOLwUaof6MLQRUOG3PSVexjVHYKG3tBpKiPXloobOxf9a/Lmt5isVPTP/cvlVnNYV0W//yDXMtk7n2bz3YCh81ea+Ku8vRT2Jd4AglyFPQ6IIBoAAAAAElFTkSuQmCC";



import { getCoverUrl } from '../utils/coverHelper';

const Checkout = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [stereumData, setStereumData] = useState(null);
  const [error, setError] = useState('');

  // Payment Simulation State
  const [facturaId, setFacturaId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('PENDIENTE');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationError, setSimulationError] = useState('');

  // Review / Comment State
  const [comentario, setComentario] = useState('');
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentarioEnviado, setComentarioEnviado] = useState(false);
  const [comentarioCargando, setComentarioCargando] = useState(false);
  const [comentarioError, setComentarioError] = useState('');
  const [comentariosExistentes, setComentariosExistentes] = useState([]);

  // Retrieve the game passed from the Storefront
  const gameToBuy = location.state?.game;

  const fetchComentarios = async () => {
    if (!gameToBuy?.id) return;
    try {
      const response = await api.get('/comentarios?size=1000');
      const allComments = response.data?.content || response.data || [];
      const filtered = allComments.filter(c => c.id_articulo === gameToBuy.id || c.idArticulo === gameToBuy.id);
      setComentariosExistentes(filtered);
    } catch (err) {
      console.error("Error al obtener comentarios:", err);
    }
  };

  // If no game was passed (e.g. user refreshed the page), redirect to store
  useEffect(() => {
    if (!gameToBuy) {
      navigate('/menu');
    } else {
      fetchComentarios();
    }
  }, [gameToBuy, navigate]);

  if (!gameToBuy) return null;

  // We set the dynamic pricing based on the selected game
  const precioJuego = gameToBuy.precio;
  const impuestoCalc = precioJuego * 0.13; // 13% tax for example
  const totalCalc = precioJuego + impuestoCalc;

  const generateInvoice = async () => {
    setIsLoading(true);
    setError('');

    const payload = {
      numero_factura: `F-${Math.floor(Math.random() * 10000)}`,
      razon_social_emp: "EZO Gaming Corp",
      id_usuario: "00000000-0000-0000-0000-000000000000",
      subtotal: precioJuego,
      impuesto: impuestoCalc,
      total: totalCalc,
      fecha_emision: new Date().toISOString().split('T')[0],
      nit_empresa: "123456789",
      nit: "987654321",
      razon_social: "Cliente EZO",
      id_metodo_pago: "00000000-0000-0000-0000-000000000000",
      detalles: [
        {
          id_articulo: gameToBuy.id,
          id_copia: "00000000-0000-0000-0000-000000000000", // Fallback, backend usually generates/assigns copies, or we mock it
          cantidad: 1,
          descripcion: `Compra de: ${gameToBuy.nombre}`
        }
      ]
    };

    try {
      const response = await api.post('/facturas', payload).catch(err => {
        console.warn("API de facturas falló, simulando respuesta con QR estático de fallback:", err);
        return {
          data: {
            payment_link: null,
            qr_base64: STATIC_QR_BASE64
          }
        };
      });
      const data = response.data;
      const fId = data?.factura_id || data?.facturaId || null;
      setFacturaId(fId);

      const paymentLink = data?.payment_link || data?.paymentLink || data?.link || null;
      
      const qrCodeRaw = data?.qr_base64 || data?.qrBase64 || data?.qrCode;
      const isMockQr = qrCodeRaw === "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
      const qrCode = (!qrCodeRaw || isMockQr) ? STATIC_QR_BASE64 : qrCodeRaw;

      setStereumData({
        payment_link: paymentLink,
        qr_base64: qrCode
      });
    } catch (err) {
      console.error("Error catastrófico en facturación, usando QR de fallback:", err);
      setStereumData({
        payment_link: 'https://stereum.tech/developers',
        qr_base64: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://stereum.tech/developers'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    setSimulationError('');
    try {
      if (facturaId) {
        await api.post(`/stereum/simular-pago/${facturaId}`);
      } else {
        console.warn("No hay ID de factura real del backend para simular el pago. Simulando en frontend únicamente.");
      }
      setPaymentStatus('COMPLETADO');
    } catch (err) {
      console.error("Error simulando el pago:", err);
      setSimulationError('No se pudo procesar la simulación de pago en el servidor.');
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSubmitComentario = async (e) => {
    e.preventDefault();
    if (!comentario.trim()) {
      setComentarioError('El comentario no puede estar en blanco.');
      return;
    }
    setComentarioCargando(true);
    setComentarioError('');
    try {
      const payloadComentario = {
        id_articulo: gameToBuy.id,
        id_usuario: "00000000-0000-0000-0000-000000000000", // Fallback to current authenticated user in backend
        puntuacion: puntuacion,
        comentario: comentario,
        fecha: new Date().toISOString().split('T')[0]
      };
      await api.post('/comentarios', payloadComentario);
      setComentarioEnviado(true);
      fetchComentarios();
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data || 'Error al enviar el comentario.';
      setComentarioError(typeof errMsg === 'string' ? errMsg : 'Error al enviar el comentario.');
    } finally {
      setComentarioCargando(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/menu')}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8 bg-surface/50 px-4 py-2 rounded-lg border border-white/5 w-fit"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver a la Tienda</span>
      </motion.button>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Game Details Summary */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring' }}
          className="w-full md:w-1/2 bg-surface/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="h-48 relative">
            <img
              src={getCoverUrl(gameToBuy.nombre)}
              alt={gameToBuy.nombre}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
          </div>
          <div className="p-8 -mt-16 relative z-10">
            <div className="w-20 h-28 rounded-lg overflow-hidden border-2 border-white/10 shadow-2xl mb-4 bg-gray-800">
              <img src={getCoverUrl(gameToBuy.nombre)} alt="cover" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">{gameToBuy.nombre}</h2>
            <p className="text-gray-400 text-sm mb-6 pb-6 border-b border-white/10">Edición Estándar Digital</p>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${precioJuego.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Impuestos (13%)</span>
                <span>${impuestoCalc.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-white/10 mt-4">
                <span>Total a Pagar</span>
                <span className="text-green-400">${totalCalc.toFixed(2)} USDT</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Payment / Stereum Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring' }}
          className="w-full md:w-1/2 bg-surface/80 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col justify-center relative"
        >
          {!stereumData ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Completar Compra</h3>
              <p className="text-gray-400 text-sm mb-8">
                Al continuar, generarás un código QR para realizar tu pago a través de Stereum en la red de Polygon.
              </p>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-white text-sm p-4 rounded-lg text-center">
                  {error}
                </div>
              )}

              <Button onClick={generateInvoice} disabled={isLoading} className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-600/20">
                {isLoading ? 'Generando QR seguro...' : `Pagar ${totalCalc.toFixed(2)} USDT`}
              </Button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center space-y-6"
            >
              <div className="flex items-center space-x-2 text-green-400 font-semibold bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20">
                <CheckCircle2 className="w-5 h-5" />
                <span>Factura Generada</span>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-2xl ring-4 ring-white/10">
                <img
                  src={stereumData.qr_base64.startsWith('http') || stereumData.qr_base64.startsWith('data:image') ? stereumData.qr_base64 : `data:image/png;base64,${stereumData.qr_base64}`}
                  alt="QR Code de Pago"
                  className="w-48 h-48"
                />
              </div>

              <p className="text-gray-400 text-sm text-center px-4">
                Abre tu billetera compatible y escanea el código para autorizar el pago de <strong className="text-white">${totalCalc.toFixed(2)} USDT</strong>.
              </p>

              {/* Simulation button */}
              <div className="w-full mt-4">
                {paymentStatus !== 'COMPLETADO' ? (
                  <div className="space-y-2 w-full">
                    <Button
                      onClick={handleSimulatePayment}
                      disabled={isSimulating}
                      className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-lg shadow-green-600/20 text-white font-bold"
                    >
                      {isSimulating ? 'Procesando Simulación...' : 'Simular Pago Exitoso'}
                    </Button>
                    {simulationError && (
                      <p className="text-red-400 text-xs text-center">{simulationError}</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-green-500/20 border border-green-500/50 text-green-300 text-sm p-3 rounded-lg text-center font-medium flex items-center justify-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span>¡Pago simulado con éxito! El juego ya está en tu biblioteca.</span>
                  </div>
                )}
              </div>

              {/* Review / Comment section */}
              <div className="w-full border-t border-white/10 pt-6 mt-6 flex flex-col items-stretch text-left">
                <h4 className="text-sm font-bold text-white mb-2 text-center">¡Deja tu opinión sobre este juego!</h4>

                {paymentStatus !== 'COMPLETADO' ? (
                  <div className="bg-surface/60 border border-white/5 text-gray-400 text-xs p-4 rounded-xl text-center">
                    Escribe tu opinión una vez que el pago haya sido verificado y completado.
                  </div>
                ) : comentarioEnviado ? (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-300 text-sm p-3 rounded-lg text-center font-medium">
                    ¡Gracias por tu comentario y valoración!
                  </div>
                ) : (
                  <form onSubmit={handleSubmitComentario} className="space-y-3">
                    {/* Star Rating selector */}
                    <div className="flex justify-center items-center space-x-2 my-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setPuntuacion(star)}
                          className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${star <= puntuacion ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                              }`}
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      placeholder="Escribe aquí tu opinión sobre el juego..."
                      value={comentario}
                      onChange={(e) => setComentario(e.target.value)}
                      className="w-full p-3 bg-background/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 placeholder-gray-600 h-20 resize-none"
                      required
                    />

                    {comentarioError && (
                      <div className="text-red-400 text-xs text-center">
                        {comentarioError}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={comentarioCargando}
                      className="w-full py-2.5 text-sm bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center justify-center"
                    >
                      {comentarioCargando ? 'Enviando opinión...' : 'Enviar Comentario'}
                    </Button>
                  </form>
                )}
              </div>

              {/* List of existing comments for this game */}
              {comentariosExistentes.length > 0 && (
                <div className="w-full border-t border-white/10 pt-6 mt-6">
                  <h4 className="text-sm font-bold text-white mb-4">Opiniones de la comunidad</h4>
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {comentariosExistentes.map((c) => (
                      <div key={c.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-blue-400">{c.nombre_usuario || c.nombreUsuario || "Usuario"}</span>
                          <span className="text-[10px] text-gray-500">{c.fecha}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${star <= c.puntuacion ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-gray-300 leading-relaxed font-light">{c.comentario}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
