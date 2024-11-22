import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import RTO from './pages/RTO';
import Returns from './pages/Returns';
import Payouts from './pages/Payouts';
import Transactions from './pages/Transactions';
import Customers from './pages/Customers';
import Subscriptions from './pages/Subscriptions';
import Wallet from './pages/Wallet';
import Billing from './pages/Billing';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import CreateOrderPage from './pages/CreateOrder';
import OrderView from './pages/OrderView';
import { OrderProvider } from './context/OrderContext';
import Login from './pages/Login';
import { AuthProvider, useAuth } from './context/AuthContext';
import SearchLogistics from './pages/SearchLogistics';
import ConfirmationInstructions from './pages/ConfirmationInstructions';
import ConfirmationDetails from './pages/ConfirmationDetails';
import Settings from './pages/Settings';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page with the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // Redirect to the page they came from or dashboard
    const from = location.state?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

const ConfirmationInstructionsWrapper = () => {
  const navigate = useNavigate();
  return (
    <ConfirmationInstructions 
      onCancel={() => navigate('/search-logistics')}
      onNext={() => {
        // Handle next action
        console.log('Next clicked');
      }}
    />
  );
};

const ConfirmationDetailsWrapper = () => {
  const navigate = useNavigate();
  return (
    <ConfirmationDetails 
      onBack={() => navigate(-1)}
      onProceed={() => {/* handle proceed action */}}
    />
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OrderProvider>
          <Routes>
            {/* Public Route */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="rto" element={<RTO />} />
              <Route path="returns" element={<Returns />} />
              <Route path="payouts" element={<Payouts />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="customers" element={<Customers />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="billing" element={<Billing />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders/create" element={<CreateOrderPage />} />
              <Route path="orders/:id" element={<OrderView />} />
              <Route path="search-logistics" element={<SearchLogistics />} />
              <Route 
                path="/confirmation-instructions" 
                element={<ConfirmationInstructionsWrapper />} 
              />
              <Route 
                path="/confirmation-details" 
                element={<ConfirmationDetailsWrapper />} 
              />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Catch all route - redirect to login if not authenticated, dashboard if authenticated */}
            <Route
              path="*"
              element={
                <Navigate to="/login" replace />
              }
            />
          </Routes>
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;