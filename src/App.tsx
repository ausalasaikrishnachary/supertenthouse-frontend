
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout"; 
import ScrollToTop from "./components/ScrollToTop";
import NotFound from "./pages/NotFound";
import WhatsAppFloat from "./WhatsAppFloat";
import Login from "./pages/Login";
import ChangePassword from "./pages/ForgotPassword";
import ProtectedRoute from "./test/ProtectedRoute";
import AdminCategories from "./pages/AdminCategories";
import AdminUsersProfile from "./pages/UserProfiles";
import AdminProducts from "./pages/AdminProducts";
import CreateOrder from '@/components/CreateOrder';
import OrdersList from '@/components/OrderList';
import AdminPackages from "./pages/AdminPackages";
import AdminAddons from "./pages/AdminAddons";
import AdminOrders from "./pages/AdminOrders";
import AdminCoupons from "./pages/coupons";
import AdminDashboard from "./pages/dashboard";
import SalesmanOrders from "./pages/salesman/orders";
import SalesmanDashboard from "./pages/salesman/dashboard";
// import AdminDashboard from "./components/AdminDashboard"
// import ProfileSettings from "./components/ProfileSettings";
import SalesmanCreateOrder from "@/pages/salesman/SalesmanCreateOrder";



const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <ScrollToTop />

        <Routes>

          {/* ✅ PUBLIC ROUTES */}
          <Route element={<Layout />}>
           
          </Route>

          {/* ✅ ADMIN ROUTES */}
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Login />} />
            
            {/* Admin Blog Management - Protected */}
             <Route path="/admin-categories" element={<AdminCategories />} />
              <Route path="/admin-products" element={<AdminProducts />} />
             <Route path="/users" element={<AdminUsersProfile />} />
             <Route path="/admin/packages" element={<AdminPackages />} />
             <Route path="/admin-addons" element={<AdminAddons />} />
              <Route path="/admin-orders" element={<AdminOrders />} />
             {/* <Route path="/dashboard" element={<AdminDashboard />} /> */}
              {/* <Route path="/profile" element={<ProfileSettings />} /> */}

              <Route path="/admin/create-order/:userId?" element={<CreateOrder />} />
              <Route path="/admin/orders" element={<OrdersList />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              

              <Route path="/salesman/dashboard" element={<SalesmanDashboard />} />
              <Route path="/salesman/orders" element={<SalesmanOrders />} />
              <Route path="/salesman/create-order" element={<SalesmanCreateOrder />} />




           

    
            
            {/* Forgot Password */}
            <Route path="/forgot-password" element={<ChangePassword />} />
          </Route>

          {/* ✅ 404 */}
          <Route path="*" element={<NotFound />} />

        </Routes>

        {/* <WhatsAppFloat /> */}

      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;