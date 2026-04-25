import { useState, useEffect } from "react";
import { SiteHeader, useToast, ToastContainer } from "../shared/components";

export default function RestaurantsPage({ onNav, cart, addresses = [], selectedAddrIdx = 0 }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [priceVal, setPriceVal] = useState(500);
  const [page, setPage] = useState(1);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentAddress = addresses[selectedAddrIdx]?.addr?.split(",")[0] || "Gomti Nagar, Lucknow";

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/restaurants');
        const data = await response.json();
        setRestaurants(data.map(r => ({
          ...r,
          img: r.image, // Mapping DB field to component field
          time: r.deliveryTime,
          delivery: r.deliveryFee,
          cost: r.costForTwo
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const chips = ["All", "⭐ Rating 4.0+", "💰 Under ₹200", "⚡ Fast Delivery", "🛵 Free Delivery", "🥦 Pure Veg", "🎉 Offers", "🆕 New"];

  return (
    <div>
      <SiteHeader cartCount={cart?.length || 0} onNav={onNav} currentAddress={currentAddress} />

      {/* FILTER BAR */}
      <div style={{ background: "var(--card)", borderBottom: "1px solid var(--border)", padding: "14px 0", position: "sticky", top: "var(--header-h)", zIndex: 90, boxShadow: "var(--shadow-sm)" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 10, overflowX: "auto", paddingBottom: 2 }}>
            {chips.map(chip => (
              <div key={chip} className={`filter-chip${activeFilter === chip ? " active" : ""}`}
                onClick={() => setActiveFilter(chip)}>  {/* toggleFilter() */}
                {chip}
              </div>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: "var(--radius-full)", background: "var(--gray4)", border: "1.5px solid var(--border)", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", color: "var(--text2)", whiteSpace: "nowrap" }}>
              <i className="fa-solid fa-arrow-up-wide-short"></i> Relevance <i className="fa-solid fa-chevron-down" style={{ fontSize: 10 }}></i>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="breadcrumb" style={{ paddingTop: 20 }}>
          <a onClick={() => onNav("home")} style={{ cursor: "pointer" }}>Home</a><span className="sep">›</span><span className="current">Restaurants</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, padding: "28px 0" }}>

          {/* SIDEBAR FILTERS */}
          <aside>
            {/* Cuisine */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)", marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 800, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                Filters <span style={{ fontSize: "0.72rem", color: "var(--red)", cursor: "pointer", fontWeight: 700 }}>Clear All</span>
              </div>
              <div style={{ fontSize: "0.82rem", fontWeight: 800, marginBottom: 8, color: "var(--text2)" }}>Cuisine</div>
              {["🍕 Pizza", "🍔 Burger", "🍚 Biryani", "🥡 Chinese", "🍣 Sushi", "🥗 Salads"].map((c, i) => (
                <label key={c} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 5 ? "1px solid var(--border)" : "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: "var(--text2)", transition: "color var(--transition)" }}>
                  <input type="checkbox" defaultChecked={i === 0} style={{ accentColor: "var(--red)" }} /> {c}
                </label>
              ))}
            </div>

            {/* Rating */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)", marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 800, marginBottom: 14 }}>Rating</div>
              {["Any Rating", "⭐ 4.0+", "⭐ 4.5+", "⭐ 4.8+"].map((r, i) => (
                <label key={r} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                  <input type="radio" name="rating" defaultChecked={i === 1} style={{ accentColor: "var(--red)" }} /> {r}
                </label>
              ))}
            </div>

            {/* Price Range — oninput */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)", marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 800, marginBottom: 14 }}>Price Range</div>
              <input type="range" min="0" max="1000" value={priceVal}
                onChange={e => setPriceVal(e.target.value)}  /* oninput → onChange */
                style={{ width: "100%", accentColor: "var(--red)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", fontWeight: 700, color: "var(--text3)", marginTop: 6 }}>
                <span>₹0</span><span style={{ color: "var(--text)", fontWeight: 800 }}>₹{priceVal}</span><span>₹1000</span>
              </div>
            </div>

            {/* Delivery Time */}
            <div style={{ background: "var(--card)", borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 800, marginBottom: 14 }}>Delivery Time</div>
              {["⚡ Under 20 min", "🕐 Under 30 min", "🕑 Under 45 min"].map((t, i) => (
                <label key={t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }}>
                  <input type="checkbox" defaultChecked={i === 0} style={{ accentColor: "var(--red)" }} /> {t}
                </label>
              ))}
            </div>
          </aside>

          {/* RESULTS */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: "0.88rem", color: "var(--text3)" }}>Showing <strong style={{ color: "var(--text)" }}>24</strong> restaurants near you</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text3)" }}><i className="fa-solid fa-location-dot" style={{ color: "var(--red)" }}></i> {currentAddress}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18 }}>
              {loading ? (
                <div style={{ gridColumn: "1/-1", padding: 40, textAlign: "center", fontSize: "1.2rem", fontWeight: 700, color: "var(--text3)" }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 10 }}></i> Loading restaurants...
                </div>
              ) : (
                restaurants.map((r, i) => (
                <div key={i} className={`rest-card${r.closed ? " rest-closed" : ""}`} onClick={() => onNav("menu", { restaurant: r.name })}>
                  <div className="rest-card-img">
                    <img src={r.img} onError={e => { e.target.src = "https://placehold.co/400x190/FFEBE0/E63946?text=🍕"; }} alt={r.name} />
                    {r.discount && <span style={{ position: "absolute", top: 10, left: 10, background: "var(--red)", color: "#fff", fontSize: "0.72rem", fontWeight: 800, padding: "4px 10px", borderRadius: "var(--radius-full)" }}>{r.discount}</span>}
                    {r.badge && <span className="badge badge-green" style={{ position: "absolute", top: 10, left: 10 }}>{r.badge}</span>}
                    {r.promo && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top,rgba(0,0,0,0.8),transparent)", padding: "16px 10px 8px", color: "#fff", fontSize: "0.75rem", fontWeight: 700 }}>{r.promo}</div>}
                    {r.closed && <span className="rest-closed-tag">{r.closed}</span>}
                  </div>
                  <div className="rest-card-body">
                    <div className="flex justify-between items-center mb-4"><div className="rest-card-name">{r.name}</div><span className="rating">⭐ {r.rating}</span></div>
                    <div className="rest-card-cuisine">{r.cuisine}</div>
                    <div className="rest-card-meta">
                      <span className="rest-meta-item"><i className="fa-solid fa-clock"></i>{r.time} min</span>
                      <span className="rest-meta-item"><i className="fa-solid fa-motorcycle"></i>{r.delivery}</span>
                      <span className="rest-meta-item"><i className="fa-solid fa-indian-rupee-sign"></i>{r.cost}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <div className="page-btn"><i className="fa-solid fa-chevron-left"></i></div>
              {[1, 2, 3, "...", 12].map((p, i) => (
                <div key={i} className={`page-btn${page === p ? " active" : ""}`} onClick={() => typeof p === "number" && setPage(p)}>{p}</div>
              ))}
              <div className="page-btn"><i className="fa-solid fa-chevron-right"></i></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
