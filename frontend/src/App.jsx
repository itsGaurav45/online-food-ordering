import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import { LoginPage, RegisterPage, ForgotPasswordPage } from "./auth/AuthPages";

import HomePage         from "./customer/HomePage";
import RestaurantsPage  from "./customer/RestaurantsPage";
import MenuPage         from "./customer/MenuPage";
import CartPage         from "./customer/CartPage";
import CheckoutPage     from "./customer/CheckoutPage";
import TrackingPage     from "./customer/TrackingPage";
import OrderHistoryPage from "./customer/OrderHistoryPage";
import ProfilePage      from "./customer/ProfilePage";

import AdminPortal      from "./admin/AdminPortal";
import RestaurantPortal from "./restaurant/RestaurantPortal";

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddrIdx, setSelectedAddrIdx] = useState(0);
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);
  
  // ── Auth State ──────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Restore session on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      
      const parsedUser = JSON.parse(savedUser);
      // If they are on login/register, send them to their dashboard
      if (location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/") {
        const dest = parsedUser.role === "admin" ? "/admin" : parsedUser.role === "restaurant" ? "/restaurant" : "/home";
        navigate(dest, { replace: true });
      }
    } else if (location.pathname !== "/login" && location.pathname !== "/register" && location.pathname !== "/forgot") {
      navigate("/login", { replace: true });
    }
  }, []);

  const handleLogin = (role) => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);

    let dest = "/home";
    if (role === "admin") dest = "/admin";
    else if (role === "restaurant") dest = "/restaurant";

    navigate(dest);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setCart([]);
    navigate("/login");
  };

  const completeOrder = (newOrder) => {
    if (newOrder) {
      setLastOrder(newOrder);
      setOrders(prev => [newOrder, ...prev]);
    }
    setCart([]);
    navigate("/tracking", { state: { order: newOrder } });
  };

  // Helper for components that still use the old onNav prop
  const onNav = (path, data = null) => {
    // Map old page names to new paths if needed
    const pathMap = {
      "login": "/login",
      "register": "/register",
      "forgot": "/forgot",
      "home": "/home",
      "restaurants": "/restaurants",
      "menu": "/menu",
      "cart": "/cart",
      "checkout": "/checkout",
      "tracking": "/tracking",
      "orders": "/orders",
      "profile": "/profile",
      "admin": "/admin",
      "restaurant": "/restaurant"
    };
    const target = pathMap[path] || `/${path}`;
    navigate(target, { state: data });
  };

  return (
    <Routes>
      {/* ── AUTH ── */}
      <Route path="/login"    element={<LoginPage    onLogin={handleLogin} onNav={onNav} />} />
      <Route path="/register" element={<RegisterPage onLogin={handleLogin} onNav={onNav} />} />
      <Route path="/forgot"   element={<ForgotPasswordPage onNav={onNav} />} />

      {/* ── CUSTOMER PAGES ── */}
      <Route path="/home"        element={<HomePage         onNav={onNav} cart={cart} addresses={addresses} selectedAddrIdx={selectedAddrIdx} user={user} />} />
      <Route path="/restaurants" element={<RestaurantsPage  onNav={onNav} cart={cart} addresses={addresses} selectedAddrIdx={selectedAddrIdx} user={user} />} />
      <Route path="/menu"        element={<MenuPage         onNav={onNav} cart={cart} setCart={setCart} addresses={addresses} selectedAddrIdx={selectedAddrIdx} navData={location.state} user={user} />} />
      <Route path="/cart"        element={<CartPage         onNav={onNav} cart={cart} setCart={setCart} addresses={addresses} setAddresses={setAddresses} selectedAddrIdx={selectedAddrIdx} setSelectedAddrIdx={setSelectedAddrIdx} user={user} />} />
      <Route path="/checkout"    element={<CheckoutPage     onNav={onNav} cart={cart} addresses={addresses} setAddresses={setAddresses} setCart={setCart} selectedAddrIdx={selectedAddrIdx} setSelectedAddrIdx={setSelectedAddrIdx} onComplete={completeOrder} user={user} token={token} currentRestaurant={location.state?.restaurant} />} />
      <Route path="/tracking"    element={<TrackingPage     onNav={onNav} addresses={addresses} selectedAddrIdx={selectedAddrIdx} order={location.state?.order || lastOrder} user={user} token={token} />} />
      <Route path="/orders"      element={<OrderHistoryPage onNav={onNav} cart={cart} newOrders={orders} addresses={addresses} selectedAddrIdx={selectedAddrIdx} user={user} token={token} />} />
      <Route path="/profile"     element={<ProfilePage      onNav={onNav} cart={cart} addresses={addresses} setAddresses={setAddresses} selectedAddrIdx={selectedAddrIdx} setSelectedAddrIdx={setSelectedAddrIdx} user={user} onSignOut={handleSignOut} />} />

      {/* ── PORTALS ── */}
      <Route path="/admin"       element={<AdminPortal      onSignOut={handleSignOut} user={user} token={token} />} />
      <Route path="/restaurant"  element={<RestaurantPortal onSignOut={handleSignOut} user={user} token={token} />} />

      {/* ── DEFAULT ── */}
      <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : user.role === 'restaurant' ? '/restaurant' : '/home') : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
