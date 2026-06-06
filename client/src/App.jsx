import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RfqList from './pages/RfqList';
import CreateRfq from './pages/CreateRfq';
import QuotationList from './pages/QuotationList';
import PurchaseOrderList from './pages/PurchaseOrderList';
import InvoiceList from './pages/InvoiceList';
import SubmitQuotation from './pages/SubmitQuotation';

// Protected layout wrapper
const DashboardLayout = ({ children }) => {
  const { user } = useApp();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Main App routing setup
function AppContent() {
  const { user } = useApp();

  return (
    <Routes>
      {/* Login path */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Dashboard & Protected layouts */}
      <Route
        path="/"
        element={
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        }
      />
      <Route
        path="/rfqs"
        element={
          <DashboardLayout>
            <RfqList />
          </DashboardLayout>
        }
      />
      <Route
        path="/rfqs/create"
        element={
          <DashboardLayout>
            <CreateRfq />
          </DashboardLayout>
        }
      />
      <Route
        path="/quotations"
        element={
          <DashboardLayout>
            <QuotationList />
          </DashboardLayout>
        }
      />
      <Route
        path="/quotations/submit"
        element={
          <DashboardLayout>
            <SubmitQuotation />
          </DashboardLayout>
        }
      />
      <Route
        path="/purchase-orders"
        element={
          <DashboardLayout>
            <PurchaseOrderList />
          </DashboardLayout>
        }
      />
      <Route
        path="/invoices"
        element={
          <DashboardLayout>
            <InvoiceList />
          </DashboardLayout>
        }
      />

      {/* Fallback redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
