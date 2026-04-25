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

/*
  ZONES / PAGES:
  Auth:     login | register | forgot
  Customer: home | restaurants | menu | cart | checkout | tracking | orders | profile
  Admin:    admin  (AdminPortal handles its own sub-pages)
  Restaurant: restaurant  (RestaurantPortal handles its own sub-pages)
*/

export default function App() {
  const getInitialZone = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("page") || "login";
  };
  const [zone, setZone] = useState(getInitialZone);
  const [navData, setNavData] = useState(null);
  const [currentRestaurant, setCurrentRestaurant] = useState("Pizza Palace, Gomti Nagar");
  const [cart, setCart] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddrIdx, setSelectedAddrIdx] = useState(0);
  const [orders, setOrders] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);

  useEffect(() => {
    // Set initial state so popstate works for first page
    if (!window.history.state) {
      window.history.replaceState({ zone: zone, data: null }, "", window.location.search || `?page=${zone}`);
    }

    const handlePopState = (event) => {
      if (event.state && event.state.zone) {
        setZone(event.state.zone);
        const data = event.state.data || null;
        setNavData(data);
        if (data && data.restaurant) {
          setCurrentRestaurant(data.restaurant);
        }
      } else {
        const params = new URLSearchParams(window.location.search);
        const p = params.get("page") || "login";
        setZone(p);
        setNavData(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [zone]);

  // Navigate across zones
  const nav = (page, data = null) => {
    window.history.pushState({ zone: page, data }, "", `?page=${page}`);
    setZone(page);
    setNavData(data);
    if (data && data.restaurant) {
      setCurrentRestaurant(data.restaurant);
    }
  };

  // After login, route to correct portal
  const handleLogin = (role) => {
    let newZone = "home";
    if (role === "admin") newZone = "admin";
    else if (role === "restaurant") newZone = "restaurant";
    
    window.history.pushState({ zone: newZone }, "", `?page=${newZone}`);
    setZone(newZone);
  };

  const handleSignOut = () => {
    window.history.pushState({ zone: "login" }, "", `?page=login`);
    setZone("login");
  };

  const completeOrder = () => {
    const newOrder = {
      id: "#BB" + Math.floor(100000 + Math.random() * 900000),
      rest: currentRestaurant,
      date: "Just now",
      img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100",
      items: cart.map(i => i.name).join(", "),
      itemsList: [...cart],
      status: "active",
      statusLabel: "Out for Delivery",
      badgeCls: "badge-orange",
      total: "₹" + (cart.reduce((a, i) => a + i.price * i.qty, 0) + 52),
      count: cart.reduce((a, i) => a + i.qty, 0),
      address: addresses[selectedAddrIdx]?.addr
    };
    setOrders([newOrder, ...orders]);
    setLastOrder(newOrder);
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
      {zone === "home"        && <HomePage         onNav={nav} cart={cart} addresses={addresses} selectedAddrIdx={selectedAddrIdx} />}
      {zone === "restaurants" && <RestaurantsPage  onNav={nav} cart={cart} addresses={addresses} selectedAddrIdx={selectedAddrIdx} />}
      {zone === "menu"        && <MenuPage         onNav={nav} cart={cart} setCart={setCart} addresses={addresses} selectedAddrIdx={selectedAddrIdx} navData={navData} />}
      {zone === "cart"        && <CartPage         onNav={nav} cart={cart} setCart={setCart} addresses={addresses} setAddresses={setAddresses} selectedAddrIdx={selectedAddrIdx} setSelectedAddrIdx={setSelectedAddrIdx} />}
      {zone === "checkout"    && <CheckoutPage     onNav={nav} cart={cart} addresses={addresses} setAddresses={setAddresses} setCart={setCart} selectedAddrIdx={selectedAddrIdx} setSelectedAddrIdx={setSelectedAddrIdx} onComplete={completeOrder} />}
      {zone === "tracking"    && <TrackingPage     onNav={nav} addresses={addresses} selectedAddrIdx={selectedAddrIdx} order={lastOrder} />}
      {zone === "orders"      && <OrderHistoryPage onNav={nav} cart={cart} newOrders={orders} addresses={addresses} selectedAddrIdx={selectedAddrIdx} />}
      {zone === "profile"     && <ProfilePage      onNav={nav} cart={cart} addresses={addresses} setAddresses={setAddresses} selectedAddrIdx={selectedAddrIdx} setSelectedAddrIdx={setSelectedAddrIdx} />}

      {/* ── ADMIN PORTAL ── */}
      {zone === "admin"       && <AdminPortal      onSignOut={handleSignOut} />}

      {/* ── RESTAURANT PORTAL ── */}
      {zone === "restaurant"  && <RestaurantPortal onSignOut={handleSignOut} />}
    </>
  );
}
