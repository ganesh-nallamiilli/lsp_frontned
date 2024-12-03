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
import BankingSettings from './pages/BankingSettings';
import MapsSettings from './pages/MapsSettings';
import MapServiceConfiguration from './pages/MapServiceConfiguration';
import PaymentServiceConfiguration from './pages/PaymentServiceConfiguration';
import PaymentSettings from './pages/PaymentSettings';
import PennyDropSettings from './pages/PennyDropSettings';
import PennyDropServiceConfiguration from './pages/PennyDropServiceConfiguration';
import UIConfiguration from './pages/UIConfiguration';
import NotificationSettings from './pages/NotificationSettings';
import EmailServiceConfiguration from './pages/EmailServiceConfiguration';
import SMSServiceConfiguration from './pages/SMSServiceConfiguration';
import NotificationTemplates from './pages/NotificationTemplates';
import Support from './pages/Support';
import UserRegistration from './pages/UserRegistration';
import Franchise from './pages/Franchise';
import CreateFranchise from './pages/CreateFranchise';
import BulkOrders from './pages/BulkOrders';
import TicketDetails from './pages/TicketDetails';
import { Provider } from 'react-redux';
import { store } from './store/store';
import FranchiseView from './pages/FranchiseView';

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
    <Provider store={store}>
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
                <Route path="support" element={<Support />} />
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
                <Route path="settings/banking" element={<BankingSettings />} />
                <Route path="settings/maps" element={<MapsSettings />} />
                <Route path="/maps-service/:provider" element={<MapServiceConfiguration />} />
                <Route path="/payment-service/:provider" element={<PaymentServiceConfiguration />} />
                <Route path="settings/payment-providers" element={<PaymentSettings />} />
                <Route path="/settings/verification" element={<PennyDropSettings />} />
                <Route path="/verification-service/:provider" element={<PennyDropServiceConfiguration />} />
                <Route path="/settings/ui" element={<UIConfiguration />} />
                <Route path="/settings/notifications" element={<NotificationSettings />} />
                <Route path="/settings/notifications/email/:provider" element={<EmailServiceConfiguration />} />
                <Route path="/settings/notifications/sms/:provider" element={<SMSServiceConfiguration />} />
                <Route path="/settings/notifications/templates" element={<NotificationTemplates />} />
                <Route path="/franchise" element={<Franchise />} />
                <Route path="/franchise/create" element={<CreateFranchise />} />
                <Route path="/orders/bulk" element={<BulkOrders />} />
                <Route path="/support/ticket/:ticketId" element={<TicketDetails />} />
                <Route path="/franchise/view/:id" element={<FranchiseView />} />
              </Route>
              <Route path="/user_registration" element={<UserRegistration />} />

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
    </Provider>
  );
}

export default App;