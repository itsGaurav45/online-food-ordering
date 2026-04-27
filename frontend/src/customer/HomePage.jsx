import { useState, useEffect, useRef } from "react";
import { SiteHeader, SiteFooter, useToast, ToastContainer } from "../shared/components";
import API_URL from "../apiConfig";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600",
    label: "🍔 Juicy Burgers",
    tag: "#1 Bestseller"
  },
  {
    src: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600",
    label: "🍗 Awadhi Biryani",
    tag: "Lucknow Special"
  },
  {
    src: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600",
    label: "🍕 Wood-fired Pizza",
    tag: "Hot & Fresh"
  }
];

export default function HomePage({ onNav, cart, addresses = [], selectedAddrIdx = 0, user }) {
  // filterCat()
  const [activeCat, setActiveCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchRecs, setShowSearchRecs] = useState(false);
  const { toasts, show } = useToast();
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroPrev, setHeroPrev] = useState(null);
  const heroTimer = useRef(null);

  useEffect(() => {
    heroTimer.current = setInterval(() => {
      setHeroPrev(prev => prev);
      setHeroIdx(i => (i + 1) % heroImages.length);
    }, 3200);
    return () => clearInterval(heroTimer.current);
  }, []);

  const currentAddress = addresses[selectedAddrIdx]?.addr?.split(",")[0] || "Gomti Nagar, Lucknow";

  const cats = [
    { id: "all", emoji: "🍽️", name: "All" },
    { id: "pizza", emoji: "🍕", name: "Pizza" },
    { id: "burger", emoji: "🍔", name: "Burger" },
    { id: "biryani", emoji: "🍚", name: "Biryani" },
    { id: "chinese", emoji: "🥡", name: "Chinese" },
    { id: "sushi", emoji: "🍣", name: "Sushi" },
    { id: "desserts", emoji: "🍰", name: "Desserts" },
    { id: "healthy", emoji: "🥗", name: "Healthy" },
  ];

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`${API_URL}/api/restaurants`);
        const data = await response.json();
        setRestaurants(data.map(r => ({
          ...r,
          img: r.image,
          time: r.deliveryTime + " min",
          delivery: r.deliveryFee === "Free" ? "Free delivery" : "₹" + r.deliveryFee + " delivery",
          cost: "₹" + r.costForTwo
        })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const searchResults = restaurants.filter(r => 
    r.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.cuisine?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRestaurants = activeCat === "all" ? restaurants : restaurants.filter(r => r.cuisine?.toLowerCase().includes(activeCat.toLowerCase()));

  return (
    <div>
      <SiteHeader cartCount={cart?.length || 0} onNav={onNav} currentAddress={currentAddress} user={user} />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg,#FFF5EE 0%,#FFEBE0 50%,#FFF0F0 100%)", padding: "60px 0 0", overflow: "hidden", position: "relative" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}>
            <div className="fade-up">
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--red-light)", color: "var(--red)", padding: "6px 14px", borderRadius: "var(--radius-full)", fontSize: "0.78rem", fontWeight: 800, marginBottom: 18 }}>
                <i className="fa-solid fa-fire"></i> 500+ Restaurants Near You
              </div>
              <h1 style={{ fontSize: "clamp(2.4rem,5vw,3.6rem)", fontWeight: 900, lineHeight: 1.12, marginBottom: 18 }}>
                Order Food<br />You <span style={{ color: "var(--red)" }}>Love</span>, Fast
              </h1>
              <p style={{ fontSize: "1rem", color: "var(--text2)", marginBottom: 28, maxWidth: 420 }}>
                From biryani to burgers — get your favourite meals delivered fresh to your doorstep in 30 minutes.
              </p>
              <form className="flex gap-8" style={{ position: "relative", background: "#fff", borderRadius: "var(--radius-full)", padding: "6px 6px 6px 20px", boxShadow: "var(--shadow-lg)", maxWidth: 480, border: "1.5px solid var(--border)", zIndex: 10 }} onSubmit={e => { e.preventDefault(); onNav("restaurants"); }}>
                <i className="fa-solid fa-magnifying-glass" style={{ color: "var(--red)", alignSelf: "center" }}></i>
                <input type="text" placeholder="Search restaurant, dish, cuisine..." style={{ flex: 1, fontSize: "0.9rem", background: "none", border: "none", outline: "none" }} value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setShowSearchRecs(true); }} onFocus={() => setShowSearchRecs(true)} onBlur={() => setTimeout(() => setShowSearchRecs(false), 200)} />
                <button type="submit" className="btn btn-primary">Search</button>
                {showSearchRecs && searchQuery.trim().length > 0 && (
                  <div style={{ position: "absolute", top: "110%", left: 0, right: 0, background: "#fff", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-lg)", overflow: "hidden", border: "1px solid var(--border)", zIndex: 20 }}>
                    {searchResults.length > 0 ? searchResults.map(r => (
                      <div key={r.name} onClick={() => { setSearchQuery(""); setShowSearchRecs(false); onNav("menu", { restaurant: r.name }); }} style={{ padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = "var(--gray4)"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                        <img src={r.img} style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }} alt="" />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{r.name}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{r.cuisine}</div>
                        </div>
                      </div>
                    )) : (
                      <div style={{ padding: "16px", textAlign: "center", fontSize: "0.85rem", color: "var(--text3)" }}>No results found</div>
                    )}
                  </div>
                )}
              </form>
              <div className="flex gap-8" style={{ marginTop: 28, gap: 28 }}>
                {[["500+", "Restaurants"], ["30 min", "Avg Delivery"], ["4.8★", "App Rating"]].map(([num, lbl], i) => (
                  <div key={i}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900 }}>{num}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text3)" }}>{lbl}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="fade-up-2" style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {/* Glowing background orb */}
              <div style={{ position: "absolute", width: 420, height: 420, background: "radial-gradient(circle,rgba(244,132,95,0.2),rgba(230,57,70,0.1),transparent 70%)", borderRadius: "50%", animation: "float 4s ease-in-out infinite" }}></div>

              {/* Image Slider */}
              <div style={{ position: "relative", width: 420, height: 340 }}>
                {heroImages.map((img, i) => (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "var(--radius-xl)",
                      overflow: "hidden",
                      boxShadow: "0 24px 60px rgba(230,57,70,0.22)",
                      transition: "opacity 0.8s cubic-bezier(.4,0,.2,1), transform 0.8s cubic-bezier(.4,0,.2,1)",
                      opacity: i === heroIdx ? 1 : 0,
                      transform: i === heroIdx ? "scale(1) translateY(0)" : "scale(0.95) translateY(12px)",
                      zIndex: i === heroIdx ? 2 : 1,
                      pointerEvents: i === heroIdx ? "auto" : "none"
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.label}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      onError={e => { e.target.src = `https://placehold.co/420x340/FFF5EE/E63946?text=${encodeURIComponent(img.label)}`; }}
                    />
                    {/* Gradient overlay */}
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)" }} />
                    {/* Label */}
                    <div style={{ position: "absolute", bottom: 18, left: 18, right: 18, zIndex: 3 }}>
                      <div style={{ display: "inline-block", background: "var(--yellow)", color: "var(--dark)", fontSize: "0.7rem", fontWeight: 800, padding: "3px 10px", borderRadius: "var(--radius-full)", marginBottom: 6 }}>{img.tag}</div>
                      <div style={{ color: "#fff", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{img.label}</div>
                    </div>
                  </div>
                ))}

                {/* Floating badge top-right */}
                <div style={{
                  position: "absolute", top: -16, right: -16, zIndex: 10,
                  background: "var(--red)", color: "#fff", borderRadius: "50%",
                  width: 72, height: 72, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(230,57,70,0.4)",
                  animation: "float 3s ease-in-out infinite",
                  fontSize: "0.65rem", fontWeight: 900, textAlign: "center", lineHeight: 1.2
                }}>
                  <span style={{ fontSize: "1.1rem" }}>⚡</span>
                  30 MIN<br/>DELIVERY
                </div>

                {/* Dot indicators */}
                <div style={{ position: "absolute", bottom: -28, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8, zIndex: 10 }}>
                  {heroImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setHeroIdx(i); clearInterval(heroTimer.current); }}
                      style={{
                        width: i === heroIdx ? 22 : 8,
                        height: 8, borderRadius: 4, border: "none", cursor: "pointer",
                        background: i === heroIdx ? "var(--red)" : "rgba(230,57,70,0.25)",
                        transition: "all 0.4s ease", padding: 0
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-header fade-up">
            <div><div className="section-title">What are you craving?</div><div className="section-subtitle">Tap to filter by category</div></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 14 }} className="fade-up-1">
            {cats.map(c => (
              <div key={c.id}
                className={`cat-item${activeCat === c.id ? " active" : ""}`}
                onClick={() => setActiveCat(c.id)}  /* filterCat() */
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "18px 12px", background: activeCat === c.id ? "var(--red-light)" : "var(--card)", borderRadius: "var(--radius-lg)", border: `2px solid ${activeCat === c.id ? "var(--red)" : "transparent"}`, cursor: "pointer", transition: "all var(--transition)", textAlign: "center" }}>
                <span style={{ fontSize: "2rem", transition: "transform var(--transition)" }}>{c.emoji}</span>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: activeCat === c.id ? "var(--red)" : "var(--text2)" }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOT DEALS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header fade-up">
            <div><div className="section-title">🔥 Hot Deals</div><div className="section-subtitle">Limited time offers</div></div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNav("restaurants")}>View All</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }} className="fade-up-1">
            <div style={{ borderRadius: "var(--radius-xl)", padding: 28, position: "relative", overflow: "hidden", minHeight: 160, display: "flex", flexDirection: "column", justifyContent: "flex-end", cursor: "pointer", background: "linear-gradient(135deg,#1A1A2E,#2D2D44)" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.65),transparent)" }}></div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "inline-block", background: "var(--yellow)", color: "var(--dark)", fontSize: "0.72rem", fontWeight: 800, padding: "3px 10px", borderRadius: "var(--radius-full)", marginBottom: 6 }}>🎉 MEGA DEAL</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 900, color: "#fff", marginBottom: 4 }}>50% OFF on First Order</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.8)" }}>Use code: <strong>BITE50</strong> · Min order ₹199</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 }}>
              <div style={{ borderRadius: "var(--radius-lg)", padding: 20, background: "linear-gradient(135deg,#F4845F,#E63946)", cursor: "pointer", position: "relative", overflow: "hidden" }}>
                <div style={{ background: "var(--yellow)", display: "inline-block", fontSize: "0.72rem", fontWeight: 800, padding: "3px 10px", borderRadius: "var(--radius-full)", marginBottom: 6, color: "var(--dark)" }}>FREE DELIVERY</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, color: "#fff" }}>On Orders above ₹299</div>
              </div>
              <div style={{ borderRadius: "var(--radius-lg)", padding: 20, background: "linear-gradient(135deg,#FFBE0B,#FF9500)", cursor: "pointer" }}>
                <div style={{ background: "var(--dark)", display: "inline-block", fontSize: "0.72rem", fontWeight: 800, padding: "3px 10px", borderRadius: "var(--radius-full)", marginBottom: 6, color: "#fff" }}>LIMITED TIME</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900, color: "#fff" }}>Buy 1 Get 1 Combo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED RESTAURANTS */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header fade-up">
            <div><div className="section-title">🍽️ Featured Restaurants</div><div className="section-subtitle">Curated picks near you</div></div>
            <button className="btn btn-ghost btn-sm" onClick={() => onNav("restaurants")}>See all 500+</button>
          </div>
          <div className="grid-auto fade-up-1">
            {loading ? (
              <div style={{ gridColumn: "1/-1", padding: 40, textAlign: "center", fontSize: "1.2rem", fontWeight: 700, color: "var(--text3)" }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 10 }}></i> Loading restaurants...
              </div>
            ) : filteredRestaurants.length > 0 ? filteredRestaurants.map((r, i) => (
              <div key={i} className="rest-card" onClick={() => onNav("menu", { restaurant: r.name, location: r.location?.split(",")[0] })}>
                <div className="rest-card-img">
                  <img src={r.img} onError={e => { e.target.src = "https://placehold.co/400x190/FFEBE0/E63946?text=🍕"; }} alt={r.name} />
                  {r.promo && <div className="rest-card-promo">{r.promo}</div>}
                  {r.badge && <span className="badge badge-green" style={{ position: "absolute", top: 10, left: 10 }}>{r.badge}</span>}
                </div>
                <div className="rest-card-body">
                  <div className="flex justify-between items-center mb-4">
                    <div className="rest-card-name">{r.name}</div>
                    <span className="rating">⭐ {r.rating}</span>
                  </div>
                  <div className="rest-card-cuisine">{r.cuisine}</div>
                  <div className="rest-card-meta">
                    <span className="rest-meta-item"><i className="fa-solid fa-clock"></i> {r.time}</span>
                    <span className="rest-meta-item"><i className="fa-solid fa-location-dot"></i> {r.location?.split(",")[0] || "Lucknow"}</span>
                    <span className="rest-meta-item"><i className="fa-solid fa-indian-rupee-sign"></i> {r.cost}</span>
                  </div>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px", background: "var(--card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>🍽️</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: 8 }}>No restaurants found</h3>
                <p style={{ color: "var(--text3)", fontSize: "0.9rem" }}>Try selecting a different category.</p>
                <button className="btn btn-ghost btn-sm" style={{ marginTop: 16 }} onClick={() => setActiveCat("all")}>View All Restaurants</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="section" style={{ background: "var(--bg2)", padding: "40px 0" }}>
        <div className="container">
          <div className="section-header fade-up">
            <div><div className="section-title">🔥 Trending Near You</div><div className="section-subtitle">Most ordered this week</div></div>
          </div>
          <div className="grid-4 fade-up-1">
            {[["🍕", "Margherita Pizza", "Ordered 1.2k times", "btn-primary", "red"], ["🍔", "Classic Burger", "Ordered 980 times", "btn-orange", "orange"], ["🍚", "Chicken Biryani", "Ordered 860 times", "btn-success", "green"], ["🍰", "Chocolate Cake", "Ordered 740 times", "btn-sm", "teal"]].map(([emoji, name, cnt, btnClass, color]) => (
              <div key={name} className={`stat-card ${color}`} style={{ textAlign: "center", padding: 24 }}>
                <div style={{ fontSize: "3rem", marginBottom: 8 }}>{emoji}</div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.95rem" }}>{name}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text3)", marginTop: 4 }}>{cnt}</div>
                <button className={`btn ${btnClass} btn-sm`} style={{ marginTop: 12 }} onClick={() => onNav("menu", { restaurant: name })}>Order Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter onNav={onNav} />

      {/* FLOATING CART */}
      {cart.length > 0 && (
        <div className="float-cart" onClick={() => onNav("cart")}>
          <div className="float-cart-count">{cart.reduce((a, i) => a + i.qty, 0)}</div>
          <div className="float-cart-text">View Cart</div>
          <div className="float-cart-price">₹{cart.reduce((a, i) => a + i.price * i.qty, 0)}</div>
          <i className="fa-solid fa-chevron-right" style={{ fontSize: 12 }}></i>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
