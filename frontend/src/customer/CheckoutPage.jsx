import { useState } from "react";
import { Modal, useToast, ToastContainer } from "../shared/components";

export default function CheckoutPage({ onNav, cart, addresses, setAddresses, selectedAddrIdx, setSelectedAddrIdx, onComplete, user, token, currentRestaurant }) {
  const subtotal = cart?.reduce((a, i) => a + i.price * i.qty, 0) || 0;
  const discount = subtotal > 500 ? 149 : 0;
  const total = subtotal > 0 ? subtotal - discount + 52 : 0;
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [newAddrLabel, setNewAddrLabel]   = useState("");
  const [newAddrText, setNewAddrText]     = useState("");
  const [selectedDT,   setSelectedDT]     = useState(0);   // selectDT()
  const [payMethod,    setPayMethod]       = useState("upi"); // selectPay()
  const [selectedUPI,  setSelectedUPI]     = useState("gpay"); // selectUPI()
  const [orderPlaced,  setOrderPlaced]     = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [placing, setPlacing]             = useState(false);
  const { toasts, show } = useToast();

  const currentAddress = addresses[selectedAddrIdx]?.addr?.split(",")[0] || "Gomti Nagar, Lucknow";

  const dtOptions = [
    { label: "ASAP", sub: "~22 mins" },
    { label: "12:30 PM", sub: "Scheduled" },
    { label: "1:00 PM", sub: "Scheduled" },
    { label: "1:30 PM", sub: "Scheduled" },
  ];

  const payOptions = [
    { id: "upi", icon: "📱", label: "UPI Payment", sub: "Google Pay, PhonePe, Paytm, BHIM", badge: { text: "Recommended", cls: "badge-green" } },
    { id: "card", icon: "💳", label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
    { id: "netbanking", icon: "🏦", label: "Net Banking", sub: "All major banks" },
    { id: "cod", icon: "💵", label: "Cash on Delivery", sub: "Pay when your order arrives" },
  ];

  const upiApps = [
    { id: "gpay", label: "🟢 Google Pay" },
    { id: "phonepe", label: "🟣 PhonePe" },
    { id: "paytm", label: "🔵 Paytm" },
    { id: "bhim", label: "🟠 BHIM" },
  ];

  // placeOrder() — real API call
  const placeOrder = async () => {
    if (!cart || cart.length === 0) { show("Your cart is empty!", "error"); return; }
    if (!addresses || addresses.length === 0) { show("Please add a delivery address!", "error"); return; }
    setPlacing(true);
    try {
      const restaurantId = cart[0]?.restaurantId;
      if (!restaurantId) {
        // Fallback: no restaurantId yet, create a local order object
        const fallbackOrder = {
          id: "#BB" + Math.floor(100000 + Math.random() * 900000),
          rest: currentRestaurant || "Restaurant",
          date: "Just now",
          items: cart.map(i => i.name).join(", "),
          itemsList: [...cart],
          status: "active", statusLabel: "Out for Delivery", badgeCls: "badge-orange",
          total: `₹${total}`, count: cart.reduce((a, i) => a + i.qty, 0),
          address: addresses[selectedAddrIdx]?.addr
        };
        setPlacedOrderId(fallbackOrder.id);
        setOrderPlaced(true);
        onComplete(fallbackOrder);
        setPlacing(false);
        return;
      }
      const res = await fetch("http://localhost:5001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          restaurant: restaurantId,
          items: cart.map(i => `${i.name} × ${i.qty}`).join(", "),
          itemsList: cart,
          amount: `₹${total}`,
          address: addresses[selectedAddrIdx]?.addr || "Lucknow",
          paymentMethod: payMethod === "cod" ? "COD" : payMethod === "card" ? "Card" : "UPI"
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to place order");
      const newOrder = {
        id: data.orderId, _id: data._id, rest: currentRestaurant || "Restaurant",
        date: "Just now", items: data.items, itemsList: cart,
        status: "active", statusLabel: "Out for Delivery", badgeCls: "badge-orange",
        total: data.amount, count: cart.reduce((a, i) => a + i.qty, 0), address: data.address
      };
      setPlacedOrderId(data.orderId);
      setOrderPlaced(true);
      onComplete(newOrder);
    } catch (err) {
      show(err.message, "error");
    } finally {
      setPlacing(false);
    }
  };

  const SectionCard = ({ step, title, children }) => (
    <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", marginBottom: 16, overflow: "hidden" }}>
      <div style={{ padding: "16px 22px", background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--red)", color: "#fff", fontSize: "0.82rem", fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{step}</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900 }}>{title}</div>
      </div>
      <div style={{ padding: "20px 22px" }}>{children}</div>
    </div>
  );

  return (
    <div>
      <header style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", height: "var(--header-h)", display: "flex", alignItems: "center", padding: "0 28px", gap: 20, position: "sticky", top: 0, zIndex: 100, boxShadow: "var(--shadow-sm)" }}>
        <div className="site-logo" style={{ cursor: "pointer" }} onClick={() => onNav("home")}><i className="fa-solid fa-bolt"></i>Bite<span>Bolt</span></div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "var(--text3)" }}>
          <i className="fa-solid fa-location-dot" style={{ color: "var(--green)" }}></i> {currentAddress}
        </div>
      </header>

      <div className="container">
        <div className="breadcrumb" style={{ paddingTop: 20 }}>
          <a onClick={() => onNav("home")} style={{ cursor: "pointer" }}>Home</a><span className="sep">›</span>
          <a onClick={() => onNav("cart")} style={{ cursor: "pointer" }}>Cart</a><span className="sep">›</span>
          <span className="current">Checkout</span>
        </div>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 24 }}>Checkout</h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, paddingBottom: 40 }}>
          <div>
            {/* Step 1 — Address */}
            <SectionCard step="1" title="Delivery Address">
              {addresses.length === 0 ? (
                <div style={{ fontSize: "0.85rem", color: "var(--text3)", padding: "10px 0", marginBottom: 10 }}>No addresses saved. Please add a new address.</div>
              ) : (
                addresses.map((a, i) => (
                  <label key={i} onClick={() => setSelectedAddrIdx(i)}
                    style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: 14, border: `1.5px solid ${selectedAddrIdx === i ? "var(--red)" : "var(--border)"}`, borderRadius: "var(--radius-lg)", cursor: "pointer", transition: "all var(--transition)", background: selectedAddrIdx === i ? "var(--red-light)" : "transparent", marginBottom: 10 }}>
                    <input type="radio" name="addr" checked={selectedAddrIdx === i} onChange={() => setSelectedAddrIdx(i)} style={{ accentColor: "var(--red)", marginTop: 3 }} />
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <strong>{a.label}</strong>
                        {a.tag && <span className="badge badge-red">{a.tag}</span>}
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text2)" }}>{a.addr}</div>
                    </div>
                  </label>
                ))
              )}
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowAddrModal(true)}><i className="fa-solid fa-plus"></i> Add New Address</button>
            </SectionCard>

            {/* Step 2 — Delivery Time */}
            <SectionCard step="2" title="Delivery Time">
              {/* selectDT() */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {dtOptions.map((dt, i) => (
                  <div key={i} onClick={() => setSelectedDT(i)}
                    style={{ textAlign: "center", padding: 10, flex: 1, borderRadius: "var(--radius)", cursor: "pointer", transition: "all var(--transition)", border: `1.5px solid ${selectedDT === i ? "var(--red)" : "var(--border)"}`, background: selectedDT === i ? "var(--red-light)" : "transparent", margin: "0 4px" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 900 }}>{dt.label}</div>
                    <div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>{dt.sub}</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* Step 3 — Payment */}
            <SectionCard step="3" title="Payment Method">
              {payOptions.map(opt => (
                <label key={opt.id} onClick={() => setPayMethod(opt.id)}   /* selectPay() */
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", border: `1.5px solid ${payMethod === opt.id ? "var(--red)" : "var(--border)"}`, borderRadius: "var(--radius-lg)", cursor: "pointer", transition: "all var(--transition)", background: payMethod === opt.id ? "var(--red-light)" : "transparent", marginBottom: 10, position: "relative" }}>
                  <input type="radio" name="pay" checked={payMethod === opt.id} onChange={() => setPayMethod(opt.id)} style={{ accentColor: "var(--red)" }} />
                  <div style={{ fontSize: "1.2rem" }}>{opt.icon}</div>
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700 }}>{opt.label}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{opt.sub}</div>
                  </div>
                  {opt.badge && <span className={`badge ${opt.badge.cls}`} style={{ position: "absolute", right: 14 }}>{opt.badge.text}</span>}
                </label>
              ))}

              {/* UPI Section */}
              {payMethod === "upi" && (
                <div style={{ background: "var(--bg2)", borderRadius: "var(--radius)", padding: 14, marginBottom: 10 }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 700, marginBottom: 10 }}>Select UPI App:</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {/* selectUPI() */}
                    {upiApps.map(app => (
                      <div key={app.id} onClick={() => setSelectedUPI(app.id)}
                        style={{ padding: "8px 16px", border: `1.5px solid ${selectedUPI === app.id ? "var(--red)" : "var(--border)"}`, borderRadius: "var(--radius)", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", transition: "all var(--transition)", background: selectedUPI === app.id ? "var(--red-light)" : "var(--card)", color: selectedUPI === app.id ? "var(--red)" : "var(--text2)", display: "flex", alignItems: "center", gap: 6 }}>
                        {app.label}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 12, fontSize: "0.82rem", color: "var(--text3)" }}>Or enter UPI ID manually:</div>
                  <div className="input-wrap" style={{ marginTop: 8 }}>
                    <i className="fa-solid fa-at input-icon"></i>
                    <input type="text" className="form-input" placeholder="yourname@upi" />
                  </div>
                  <div style={{ marginTop: 16, display: "flex", gap: 20, alignItems: "center", background: "#fff", padding: 16, borderRadius: "var(--radius)", border: "1px dashed var(--border)" }}>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=bitebolt@okaxis&pn=BiteBolt" alt="UPI QR" style={{ width: 90, height: 90, borderRadius: 4 }} />
                    <div>
                      <div style={{ fontWeight: 800, marginBottom: 4 }}>Scan to Pay</div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}>Use any UPI app to scan and pay seamlessly.</div>
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>

            {/* Step 4 — Cooking Instructions */}
            <SectionCard step="4" title="Cooking Instructions (Optional)">
              <textarea className="form-input no-icon" rows={3} placeholder="Any special requests? (e.g. less spicy, extra sauce...)" style={{ resize: "none" }}></textarea>
            </SectionCard>
          </div>

          {/* RIGHT — Order Summary */}
          <div>
            <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", position: "sticky", top: "calc(var(--header-h) + 16px)" }}>
              <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900 }}>📋 Order Summary</div>
              </div>
              <div style={{ padding: "16px 22px" }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", marginBottom: 10 }}>Your Items</div>
                {cart && cart.length > 0 ? cart.map(item => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)", fontSize: "0.85rem" }}>
                    <span>{item.name} × {item.qty}</span><span style={{ fontWeight: 700 }}>₹{item.price * item.qty}</span>
                  </div>
                )) : <div style={{ padding: "10px 0", fontSize: "0.85rem", color: "var(--text3)" }}>Your cart is empty.</div>}
                <div className="divider"></div>
                {[["Subtotal", `₹${subtotal}`], discount ? ["Discount (BITE50)", `−₹${discount}`, "var(--green)"] : null, ["Delivery Fee", "FREE", "var(--green)"], ["Taxes & GST", "₹52"]].filter(Boolean).map(([k, v, clr]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", fontSize: "0.88rem" }}>
                    <span style={{ color: "var(--text2)" }}>{k}</span><span style={{ color: clr || "inherit", fontWeight: clr ? 700 : 400 }}>{v}</span>
                  </div>
                ))}
                <div className="divider"></div>
                <div className="flex justify-between items-center mb-16" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 900 }}>
                  <span>Total</span><span style={{ color: "var(--red)" }}>₹{total}</span>
                </div>
                {discount > 0 && (
                  <div style={{ background: "var(--green-light)", borderRadius: "var(--radius)", padding: "10px 14px", fontSize: "0.78rem", fontWeight: 700, color: "#197A32", display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                    <i className="fa-solid fa-piggy-bank"></i> You save ₹{discount + 49} on this order!
                  </div>
                )}
                <button className="btn btn-primary btn-full btn-lg" onClick={placeOrder} disabled={!cart?.length || !addresses?.length || placing}>
                  {placing ? <><i className="fa-solid fa-spinner fa-spin"></i> Placing...</> : <><i className="fa-solid fa-check"></i> Place Order · ₹{total}</>}
                </button>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12, fontSize: "0.72rem", color: "var(--text3)" }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: "var(--green)" }}></i> 100% Secure Payment
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ORDER CONFIRMATION MODAL — placeOrder() */}
      <Modal open={orderPlaced} onClose={() => { setOrderPlaced(false); onNav("tracking"); }} title=""
        footer={
          <>
            <button className="btn btn-primary btn-full btn-lg" onClick={onComplete}>Track Your Order <i className="fa-solid fa-location-dot"></i></button>
            <button className="btn btn-secondary btn-full" style={{ marginTop: 10 }} onClick={() => { setOrderPlaced(false); onNav("home"); }}>Back to Home</button>
          </>
        }>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: 16, animation: "pulse 1s ease infinite" }}>🎉</div>
          <h2 style={{ fontSize: "1.6rem", marginBottom: 8 }}>Order Placed!</h2>
          <p style={{ color: "var(--text2)", marginBottom: 6 }}>Your order <strong>{placedOrderId || "#BB..."}  </strong> has been placed successfully!</p>
          <p style={{ color: "var(--text3)", fontSize: "0.85rem", marginBottom: 24 }}>Estimated delivery: <strong style={{ color: "var(--red)" }}>22-28 minutes</strong></p>
          <div style={{ background: "var(--bg2)", borderRadius: "var(--radius)", padding: 16 }}>
            <div style={{ fontSize: "0.82rem", color: "var(--text3)", marginBottom: 4 }}>Order from</div>
            <div style={{ fontWeight: 800 }}>Pizza Palace</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text3)", marginTop: 8 }}>Delivering to: {addresses[selectedAddrIdx]?.addr}</div>
          </div>
        </div>
      </Modal>

      {/* ADD NEW ADDRESS MODAL */}
      <Modal open={showAddrModal} onClose={() => setShowAddrModal(false)} title="Add New Address"
        footer={
          <button className="btn btn-primary btn-full" onClick={() => {
            if (!newAddrLabel || !newAddrText) {
              show("Please fill out both fields", "error");
              return;
            }
            setAddresses([...addresses, { label: `📍 ${newAddrLabel}`, addr: newAddrText }]);
            setSelectedAddrIdx(addresses.length);
            setShowAddrModal(false);
            setNewAddrLabel("");
            setNewAddrText("");
            show("Address added successfully", "success");
          }}>Save Address</button>
        }>
        <div style={{ padding: "0 10px" }}>
          <div className="input-wrap" style={{ marginBottom: 16 }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 8, display: "block" }}>Save as (e.g., Home, Office)</label>
            <input type="text" className="form-input no-icon" placeholder="Home" value={newAddrLabel} onChange={e => setNewAddrLabel(e.target.value)} />
          </div>
          <div className="input-wrap" style={{ marginBottom: 16 }}>
            <label style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: 8, display: "block" }}>Complete Address</label>
            <textarea className="form-input no-icon" rows={3} placeholder="Enter your full address here..." style={{ resize: "none" }} value={newAddrText} onChange={e => setNewAddrText(e.target.value)}></textarea>
          </div>
        </div>
      </Modal>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
