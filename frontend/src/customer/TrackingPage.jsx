import { useState, useEffect } from "react";
import { useToast, ToastContainer } from "../shared/components";
import { io } from "socket.io-client";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const riderIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: "<div class='rider-marker' style='background:#1A1A2E; color:#fff; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 8px 20px rgba(0,0,0,0.3); border:2px solid #fff; font-size:18px; transform-origin:center;'><i class='fa-solid fa-motorcycle'></i></div>",
  iconSize: [38, 38],
  iconAnchor: [19, 19]
});

const restaurantIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: "<div style='background:#FFD700; color:#000; width:32px; height:32px; border-radius:8px; display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-shadow:0 4px 10px rgba(0,0,0,0.2); font-size:14px;'><i class='fa-solid fa-store'></i></div>",
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const homeIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: "<div style='background:var(--green); color:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid #fff; box-shadow:0 4px 10px rgba(0,0,0,0.2); font-size:14px;'><i class='fa-solid fa-house-user'></i></div>",
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const RESTAURANT_LOCATIONS = {
  "pizza palace": { pos: [26.8467, 80.9462], cityHint: "lucknow" },      // Hazratganj
  "la pino": { pos: [26.8500, 81.0200], cityHint: "lucknow" },           // Gomti Nagar
  "burger point": { pos: [26.9159, 80.9462], cityHint: "lucknow" },      // Aliganj
  "mad over burgers": { pos: [26.8714, 81.0000], cityHint: "lucknow" },  // Indira Nagar
  "tunday kababi": { pos: [26.8526, 80.9316], cityHint: "lucknow" },     // Lalbagh
  "dastarkhwan": { pos: [26.8526, 80.9316], cityHint: "lucknow" },       // Lalbagh
  "biryani express": { pos: [26.8502, 80.9128], cityHint: "lucknow" },   // Aminabad
  "wok & roll": { pos: [26.8714, 81.0000], cityHint: "lucknow" },        // Indira Nagar
  "chung fa": { pos: [26.8758, 80.9484], cityHint: "lucknow" },          // Mahanagar
  "sushi house": { pos: [26.8571, 81.0080], cityHint: "lucknow" },       // Gomti Nagar
};

export default function TrackingPage({ onNav, addresses = [], selectedAddrIdx = 0, order, user, token }) {
  const currentAddr = order?.address || addresses[selectedAddrIdx]?.addr || "Lucknow";
  const addrLower = currentAddr.toLowerCase();
  const isLucknow = addrLower.includes("lucknow");
  const restLower = (order?.rest || "").toLowerCase();
  const restKey = Object.keys(RESTAURANT_LOCATIONS).find(k => restLower.includes(k));
  const restMeta = restKey ? RESTAURANT_LOCATIONS[restKey] : null;

  const [eta, setEta] = useState(15);
  const [progress, setProgress] = useState(15);
  const [riderPos, setRiderPos] = useState([26.8500, 80.9300]);
  const [userPos, setUserPos] = useState(() => {
    const al = (order?.address || currentAddr).toLowerCase();
    if (al.includes("bbd university")) return [26.8890, 81.0630];
    if (al.includes("gomti nagar")) return [26.8522, 80.9994];
    if (al.includes("hazratganj")) return [26.8467, 80.9462];
    if (al.includes("aliganj")) return [26.9159, 80.9462];
    if (al.includes("indira nagar")) return [26.8714, 81.0000];
    return [26.8500, 80.9500]; // Lucknow center fallback
  });
  const { toasts, show } = useToast();

  const [restaurantPos, setRestaurantPos] = useState(
    restMeta?.pos || [26.8467, 80.9462]
  );
  const riders = [
    { name: "Rahul Sharma", initial: "R", phone: "+91 98765 43210", vehicle: "Royal Enfield Thunderbird · UP-32-AB-1234", rating: "4.9", deliveries: "2,341" },
    { name: "Amit Kumar", initial: "A", phone: "+91 87654 32109", vehicle: "Honda Activa · UP-32-CD-5678", rating: "4.7", deliveries: "1,820" },
    { name: "Prakash Yadav", initial: "P", phone: "+91 76543 21098", vehicle: "Hero Splendor · UP-32-EF-9012", rating: "4.8", deliveries: "3,105" },
    { name: "Vikas Singh", initial: "V", phone: "+91 99887 76655", vehicle: "Bajaj Pulsar · UP-32-GH-3456", rating: "4.6", deliveries: "950" }
  ];
  const [rider] = useState(() => riders[Math.floor(Math.random() * riders.length)]);

  // Animation state for the rider
  const [animPercent, setAnimPercent] = useState(0);

  useEffect(() => {
    if (progress < 70) {
      setRiderPos(restaurantPos);
      setAnimPercent(0);
      return;
    }
    if (progress >= 100) {
      setRiderPos(userPos);
      setAnimPercent(1);
      return;
    }

    // Start slow animation (taking ~45s for the full trip in demo)
    const duration = 45000; 
    const start = Date.now();

    const frame = () => {
      const now = Date.now();
      const p = Math.min((now - start) / duration, 1);
      setAnimPercent(p);
      
      const lat = restaurantPos[0] + (userPos[0] - restaurantPos[0]) * p;
      const lng = restaurantPos[1] + (userPos[1] - restaurantPos[1]) * p;
      setRiderPos([lat, lng]);

      if (p < 1) requestAnimationFrame(frame);
    };

    const anim = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(anim);
  }, [progress, restaurantPos, userPos]);

  // Real-time DB Polling for Order Status
  useEffect(() => {
    if (!order?._id || !token) return;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${order._id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          const s = data.status.toLowerCase();
          
          if (s === 'new') setProgress(15);
          else if (s === 'preparing') setProgress(40);
          else if (s === 'delivering' || s === 'dispatched') {
             setProgress(70);
             // Fake a countdown based on animation percent
             setEta(Math.max(1, Math.round(8 * (1 - animPercent))));
          }
          else if (s === 'delivered') {
             setProgress(100);
             setEta(0);
          }
        }
      } catch (err) {
        console.error("Error fetching order status:", err);
      }
    };

    // Fetch immediately and then every 2 seconds
    fetchStatus();
    const interval = setInterval(fetchStatus, 2000);

    return () => clearInterval(interval);
  }, [order?._id, token, animPercent]);

  const steps = [
    { icon: <i className="fa-solid fa-check" style={{ color: "#fff", fontSize: 16 }}></i>, label: "Order Placed", time: "Just now", state: "done" },
    { icon: progress > 30 ? <i className="fa-solid fa-check" style={{ color: "#fff", fontSize: 16 }}></i> : "⏳", label: "Preparing", time: progress > 30 ? "Done" : "In Progress", state: progress > 30 ? "done" : "active" },
    { icon: progress > 50 ? <i className="fa-solid fa-check" style={{ color: "#fff", fontSize: 16 }}></i> : "📦", label: "Packing", time: progress > 50 ? "Done" : progress > 30 ? "Soon" : "", state: progress > 50 ? "done" : progress > 30 ? "active" : "" },
    { icon: progress > 70 ? <i className="fa-solid fa-check" style={{ color: "#fff", fontSize: 16 }}></i> : "🛵", label: "Dispatched", time: progress > 70 ? "Done" : progress > 50 ? "Soon" : "", state: progress > 70 ? "done" : progress > 50 ? "active" : "" },
    { icon: "📍", label: "Arriving", time: "~" + eta + " mins", state: progress > 70 ? "active" : "" },
  ];

  return (
    <div>
      <header style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", height: "var(--header-h)", display: "flex", alignItems: "center", padding: "0 28px", gap: 20, position: "sticky", top: 0, zIndex: 100, boxShadow: "var(--shadow-sm)" }}>
        <div className="site-logo" style={{ cursor: "pointer" }} onClick={() => onNav("home")}><i className="fa-solid fa-bolt"></i>Bite<span>Bolt</span></div>
        <div className="header-location" style={{ marginLeft: 20 }}>
          <i className="fa-solid fa-location-dot"></i>
          {currentAddr.split(",")[0]}
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => onNav("orders")}>My Orders</button>
          <div className="header-user" onClick={() => onNav("profile")} style={{ cursor: "pointer" }}><div className="header-avatar" style={{ background: user?.avatarBg }}>{user?.initials || "U"}</div>{user?.name?.split(" ")[0] || "Me"}</div>
        </div>
      </header>

      <div className="container">
        <div className="breadcrumb" style={{ paddingTop: 20 }}>
          <a onClick={() => onNav("home")} style={{ cursor: "pointer" }}>Home</a><span className="sep">›</span>
          <a onClick={() => onNav("orders")} style={{ cursor: "pointer" }}>Orders</a><span className="sep">›</span>
          <span className="current">Track Order</span>
        </div>

        <div style={{ maxWidth: 680, margin: "0 auto", paddingBottom: 40 }}>
          {/* HEADER CARD */}
          <div style={{ background: "linear-gradient(135deg,var(--red),var(--orange))", borderRadius: "var(--radius-xl)", padding: "24px 28px", color: "#fff", marginBottom: 20, position: "relative", overflow: "hidden" }} className="fade-up">
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, background: "rgba(255,255,255,0.1)", borderRadius: "50%" }}></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.82rem", opacity: 0.8, marginBottom: 6 }}>Order {order?.id || "#BB2024118"} · {order?.rest || "Pizza Palace"}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, marginBottom: 6 }}>
                  {progress < 40 ? "👨‍🍳 Preparing Order" : progress < 70 ? "📦 Packing Order" : "🛵 Out for Delivery"}
                </div>
                <div style={{ fontSize: "1rem", opacity: 0.9 }}>{progress < 70 ? "Estimated arrival" : "Arriving in approximately"}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 900 }}>{eta}</div>
                <div style={{ fontSize: "0.9rem", opacity: 0.8 }}>minutes</div>
              </div>
            </div>
          </div>

          {/* LIVE MAP */}
          <div className="map-container fade-up-1">
            <MapContainer center={riderPos} zoom={12} scrollWheelZoom={false}>
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {/* Route Line */}
              <Polyline
                positions={[restaurantPos, userPos]}
                color="var(--red)"
                weight={3}
                opacity={0.5}
                dashArray="10, 10"
              />
              <Marker position={restaurantPos} icon={restaurantIcon}>
                <Popup>{order?.rest || "Restaurant"}</Popup>
              </Marker>
              
              {/* Animated Rider */}
              <Marker position={riderPos} icon={riderIcon}>
                <Popup>{rider.name} is on the way!</Popup>
              </Marker>

              <Marker position={userPos} icon={homeIcon}>
                <Popup>Your Location: {currentAddr.split(",")[0]}</Popup>
              </Marker>
            </MapContainer>
          </div>

          {/* PROGRESS */}
          <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", padding: 28, marginBottom: 20 }} className="fade-up-1">
            <div style={{ background: "var(--bg2)", borderRadius: "var(--radius-lg)", padding: "16px 20px", marginBottom: 20, border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, background: "var(--green)", borderRadius: "50%", animation: "pulse 1.5s ease infinite" }}></div>
              <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>Live tracking active</span>
              <span style={{ fontSize: "0.78rem", color: "var(--text3)", marginLeft: "auto" }}>Updated just now</span>
            </div>

            {/* TRACKING STEPS */}
            <div className="tracking-steps">
              <div className="tracking-progress" style={{ width: `${progress}%` }}></div>
              {steps.map((s, i) => (
                <div key={i} className="track-step">
                  <div className={`track-dot${s.state === "done" ? " done" : s.state === "active" ? " active" : ""}`}>
                    {typeof s.icon === "string" ? s.icon : s.icon}
                  </div>
                  <div className={`track-label${s.state === "active" ? " active" : s.state === "done" ? " done" : ""}`}>{s.label}</div>
                  <div style={{ fontSize: "0.7rem", color: s.state === "active" ? "var(--red)" : "var(--text3)", fontWeight: s.state === "active" ? 700 : 400, textAlign: "center" }}>{s.time}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 700, color: "var(--text3)", marginBottom: 6 }}>
                <span>Order progress</span><span style={{ color: "var(--red)" }}>{progress}%</span>
              </div>
              <div className="progress-track"><div className="progress-fill progress-red" style={{ width: `${progress}%` }}></div></div>
            </div>
          </div>

          {/* RIDER CARD */}
          <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden", marginBottom: 20 }} className="fade-up-2">
            <div style={{ background: "var(--dark)", color: "#fff", padding: "14px 20px", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: ".06em", fontWeight: 800 }}>🛵 Your Delivery Partner</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg,var(--red),var(--orange))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 900, color: "#fff", border: "3px solid var(--border)" }}>{rider.initial}</div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, marginBottom: 2 }}>{rider.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", fontWeight: 700, color: "var(--text3)" }}>
                  <i className="fa-solid fa-star" style={{ color: "var(--yellow)" }}></i> {rider.rating} · {rider.deliveries} deliveries
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 4 }}>{rider.vehicle}</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                <button onClick={() => show(`Calling ${rider.name}...`, "info")} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--border)", background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, transition: "all var(--transition)" }}>
                  <i className="fa-solid fa-phone"></i>
                </button>
                <button onClick={() => show("Opening chat...", "info")} style={{ width: 44, height: 44, borderRadius: "50%", border: "1.5px solid var(--border)", background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 16, transition: "all var(--transition)" }}>
                  <i className="fa-solid fa-message"></i>
                </button>
              </div>
            </div>
          </div>

          {/* DELIVERY ADDRESS */}
          <div className="card mb-20 fade-up-3" style={{ cursor: "default" }}>
            <div className="card-body">
              <div className="flex items-center gap-12">
                <div style={{ width: 44, height: 44, background: "var(--red-light)", borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>📍</div>
                <div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: ".04em" }}>Delivering to</div>
                  <div style={{ fontWeight: 700, marginTop: 2 }}>{currentAddr}</div>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER ITEMS */}
          <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden" }} className="fade-up-4">
            <div style={{ padding: "14px 20px", background: "var(--bg2)", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900 }}>Your Order</div>
            {(order?.itemsList || (order?.items ? order.items.split(", ").map(s => [s, ""]) : [])).map((item, index) => {
              const name = Array.isArray(item) ? item[0] : `🍽️ ${item.name} × ${item.qty}`;
              const priceLabel = Array.isArray(item) ? item[1] : `₹${item.price * item.qty}`;
              return (
                <div key={index} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 20px", borderBottom: "1px solid var(--border)", fontSize: "0.88rem" }}>
                  <span>{name}</span><span style={{ fontWeight: 800 }}>{priceLabel}</span>
                </div>
              );
            })}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 20px", background: "var(--bg2)" }}>
              <span style={{ fontWeight: 900 }}>Total Paid</span><span style={{ fontWeight: 900, color: "var(--red)" }}>{order?.total || order?.amount || "₹0"}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button className="btn btn-secondary btn-full" onClick={() => show("Support team notified", "info")}>
              <i className="fa-solid fa-headset"></i> Get Help
            </button>
            <button className="btn btn-danger btn-full" onClick={() => show("Cancellation window has passed", "error")}>
              <i className="fa-solid fa-xmark"></i> Cancel Order
            </button>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
