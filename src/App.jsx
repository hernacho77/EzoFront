import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import MainMenu from './pages/MainMenu';
import Checkout from './pages/Checkout';
import Library from './pages/Library';
import Wishlist from './pages/Wishlist';
import Chat from './pages/Chat';
import { AdminDashboard } from './pages/AdminDashboard';
import Layout from './components/Layout';

// A simple wrapper for protected routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/menu" 
            element={
              <PrivateRoute>
                <Layout>
                  <MainMenu />
                </Layout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/library" 
            element={
              <PrivateRoute>
                <Layout>
                  <Library />
                </Layout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <PrivateRoute>
                <Layout>
                  <Wishlist />
                </Layout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/chat" 
            element={
              <PrivateRoute>
                <Layout>
                  <Chat />
                </Layout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <PrivateRoute>
                <Layout>
                  <Checkout />
                </Layout>
              </PrivateRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <PrivateRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </PrivateRoute>
            } 
          />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
