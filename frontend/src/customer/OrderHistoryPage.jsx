import { useState } from "react";
import { SiteHeader, Modal, useToast, ToastContainer } from "../shared/components";

/* Star Rating Component */
function StarRating({ count = 5, value = 0, onChange }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`star${i < value ? " active" : ""}`} onClick={() => onChange && onChange(i + 1)}
          style={{ fontSize: 18, cursor: onChange ? "pointer" : "default", transition: "transform var(--transition)", color: i < value ? "var(--yellow)" : "var(--gray3)" }}>★</span>
      ))}
    </div>
  );
}

export default function OrderHistoryPage({ onNav, cart, newOrders = [], addresses = [], selectedAddrIdx = 0 }) {
  const currentAddress = addresses[selectedAddrIdx]?.addr?.split(",")[0] || "Gomti Nagar, Lucknow";
  // setTab()
  const [activeTab, setActiveTab] = useState("All Orders");
  // openRate(), closeRate()
  const [rateModal, setRateModal] = useState(false);
  // rateModal(n)
  const [rateValue, setRateValue] = useState(0);
  // rate(n) — for biryani inline rating
  const [biryaniRating, setBiryaniRating] = useState(5);
  const { toasts, show } = useToast();

  const tabs = ["All Orders", "Active", "Delivered", "Cancelled"];

  // submitRate()
  const submitRate = () => {
    setRateModal(false);
    show("Review submitted! Thanks 🙏", "success");
  };

  // reorder
  const reorder = () => show("Items added to cart!", "success");

  const orders = [
    ...newOrders,
    {
      id: "#BB2024118", rest: "Pizza Palace", date: "Today, 12:01 PM",
      img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100",
      items: "Margherita Pizza, Pepperoni Feast, Penne Arrabbiata",
      status: "active", statusLabel: "Out for Delivery", badgeCls: "badge-orange",
      total: "₹900", count: 3,
    },
    {
      id: "#BB2024099", rest: "Burger Brothers", date: "Yesterday, 8:22 PM",
      img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=100",
      items: "Classic Double Smash Burger × 2, Cheesy Fries × 1, Chocolate Shake × 2",
      status: "delivered", statusLabel: "✓ Delivered", badgeCls: "badge-green",
      total: "₹748", count: 5,
    },
    {
      id: "#BB2024080", rest: "Biryani Express", date: "Dec 16, 1:15 PM",
      img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=100",
      items: "Chicken Hyderabadi Biryani × 2, Raita, Gulab Jamun",
      status: "delivered", statusLabel: "✓ Delivered", badgeCls: "badge-green",
      total: "₹699", count: 4, showStars: true,
    },
    {
      id: "#BB2024055", rest: "Wok & Roll", date: "Dec 12, 7:45 PM",
      img: null, restEmoji: "🍜",
      items: "Hakka Noodles, Manchurian Gravy, Spring Rolls",
      status: "cancelled", statusLabel: "✕ Cancelled", badgeCls: "badge-red",
      total: "₹389", count: 3, cancelNote: "Cancelled reason: Restaurant unavailable · Full refund processed",
    },
  ];

  const filtered = activeTab === "All Orders" ? orders
    : activeTab === "Active" ? orders.filter(o => o.status === "active")
    : activeTab === "Delivered" ? orders.filter(o => o.status === "delivered")
    : orders.filter(o => o.status === "cancelled");

  return (
    <div>
      <SiteHeader cartCount={cart?.length || 0} onNav={onNav} currentAddress={currentAddress} />
      <div className="container">
        <div className="breadcrumb" style={{ paddingTop: 20 }}>
          <a onClick={() => onNav("home")} style={{ cursor: "pointer" }}>Home</a><span className="sep">›</span>
          <span className="current">My Orders</span>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: 40 }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: 20 }}>My Orders 📋</h1>

          {/* FILTER TABS — setTab() */}
          <div style={{ display: "flex", gap: 4, background: "var(--gray4)", borderRadius: "var(--radius-full)", padding: 4, marginBottom: 24 }}>
            {tabs.map(tab => (
              <div key={tab} onClick={() => setActiveTab(tab)}
                style={{ flex: 1, textAlign: "center", padding: "9px 14px", borderRadius: "var(--radius-full)", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", transition: "all var(--transition)", color: activeTab === tab ? "var(--red)" : "var(--text2)", background: activeTab === tab ? "var(--card)" : "transparent", boxShadow: activeTab === tab ? "var(--shadow-sm)" : "none" }}>
                {tab}
              </div>
            ))}
          </div>

          {/* ORDER CARDS */}
          {filtered.map((order, i) => (
            <div key={order.id} style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden", marginBottom: 16, transition: "all var(--transition)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
                <div style={{ width: 48, height: 48, borderRadius: "var(--radius)", overflow: "hidden", border: "1.5px solid var(--border)", flexShrink: 0, background: "var(--red-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                  {order.img ? <img src={order.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} alt="" /> : order.restEmoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, marginBottom: 2 }}>{order.rest}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{order.date} · Order {order.id}</div>
                </div>
                <span className={`badge ${order.badgeCls}`} style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
                  {order.status === "active" && <i className="fa-solid fa-circle" style={{ fontSize: 8, animation: "pulse 1s infinite", marginRight: 4 }}></i>}
                  {order.statusLabel}
                </span>
              </div>
              <div style={{ padding: "16px 20px" }}>
                <div style={{ fontSize: "0.85rem", color: "var(--text2)", marginBottom: 14 }}>{order.items}</div>
                {order.status === "active" && (
                  <div>
                    <div className="progress-track"><div className="progress-fill progress-red" style={{ width: "75%" }}></div></div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 6 }}>Arriving in ~8 minutes</div>
                  </div>
                )}
                {order.cancelNote && (
                  <div style={{ fontSize: "0.75rem", color: "var(--text3)", background: "var(--gray4)", borderRadius: "var(--radius-sm)", padding: "8px 12px", marginBottom: 12 }}>{order.cancelNote}</div>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 900, color: order.status === "cancelled" ? "var(--text3)" : "var(--text)" }}>
                    {order.total} <span style={{ fontSize: "0.75rem", color: "var(--text3)", fontWeight: 500 }}>· {order.count} items{order.status === "cancelled" ? " · Refunded" : ""}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {order.status === "active" && (
                      <button className="btn btn-primary btn-sm" onClick={() => onNav("tracking")}>
                        <i className="fa-solid fa-location-dot"></i> Track Order
                      </button>
                    )}
                    {order.status === "delivered" && !order.showStars && (
                      <>
                        {/* openRate() */}
                        <div onClick={() => setRateModal(true)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", color: "var(--orange)", fontWeight: 700, cursor: "pointer" }}>
                          <i className="fa-regular fa-star"></i> Rate Order
                        </div>
                        <button className="btn btn-primary btn-sm" onClick={reorder}>
                          <i className="fa-solid fa-rotate-right"></i> Reorder
                        </button>
                      </>
                    )}
                    {order.showStars && (
                      <>
                        {/* rate(n) — inline star rating */}
                        <StarRating value={biryaniRating} onChange={setBiryaniRating} />
                        <button className="btn btn-primary btn-sm" onClick={reorder}>
                          <i className="fa-solid fa-rotate-right"></i> Reorder
                        </button>
                      </>
                    )}
                    {order.status === "cancelled" && (
                      <button className="btn btn-secondary btn-sm" onClick={() => onNav("restaurants")}>Find Similar</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RATE MODAL — openRate(), closeRate(), rateModal(n), submitRate() */}
      <Modal open={rateModal} onClose={() => setRateModal(false)} title="Rate your experience"
        footer={<><button className="btn btn-secondary" onClick={() => setRateModal(false)}>Cancel</button><button className="btn btn-primary" onClick={submitRate}>Submit Review</button></>}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "0.9rem", color: "var(--text2)", marginBottom: 20 }}>How was your order from <strong>Burger Brothers</strong>?</div>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
            {/* rateModal(n) */}
            <StarRating value={rateValue} onChange={setRateValue} />
          </div>
          <textarea className="form-input no-icon" rows={3} placeholder="Tell us what you loved (optional)..." style={{ resize: "none", marginBottom: 0, textAlign: "left" }}></textarea>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
