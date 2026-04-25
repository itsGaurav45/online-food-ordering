import { useState } from "react";
import { SiteHeader, useToast, ToastContainer } from "../shared/components";

const VALID_COUPONS = ["BITE50", "FREEDEL", "NEWUSER", "FLAT100"];

export default function CartPage({ onNav, cart: items, setCart: setItems, addresses, selectedAddrIdx, setSelectedAddrIdx }) {
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const { toasts, show } = useToast();

  const currentAddress = addresses[selectedAddrIdx]?.addr?.split(",")[0] || "Gomti Nagar, Lucknow";

  // changeQty(id, delta, basePrice)
  const changeQty = (id, d) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  };

  // removeItem(id)
  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
    show("Item removed", "info");
  };

  // applyCoupon()
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (VALID_COUPONS.includes(code)) {
      setCouponApplied(true);
      show(`Coupon ${code} applied!`, "success");
    } else {
      show("Invalid coupon code", "error");
    }
  };

  const subtotal = items.reduce((a, i) => a + i.price * i.qty, 0);
  const discount = couponApplied ? 149 : 0;
  const total = subtotal - discount + 52;

  return (
    <div>
      <SiteHeader cartCount={items.length} onNav={onNav} currentAddress={currentAddress} />
      <div className="container">
        <div className="breadcrumb" style={{ paddingTop: 20 }}>
          <a onClick={() => onNav("home")} style={{ cursor: "pointer" }}>Home</a><span className="sep">›</span>
          <a onClick={() => onNav("menu")} style={{ cursor: "pointer" }}>Pizza Palace</a><span className="sep">›</span>
          <span className="current">Cart</span>
        </div>
        <h1 style={{ fontSize: "1.8rem", marginBottom: 24 }}>🛒 Your Cart <span style={{ fontSize: "1rem", color: "var(--text3)", fontWeight: 600 }}>({items.length} items)</span></h1>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", marginBottom: 40 }}>
            <div style={{ fontSize: "5rem", marginBottom: 16 }}>🛒</div>
            <h2 style={{ fontSize: "1.6rem", fontWeight: 900, marginBottom: 8 }}>Your cart is empty!</h2>
            <p style={{ color: "var(--text3)", marginBottom: 28, fontSize: "0.95rem" }}>Add items from a restaurant to get started.</p>
            <button className="btn btn-primary btn-lg" onClick={() => onNav("restaurants")}>
              <i className="fa-solid fa-utensils"></i> Browse Restaurants
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24, paddingBottom: 40 }}>
            {/* LEFT */}
            <div>
            {/* Items */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow)", marginBottom: 16 }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg2)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}><span>🍕</span> Pizza Palace</div>
                <a onClick={() => onNav("menu")} style={{ fontSize: "0.78rem", color: "var(--red)", fontWeight: 700, cursor: "pointer" }}><i className="fa-solid fa-plus"></i> Add more items</a>
              </div>
              {items.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 22px", borderBottom: "1px solid var(--border)", transition: "background var(--transition)" }}>
                  <div style={{ width: 72, height: 60, borderRadius: "var(--radius)", overflow: "hidden", flexShrink: 0 }}>
                    <img src={item.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.src = "https://placehold.co/72x60/FFEBE0/E63946?text=🍕"; }} alt={item.name} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 800, marginBottom: 3 }}>{item.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{item.subtitle}</div>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
                    {/* changeQty */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--gray4)", borderRadius: "var(--radius-full)", padding: 4 }}>
                      <button onClick={() => changeQty(item.id, -1)} style={{ width: 30, height: 30, borderRadius: "50%", background: "#fff", border: "1.5px solid var(--red)", color: "var(--red)", fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all var(--transition)" }}>−</button>
                      <span style={{ fontSize: "0.9rem", fontWeight: 800, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => changeQty(item.id, 1)} style={{ width: 30, height: 30, borderRadius: "50%", background: "#fff", border: "1.5px solid var(--red)", color: "var(--red)", fontSize: 16, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 900, color: "var(--red)", minWidth: 70, textAlign: "right" }}>₹{item.price * item.qty}</div>
                    {/* removeItem */}
                    <button onClick={() => removeItem(item.id)} style={{ color: "var(--gray2)", fontSize: 14, cursor: "pointer", background: "none", border: "none", padding: 4, transition: "color var(--transition)" }}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow)", marginBottom: 16 }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}><i className="fa-solid fa-tag" style={{ color: "var(--orange)" }}></i> Coupons & Offers</div>
              </div>
              <div style={{ padding: "18px 22px", display: "flex", gap: 10 }}>
                <input type="text" value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  style={{ flex: 1, padding: "12px 16px", background: "var(--gray4)", border: "1.5px solid transparent", borderRadius: "var(--radius)", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.05em", transition: "all var(--transition)" }} />
                <button className="btn btn-orange" onClick={applyCoupon}>Apply</button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "0 22px 16px" }}>
                {/* setCoupon() */}
                {VALID_COUPONS.map(code => (
                  <div key={code} onClick={() => setCouponInput(code)}
                    style={{ padding: "6px 14px", border: "1.5px dashed var(--border)", borderRadius: "var(--radius-full)", fontSize: "0.75rem", fontWeight: 800, cursor: "pointer", color: "var(--text2)", transition: "all var(--transition)", letterSpacing: "0.05em" }}>
                    {code}
                  </div>
                ))}
              </div>
              {couponApplied && (
                <div style={{ margin: "0 22px 16px", background: "var(--green-light)", border: "1px solid rgba(45,198,83,0.3)", borderRadius: "var(--radius)", padding: "10px 16px", fontSize: "0.82rem", fontWeight: 700, color: "#197A32", display: "flex", alignItems: "center", gap: 8 }}>
                  <i className="fa-solid fa-check-circle"></i> BITE50 applied — You save ₹149!
                </div>
              )}
            </div>

            {/* Delivery Address */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow)" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}><i className="fa-solid fa-location-dot" style={{ color: "var(--red)" }}></i> Delivery Address</div>
                <a onClick={(e) => { e.preventDefault(); onNav("checkout"); }} style={{ fontSize: "0.78rem", color: "var(--red)", fontWeight: 700, cursor: "pointer" }}>+ Add New</a>
              </div>
              <div style={{ padding: "16px 22px", display: "flex", flexDirection: "column", gap: 12 }}>
                {addresses.length === 0 ? (
                  <div style={{ fontSize: "0.85rem", color: "var(--text3)", padding: "10px 0" }}>No addresses saved. Proceed to checkout to add one.</div>
                ) : (
                  addresses.map((a, index) => (
                    <label key={index} onClick={() => setSelectedAddrIdx(index)}
                      style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: 16, border: `1.5px solid ${selectedAddrIdx === index ? "var(--red)" : "var(--border)"}`, borderRadius: "var(--radius-lg)", cursor: "pointer", transition: "all var(--transition)", background: selectedAddrIdx === index ? "var(--red-light)" : "transparent" }}>
                      <input type="radio" name="addr" checked={selectedAddrIdx === index} onChange={() => setSelectedAddrIdx(index)} style={{ accentColor: "var(--red)", marginTop: 3 }} />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <strong>{a.label}</strong>
                          {a.tag && <span style={{ background: "var(--red-light)", color: "var(--red)", fontSize: "0.7rem", fontWeight: 800, padding: "2px 8px", borderRadius: "var(--radius-full)" }}>{a.tag}</span>}
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text2)" }}>{a.addr}</div>
                        {a.contact && <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 3 }}>{a.contact}</div>}
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Bill Summary */}
          <div>
            <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", overflow: "hidden", boxShadow: "var(--shadow)", position: "sticky", top: "calc(var(--header-h) + 16px)" }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border)", background: "var(--bg2)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900 }}>💰 Bill Summary</div>
              </div>
              <div style={{ padding: "16px 22px" }}>
                <div style={{ background: "linear-gradient(135deg,var(--green-light),#B8F5CF)", border: "1px solid rgba(45,198,83,0.3)", borderRadius: "var(--radius)", padding: "12px 16px", fontSize: "0.82rem", fontWeight: 700, color: "#197A32", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <i className="fa-solid fa-piggy-bank"></i> You're saving ₹{discount + 49} on this order!
                </div>
                {[["Item Total", `₹${subtotal}`], couponApplied ? ["Discount (BITE50)", "− ₹149"] : null, ["Delivery Fee", "FREE"], ["GST & Charges", "₹52"]].filter(Boolean).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", fontSize: "0.88rem", color: k.startsWith("Discount") ? "var(--green)" : "var(--text2)" }}><span>{k}</span><span style={{ color: k.startsWith("Discount") ? "var(--green)" : "inherit" }}>{v}</span></div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 10px", fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 900, borderTop: "2px solid var(--border)", marginTop: 6 }}>
                  <span>To Pay</span><span style={{ color: "var(--red)" }}>₹{total}</span>
                </div>
                <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: 16 }} onClick={() => onNav("checkout")}>
                  Proceed to Checkout <i className="fa-solid fa-arrow-right"></i>
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginTop: 12, fontSize: "0.75rem", color: "var(--text3)" }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: "var(--green)" }}></i> 100% Secure Payment
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
