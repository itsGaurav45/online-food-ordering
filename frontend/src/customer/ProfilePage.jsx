import { useState } from "react";
import { SiteHeader, useToast, ToastContainer } from "../shared/components";

export default function ProfilePage({ onNav, cart, addresses = [], setAddresses, selectedAddrIdx, setSelectedAddrIdx }) {
  // showPane()
  const [activePane, setActivePane] = useState("details");
  // toggleEdit() state
  const [editing, setEditing] = useState(false);
  // togglePref() — food preferences
  const [prefs, setPrefs] = useState({ pizza: true, burger: true, biryani: false, healthy: true, sushi: false, desserts: false });
  // notification toggles
  const [notifs, setNotifs] = useState({ orders: true, promo: true, email: false, sms: true, newRest: false });
  // security toggles
  const [security, setSecurity] = useState({ twoFA: false, loginAlerts: true });
  const { toasts, show } = useToast();

  const currentAddress = addresses[selectedAddrIdx]?.addr?.split(",")[0] || "Gomti Nagar, Lucknow";

  const navItems = [
    { id: "details", icon: "fa-solid fa-user", label: "Personal Details" },
    { id: "addresses", icon: "fa-solid fa-location-dot", label: "Saved Addresses" },
    { id: "payments", icon: "fa-solid fa-credit-card", label: "Payment Methods" },
    { id: "notifications", icon: "fa-solid fa-bell", label: "Notifications" },
    { id: "security", icon: "fa-solid fa-shield-halved", label: "Security" },
    { id: "orders", icon: "fa-solid fa-clock-rotate-left", label: "Order History" },
  ];

  // toggleEdit()
  const toggleEdit = () => setEditing(e => !e);

  // saveProfile(e)
  const saveProfile = (e) => {
    e.preventDefault();
    setEditing(false);
    show("Profile updated successfully!", "success");
  };

  // togglePref(key)
  const togglePref = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const prefItems = [
    { key: "pizza", label: "🍕 Pizza" }, { key: "burger", label: "🍔 Burger" },
    { key: "biryani", label: "🍚 Biryani" }, { key: "healthy", label: "🥗 Healthy" },
    { key: "sushi", label: "🍣 Sushi" }, { key: "desserts", label: "🍰 Desserts" },
  ];

  return (
    <div>
      <SiteHeader cartCount={cart?.length || 0} onNav={onNav} currentAddress={currentAddress} />
      <div className="container">
        <div className="breadcrumb" style={{ paddingTop: 20 }}>
          <a onClick={() => onNav("home")} style={{ cursor: "pointer" }}>Home</a><span className="sep">›</span>
          <span className="current">My Profile</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24, paddingBottom: 48 }}>
          {/* SIDEBAR */}
          <div>
            {/* Hero card */}
            <div style={{ background: "linear-gradient(135deg,var(--red),var(--orange))", borderRadius: "var(--radius-xl)", padding: "28px 20px", textAlign: "center", color: "#fff", marginBottom: 14, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 130, height: 130, background: "rgba(255,255,255,0.1)", borderRadius: "50%" }}></div>
              <div style={{ position: "relative", display: "inline-block", marginBottom: 14 }}>
                <div style={{ width: 84, height: 84, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "#fff", border: "4px solid rgba(255,255,255,0.5)", margin: "0 auto" }}>A</div>
                <div style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--red)", fontSize: 12, boxShadow: "var(--shadow)" }}>
                  <i className="fa-solid fa-camera"></i>
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 900, marginBottom: 4 }}>Arjun Sharma</div>
              <div style={{ fontSize: "0.78rem", opacity: 0.85, marginBottom: 10 }}>arjun@example.com</div>
              <div style={{ display: "flex", justifyContent: "space-around", background: "rgba(255,255,255,0.15)", borderRadius: "var(--radius)", padding: 12 }}>
                {[["24", "Orders"], ["₹8.4k", "Spent"], ["2", "Addresses"]].map(([v, l]) => (
                  <div key={l} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 900 }}>{v}</div>
                    <div style={{ fontSize: "0.68rem", opacity: 0.8 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
              {navItems.map((item, i) => (
                <div key={item.id}
                  onClick={() => item.id === "orders" ? onNav("orders") : setActivePane(item.id)}  /* showPane() */
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", transition: "all var(--transition)", borderBottom: i < navItems.length - 1 ? "1px solid var(--border)" : "none", background: activePane === item.id ? "var(--red-light)" : "transparent", color: activePane === item.id ? "var(--red)" : "var(--text2)" }}>
                  <i className={item.icon} style={{ width: 18, textAlign: "center", fontSize: 14 }}></i>
                  {item.label}
                  <i className="fa-solid fa-chevron-right" style={{ marginLeft: "auto", fontSize: 11, color: "var(--gray3)" }}></i>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", transition: "all var(--transition)", color: "var(--red)" }}
                onClick={() => show("Logged out successfully", "info")}>
                <i className="fa-solid fa-right-from-bracket" style={{ width: 18, textAlign: "center", fontSize: 14 }}></i> Logout
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div>

            {/* ── PERSONAL DETAILS ── */}
            {activePane === "details" && (
              <>
                <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden", marginBottom: 16 }}>
                  <div style={{ padding: "16px 22px", background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}><i className="fa-solid fa-user" style={{ color: "var(--red)" }}></i> Personal Details</div>
                    <button className="btn btn-secondary btn-sm" onClick={toggleEdit}>   {/* toggleEdit() */}
                      <i className={`fa-solid ${editing ? "fa-xmark" : "fa-pen"}`}></i> {editing ? "Cancel" : "Edit"}
                    </button>
                  </div>
                  <div style={{ padding: 22 }}>
                    <form onSubmit={saveProfile}>  {/* saveProfile() */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        {[["First Name", "Arjun", "text"], ["Last Name", "Sharma", "text"]].map(([lbl, val, t]) => (
                          <div key={lbl} className="form-group">
                            <label className="form-label">{lbl}</label>
                            <div className="input-wrap"><i className="fa-solid fa-user input-icon"></i><input type={t} className="form-input" defaultValue={val} disabled={!editing} /></div>
                          </div>
                        ))}
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div className="input-wrap"><i className="fa-solid fa-envelope input-icon"></i><input type="email" className="form-input" defaultValue="arjun@example.com" disabled={!editing} /></div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                        <div className="form-group"><label className="form-label">Mobile Number</label><div className="input-wrap"><i className="fa-solid fa-phone input-icon"></i><input className="form-input" defaultValue="+91 9876543210" disabled={!editing} /></div></div>
                        <div className="form-group"><label className="form-label">Date of Birth</label><div className="input-wrap"><i className="fa-solid fa-cake-candles input-icon"></i><input type="date" className="form-input" defaultValue="1998-07-15" disabled={!editing} /></div></div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Gender</label>
                        <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                          {["Male", "Female", "Other"].map(g => (
                            <label key={g} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                              <input type="radio" name="gender" value={g.toLowerCase()} defaultChecked={g === "Male"} style={{ accentColor: "var(--red)" }} disabled={!editing} /> {g}
                            </label>
                          ))}
                        </div>
                      </div>
                      {editing && <button type="submit" className="btn btn-primary">Save Changes <i className="fa-solid fa-check"></i></button>}
                    </form>
                  </div>
                </div>

                {/* Food Preferences */}
                <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
                  <div style={{ padding: "16px 22px", background: "var(--bg2)", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}><i className="fa-solid fa-utensils" style={{ color: "var(--orange)" }}></i> Food Preferences</div>
                  </div>
                  <div style={{ padding: 22 }}>
                    <div style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: 14 }}>Personalise your recommendations:</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {prefItems.map(({ key, label }) => (
                        // togglePref()
                        <div key={key} onClick={() => togglePref(key)}
                          style={{ padding: "8px 16px", background: prefs[key] ? "var(--red-light)" : "var(--gray4)", border: `1.5px solid ${prefs[key] ? "var(--red)" : "transparent"}`, color: prefs[key] ? "var(--red)" : "var(--text2)", borderRadius: "var(--radius-full)", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", transition: "all var(--transition)" }}>
                          {label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ── ADDRESSES ── */}
            {activePane === "addresses" && (
              <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}><i className="fa-solid fa-location-dot" style={{ color: "var(--red)" }}></i> Saved Addresses</div>
                  <button className="btn btn-primary btn-sm" onClick={() => show("Add address form opened", "info")}><i className="fa-solid fa-plus"></i> Add New</button>
                </div>
                <div style={{ padding: 22 }}>
                  {addresses.map((a, i) => (
                    <div key={i} onClick={() => setSelectedAddrIdx(i)}
                      style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: 16, border: `1.5px solid ${selectedAddrIdx === i ? "var(--red)" : "var(--border)"}`, borderRadius: "var(--radius-lg)", marginBottom: 10, transition: "all var(--transition)", cursor: "pointer", background: selectedAddrIdx === i ? "var(--red-light)" : "transparent" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0, background: "var(--red-light)" }}>{a.emoji || "📍"}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                          <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 900 }}>{a.label}</div>
                          {selectedAddrIdx === i && <span className="badge badge-red" style={{ fontSize: "0.65rem" }}>Default</span>}
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text2)", lineHeight: 1.5 }}>{a.addr}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text3)", marginTop: 4 }}>{a.contact || "Arjun Sharma · 9876543210"}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={(e) => { e.stopPropagation(); show("Edit address", "info"); }}><i className="fa-solid fa-pen"></i></button>
                        <button className="btn btn-danger btn-sm" onClick={(e) => { e.stopPropagation(); setAddresses(prev => prev.filter((_, idx) => idx !== i)); show("Address removed", "info"); }}><i className="fa-solid fa-trash"></i></button>
                      </div>
                    </div>
                  ))}
                  {addresses.length === 0 && <div style={{ textAlign: "center", padding: 20, color: "var(--text3)" }}>No addresses saved.</div>}
                </div>
              </div>
            )}

            {/* ── PAYMENTS ── */}
            {activePane === "payments" && (
              <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", background: "var(--bg2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}><i className="fa-solid fa-credit-card" style={{ color: "var(--red)" }}></i> Payment Methods</div>
                  <button className="btn btn-primary btn-sm"><i className="fa-solid fa-plus"></i> Add</button>
                </div>
                <div style={{ padding: 22 }}>
                  {[{ icon: <div style={{ background: "#1A1A2E", color: "#fff", fontSize: 14, fontWeight: 800 }}>UPI</div>, label: "Google Pay", sub: "arjun@okaxis", badge: "Default" }, { icon: "💳", label: "HDFC Bank", sub: "Visa •••• 4532 · Expires 08/26", del: true }].map((p, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, border: "1.5px solid var(--border)", borderRadius: "var(--radius-lg)", marginBottom: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "var(--radius)", display: "flex", alignItems: "center", justifyContent: "center", background: i === 0 ? "#1A1A2E" : "var(--orange-light)", fontSize: 18 }}>{p.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 900 }}>{p.label}</div>
                        <div style={{ fontSize: "0.82rem", color: "var(--text2)" }}>{p.sub}</div>
                      </div>
                      {p.badge && <span className="badge badge-green">{p.badge}</span>}
                      {p.del && <button className="btn btn-danger btn-sm"><i className="fa-solid fa-trash"></i></button>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activePane === "notifications" && (
              <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", background: "var(--bg2)", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}><i className="fa-solid fa-bell" style={{ color: "var(--red)" }}></i> Notification Preferences</div>
                </div>
                <div style={{ padding: 22 }}>
                  {[["orders", "Order Updates", "Get notified about your order status"], ["promo", "Promotional Offers", "Deals, discounts and special offers"], ["email", "Email Newsletters", "Weekly digest and food stories"], ["sms", "SMS Alerts", "Text messages for orders"], ["newRest", "New Restaurants", "When new eateries open near you"]].map(([key, title, sub]) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <strong style={{ display: "block", fontSize: "0.88rem", fontWeight: 700 }}>{title}</strong>
                        <span style={{ fontSize: "0.78rem", color: "var(--text3)" }}>{sub}</span>
                      </div>
                      <label className="toggle">
                        <input type="checkbox" checked={notifs[key]} onChange={() => setNotifs(p => ({ ...p, [key]: !p[key] }))} />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SECURITY ── */}
            {activePane === "security" && (
              <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", border: "1px solid var(--border)", boxShadow: "var(--shadow)", overflow: "hidden" }}>
                <div style={{ padding: "16px 22px", background: "var(--bg2)", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, display: "flex", alignItems: "center", gap: 8 }}><i className="fa-solid fa-shield-halved" style={{ color: "var(--red)" }}></i> Security Settings</div>
                </div>
                <div style={{ padding: 22 }}>
                  <div className="form-group"><label className="form-label">Current Password</label><div className="input-wrap"><i className="fa-solid fa-lock input-icon"></i><input type="password" className="form-input" placeholder="Enter current password" /></div></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                    <div className="form-group"><label className="form-label">New Password</label><div className="input-wrap"><i className="fa-solid fa-lock input-icon"></i><input type="password" className="form-input" placeholder="New password" /></div></div>
                    <div className="form-group"><label className="form-label">Confirm Password</label><div className="input-wrap"><i className="fa-solid fa-lock input-icon"></i><input type="password" className="form-input" placeholder="Confirm new password" /></div></div>
                  </div>
                  <button className="btn btn-primary mb-24" onClick={() => show("Password updated!", "success")}>Update Password</button>
                  <div style={{ height: 1, background: "var(--border)", margin: "24px 0" }}></div>
                  {[["twoFA", "Two-Factor Authentication", "Add extra security to your account"], ["loginAlerts", "Login Alerts", "Get notified of new logins"]].map(([key, title, sub]) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                      <div>
                        <strong style={{ display: "block", fontSize: "0.88rem", fontWeight: 700 }}>{title}</strong>
                        <span style={{ fontSize: "0.78rem", color: "var(--text3)" }}>{sub}</span>
                      </div>
                      <label className="toggle">
                        <input type="checkbox" checked={security[key]} onChange={() => setSecurity(p => ({ ...p, [key]: !p[key] }))} />
                        <span className="toggle-slider"></span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
