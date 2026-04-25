import { useState } from "react";
import { SiteHeader, SiteFooter, useToast, ToastContainer } from "../shared/components";

export default function HomePage({ onNav, cart, addresses = [], selectedAddrIdx = 0 }) {
  // filterCat()
  const [activeCat, setActiveCat] = useState("pizza");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchRecs, setShowSearchRecs] = useState(false);
  const { toasts, show } = useToast();

  const currentAddress = addresses[selectedAddrIdx]?.addr?.split(",")[0] || "Gomti Nagar, Lucknow";

  const cats = [
    { id: "pizza", emoji: "🍕", name: "Pizza" },
    { id: "burger", emoji: "🍔", name: "Burger" },
    { id: "biryani", emoji: "🍚", name: "Biryani" },
    { id: "chinese", emoji: "🥡", name: "Chinese" },
    { id: "sushi", emoji: "🍣", name: "Sushi" },
    { id: "desserts", emoji: "🍰", name: "Desserts" },
    { id: "healthy", emoji: "🥗", name: "Healthy" },
  ];

  const restaurants = [
    { name: "Pizza Palace, Gomti Nagar", cuisine: "Pizza · Italian · Pasta", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400", promo: "🎉 50% off up to ₹100", rating: "4.8", time: "22 min", delivery: "Free delivery", cost: "₹200", badge: "Pure Veg" },
    { name: "Domino's Pizza, Hazratganj", cuisine: "Pizza · Fast Food", img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400", promo: "₹150 OFF", rating: "4.3", time: "25 min", delivery: "₹30 delivery", cost: "₹250" },
    { name: "Burger Brothers, Aliganj", cuisine: "Burgers · American · Shakes", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400", promo: "🎁 Free fries on ₹399+", rating: "4.6", time: "18 min", delivery: "₹29 delivery", cost: "₹300" },
    { name: "Burger King, Phoenix Palassio", cuisine: "Burgers · Fast Food", img: "https://images.unsplash.com/photo-1586816001966-79b736744398?w=400", promo: null, rating: "4.4", time: "35 min", delivery: "₹45 delivery", cost: "₹250" },
    { name: "Biryani Express, Aminabad", cuisine: "Biryani · Mughlai · North Indian", img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400", promo: "🍛 Weekend Offer", rating: "4.9", time: "30 min", delivery: "Free delivery", cost: "₹350" },
    { name: "Dastarkhwan, Lalbagh", cuisine: "Mughlai · Biryani · Lucknowi", img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400", promo: "10% OFF", rating: "4.7", time: "40 min", delivery: "₹40 delivery", cost: "₹500" },
    { name: "Wok & Roll, Indira Nagar", cuisine: "Chinese · Thai · Asian", img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400", promo: null, rating: "4.4", time: "25 min", delivery: "₹49 delivery", cost: "₹280" },
    { name: "Chung Fa, Mahanagar", cuisine: "Chinese · Asian", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400", promo: "Free spring rolls", rating: "4.5", time: "30 min", delivery: "₹35 delivery", cost: "₹400" },
    { name: "Sushi House, Gomti Nagar", cuisine: "Sushi · Japanese · Asian", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400", promo: "🍣 20% OFF", rating: "4.6", time: "45 min", delivery: "₹60 delivery", cost: "₹800" },
    { name: "Tokyo Drift, Hazratganj", cuisine: "Sushi · Japanese", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400", promo: null, rating: "4.3", time: "50 min", delivery: "₹50 delivery", cost: "₹750" },
    { name: "Sugar Rush, Kapoorthala", cuisine: "Desserts · Bakery · Cakes", img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400", promo: "Buy 1 Get 1", rating: "4.8", time: "15 min", delivery: "Free delivery", cost: "₹150", badge: "New" },
    { name: "Green Bowl, Vikas Nagar", cuisine: "Healthy · Salads", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400", promo: null, rating: "4.5", time: "20 min", delivery: "₹25 delivery", cost: "₹250", badge: "Pure Veg" }
  ];

  const searchResults = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRestaurants = activeCat === "all" ? restaurants : restaurants.filter(r => r.cuisine.toLowerCase().includes(activeCat.toLowerCase()));

  return (
    <div>
      <SiteHeader cartCount={cart?.length || 0} onNav={onNav} currentAddress={currentAddress} />

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
            <div className="fade-up-2" style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
              <div style={{ position: "absolute", width: 420, height: 420, background: "radial-gradient(circle,rgba(244,132,95,0.15),rgba(230,57,70,0.08),transparent 70%)", borderRadius: "50%", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}></div>
              <img style={{ position: "relative", zIndex: 1, maxWidth: 460, animation: "float 3.5s ease-in-out infinite" }}
                src="https://img.freepik.com/free-photo/tasty-burger-isolated-white-background_1268-5393.jpg"
                onError={e => { e.target.src = "https://placehold.co/460x400/FFF5EE/E63946?text=🍔+Order+Now"; }}
                alt="Food" />
              {/* Floaters */}
              <div style={{ position: "absolute", background: "#fff", borderRadius: "var(--radius-lg)", padding: "12px 16px", boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 10, fontSize: "0.82rem", fontWeight: 700, zIndex: 2, top: "20%", left: "-10px", animation: "float 3s ease-in-out infinite" }}>
                <div style={{ background: "var(--red-light)", width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>🍕</div>
                <div><div style={{ fontWeight: 800 }}>Pizza Palace</div><div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>⭐ 4.8 · 22 min</div></div>
              </div>
              <div style={{ position: "absolute", background: "#fff", borderRadius: "var(--radius-lg)", padding: "12px 16px", boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 10, fontSize: "0.82rem", fontWeight: 700, zIndex: 2, bottom: "25%", right: "-10px", animation: "float 3s 1.5s ease-in-out infinite" }}>
                <div style={{ background: "var(--orange-light)", width: 32, height: 32, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>🍔</div>
                <div><div style={{ fontWeight: 800 }}>Burger Bros</div><div style={{ fontSize: "0.72rem", color: "var(--text3)" }}>⭐ 4.6 · 18 min</div></div>
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
            {filteredRestaurants.length > 0 ? filteredRestaurants.map((r, i) => (
              <div key={i} className="rest-card" onClick={() => onNav("menu", { restaurant: r.name })}>
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
                    <span className="rest-meta-item"><i className="fa-solid fa-motorcycle"></i> {r.delivery}</span>
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
