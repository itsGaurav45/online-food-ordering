import { useState, useEffect } from "react";
import { PanelSidebar, BarChart, Modal, useToast, ToastContainer } from "../shared/components";

/* ─── Admin Nav Config ──────────────────────────────── */
const ADMIN_NAV = [
  { type: "section", label: "Overview" },
  { id: "dashboard",    icon: "fa-solid fa-gauge-high",  label: "Dashboard" },
  { id: "reports",      icon: "fa-solid fa-chart-line",  label: "Reports & Analytics" },
  { type: "section", label: "Management", mt: 16 },
  { id: "users",        icon: "fa-solid fa-users",       label: "Users",       badge: "8,421", badgeClass: "green" },
  { id: "restaurants",  icon: "fa-solid fa-store",       label: "Restaurants", badge: "12" },
  { id: "orders",       icon: "fa-solid fa-bag-shopping", label: "Orders" },
  { type: "section", label: "System", mt: 16 },
  { id: "coupons",      icon: "fa-solid fa-tag",         label: "Coupons" },
  { id: "security",     icon: "fa-solid fa-shield-halved",label: "Security" },
  { id: "settings",     icon: "fa-solid fa-gear",        label: "Settings" },
  { id: "logout",       icon: "fa-solid fa-right-from-bracket", label: "Logout" },
];

/* ─── Shared stat card ──────────────────────────────── */
function StatCard({ color, icon, num, label, change, changeType = "up", compact = false }) {
  return (
    <div className={`stat-card ${color}`} style={compact ? { padding: 16 } : {}}>
      <div className={`stat-icon ${color}`} style={compact ? { width: 36, height: 36, fontSize: 15, marginBottom: 10 } : {}}><i className={icon}></i></div>
      <div className="stat-num" style={compact ? { fontSize: "1.5rem" } : {}}>{num}</div>
      <div className="stat-label">{label}</div>
      {change && <div className={`stat-change ${changeType}`}>{changeType === "up" ? <i className="fa-solid fa-arrow-trend-up"></i> : <i className="fa-solid fa-arrow-trend-down"></i>} {change}</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ADMIN DASHBOARD — approveRest(), rejectRest(), BarChart
═══════════════════════════════════════════════════ */
function AdminDashboard({ onNav, pending, onAction, showToast, stats }) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const revData = [32,41,28,56,48,62,75,68,82,91,78,96];

  const metrics = [
    { label: "Order Success Rate", val: "94.2%", w: "94%", clr: "var(--green)" },
    { label: "Restaurant Uptime",  val: "87.1%", w: "87%", clr: "var(--teal)" },
    { label: "User Retention",     val: "72.4%", w: "72%", clr: "var(--orange)" },
    { label: "Cancellation Rate",  val: "5.8%",  w: "5.8%", clr: "var(--red)" },
  ];

  const cities = [
    { flag: "🗼", name: "Delhi NCR",   orders: "8,421", pct: "85%", clr: "var(--red)" },
    { flag: "🌊", name: "Mumbai",      orders: "6,214", pct: "62%", clr: "var(--orange)" },
    { flag: "🌳", name: "Bangalore",   orders: "4,892", pct: "49%", clr: "var(--teal)" },
    { flag: "🏯", name: "Hyderabad",   orders: "3,341", pct: "33%", clr: "var(--green)" },
    { flag: "🌺", name: "Chennai",     orders: "2,108", pct: "21%", clr: "#9B5DE5" },
  ];

  return (
    <div>
      <div className="panel-topbar">
        <div>
          <div className="panel-topbar-title">Admin Dashboard</div>
          <div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>Welcome back! Here's what's happening today.</div>
        </div>
        <div className="panel-topbar-right">
          <div style={{ fontSize: "0.78rem", color: "var(--text3)", display: "flex", alignItems: "center", gap: 6 }}>
            <i className="fa-solid fa-calendar" style={{ color: "var(--red)" }}></i> Saturday, 21 March 2026
          </div>
          <div style={{ position: "relative", background: "var(--gray4)", border: "1.5px solid var(--border)", borderRadius: "var(--radius)", width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text2)" }}>
            <i className="fa-solid fa-bell"></i>
            <span className="header-badge">12</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-4 mb-24">
        <StatCard color="red"    icon="fa-solid fa-users"           num={stats.totalUsers}        label="Total Users"        change="+142 this week" />
        <StatCard color="orange" icon="fa-solid fa-store"            num={stats.totalRestaurants || 0}  label="Restaurants"        change={`${stats.pendingRestaurants} pending approval`} />
        <StatCard color="green"  icon="fa-solid fa-bag-shopping"     num={stats.totalOrders}       label="Total Orders"       change="+3,241 today" />
        <StatCard color="teal"   icon="fa-solid fa-indian-rupee-sign" num={stats.revenue}           label="Monthly Revenue"    change="+22% vs last month" />
      </div>

      <div className="grid-2 mb-24">
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-body">
            <div className="section-header mb-16">
              <div><div className="section-title" style={{ fontSize: "1.1rem" }}>Platform Revenue</div><div className="section-subtitle">Monthly revenue trend</div></div>
              <select style={{ padding: "6px 12px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-full)", fontSize: "0.78rem", fontWeight: 700, background: "var(--gray4)", cursor: "pointer" }}>
                <option>Last 7 Days</option><option selected>Last 30 Days</option><option>Last 3 Months</option>
              </select>
            </div>
            <BarChart data={revData} labels={months} height={160} />
          </div>
        </div>

        {/* Platform Health */}
        <div className="card">
          <div className="card-body">
            <div className="section-header mb-16"><div className="section-title" style={{ fontSize: "1.1rem" }}>Platform Health</div></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {metrics.map(m => (
                <div key={m.label}>
                  <div className="flex justify-between mb-4"><span style={{ fontSize: "0.82rem", fontWeight: 700 }}>{m.label}</span><span style={{ fontSize: "0.82rem", fontWeight: 800, color: m.clr }}>{m.val}</span></div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: m.w, background: m.clr }}></div></div>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 20 }}>
              {[["⭐", "4.7", "Avg Platform Rating"], ["⚡", "27 min", "Avg Delivery Time"]].map(([ico, val, lbl]) => (
                <div key={lbl} style={{ background: "var(--card)", borderRadius: "var(--radius-lg)", padding: 16, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                  <div style={{ fontSize: "1.4rem", marginBottom: 4 }}>{ico}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 900 }}>{val}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2 mb-24">
        {/* Pending Approvals */}
        <div className="card">
          <div className="card-body">
            <div className="section-header mb-16">
              <div><div className="section-title" style={{ fontSize: "1.1rem" }}>⏳ Pending Approvals</div><div className="section-subtitle">Restaurants awaiting verification</div></div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNav("restaurants")}>View All ({pending.length})</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pending.map(r => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, background: "var(--bg2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "var(--radius)", background: "var(--orange-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{r.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: "0.88rem" }}>{r.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{r.sub}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-success btn-sm" onClick={() => onAction(r.id, "approve")}><i className="fa-solid fa-check"></i></button>
                    <button className="btn btn-danger btn-sm"  onClick={() => onAction(r.id, "reject")}><i className="fa-solid fa-xmark"></i></button>
                  </div>
                </div>
              ))}
              {pending.length === 0 && <div style={{ textAlign: "center", padding: 24, color: "var(--text3)", fontSize: "0.85rem" }}>No pending approvals 🎉</div>}
            </div>
          </div>
        </div>


        {/* New Users Today */}
        <div className="card">
          <div className="card-body">
            <div className="section-header mb-16">
              <div><div className="section-title" style={{ fontSize: "1.1rem" }}>👤 New Users Today</div></div>
              <button className="btn btn-ghost btn-sm" onClick={() => onNav("users")}>All Users</button>
            </div>
            <table className="data-table">
              <thead><tr><th>User</th><th>Joined</th><th>Orders</th><th>Status</th></tr></thead>
              <tbody>
                {[["RS","Rohan Singh","var(--red)","Just now","0","Active","badge-green"],["SK","Sneha Kapoor","var(--orange)","12 min ago","0","Active","badge-green"],["MJ","Meera Joshi","var(--teal)","1h ago","2","Active","badge-green"],["VP","Vijay Patel","var(--dark)","3h ago","1","Pending","badge-yellow"]].map(([i,n,c,t,o,s,b]) => (
                  <tr key={n}>
                    <td><div className="user-cell"><div className="user-initials" style={{ background: c }}>{i}</div>{n}</div></td>
                    <td style={{ fontSize: "0.78rem", color: "var(--text3)" }}>{t}</td>
                    <td>{o}</td>
                    <td><span className={`badge ${b}`}>{s}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* City Breakdown */}
      <div className="card mb-24">
        <div className="card-body">
          <div className="section-header mb-16"><div className="section-title" style={{ fontSize: "1.1rem" }}>🗺️ Orders by City</div></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14 }}>
            {cities.map(c => (
              <div key={c.name} style={{ textAlign: "center", padding: 16, background: "var(--bg2)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "1.4rem", marginBottom: 8 }}>{c.flag}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.1rem" }}>{c.orders}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: 4 }}>{c.name}</div>
                <div className="progress-track" style={{ marginTop: 8 }}><div className="progress-fill" style={{ width: c.pct, background: c.clr }}></div></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════
   ADMIN ORDERS — filters, table, export
═══════════════════════════════════════════════════ */
function AdminOrders({ orders, showToast }) {
  const [search, setSearch] = useState("");
  const filtered = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.name.toLowerCase().includes(search.toLowerCase()) || 
    o.rest.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="panel-topbar">
        <div><div className="panel-topbar-title">Order Monitoring</div><div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>Live view of all orders across the platform</div></div>
        <div className="panel-topbar-right">
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", fontWeight: 700, color: "var(--green)" }}>
            <div style={{ width: 8, height: 8, background: "var(--green)", borderRadius: "50%", animation: "pulse 1.5s infinite" }}></div> Live Mode
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => showToast("Refreshed","info")}><i className="fa-solid fa-rotate-right"></i> Refresh</button>
          <button className="btn btn-primary btn-sm"   onClick={() => showToast("Export started","info")}><i className="fa-solid fa-download"></i> Export</button>
        </div>
      </div>

      <div className="grid-4 mb-24">
        <StatCard compact color="red"    icon="fa-solid fa-circle-dot"   num="247"   label="Active Orders"   change="Right now" />
        <StatCard compact color="orange" icon="fa-solid fa-bag-shopping"  num="3,241" label="Today's Orders"  change="+18%" />
        <StatCard compact color="green"  icon="fa-solid fa-check-circle"  num="3,052" label="Delivered"       change="94.2% success" />
        <StatCard compact color="teal"   icon="fa-solid fa-xmark-circle"  num="189"   label="Cancelled"       change="5.8%" changeType="down" />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, background: "var(--gray4)", borderRadius: "var(--radius-full)", padding: "10px 18px", maxWidth: 320 }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: "var(--gray2)", fontSize: 13 }}></i>
          <input type="text" placeholder="Search order ID, customer, restaurant..." 
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: "none", background: "none", fontSize: "0.85rem", width: "100%", color: "var(--text)" }} />
        </div>
        <select style={{ padding: "10px 16px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-full)", fontSize: "0.82rem", fontWeight: 700, background: "var(--gray4)", color: "var(--text2)" }}>
          <option>All Status</option><option>Active</option><option>Preparing</option><option>Delivering</option><option>Delivered</option><option>Cancelled</option>
        </select>
        <select style={{ padding: "10px 16px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-full)", fontSize: "0.82rem", fontWeight: 700, background: "var(--gray4)", color: "var(--text2)" }}>
          <option>Today</option><option>Yesterday</option><option>Last 7 days</option>
        </select>
        <input type="date" style={{ padding: "10px 16px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-full)", fontSize: "0.82rem", fontWeight: 700, background: "var(--gray4)", color: "var(--text2)" }} />
      </div>

      <div className="card">
        <div style={{ overflowX: "auto", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
          <table className="data-table">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Restaurant</th><th>Items</th><th>Amount</th><th>Payment</th><th>Time</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td><strong>{o.id}</strong></td>
                  <td><div className="user-cell"><div className="user-initials" style={{ background: o.iBg, width: 30, height: 30, fontSize: "0.7rem" }}>{o.initials}</div>{o.name}</div></td>
                  <td style={{ fontSize: "0.82rem" }}>{o.rest}</td>
                  <td style={{ fontSize: "0.82rem", color: "var(--text2)" }}>{o.items}</td>
                  <td style={{ fontWeight: 800, color: "var(--green)" }}>{o.amt}</td>
                  <td><span className="badge badge-teal">{o.pay}</span></td>
                  <td style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{o.time}</td>
                  <td><span className={`badge ${o.sBadge}`} style={{ fontSize: "0.7rem" }}>{o.status}</span></td>
                  <td><button className="btn btn-secondary btn-sm" onClick={() => showToast(`Opening order ${o.id}`, "info")}><i className="fa-solid fa-eye"></i></button></td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="9" style={{ textAlign: "center", padding: 32, color: "var(--text3)" }}>No orders found for "{search}"</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>Showing {filtered.length} of {orders.length} orders</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["←", 1, 2, 3, "...", 649, "→"].map((p, i) => (
              <button key={i} className="btn btn-secondary btn-sm" onClick={() => showToast(`Page ${p} clicked`)} style={p === 1 ? { background: "var(--red)", color: "#fff", borderColor: "var(--red)" } : {}}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════
   ADMIN USERS — toggleDD(), toggleAll(), action dropdown
═══════════════════════════════════════════════════ */
function AdminUsers({ users, showToast }) {
  const [allChecked, setAllChecked] = useState(false);
  const [checked, setChecked]       = useState({});
  const [openDD, setOpenDD]         = useState(null);
  const [search, setSearch]         = useState("");

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.phone.includes(search)
  );

  const handleToggleAll = (e) => {
    setAllChecked(e.target.checked);
    const map = {};
    filtered.forEach(u => (map[u.id] = e.target.checked));
    setChecked(map);
  };

  const handleDD = (id) => setOpenDD(o => (o === id ? null : id));

  return (
    <div onClick={() => setOpenDD(null)}>
      <div className="panel-topbar">
        <div><div className="panel-topbar-title">User Management</div><div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>Manage all 8,421 registered users</div></div>
        <div className="panel-topbar-right">
          <button className="btn btn-primary btn-sm" onClick={() => showToast("Export CSV started", "info")}><i className="fa-solid fa-download"></i> Export</button>
        </div>
      </div>

      <div className="grid-4 mb-24">
        <StatCard compact color="red"    icon="fa-solid fa-users"        num="8,421" label="Total Users" />
        <StatCard compact color="green"  icon="fa-solid fa-circle-check" num="7,984" label="Active" />
        <StatCard compact color="orange" icon="fa-solid fa-user-clock"   num="302"   label="Inactive" />
        <StatCard compact color="teal"   icon="fa-solid fa-ban"          num="135"   label="Suspended" />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, background: "var(--gray4)", borderRadius: "var(--radius-full)", padding: "10px 18px", maxWidth: 320 }}>
          <i className="fa-solid fa-magnifying-glass" style={{ color: "var(--gray2)", fontSize: 13 }}></i>
          <input type="text" placeholder="Search by name, email, phone..." 
            value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: "none", background: "none", fontSize: "0.85rem", width: "100%", color: "var(--text)" }} />
        </div>
        <select style={{ padding: "10px 16px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-full)", fontSize: "0.82rem", fontWeight: 700, background: "var(--gray4)", color: "var(--text2)" }}>
          <option>All Status</option><option>Active</option><option>Inactive</option><option>Suspended</option>
        </select>
        <select style={{ padding: "10px 16px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-full)", fontSize: "0.82rem", fontWeight: 700, background: "var(--gray4)", color: "var(--text2)" }}>
          <option>Sort: Newest</option><option>Sort: Oldest</option><option>Sort: Orders</option>
        </select>
      </div>

      <div className="card">
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th><input type="checkbox" style={{ accentColor: "var(--red)" }} checked={allChecked} onChange={handleToggleAll} /></th>
                <th>User</th><th>Email</th><th>Phone</th><th>Orders</th><th>Spent</th><th>Joined</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td><input type="checkbox" style={{ accentColor: "var(--red)" }} checked={!!checked[u.id]} onChange={e => setChecked(p => ({ ...p, [u.id]: e.target.checked }))} /></td>
                  <td><div className="user-cell"><div className="user-initials" style={{ background: u.bg }}>{u.ini}</div><div style={{ fontWeight: 700 }}>{u.name}</div></div></td>
                  <td style={{ fontSize: "0.82rem", color: "var(--text2)" }}>{u.email}</td>
                  <td style={{ fontSize: "0.82rem" }}>{u.phone}</td>
                  <td style={{ fontWeight: 800 }}>{u.orders}</td>
                  <td style={{ fontWeight: 800, color: "var(--green)" }}>{u.spent}</td>
                  <td style={{ fontSize: "0.78rem", color: "var(--text3)" }}>{u.joined}</td>
                  <td><span className={`badge ${u.sBadge}`}>{u.status}</span></td>
                  <td>
                    {/* toggleDD() dropdown */}
                    <div style={{ position: "relative" }} onClick={e => { e.stopPropagation(); handleDD(u.id); }}>
                      <button className="btn btn-secondary btn-sm"><i className="fa-solid fa-ellipsis-vertical"></i></button>
                      {openDD === u.id && (
                        <div style={{ position: "absolute", right: 0, top: "110%", background: "var(--card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", padding: 6, zIndex: 50, minWidth: 160 }}>
                          {u.actions.map(a => (
                            <div key={a.lbl} onClick={() => { showToast(a.lbl, a.fn); setOpenDD(null); }}
                              style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: "var(--radius-sm)", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", transition: "all var(--transition)", color: a.danger ? "var(--red)" : "var(--text2)" }}>
                              <i className={`fa-solid ${a.ico}`}></i> {a.lbl}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="9" style={{ textAlign: "center", padding: 32, color: "var(--text3)" }}>No users found for "{search}"</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>Showing {filtered.length} of {users.length} users</div>
          <div style={{ display: "flex", gap: 6 }}>
            {["←", 1, 2, 3, "...", 1685, "→"].map((p, i) => (
              <button key={i} className="btn btn-secondary btn-sm" onClick={() => showToast(`Page ${p} clicked`)} style={p === 1 ? { background: "var(--red)", color: "#fff", borderColor: "var(--red)" } : {}}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════
   ADMIN RESTAURANTS — tabs, handleRest() approve/reject
═══════════════════════════════════════════════════ */
function AdminRestaurants({ pending, onAction, showToast }) {
  const [activeTab, setActiveTab] = useState("pending");
  const tabs = [{ id: "pending", label: `⏳ Pending (${pending.length})` }, { id: "active", label: "✅ Active (489)" }, { id: "suspended", label: "🚫 Suspended (11)" }];

  return (
    <div>
      <div className="panel-topbar">
        <div><div className="panel-topbar-title">Restaurant Management</div><div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>512 restaurants · {pending.length} pending approval</div></div>
        <div className="panel-topbar-right">
          <button className="btn btn-primary btn-sm" onClick={() => showToast("Add restaurant modal", "info")}><i className="fa-solid fa-plus"></i> Add Restaurant</button>
        </div>
      </div>

      <div className="grid-4 mb-24">
        <StatCard compact color="red"    icon="fa-solid fa-store"        num="512" label="Total" />
        <StatCard compact color="green"  icon="fa-solid fa-circle-check" num="489" label="Active" />
        <StatCard compact color="orange" icon="fa-solid fa-clock"        num={pending.length} label="Pending" />
        <StatCard compact color="teal"   icon="fa-solid fa-ban"          num="11"  label="Suspended" />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, background: "var(--gray4)", borderRadius: "var(--radius-full)", padding: 4, marginBottom: 24, width: "fit-content" }}>
        {tabs.map(t => (
          <div key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ padding: "9px 18px", borderRadius: "var(--radius-full)", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", transition: "all var(--transition)", color: activeTab === t.id ? "var(--red)" : "var(--text2)", background: activeTab === t.id ? "var(--card)" : "transparent", boxShadow: activeTab === t.id ? "var(--shadow-sm)" : "none" }}>
            {t.label}
          </div>
        ))}
      </div>

      {activeTab === "pending" && (
        <div className="grid-3">
          {pending.map(r => (
            <div key={r.id} style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden", transition: "all var(--transition)" }}>
              <div style={{ height: 120, position: "relative", overflow: "hidden" }}>
                <img src={r.headerImg} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.src = "https://placehold.co/400x120/FFEBE0/E63946?text=🍽️"; }} alt="" />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.6),transparent)" }}></div>
                <div style={{ position: "absolute", top: 10, right: 10 }}><span className="badge badge-yellow">Pending Review</span></div>
                <div style={{ position: "absolute", bottom: 10, left: 14, zIndex: 1, width: 48, height: 48, borderRadius: "var(--radius)", border: "3px solid var(--card)", background: "var(--card)", overflow: "hidden" }}>
                  <img src={r.headerImg} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                </div>
              </div>
              <div style={{ padding: 16, marginTop: 20 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1rem", marginBottom: 4 }}>{r.name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text3)", marginBottom: 10 }}>{r.sub}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: "0.78rem", color: "var(--text2)", marginBottom: 14 }}>
                  <div><i className="fa-solid fa-user" style={{ color: "var(--red)", width: 16 }}></i> Owner: {r.owner}</div>
                  <div><i className="fa-solid fa-phone" style={{ color: "var(--red)", width: 16 }}></i> {r.phone}</div>
                  <div><i className="fa-solid fa-clock" style={{ color: "var(--red)", width: 16 }}></i> Submitted: {String(r.age || "New")}</div>
                  <div><i className="fa-solid fa-file" style={{ color: "var(--red)", width: 16 }}></i> FSSAI: <span style={{ color: r.fssaiClr || 'var(--orange)', fontWeight: 700 }}>{String(r.fssai || "Pending")}</span></div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-danger btn-sm btn-full" onClick={() => onAction(r.id, "reject")}><i className="fa-solid fa-xmark"></i> Reject</button>
                  <button className="btn btn-success btn-sm btn-full" onClick={() => onAction(r.id, "approve")}><i className="fa-solid fa-check"></i> Approve</button>
                </div>
                <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 6 }} onClick={() => showToast("Opening details", "info")}><i className="fa-solid fa-eye"></i> View Full Details</button>
              </div>
            </div>
          ))}
          {pending.length === 0 && <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "var(--text3)" }}><div style={{ fontSize: "3rem", marginBottom: 12 }}>🎉</div><div style={{ fontWeight: 700 }}>All approvals processed!</div></div>}
        </div>
      )}
      {activeTab !== "pending" && (
        <div style={{ textAlign: "center", padding: 80, color: "var(--text3)" }}>
          <div style={{ fontSize: "3rem", marginBottom: 12 }}>🍽️</div>
          <div style={{ fontWeight: 700, fontSize: "1rem" }}>Switch to Pending tab to see restaurants awaiting approval</div>
        </div>
      )}
    </div>
  );
}


/* ═══════════════════════════════════════════════════
   ADMIN REPORTS — BarChart, donut SVG, KPI cards
═══════════════════════════════════════════════════ */
function AdminReports({ showToast }) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const revData = [28,38,32,48,44,58,69,62,78,86,74,92];

  const kpis = [
    { num: "₹48.6L", label: "Total Revenue (30d)",   change: "+22.4% vs last month", w: "82%", clr: "var(--red)" },
    { num: "94,821", label: "Total Orders (30d)",     change: "+18.7% growth",        w: "74%", clr: "var(--orange)" },
    { num: "₹512",   label: "Avg Order Value",        change: "+4.2% increase",       w: "68%", clr: "var(--green)" },
    { num: "4.7★",   label: "Avg Platform Rating",    change: "+0.2 from last month", w: "94%", clr: "var(--teal)" },
  ];

  const topRests = [
    { rank: "1", rankBg: "linear-gradient(135deg,#FFD700,#FFA500)", ini: "PP", iBg: "var(--red)",    name: "Pizza Palace",    cuisine: "Pizza · Italian",    orders: "8,421", rev: "₹42.1L", rating: "4.8", cancel: "2.1%", cancelClr: "var(--green)" },
    { rank: "2", rankBg: "linear-gradient(135deg,#C0C0C0,#A0A0A0)", ini: "BE", iBg: "var(--orange)", name: "Biryani Express", cuisine: "Biryani · Mughlai",  orders: "7,892", rev: "₹38.4L", rating: "4.9", cancel: "1.8%", cancelClr: "var(--green)" },
    { rank: "3", rankBg: "linear-gradient(135deg,#CD7F32,#A0522D)", ini: "BB", iBg: "var(--teal)",   name: "Burger Brothers", cuisine: "Burgers · American", orders: "6,240", rev: "₹29.8L", rating: "4.6", cancel: "3.4%", cancelClr: "var(--orange)" },
    { rank: "4", rankBg: "var(--gray4)",                             ini: "WR", iBg: "#9B5DE5",       name: "Wok & Roll",      cuisine: "Chinese · Thai",     orders: "4,128", rev: "₹18.2L", rating: "4.4", cancel: "4.1%", cancelClr: "var(--orange)" },
    { rank: "5", rankBg: "var(--gray4)",                             ini: "GB", iBg: "var(--green)",  name: "Green Bowl",      cuisine: "Healthy · Salads",   orders: "3,892", rev: "₹14.6L", rating: "4.7", cancel: "2.8%", cancelClr: "var(--green)" },
  ];

  return (
    <div>
      <div className="panel-topbar">
        <div><div className="panel-topbar-title">Reports & Analytics</div><div style={{ fontSize: "0.78rem", color: "var(--text3)" }}>Platform-wide insights and performance metrics</div></div>
        <div className="panel-topbar-right">
          <select style={{ padding: "9px 14px", border: "1.5px solid var(--border)", borderRadius: "var(--radius-full)", fontSize: "0.82rem", fontWeight: 700, background: "var(--gray4)", color: "var(--text2)" }}>
            <option>Last 30 Days</option><option>Last 7 Days</option><option>Last 3 Months</option><option>This Year</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => showToast("Generating PDF report...", "info")}><i className="fa-solid fa-file-pdf"></i> Export PDF</button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid-4 mb-24">
        {kpis.map((k, i) => (
          <div key={i} className={`fade-up-${i}`} style={{ background: "var(--card)", borderRadius: "var(--radius-lg)", padding: 20, border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", gap: 10 }}>
            <div><div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color: k.clr }}>{k.num}</div><div style={{ fontSize: "0.78rem", color: "var(--text3)", fontWeight: 600 }}>{k.label}</div></div>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4, color: "var(--green)" }}><i className="fa-solid fa-arrow-trend-up"></i>{k.change}</div>
            <div className="progress-track"><div className="progress-fill" style={{ width: k.w, background: k.clr }}></div></div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-24">
        {/* Revenue Chart */}
        <div className="card">
          <div className="card-body">
            <div className="section-header mb-16">
              <div><div className="section-title" style={{ fontSize: "1.1rem" }}>Revenue Trend</div><div className="section-subtitle">Monthly comparison</div></div>
            </div>
            <BarChart data={revData} labels={months} height={180} />
            <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 700 }}><div style={{ width: 12, height: 12, borderRadius: 3, background: "linear-gradient(var(--red),var(--orange))" }}></div>This Year</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.75rem", fontWeight: 700, color: "var(--text3)" }}><div style={{ width: 12, height: 12, borderRadius: 3, background: "var(--gray3)" }}></div>Last Year</div>
            </div>
          </div>
        </div>

        {/* Order Distribution Donut */}
        <div className="card">
          <div className="card-body">
            <div className="section-header mb-16"><div className="section-title" style={{ fontSize: "1.1rem" }}>Order Distribution</div></div>
            <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto" }}>
              <svg viewBox="0 0 36 36" width="180" height="180" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--gray4)" strokeWidth="3.5" />
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--red)"    strokeWidth="3.5" strokeDasharray="47 53" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--orange)" strokeWidth="3.5" strokeDasharray="23 77" strokeDashoffset="-47" />
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--teal)"   strokeWidth="3.5" strokeDasharray="14 86" strokeDashoffset="-70" />
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--green)"  strokeWidth="3.5" strokeDasharray="10 90" strokeDashoffset="-84" />
                <circle cx="18" cy="18" r="15.91" fill="none" stroke="var(--yellow)" strokeWidth="3.5" strokeDasharray="6 94"  strokeDashoffset="-94" />
              </svg>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 900 }}>94.8k</div>
                <div style={{ fontSize: "0.68rem", color: "var(--text3)" }}>Total Orders</div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
              {[["var(--red)","Pizza","47% · 44,564"],["var(--orange)","Burgers","23% · 21,809"],["var(--teal)","Biryani","14% · 13,275"],["var(--green)","Chinese","10% · 9,482"],["var(--yellow)","Others","6% · 5,689"]].map(([clr,lbl,val]) => (
                <div key={lbl} className="flex justify-between items-center">
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", fontWeight: 700 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: clr }}></div>{lbl}</div>
                  <span style={{ fontSize: "0.82rem" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Restaurants Table */}
      <div className="card mb-24">
        <div className="card-body">
          <div className="section-header mb-16"><div className="section-title" style={{ fontSize: "1.1rem" }}>🏆 Top Performing Restaurants</div></div>
          <table className="data-table">
            <thead><tr><th>Rank</th><th>Restaurant</th><th>Cuisine</th><th>Orders</th><th>Revenue</th><th>Avg Rating</th><th>Cancellation</th></tr></thead>
            <tbody>
              {topRests.map(r => (
                <tr key={r.name}>
                  <td><div style={{ width: 28, height: 28, background: r.rankBg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 900, color: "#fff" }}>{r.rank}</div></td>
                  <td><div className="user-cell"><div className="user-initials" style={{ background: r.iBg, width: 32, height: 32, fontSize: "0.72rem" }}>{r.ini}</div><strong>{r.name}</strong></div></td>
                  <td style={{ fontSize: "0.82rem" }}>{r.cuisine}</td>
                  <td style={{ fontWeight: 800 }}>{r.orders}</td>
                  <td style={{ fontWeight: 800, color: "var(--green)" }}>{r.rev}</td>
                  <td><span className="rating" style={{ fontSize: "0.78rem", padding: "3px 8px" }}>⭐ {r.rating}</span></td>
                  <td style={{ color: r.cancelClr, fontWeight: 700 }}>{r.cancel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-3">
        {[
          { title: "👤 User Growth", rows: [["+1,842","New users this month","var(--green)"],["6,241","Monthly Active Users",""],["3.2%","Churn Rate","var(--orange)"],["4.8","Avg Sessions/User",""]] },
          { title: "💰 Revenue Breakdown", rows: [["₹8.75L","Commission (18%)","var(--red)"],["₹3.21L","Delivery Fees",""],["₹1.42L","Ad Revenue",""],["−₹0.84L","Refunds Issued","var(--red)"]] },
          { title: "⚡ Operations", rows: [["27 min","Avg Delivery Time",""],["89.4%","On-time Delivery","var(--green)"],["142","Support Tickets","var(--orange)"],["94%","Resolved (24h)","var(--green)"]] },
        ].map(card => (
          <div key={card.title} className="card">
            <div className="card-body">
              <div className="section-title" style={{ fontSize: "1rem", marginBottom: 14 }}>{card.title}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {card.rows.map(([val, lbl, clr]) => (
                  <div key={lbl} className="flex justify-between">
                    <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>{lbl}</span>
                    <strong style={{ color: clr || "var(--text)" }}>{val}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════
   ADMIN PORTAL SHELL
═══════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════
   ADMIN PORTAL SHELL
   Lifts state up, handles mobile toggle & URL sync
═══════════════════════════════════════════════════ */
export default function AdminPortal({ onSignOut, user, token }) {
  const { toasts, show } = useToast();
  const API_BASE = "/api/admin";
  
  // URL Sync for sub-pages
  const [page, setPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("sub") || "dashboard";
  });
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // SHARED STATE (LIFTED UP)
  const [pendingRests, setPendingRests] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalRestaurants: 0, pendingRestaurants: 0, totalOrders: 0, revenue: "₹0" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Fetching admin data...");
        const [sRes, rRes, uRes, oRes] = await Promise.all([
          fetch(`${API_BASE}/stats`).then(r => r.json()),
          fetch(`${API_BASE}/restaurants?status=pending`).then(r => r.json()),
          fetch(`${API_BASE}/users`).then(r => r.json()),
          fetch(`${API_BASE}/orders`).then(r => r.json())
        ]);
        
        console.log("Admin Data Received:", { sRes, rRes, uRes, oRes });

        if (sRes) setStats(sRes);
        
        if (Array.isArray(rRes)) {
          setPendingRests(rRes.map(r => ({
            id: r._id || Math.random(),
            name: r.name || "Unnamed",
            emoji: r.emoji || "🍴",
            sub: (r.cuisine || "Cuisine") + " · " + (r.location || ""),
            owner: r.ownerName || "Unknown",
            phone: r.phone || "No phone",
            age: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "New",
            fssai: r.fssaiStatus || "Pending",
            fssaiClr: r.fssaiStatus === 'Verified' ? 'var(--green)' : 'var(--orange)',
            headerImg: r.image || ""
          })));
        }

        if (Array.isArray(uRes)) {
          setUsersData(uRes.map(u => ({
            id: u._id || Math.random(),
            ini: u.initials || (u.name ? u.name.charAt(0) : "?"),
            bg: u.avatarBg || "var(--gray2)",
            name: u.name || "Unknown User",
            email: u.email || "",
            phone: u.phone || "",
            orders: u.totalOrders || 0,
            spent: u.totalSpent || "₹0",
            joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Unknown",
            status: u.status || "Active",
            sBadge: u.status === 'Active' ? 'badge-green' : 'badge-yellow',
            actions: [
              {lbl:"View Profile",ico:"fa-eye",fn:"info"},
              {lbl:"Send Email",ico:"fa-envelope",fn:"success"},
              {lbl:"Suspend",ico:"fa-ban",fn:"error",danger:true}
            ]
          })));
        }

        if (Array.isArray(oRes)) {
          setOrdersData(oRes.map(o => ({
            id: o.orderId || "#???",
            initials: o.customer?.initials || "?",
            iBg: o.customer?.avatarBg || "var(--gray2)",
            name: o.customer?.name || "Unknown",
            rest: o.restaurant?.name || "Unknown",
            items: o.items || "0 items",
            amt: o.amount || "₹0",
            pay: o.paymentMethod || "UPI",
            time: o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
            status: o.status || "New",
            sBadge: o.statusBadge || "badge-yellow"
          })));
        }

      } catch (error) {
        console.error("Fetch error:", error);
        show("Failed to fetch data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  const handleNav = (id) => {
    if (id === "logout") { onSignOut(); return; }
    window.history.pushState({ sub: id }, "", `?page=admin&sub=${id}`);
    setPage(id);
    setSidebarOpen(false);
  };

  const handleApproveReject = async (id, action) => {
    try {
      const res = await fetch(`${API_BASE}/restaurants/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action === 'approve' ? 'active' : 'rejected' })
      });
      if (res.ok) {
        setPendingRests(p => p.filter(r => r.id !== id));
        show(action === "approve" ? "Restaurant approved! 🎉" : "Restaurant rejected", action === "approve" ? "success" : "error");
      } else {
        show("Failed to update status", "error");
      }
    } catch (error) {
      show("Network error", "error");
    }
  };

  const renderContent = () => {
    if (loading) return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 20 }}>
        <div style={{ width: 40, height: 40, border: '4px solid var(--border)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <div style={{ fontWeight: 700, color: 'var(--text3)' }}>Loading admin data...</div>
      </div>
    );

    switch(page) {
      case "dashboard":   return <AdminDashboard onNav={handleNav} pending={pendingRests} onAction={handleApproveReject} showToast={show} stats={stats} />;
      case "orders":      return <AdminOrders orders={ordersData} showToast={show} />;
      case "users":       return <AdminUsers users={usersData} showToast={show} />;
      case "restaurants": return <AdminRestaurants pending={pendingRests} onAction={handleApproveReject} showToast={show} />;
      case "reports":     return <AdminReports showToast={show} />;
      case "coupons":     return <PlaceholderPage title="Coupon Management" icon="fa-tag" color="var(--red)" />;
      case "security":    return <PlaceholderPage title="System Security" icon="fa-shield-halved" color="var(--teal)" />;
      case "settings":    return <PlaceholderPage title="Admin Settings" icon="fa-gear" color="var(--gray2)" />;
      default:            return <AdminDashboard onNav={handleNav} pending={pendingRests} onAction={handleApproveReject} showToast={show} stats={stats} />;
    }
  };

  return (
    <div className="panel-layout">
      <PanelSidebar
        subtitle="Admin Panel"
        navItems={ADMIN_NAV}
        activeItem={page}
        onNav={handleNav}
        userName={user?.name || "Super Admin"}
        userRole="Full Access"
        userInitials={user?.initials || "AD"}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userAvatarStyle={{ background: "linear-gradient(135deg,#1A1A2E,var(--teal))" }}
      />
      <main className="panel-content">
        {/* Mobile Toggle Bar */}
        <div className="mobile-toggle-btn" onClick={() => setSidebarOpen(true)}>
          <i className="fa-solid fa-bars"></i>
        </div>
        {renderContent()}
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

function PlaceholderPage({ title, icon, color }) {
  return (
    <div className="card fade-up" style={{ padding: 60, textAlign: "center", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 100, height: 100, background: color + "1a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: color, marginBottom: 24 }}>
        <i className={`fa-solid ${icon}`}></i>
      </div>
      <h2 style={{ fontSize: "2rem", marginBottom: 12 }}>{title}</h2>
      <p style={{ color: "var(--text3)", maxWidth: 400 }}>This section is currently under development. Stay tuned for platform updates!</p>
      <button className="btn btn-secondary" style={{ marginTop: 24 }} onClick={() => window.history.back()}>Go Back</button>
    </div>
  );
}

