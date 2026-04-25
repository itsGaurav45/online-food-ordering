import { useState, useEffect } from "react";

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
  const getInitialZone = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") || "login";
  };
  const [zone, setZone] = useState(getInitialZone);
  const [navData, setNavData] = useState(null);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);
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
      // If they were on login page, redirect to correct zone
      const params = new URLSearchParams(window.location.search);
      const currentPage = params.get("page") || "login";
      if (currentPage === "login" || currentPage === "register") {
        const parsedUser = JSON.parse(savedUser);
        const dest = parsedUser.role === "admin" ? "admin" : parsedUser.role === "restaurant" ? "restaurant" : "home";
        setZone(dest);
        window.history.replaceState({ zone: dest }, "", `?page=${dest}`);
      }
    }
  }, []);

  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ zone: zone, data: null }, "", window.location.search || `?page=${zone}`);
    }

    const handlePopState = (event) => {
      if (event.state && event.state.zone) {
        setZone(event.state.zone);
        const data = event.state.data || null;
        setNavData(data);
        if (data && data.restaurant) setCurrentRestaurant(data.restaurant);
      } else {
        const params = new URLSearchParams(window.location.search);
        setZone(params.get("page") || "login");
        setNavData(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [zone]);

  const nav = (page, data = null) => {
    window.history.pushState({ zone: page, data }, "", `?page=${page}`);
    setZone(page);
    setNavData(data);
    if (data && data.restaurant) setCurrentRestaurant(data.restaurant);
  };

  const handleLogin = (role) => {
    // Refresh user from localStorage after login
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedToken) setToken(savedToken);

    let newZone = "home";
    if (role === "admin") newZone = "admin";
    else if (role === "restaurant") newZone = "restaurant";

    window.history.pushState({ zone: newZone }, "", `?page=${newZone}`);
    setZone(newZone);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setCart([]);
    window.history.pushState({ zone: "login" }, "", `?page=login`);
    setZone("login");
  };

  const completeOrder = (newOrder) => {
    if (newOrder) {
      setLastOrder(newOrder);
      setOrders(prev => [newOrder, ...prev]);
    }
    setCart([]);
    nav("tracking");
  };

  return (
    <>
      {/* ── AUTH ── */}
      {zone === "login"    && <LoginPage    onLogin={handleLogin} onNav={nav} />}
      {zone === "register" && <RegisterPage onLogin={handleLogin} onNav={nav} />}
      {zone === "forgot"   && <ForgotPasswordPage onNav={nav} />}

      {/* ── CUSTOMER PAGES ── */}
      {zone === "home"        && <HomePage         onNav={nav} cart={cart} addresses={addresses} selectedAddrIdx={selectedAddrIdx} user={user} />}
      {zone === "restaurants" && <RestaurantsPage  onNav={nav} cart={cart} addresses={addresses} selectedAddrIdx={selectedAddrIdx} user={user} />}
      {zone === "menu"        && <MenuPage         onNav={nav} cart={cart} setCart={setCart} addresses={addresses} selectedAddrIdx={selectedAddrIdx} navData={navData} user={user} />}
      {zone === "cart"        && <CartPage         onNav={nav} cart={cart} setCart={setCart} addresses={addresses} setAddresses={setAddresses} selectedAddrIdx={selectedAddrIdx} setSelectedAddrIdx={setSelectedAddrIdx} user={user} />}
      {zone === "checkout"    && <CheckoutPage     onNav={nav} cart={cart} addresses={addresses} setAddresses={setAddresses} setCart={setCart} selectedAddrIdx={selectedAddrIdx} setSelectedAddrIdx={setSelectedAddrIdx} onComplete={completeOrder} user={user} token={token} currentRestaurant={currentRestaurant} />}
      {zone === "tracking"    && <TrackingPage     onNav={nav} addresses={addresses} selectedAddrIdx={selectedAddrIdx} order={lastOrder} user={user} token={token} />}
      {zone === "orders"      && <OrderHistoryPage onNav={nav} cart={cart} newOrders={orders} addresses={addresses} selectedAddrIdx={selectedAddrIdx} user={user} token={token} />}
      {zone === "profile"     && <ProfilePage      onNav={nav} cart={cart} addresses={addresses} setAddresses={setAddresses} selectedAddrIdx={selectedAddrIdx} setSelectedAddrIdx={setSelectedAddrIdx} user={user} onSignOut={handleSignOut} />}

      {/* ── ADMIN PORTAL ── */}
      {zone === "admin"       && <AdminPortal      onSignOut={handleSignOut} user={user} token={token} />}

      {/* ── RESTAURANT PORTAL ── */}
      {zone === "restaurant"  && <RestaurantPortal onSignOut={handleSignOut} user={user} token={token} />}
    </>
  );
}
