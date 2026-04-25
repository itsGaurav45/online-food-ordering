import { useState, useEffect } from "react";
import { SiteHeader, useToast, ToastContainer } from "../shared/components";

/* Veg/NonVeg indicator */
function VegDot({ veg }) {
  const clr = veg ? "var(--green)" : "var(--red)";
  return (
    <div style={{ width: 14, height: 14, border: `1.5px solid ${clr}`, borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <div style={{ width: 7, height: 7, background: clr, borderRadius: "50%" }}></div>
    </div>
  );
}



const MENU_SECTIONS = [
  {
    id: "bestsellers", title: "⭐ Bestsellers", items: [
      { name: "Margherita Pizza", desc: "Classic tomato sauce, fresh mozzarella, basil leaves on a hand-tossed crust", price: 299, oldPrice: 399, veg: true, bestseller: true, img: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=200" },
      { name: "Pepperoni Feast", desc: "Loaded with premium pepperoni, bell peppers, olives and extra cheese", price: 449, oldPrice: 549, veg: false, img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200" },
    ]
  },
  {
    id: "pizzas", title: "🍕 Pizzas", badge: "4 items", items: [
      { name: "Paneer Tikka Pizza", desc: "Spiced paneer, capsicum, onions, tikka sauce on a thin crust", price: 349, veg: true, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200" },
      { name: "BBQ Chicken Pizza", desc: "Smoky BBQ chicken with caramelized onions, cheddar and jalapeños", price: 499, oldPrice: 599, veg: false, bestseller: true, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200" },
    ]
  },
  {
    id: "pasta", title: "🍝 Pasta", items: [
      { name: "Creamy Penne Arrabbiata", desc: "Penne in rich spicy tomato cream sauce with fresh herbs", price: 249, veg: true, img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=200" },
    ]
  },
];

export default function MenuPage({ onNav, cart, setCart, addresses = [], selectedAddrIdx = 0, navData }) {
  const [activeNav, setActiveNav] = useState("bestsellers");
  const [menuSections, setMenuSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, show } = useToast();

  const currentAddress = addresses[selectedAddrIdx]?.addr?.split(",")[0] || "Gomti Nagar, Lucknow";

  const restaurantName = navData?.restaurant || "Pizza Palace, Gomti Nagar";

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/foods');
        let data = await response.json();
        
        // Dynamically filter data based on restaurant name for demo purposes
        const lowerName = restaurantName.toLowerCase();
        let targetCategory = "";
        if (lowerName.includes("burger")) targetCategory = "Burgers";
        else if (lowerName.includes("pizza")) targetCategory = "Pizzas";
        else if (lowerName.includes("biryani") || lowerName.includes("dastarkhwan")) targetCategory = "Biryani";
        else if (lowerName.includes("sushi") || lowerName.includes("tokyo")) targetCategory = "Sushi";
        else if (lowerName.includes("wok") || lowerName.includes("chung") || lowerName.includes("chinese")) targetCategory = "Chinese";
        else if (lowerName.includes("sugar") || lowerName.includes("dessert")) targetCategory = "Desserts";
        else if (lowerName.includes("green") || lowerName.includes("healthy")) targetCategory = "Healthy";

        if (targetCategory) {
          data = data.filter(item => item.category === targetCategory);
        }

        // Group by category
        const categories = [...new Set(data.map(item => item.category))];
        const sections = categories.map(cat => ({
          id: cat.toLowerCase(),
          title: cat,
          items: data.filter(item => item.category === cat).map(item => ({
            ...item,
            img: item.image,
            veg: true, // Defaulting to veg for now as model doesn't have it yet
            desc: item.description
          }))
        }));
        
        setMenuSections(sections);
        if (sections.length > 0) setActiveNav(sections[0].id);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching foods:', error);
        show('Failed to load menu. Please try again.', 'error');
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const cartTotal = cart.reduce((a, b) => a + b.price * b.qty, 0);
  const cartCount = cart.reduce((a, b) => a + b.qty, 0);

  // addToCart(item) — saves full item including img
  const addToCart = (item) => {
    setCart(prev => {
      const ex = prev.find(i => i.name === item.name);
      if (ex) return prev.map(i => i.name === item.name ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: Date.now(), name: item.name, price: item.price, img: item.img || "", qty: 1 }];
    });
    show(item.name + " added to cart!", "success");
  };

  // changeQty(id, delta) — from HTML onclick
  const changeQty = (id, d) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + d) } : i).filter(i => i.qty > 0));
  };

  // scrollTo(id, el) — from HTML onclick  → just set active nav
  const scrollToSection = (id) => setActiveNav(id);

  return (
    <div>
      <SiteHeader cartCount={cartCount} onNav={onNav} currentAddress={currentAddress} />

      {/* HERO */}
      <div style={{ height: 280, position: "relative", overflow: "hidden" }}>
        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.src = "https://placehold.co/1200x280/FFEBE0/E63946?text=🍕+Pizza+Palace"; }} alt="" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.7),rgba(0,0,0,0.2))" }}></div>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 28, zIndex: 1, color: "#fff" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Pizza Palace</h1>
          <p style={{ opacity: 0.85 }}>Pizza · Italian · Pasta · {currentAddress}</p>
        </div>
      </div>

      <div className="container">
        <div className="breadcrumb" style={{ paddingTop: 60 }}>
          <a onClick={() => onNav("home")} style={{ cursor: "pointer" }}>Home</a><span className="sep">›</span>
          <a onClick={() => onNav("restaurants")} style={{ cursor: "pointer" }}>Restaurants</a><span className="sep">›</span>
          <span className="current">{restaurantName}</span>
        </div>

        {/* INFO CARD */}
        <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", margin: "-40px 0 0", position: "relative", zIndex: 2, padding: "24px 28px", boxShadow: "var(--shadow)", border: "1px solid var(--border)", marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 16 }}>
            <div style={{ width: 72, height: 72, borderRadius: "var(--radius-lg)", overflow: "hidden", border: "3px solid var(--border)", flexShrink: 0 }}>
              <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.src = "https://placehold.co/72/FFEBE0/E63946?text=🍕"; }} alt="" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: "1.5rem", marginBottom: 6 }}>{restaurantName}</h2>
              <div style={{ fontSize: "0.85rem", color: "var(--text3)", marginBottom: 10 }}>{restaurantName.includes("Pizza") ? "Pizza · Italian" : restaurantName.includes("Burger") ? "Burgers · Fast Food" : "Multi Cuisine"} · {currentAddress}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span className="badge badge-green">Pure Veg Available</span>
                <span className="badge badge-red">50% OFF up to ₹100</span>
                <span className="badge badge-orange">Free Delivery</span>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span className="rating" style={{ fontSize: "1rem", padding: "6px 14px" }}>⭐ 4.8</span>
              <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: 6 }}>2,841 ratings</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            {[["22 min", "Delivery Time"], ["Free", "Delivery Fee"], ["₹199", "Min Order"], ["Open", "Status"]].map(([v, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 900, color: l === "Status" ? "var(--green)" : "inherit" }}>{v}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text3)", fontWeight: 600 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 320px", gap: 24, padding: "28px 0" }}>

          {/* MENU NAV — scrollTo() */}
          <div style={{ position: "sticky", top: "calc(var(--header-h) + 16px)", height: "fit-content" }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--text3)", marginBottom: 10 }}>Menu Categories</div>
            {menuSections.map((sec) => (
              <div key={sec.id}
                onClick={() => scrollToSection(sec.id)}
                style={{ padding: "10px 14px", borderRadius: "var(--radius)", fontSize: "0.85rem", fontWeight: 700, color: activeNav === sec.id ? "var(--red)" : "var(--text2)", cursor: "pointer", transition: "all var(--transition)", background: activeNav === sec.id ? "var(--red-light)" : "transparent", borderLeft: `3px solid ${activeNav === sec.id ? "var(--red)" : "transparent"}` }}>
                {sec.title}
              </div>
            ))}
          </div>

          {/* MENU ITEMS */}
          <div>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", fontSize: "1.2rem", fontWeight: 700, color: "var(--text3)" }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: 10 }}></i> Loading delicious menu...
              </div>
            ) : (
              menuSections.map(sec => (
              <div key={sec.id} style={{ marginBottom: 32 }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 900, marginBottom: 16, paddingBottom: 10, borderBottom: "2px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                  {sec.title}
                  {sec.badge && <span className="badge badge-orange" style={{ fontSize: "0.72rem" }}>{sec.badge}</span>}
                </div>
                {sec.items.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, background: "var(--card)", borderRadius: "var(--radius-lg)", padding: 16, border: "1px solid var(--border)", marginBottom: 12, transition: "all var(--transition)" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <VegDot veg={item.veg} />
                        {item.bestseller && <span style={{ background: "var(--orange-light)", color: "var(--orange)", fontSize: "0.68rem", fontWeight: 800, padding: "2px 8px", borderRadius: "var(--radius-full)" }}>Bestseller</span>}
                      </div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 800 }}>{item.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text3)", lineHeight: 1.5 }}>{item.desc}</div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 900, color: "var(--red)" }}>
                          ₹{item.price} {item.oldPrice && <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "var(--text3)", textDecoration: "line-through", marginLeft: 6 }}>₹{item.oldPrice}</span>}
                        </div>
                        {/* addToCart() / changeQty() */}
                        {(() => {
                          const inCart = cart.find(i => i.name === item.name);
                          return inCart ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--red-light)", border: "1.5px solid var(--red)", borderRadius: "var(--radius-full)", padding: "4px 8px" }}>
                              <button onClick={() => changeQty(inCart.id, -1)} style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--red)", border: "none", color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                              <span style={{ fontSize: "0.9rem", fontWeight: 800, minWidth: 18, textAlign: "center", color: "var(--red)" }}>{inCart.qty}</span>
                              <button onClick={() => addToCart(item)} style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--red)", border: "none", color: "#fff", fontSize: 16, fontWeight: 900, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                            </div>
                          ) : (
                            <button className="add-cart-btn" onClick={() => addToCart(item)}>
                              <i className="fa-solid fa-plus"></i> Add
                            </button>
                          );
                        })()}
                      </div>
                    </div>
                    <div style={{ width: 110, height: 90, borderRadius: "var(--radius)", overflow: "hidden", flexShrink: 0 }}>
                      <img src={item.img} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => { e.target.src = "https://placehold.co/110x90/FFEBE0/E63946?text=🍕"; }} alt={item.name} />
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          </div>

          {/* CART SIDEBAR */}
          <div style={{ position: "sticky", top: "calc(var(--header-h) + 16px)", height: "fit-content", background: "var(--card)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow)", border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg,var(--red),var(--orange))", padding: "16px 20px", color: "#fff" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 900 }}>🛒 Your Order</div>
              <div style={{ fontSize: "0.78rem", opacity: 0.85 }}>Pizza Palace · {cartCount} items</div>
            </div>
            <div style={{ padding: 16, maxHeight: 300, overflowY: "auto" }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ flex: 1, fontSize: "0.85rem", fontWeight: 700 }}>{item.name}</span>
                  {/* changeQty() */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => changeQty(item.id, -1)} style={{ width: 24, height: 24, borderRadius: "50%", border: "1.5px solid var(--red)", background: "none", color: "var(--red)", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all var(--transition)" }}>−</button>
                    <span style={{ fontSize: "0.85rem", fontWeight: 800, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} style={{ width: 24, height: 24, borderRadius: "50%", border: "1.5px solid var(--red)", background: "none", color: "var(--red)", fontSize: 14, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                  </div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 800, color: "var(--red)" }}>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "14px 16px", background: "var(--bg2)", borderTop: "1px solid var(--border)" }}>
              {[["Subtotal", `₹${cartTotal}`], ["Delivery Fee", "FREE"], ["Taxes & Charges", "₹52"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: 8, color: "var(--text2)" }}><span>{k}</span><span style={{ color: v === "FREE" ? "var(--green)" : "inherit" }}>{v}</span></div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-display)", fontSize: "0.95rem", fontWeight: 900, color: "var(--text)", borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 6 }}>
                <span>Total</span><span style={{ color: "var(--red)" }}>₹{cartTotal + 52}</span>
              </div>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <button className="btn btn-primary btn-full" onClick={() => onNav("cart")}>Proceed to Cart <i className="fa-solid fa-arrow-right"></i></button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}
