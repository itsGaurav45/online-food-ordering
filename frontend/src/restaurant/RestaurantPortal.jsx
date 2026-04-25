import { useState, useEffect, useRef } from "react";
import { PanelSidebar, BarChart, Modal, useToast, ToastContainer } from "../shared/components";

/* ─── Restaurant Nav Config ──────────────────────────── */
const REST_NAV = [
  { type: "section", label: "Main" },
  { id: "dashboard",  icon: "fa-solid fa-gauge-high",    label: "Dashboard" },
  { id: "orders",     icon: "fa-solid fa-bag-shopping",  label: "Orders",          badge: "4" },
  { id: "menu",       icon: "fa-solid fa-utensils",      label: "Menu Management" },
  { type: "section",  label: "Analytics", mt: 16 },
  { id: "earnings",   icon: "fa-solid fa-chart-line",    label: "Earnings" },
  { id: "reviews",    icon: "fa-solid fa-star",          label: "Reviews" },
  { type: "section",  label: "Settings", mt: 16 },
  { id: "info",       icon: "fa-solid fa-store",         label: "Restaurant Info" },
  { id: "hours",      icon: "fa-solid fa-clock",         label: "Hours & Availability" },
  { id: "logout",     icon: "fa-solid fa-right-from-bracket", label: "Logout" },
];

/* ═══════════════════════════════════════════════════════
   RESTAURANT DASHBOARD — acceptOrder(), rejectOrder(), BarChart, markReady
═══════════════════════════════════════════════════════ */
function RestDashboard({ onNav }) {
  const { toasts, show } = useToast();
  // Live orders list — acceptOrder() / rejectOrder()
  const [liveOrders, setLiveOrders] = useState([
    { id: "#119", bg: "var(--yellow-light)", clr: "#8A6800", items: "Chicken Biryani × 2, Raita", customer: "Rohan Singh · Table 4 · Just now",   status: "new",       statusLabel: "New Order",  ready: false },
    { id: "#118", bg: "var(--orange-light)", clr: "#C45D30", items: "Margherita × 1, Pepperoni × 1", customer: "Arjun Sharma · 12:01 PM · 8 min", status: "preparing", statusLabel: "Preparing", ready: false },
    { id: "#117", bg: "rgba(15,163,177,.12)", clr: "var(--teal)", items: "BBQ Chicken Pizza × 2",  customer: "Priya Mehta · 11:52 AM · 17 min",   status: "delivering",statusLabel: "Delivering", ready: false, eta: "ETA: 5 min" },
    { id: "#116", bg: "var(--green-light)",  clr: "#197A32", items: "Penne Arrabbiata × 3, Garlic Bread", customer: "Meera Joshi · 11:30 AM · ₹847", status: "delivered", statusLabel: "Delivered", revenue: "₹847" },
  ]);
  const [newOrderBadge, setNewOrderBadge] = useState(4);

  const statusStyle = { new: "var(--yellow-light)", preparing: "var(--orange-light)", delivering: "rgba(15,163,177,.12)", delivered: "var(--green-light)" };
  const statusTextClr = { new: "#8A6800", preparing: "#C45D30", delivering: "var(--teal)", delivered: "#197A32" };

  // acceptOrder(id)
  const acceptOrder = (id) => {
    setLiveOrders(p => p.map(o => o.id === id ? { ...o, status: "preparing", statusLabel: "Preparing" } : o));
    setNewOrderBadge(b => Math.max(0, b - 1));
    show("Order accepted!", "success");
  };

  // rejectOrder(id)
  const rejectOrder = (id) => {
    setLiveOrders(p => p.filter(o => o.id !== id));
    show("Order rejected", "error");
  };

  // markReady(id)
  const markReady = (id) => {
    setLiveOrders(p => p.map(o => o.id === id ? { ...o, status: "delivering", statusLabel: "Delivering" } : o));
    show("Order marked as ready", "success");
  };

  const revenueData   = [8200, 11400, 9800, 13200, 10600, 14280, 12900];
  const revenueLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div>
      <div className="panel-topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <div className="panel-topbar-title">Dashboard</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>Welcome back, Pizza Palace 🍕</div>
          </div>
        </div>
        <div className="panel-topbar-right">
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--green-light)", borderRadius: "var(--radius-full)", fontSize: "0.78rem", fontWeight: 800, color: "#197A32" }}>
            <div style={{ width: 8, height: 8, background: "var(--green)", borderRadius: "50%", animation: "pulse 1.5s infinite" }}></div> Open for Orders
          </div>
          <div style={{ position: "relative", background: "var(--gray4)", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text2)" }} onClick={() => show("5 new orders received", "info")}>
            <i className="fa-solid fa-bell"></i><span className="header-badge">{newOrderBadge}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4 mb-24">
        {[["red","fa-solid fa-bag-shopping","48","Today's Orders","+12% vs yesterday"],["orange","fa-solid fa-indian-rupee-sign","₹14,280","Today's Revenue","+8%"],["green","fa-solid fa-star","4.8","Avg Rating","2,841 reviews"],["teal","fa-solid fa-clock","22 min","Avg Prep Time","3 min faster"]].map(([c,i,n,l,ch],idx) => (
          <div key={l} className={`stat-card ${c} fade-up-${idx}`}>
            <div className={`stat-icon ${c}`}><i className={i}></i></div>
            <div className="stat-num">{n}</div>
            <div className="stat-label">{l}</div>
            <div className="stat-change up"><i className="fa-solid fa-arrow-trend-up"></i> {ch}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-24">
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-body">
            <div className="section-header mb-16">
              <div><div className="section-title" style={{ fontSize: "1.1rem" }}>Weekly Revenue</div><div className="section-subtitle">Last 7 days performance</div></div>
              <span className="badge badge-green">↑ ₹8,240 vs last week</span>
            </div>
            <BarChart data={revenueData} labels={revenueLabels} height={140} />
          </div>
        </div>

        {/* Order Breakdown */}
        <div className="card">
          <div className="card-body">
            <div className="section-header mb-16"><div className="section-title" style={{ fontSize: "1.1rem" }}>Order Breakdown</div></div>
            {[["Delivered","38 (79%)","var(--green)","79%","progress-green"],["In Progress","6 (13%)","var(--orange)","13%",""],["Cancelled","4 (8%)","var(--red)","8%","progress-red"]].map(([l,v,clr,w,pcls]) => (
              <div key={l} style={{ marginBottom: 14 }}>
                <div className="flex justify-between mb-4"><span style={{ fontSize: "0.82rem", fontWeight: 700 }}>{l}</span><span style={{ fontSize: "0.82rem", fontWeight: 800, color: clr }}>{v}</span></div>
                <div className="progress-track"><div className={`progress-fill ${pcls}`} style={{ width: w, background: !pcls ? clr : undefined }}></div></div>
              </div>
            ))}
            <div style={{ background: "var(--bg2)", borderRadius: "var(--radius)", padding: 14, marginTop: 20 }}>
              <div style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", marginBottom: 10 }}>Top Selling Items Today</div>
              {[["🍕 Margherita Pizza","12 sold","badge-red"],["🍕 Pepperoni Feast","9 sold","badge-orange"],["🍝 Penne Arrabbiata","7 sold","badge-gray"]].map(([n,c,b]) => (
                <div key={n} className="flex justify-between items-center" style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>{n}</span>
                  <span className={`badge ${b}`}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Orders */}
      <div className="card mb-24">
        <div className="card-body">
          <div className="section-header mb-4">
            <div><div className="section-title" style={{ fontSize: "1.1rem" }}>🔴 Live Orders</div><div className="section-subtitle">Requiring your attention</div></div>
            <button className="btn btn-secondary btn-sm" onClick={() => onNav("orders")}>View All</button>
          </div>
          {liveOrders.map(o => (
            <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ background: statusStyle[o.status], color: statusTextClr[o.status], width: 36, height: 36, borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: "0.8rem", flexShrink: 0 }}>{o.id}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.88rem", fontWeight: 800 }}>{o.items}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{o.customer}</div>
              </div>
              <div style={{ background: statusStyle[o.status], color: statusTextClr[o.status], padding: "4px 10px", borderRadius: "var(--radius-full)", fontSize: "0.72rem", fontWeight: 800 }}>{o.statusLabel}</div>
              {o.status === "new" && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="btn btn-success btn-sm" onClick={() => acceptOrder(o.id)}><i className="fa-solid fa-check"></i> Accept</button>
                  <button className="btn btn-danger btn-sm"  onClick={() => rejectOrder(o.id)}><i className="fa-solid fa-xmark"></i></button>
                </div>
              )}
              {o.status === "preparing" && (
                <button className="btn btn-sm" style={{ background: "var(--teal)", color: "#fff" }} onClick={() => markReady(o.id)}>Mark Ready</button>
              )}
              {o.status === "delivering" && <div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>{o.eta}</div>}
              {o.status === "delivered"  && <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--green)" }}>{o.revenue}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="card">
        <div className="card-body">
          <div className="section-header mb-16"><div className="section-title" style={{ fontSize: "1.1rem" }}>⭐ Recent Reviews</div></div>
          {[{ name: "Arjun S.", stars: 5, text: "Absolutely loved the BBQ Chicken Pizza! Crispy crust, generous toppings. Will order again!", time: "2 hours ago · Order #BB118" }, { name: "Priya M.", stars: 4, text: "Good food but delivery took 35 mins. The pasta was creamy and delicious though!", time: "Yesterday · Order #BB099" }].map(r => (
            <div key={r.name} style={{ padding: 14, background: "var(--bg2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", marginBottom: 14 }}>
              <div className="flex justify-between items-center mb-8">
                <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>{r.name}</div>
                <div style={{ color: "var(--yellow)" }}>{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</div>
              </div>
              <div style={{ fontSize: "0.82rem", color: "var(--text2)" }}>"{r.text}"</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: 6 }}>{r.time}</div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RESTAURANT ORDERS — setTab(), acceptOrder(), rejectOrder(), timer countdown
═══════════════════════════════════════════════════════ */
function RestOrders() {
  const { toasts, show } = useToast();
  // setTab()
  const [activeTab, setActiveTab] = useState("New");
  // Timer countdown (from HTML setInterval)
  const [secs, setSecs] = useState(165);
  useEffect(() => {
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const timerStr = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;

  const [newOrders, setNewOrders] = useState([
    { id: "#BB2024119", customer: "Rohan Singh",  meta: "Just now · UPI Paid · ₹698",  items: "• Chicken Biryani × 2 · • Raita × 1 · • Soft Drink × 2", addr: "B-12 Saket District Centre, Delhi · Deliver by 12:45 PM", priority: "🔥 Priority" },
    { id: "#BB2024120", customer: "Sneha Kapoor", meta: "1 min ago · COD · ₹1,248",     items: "• BBQ Chicken Pizza × 2 · • Garlic Bread × 2 · • Tiramisu × 1", addr: "A-44 Gomti Nagar, Lucknow · Deliver by 1:00 PM", priority: "Normal" },
  ]);

  // acceptOrder(id)
  const acceptOrder = (id) => {
    setNewOrders(p => p.filter(o => o.id !== id));
    show("Order accepted!", "success");
  };
  // rejectOrder(id)
  const rejectOrder = (id) => {
    setNewOrders(p => p.filter(o => o.id !== id));
    show("Order rejected", "error");
  };

  const tabs = [
    { label: "🔴 New",        id: "New",        badge: "badge-red",    cnt: newOrders.length },
    { label: "🔥 Preparing",  id: "Preparing",  badge: "badge-orange", cnt: 2 },
    { label: "🛵 Delivering", id: "Delivering", badge: "badge-teal",   cnt: 3 },
    { label: "✅ Delivered",  id: "Delivered",  badge: null, cnt: null },
    { label: "❌ Cancelled",  id: "Cancelled",  badge: null, cnt: null },
  ];

  const StatusTimeline = ({ step }) => {
    const steps = ["Received", "Preparing", "Ready", "Delivered"];
    const doneIdx = steps.indexOf(step);
    return (
      <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: i < doneIdx ? "var(--green)" : i === doneIdx ? "var(--red)" : "var(--gray3)", animation: i === doneIdx ? "pulse 1.5s infinite" : "none" }}></div>
            <span style={{ fontSize: "0.72rem", fontWeight: 700 }}>{s}</span>
            {i < steps.length - 1 && <span style={{ color: "var(--gray3)", fontSize: 10 }}>›</span>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="panel-topbar">
        <div><div className="panel-topbar-title">Order Management</div><div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>Real-time order tracking & management</div></div>
        <div className="panel-topbar-right">
          <div style={{ fontSize: "0.82rem", color: "var(--text3)" }}>Auto-refresh: <strong style={{ color: "var(--green)" }}>ON</strong></div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--green-light)", borderRadius: "var(--radius-full)", fontSize: "0.78rem", fontWeight: 800, color: "#197A32" }}>
            <div style={{ width: 8, height: 8, background: "var(--green)", borderRadius: "50%", animation: "pulse 1.5s infinite" }}></div>Open
          </div>
        </div>
      </div>

      {/* Tab Bar — setTab() */}
      <div style={{ display: "flex", gap: 4, background: "var(--gray4)", borderRadius: "var(--radius-full)", padding: 4, marginBottom: 24, overflowX: "auto" }}>
        {tabs.map(t => (
          <div key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: "9px 18px", borderRadius: "var(--radius-full)", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", transition: "all var(--transition)", color: activeTab === t.id ? "var(--red)" : "var(--text2)", background: activeTab === t.id ? "var(--card)" : "transparent", boxShadow: activeTab === t.id ? "var(--shadow-sm)" : "none", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
            {t.label}
            {t.cnt !== null && <span className={`badge ${t.badge}`} style={{ fontSize: "0.68rem" }}>{t.cnt}</span>}
          </div>
        ))}
      </div>

      {/* NEW ORDERS TAB */}
      {activeTab === "New" && (
        <div>
          {newOrders.map((o, idx) => (
            <div key={o.id} style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", background: "var(--bg2)", borderBottom: "1px solid var(--border)" }}>
                <div style={{ background: "var(--red-light)", color: "var(--red)", fontFamily: "var(--font-display)", fontWeight: 900, padding: "8px 14px", borderRadius: "var(--radius-sm)", fontSize: "0.9rem" }}>{o.id}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>{o.customer}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}><i className="fa-solid fa-clock" style={{ fontSize: 11 }}></i> {o.meta}</div>
                </div>
                <span style={{ padding: "3px 8px", borderRadius: "var(--radius-full)", fontSize: "0.68rem", fontWeight: 800, background: o.priority.includes("🔥") ? "var(--red-light)" : "var(--gray4)", color: o.priority.includes("🔥") ? "var(--red)" : "var(--text3)" }}>{o.priority}</span>
                {/* Timer countdown */}
                {idx === 0 && (
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 900, color: "var(--orange)", display: "flex", alignItems: "center", gap: 4 }}>
                    <i className="fa-solid fa-clock"></i> {timerStr}
                  </div>
                )}
              </div>
              <div style={{ padding: "16px 20px" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text2)", marginBottom: 10 }}>{o.items}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text3)", background: "var(--bg2)", padding: "8px 12px", borderRadius: "var(--radius-sm)", marginBottom: 12 }}>
                  <i className="fa-solid fa-location-dot" style={{ color: "var(--red)" }}></i> {o.addr}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <StatusTimeline step="Received" />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-danger btn-sm"  onClick={() => rejectOrder(o.id)}><i className="fa-solid fa-xmark"></i> Reject</button>
                    <button className="btn btn-success btn-sm" onClick={() => acceptOrder(o.id)}><i className="fa-solid fa-check"></i> Accept Order</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {newOrders.length === 0 && (
            <div style={{ textAlign: "center", padding: 60, color: "var(--text3)" }}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>📋</div>
              <div style={{ fontWeight: 700 }}>No new orders right now</div>
              <div style={{ fontSize: "0.82rem", marginTop: 6 }}>New orders will appear here automatically</div>
            </div>
          )}
        </div>
      )}

      {/* PREPARING TAB */}
      {activeTab === "Preparing" && (
        <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", background: "var(--bg2)", borderBottom: "1px solid var(--border)" }}>
            <div style={{ background: "var(--orange-light)", color: "#C45D30", fontFamily: "var(--font-display)", fontWeight: 900, padding: "8px 14px", borderRadius: "var(--radius-sm)", fontSize: "0.9rem" }}>#BB2024118</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: "0.9rem" }}>Arjun Sharma</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>12:01 PM · UPI · ₹900</div>
            </div>
            <span className="badge badge-orange">Preparing</span>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 900, color: "var(--orange)", display: "flex", alignItems: "center", gap: 4 }}><i className="fa-solid fa-fire"></i> 12 min</div>
          </div>
          <div style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--text2)", marginBottom: 12 }}>• Margherita Pizza × 1 · • Pepperoni Feast × 1 · • Penne Arrabbiata × 1</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <StatusTimeline step="Preparing" />
              <button className="btn btn-sm" style={{ background: "var(--teal)", color: "#fff" }} onClick={() => show("Order marked as ready for pickup", "success")}>
                <i className="fa-solid fa-bell"></i> Mark Ready
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Other tabs — placeholder */}
      {!["New","Preparing"].includes(activeTab) && (
        <div style={{ textAlign: "center", padding: 60, color: "var(--text3)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 700 }}>No {activeTab.toLowerCase()} orders</div>
          <div style={{ fontSize: "0.82rem", marginTop: 6 }}>Orders will appear here</div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RESTAURANT MENU — filterCat(), openEdit(), confirmDelete(), saveItem(), toggleAvailable()
═══════════════════════════════════════════════════════ */
function RestMenu() {
  const { toasts, show } = useToast();
  // filterCat()
  const [activeCat, setActiveCat] = useState("All Items");
  // Add/Edit modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add New Item");
  const [editData, setEditData] = useState({ name: "", price: "", desc: "", category: "🍕 Pizzas", type: "veg", available: true });
  // confirmDelete() — delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [items, setItems] = useState([
    { id: 1, name: "Margherita Pizza",  desc: "Classic tomato, mozzarella, fresh basil",            price: 299, veg: true,  available: true,  img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200", cat: "🍕 Pizzas" },
    { id: 2, name: "Pepperoni Feast",   desc: "Premium pepperoni, bell peppers, olives",             price: 449, veg: false, available: true,  img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200", cat: "🍕 Pizzas" },
    { id: 3, name: "Paneer Tikka Pizza",desc: "Spiced paneer, capsicum, onions, tikka sauce",        price: 349, veg: true,  available: false, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200", cat: "🍕 Pizzas" },
    { id: 4, name: "BBQ Chicken Pizza", desc: "Smoky BBQ chicken, caramelized onions, cheddar",      price: 499, veg: false, available: true,  img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200", cat: "🍕 Pizzas" },
    { id: 5, name: "Penne Arrabbiata",  desc: "Spicy tomato cream sauce, fresh herbs",               price: 249, veg: true,  available: true,  img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=200", cat: "🍝 Pasta" },
  ]);

  const cats = [
    { label: "⭐ All Items", count: items.length },
    { label: "🍕 Pizzas",   count: items.filter(i => i.cat === "🍕 Pizzas").length },
    { label: "🍝 Pasta",    count: items.filter(i => i.cat === "🍝 Pasta").length },
    { label: "🥗 Starters", count: 2 },
    { label: "🥤 Drinks",   count: 2 },
    { label: "🍰 Desserts", count: 1 },
  ];

  const displayed = activeCat === "⭐ All Items" ? items : items.filter(i => i.cat === activeCat);

  // openEdit(item) — fill modal with existing data
  const openEdit = (item) => {
    setModalTitle("Edit Item");
    setEditData({ name: item.name, price: String(item.price), desc: item.desc, category: item.cat, type: item.veg ? "veg" : "nonveg", available: item.available });
    setModalOpen(true);
  };

  // saveItem() — save new or edited item
  const saveItem = () => {
    setModalOpen(false);
    show("Item saved successfully!", "success");
  };

  // confirmDelete(id)
  const confirmDelete = (id) => {
    setDeleteTarget(id);
    setDeleteModal(true);
  };

  // doDelete()
  const doDelete = () => {
    setItems(p => p.filter(i => i.id !== deleteTarget));
    setDeleteModal(false);
    show("Item deleted", "info");
  };

  // toggle available
  const toggleAvailable = (id) => {
    setItems(p => p.map(i => i.id === id ? { ...i, available: !i.available } : i));
  };

  return (
    <div>
      <div className="panel-topbar">
        <div><div className="panel-topbar-title">Menu Management</div><div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>Manage your food items and categories</div></div>
        <div className="panel-topbar-right">
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--gray4)", borderRadius: "var(--radius-full)", padding: "8px 16px", width: 220 }}>
            <i className="fa-solid fa-magnifying-glass" style={{ color: "var(--gray2)", fontSize: 13 }}></i>
            <input type="text" placeholder="Search items..." style={{ background: "none", border: "none", fontSize: "0.85rem", color: "var(--text)" }} />
          </div>
          <button className="btn btn-primary" onClick={() => { setModalTitle("Add New Item"); setEditData({ name: "", price: "", desc: "", category: "🍕 Pizzas", type: "veg", available: true }); setModalOpen(true); }}>
            <i className="fa-solid fa-plus"></i> Add Item
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 24 }}>
        {/* Category Sidebar — filterCat() */}
        <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden", height: "fit-content" }}>
          <div style={{ padding: "14px 18px", background: "var(--bg2)", borderBottom: "1px solid var(--border)", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "0.9rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Categories
            <button className="btn btn-ghost btn-sm" style={{ fontSize: "0.72rem" }} onClick={() => show("Add category", "info")}><i className="fa-solid fa-plus"></i></button>
          </div>
          {cats.map(c => (
            <div key={c.label} onClick={() => setActiveCat(c.label)}   /* filterCat() */
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer", borderBottom: "1px solid var(--border)", transition: "all var(--transition)", color: activeCat === c.label ? "var(--red)" : "var(--text2)", background: activeCat === c.label ? "var(--red-light)" : "transparent" }}>
              <span>{c.label}</span>
              <span className="badge badge-gray">{c.count}</span>
            </div>
          ))}
        </div>

        {/* Items List */}
        <div>
          <div className="flex justify-between items-center mb-16">
            <div style={{ fontSize: "0.82rem", color: "var(--text3)" }}>Showing <strong>{displayed.length}</strong> items</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button className="btn btn-secondary btn-sm">Sort by Name</button>
              <button className="btn btn-secondary btn-sm"><i className="fa-solid fa-filter"></i> Filter</button>
            </div>
          </div>

          {displayed.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 14, alignItems: "center", padding: 14, background: "var(--card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", marginBottom: 10, transition: "all var(--transition)" }}>
              <div style={{ width: 70, height: 60, borderRadius: "var(--radius)", overflow: "hidden", flexShrink: 0 }}>
                <img src={item.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.src = "https://placehold.co/70x60/FFEBE0/E63946?text=🍕"; }} alt={item.name} />
              </div>
              {/* Veg/NonVeg dot */}
              <div style={{ width: 14, height: 14, border: `1.5px solid ${item.veg ? "var(--green)" : "var(--red)"}`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <div style={{ width: 7, height: 7, background: item.veg ? "var(--green)" : "var(--red)", borderRadius: "50%" }}></div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 800, marginBottom: 3 }}>{item.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 2 }}>{item.desc}</div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, color: "var(--red)" }}>₹{item.price}</div>
              <span className={`badge ${item.available ? "badge-green" : "badge-gray"}`}>{item.available ? "Available" : "Unavailable"}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {/* toggle available */}
                <label className="toggle" onClick={() => toggleAvailable(item.id)}>
                  <input type="checkbox" checked={item.available} onChange={() => {}} />
                  <span className="toggle-slider"></span>
                </label>
                {/* openEdit() */}
                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(item)}><i className="fa-solid fa-pen"></i></button>
                {/* confirmDelete() */}
                <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(item.id)}><i className="fa-solid fa-trash"></i></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ADD/EDIT ITEM MODAL — saveItem() */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle} maxWidth={560}
        footer={<><button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button><button className="btn btn-primary" onClick={saveItem}><i className="fa-solid fa-check"></i> Save Item</button></>}>
        <div>
          <div className="form-group">
            <label className="form-label">Item Name</label>
            <div className="input-wrap"><i className="fa-solid fa-utensils input-icon"></i><input type="text" className="form-input" value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Margherita Pizza" /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Price (₹)</label>
              <div className="input-wrap"><i className="fa-solid fa-indian-rupee-sign input-icon"></i><input type="number" className="form-input" value={editData.price} onChange={e => setEditData(p => ({ ...p, price: e.target.value }))} placeholder="299" /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input no-icon" style={{ paddingLeft: 14 }} value={editData.category} onChange={e => setEditData(p => ({ ...p, category: e.target.value }))}>
                <option>🍕 Pizzas</option><option>🍝 Pasta</option><option>🥗 Starters</option><option>🥤 Drinks</option><option>🍰 Desserts</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input no-icon" rows={3} value={editData.desc} onChange={e => setEditData(p => ({ ...p, desc: e.target.value }))} placeholder="Short description..." style={{ resize: "none" }}></textarea>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Food Type</label>
              <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}>
                  <input type="radio" name="ftype" checked={editData.type === "veg"} onChange={() => setEditData(p => ({ ...p, type: "veg" }))} style={{ accentColor: "var(--green)" }} /> 🟢 Veg
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "0.82rem", fontWeight: 700 }}>
                  <input type="radio" name="ftype" checked={editData.type === "nonveg"} onChange={() => setEditData(p => ({ ...p, type: "nonveg" }))} style={{ accentColor: "var(--red)" }} /> 🔴 Non-veg
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Available</label>
              <div style={{ marginTop: 8 }}>
                <label className="toggle">
                  <input type="checkbox" checked={editData.available} onChange={() => setEditData(p => ({ ...p, available: !p.available }))} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Item Image</label>
            <div style={{ border: "2px dashed var(--border)", borderRadius: "var(--radius-lg)", padding: 24, textAlign: "center", cursor: "pointer", transition: "all var(--transition)" }}
              onMouseOver={e => e.currentTarget.style.borderColor = "var(--red)"} onMouseOut={e => e.currentTarget.style.borderColor = "var(--border)"}>
              <i className="fa-solid fa-cloud-arrow-up" style={{ fontSize: 28, color: "var(--gray2)", marginBottom: 8 }}></i>
              <div style={{ fontSize: "0.82rem", color: "var(--text3)" }}>Click to upload or drag & drop</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>PNG, JPG up to 5MB</div>
            </div>
          </div>
        </div>
      </Modal>

      {/* DELETE CONFIRM MODAL */}
      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title="" maxWidth={380}
        footer={<><button className="btn btn-secondary btn-full" onClick={() => setDeleteModal(false)}>Cancel</button><button className="btn btn-primary btn-full" style={{ background: "linear-gradient(135deg,var(--red),#C1121F)" }} onClick={doDelete}>Delete Item</button></>}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🗑️</div>
          <h3 style={{ marginBottom: 8 }}>Delete Item?</h3>
          <p style={{ color: "var(--text2)", fontSize: "0.88rem" }}>This item will be removed permanently. This cannot be undone.</p>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   RESTAURANT PORTAL SHELL
═══════════════════════════════════════════════════════ */
export default function RestaurantPortal({ onSignOut }) {
  const [page, setPage] = useState("dashboard");

  const handleNav = (id) => {
    if (id === "logout") { onSignOut(); return; }
    setPage(id);
  };

  const pages = {
    dashboard: <RestDashboard onNav={setPage} />,
    orders:    <RestOrders />,
    menu:      <RestMenu />,
  };

  return (
    <div className="panel-layout">
      <PanelSidebar
        subtitle="Restaurant Panel"
        navItems={REST_NAV}
        activeItem={page}
        onNav={handleNav}
        userName="Pizza Palace"
        userRole="Restaurant Owner"
        userInitials="PP"
      />
      <main className="panel-content">
        {pages[page] || pages["dashboard"]}
      </main>
    </div>
  );
}
