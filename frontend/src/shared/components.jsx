import { useState, useCallback, useEffect } from "react";




/* ── Toast System ─────────────────────────────────────── */
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, show };
}

export function ToastContainer({ toasts }) {
  const icons = { info: "fa-circle-info", success: "fa-check-circle", error: "fa-circle-xmark" };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast show ${t.type}`}>
          <i className={`fa-solid ${icons[t.type]}`}></i>{t.msg}
        </div>
      ))}
    </div>
  );
}

/* ── Modal ────────────────────────────────────────────── */
export function Modal({ open, onClose, title, children, footer, maxWidth = 480 }) {
  // Close on overlay click
  return (
    <div className={`modal-overlay${open ? " open" : ""}`} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth }}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="modal-close" onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

/* ── Site Header (Customer) ───────────────────────────── */
export function SiteHeader({ cartCount = 3, onNav, page, currentAddress, user }) {
  const initials = user?.initials || (user?.name ? user.name.charAt(0).toUpperCase() : "U");
  const firstName = user?.name?.split(" ")[0] || "Me";

  const [liveLocation, setLiveLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    let watchId;
    if ("geolocation" in navigator) {
      setIsTracking(true);
      watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            if (data && data.display_name) {
               const addr = data.address;
               const shortAddr = [addr.suburb || addr.neighbourhood || addr.road, addr.city || addr.town || addr.village || addr.state].filter(Boolean).join(", ");
               setLiveLocation(shortAddr || data.display_name.split(",").slice(0, 2).join(", "));
            }
          } catch (error) {
            console.error("Error fetching location", error);
          }
        },
        (error) => {
          console.error("Error getting location", error);
          setIsTracking(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const displayAddress = liveLocation ? liveLocation : currentAddress || "Select Address";

  return (
    <header className="site-header">
      <div className="site-logo" style={{ cursor: "pointer" }} onClick={() => onNav("home")}>
        <i className="fa-solid fa-bolt"></i>Bite<span>Bolt</span>
      </div>
      <div className="header-location" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <i className="fa-solid fa-location-dot"></i>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", lineHeight: "1.2" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "200px" }}>{displayAddress}</span>
        </div>
        <i className="fa-solid fa-chevron-down" style={{ fontSize: 10, color: "var(--text3)", alignSelf: 'center' }}></i>
      </div>
      <div className="header-search">
        <div className="header-search-inner">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Search for restaurants or dishes..." />
        </div>
      </div>
      <div className="header-actions">
        <div className="header-icon-btn" onClick={() => onNav("cart")} style={{ cursor: "pointer" }}>
          <i className="fa-solid fa-bag-shopping"></i>
          <span className="header-badge">{cartCount}</span>
        </div>
        <div className="header-icon-btn" onClick={() => onNav("orders")} style={{ cursor: "pointer" }}>
          <i className="fa-regular fa-clock"></i>
        </div>
        <div className="header-user" onClick={() => onNav("profile")} style={{ cursor: "pointer" }}>
          <div className="header-avatar" style={{ background: user?.avatarBg || undefined }}>{initials}</div>{firstName}
        </div>
      </div>
    </header>
  );
}

/* ── Site Footer ──────────────────────────────────────── */
export function SiteFooter({ onNav }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="logo"><i className="fa-solid fa-bolt"></i> Bite<span>Bolt</span></div>
            <p className="footer-desc">Delivering happiness to your doorstep. Fresh, fast, and always on time.</p>
            <div className="social-links" style={{ marginTop: 16 }}>
              <a href="#" className="social-link"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="social-link"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="social-link"><i className="fa-brands fa-twitter"></i></a>
            </div>
          </div>
          <div>
            <div className="footer-heading">Quick Links</div>
            <div className="footer-links">
              <a onClick={() => onNav("home")} style={{ cursor: "pointer" }}>Home</a>
              <a onClick={() => onNav("restaurants")} style={{ cursor: "pointer" }}>Restaurants</a>
              <a onClick={() => onNav("orders")} style={{ cursor: "pointer" }}>My Orders</a>
              <a onClick={() => onNav("profile")} style={{ cursor: "pointer" }}>Profile</a>
            </div>
          </div>
          <div>
            <div className="footer-heading">For Partners</div>
            <div className="footer-links">
              <a onClick={() => onNav("restaurant")} style={{ cursor: "pointer" }}>Restaurant Panel</a>
              <a onClick={() => onNav("admin")} style={{ cursor: "pointer" }}>Admin Panel</a>
            </div>
          </div>
          <div>
            <div className="footer-heading">Help</div>
            <div className="footer-links">
              <a href="#">FAQs</a><a href="#">Contact Us</a>
              <a href="#">Privacy Policy</a><a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 BiteBolt. All rights reserved.</span>
          <span>Made with ❤️ in India</span>
        </div>
      </div>
    </footer>
  );
}

/* ── Panel Sidebar ────────────────────────────────────── */
export function PanelSidebar({ title, subtitle, navItems, activeItem, onNav, userName, userRole, userInitials, userAvatarStyle = {}, isOpen, onClose }) {
  return (
    <>
      <div className={`panel-overlay${isOpen ? " open" : ""}`} onClick={onClose}></div>
      <aside className={`panel-sidebar${isOpen ? " open" : ""}`} id="panelSidebar">
        <div className="panel-sidebar-header">
          <div className="panel-logo"><i className="fa-solid fa-bolt"></i> Bite<span>Bolt</span></div>
          <div className="panel-subtitle">{subtitle}</div>
          {onClose && (
            <button className="panel-close-btn" onClick={onClose}>
              <i className="fa-solid fa-xmark"></i>
            </button>
          )}
        </div>
        <nav className="panel-nav">
          {navItems.map((item, i) =>
            item.type === "section" ? (
              <div key={i} className="nav-section-label" style={{ marginTop: item.mt || 0 }}>{item.label}</div>
            ) : (
              <div
                key={item.id}
                className={`nav-item${activeItem === item.id ? " active" : ""}`}
                onClick={() => { onNav(item.id); onClose && onClose(); }}
              >
                <i className={item.icon}></i>
                {item.label}
                {item.badge && <span className={`nav-badge${item.badgeClass ? " " + item.badgeClass : ""}`}>{item.badge}</span>}
              </div>
            )
          )}
        </nav>
        <div className="panel-user">
          <div className="panel-user-avatar" style={userAvatarStyle}>{userInitials}</div>
          <div>
            <div className="panel-user-name">{userName}</div>
            <div className="panel-user-role">{userRole}</div>
          </div>
        </div>
      </aside>
    </>
  );
}


/* ── Mini Bar Chart ───────────────────────────────────── */
export function BarChart({ data, labels, height = 160, colors }) {
  const maxV = Math.max(...data);
  const COLORS = colors || ["var(--red)", "var(--orange)", "var(--teal)", "var(--green)"];
  return (
    <div>
      <div className="chart-bar-wrap" style={{ height }}>
        {data.map((v, i) => (
          <div key={i} className="chart-bar"
            style={{
              height: (v / maxV * 100) + "%",
              background: `linear-gradient(to top,${COLORS[i % COLORS.length]},${COLORS[(i + 1) % COLORS.length]})`
            }}>
            <div className="bar-tip">₹{v}</div>
          </div>
        ))}
      </div>
      <div className="chart-labels">
        {labels.map((l, i) => <div key={i} className="chart-label">{l}</div>)}
      </div>
    </div>
  );
}
