# BiteBolt — HTML → React Conversion

## Complete Project Structure

```
BiteBolt/
├── index.html                 ← Vite HTML entry (Font Awesome CDN)
├── main.jsx                   ← React root render
├── App.jsx                    ← Master zone router
│
├── shared/
│   ├── globalStyles.js        ← Full shared.css as JS string (CSS vars, all shared classes)
│   └── components.jsx         ← StyleInjector, useToast/ToastContainer, Modal,
│                                 SiteHeader, SiteFooter, PanelSidebar, BarChart
│
├── auth/
│   └── AuthPages.jsx          ← LoginPage, RegisterPage, ForgotPasswordPage
│
├── customer/
│   ├── HomePage.jsx           ← index.html
│   ├── RestaurantsPage.jsx    ← restaurants.html
│   ├── MenuPage.jsx           ← menu.html
│   ├── CartPage.jsx           ← cart.html
│   ├── CheckoutPage.jsx       ← checkout.html
│   ├── TrackingPage.jsx       ← tracking.html
│   ├── OrderHistoryPage.jsx   ← order-history.html
│   └── ProfilePage.jsx        ← profile.html
│
├── admin/
│   └── AdminPortal.jsx        ← admin-dashboard + admin-orders + admin-users
│                                 + admin-restaurants + admin-reports
│
└── restaurant/
    └── RestaurantPortal.jsx   ← restaurant-dashboard + restaurant-orders
                                  + restaurant-menu
```

---

## Every HTML Function → React Equivalent

| HTML JS Function | File | React Pattern |
|---|---|---|
| `togglePwd()` | LoginPage, RegisterPage | `useState(showPw)` + toggle |
| `handleLogin(e)` | LoginPage | `handleLogin(e)` → `onLogin(role)` |
| `checkStrength(v)` | RegisterPage | `useState(strength)` object |
| `handleRegister(e)` | RegisterPage | form `onSubmit` |
| `goStep2()` / `goStep3()` / `resetDone()` | ForgotPasswordPage | `useState(step)` |
| `otpNext(el, i)` | ForgotPasswordPage | `useRef` array + `focus()` |
| `filterCat(el, cat)` | HomePage, RestMenu | `useState(activeCat)` |
| `toggleFilter(el)` | RestaurantsPage | `useState(activeFilter)` |
| `priceRange oninput` | RestaurantsPage | `useState(priceVal)` + `onChange` |
| `addToCart(btn, name, price)` | MenuPage | `setCart(...)` + toast |
| `changeQty(btn, d)` in menu | MenuPage | per-item qty state |
| `scrollTo(id, el)` | MenuPage | `useState(activeNav)` |
| `changeQty(id, d, price)` in cart | CartPage | item-level qty update |
| `removeItem(id)` | CartPage | `setItems` filter |
| `setCoupon(code)` | CartPage | `setCouponInput(code)` |
| `applyCoupon()` | CartPage | validate + `setCouponApplied` |
| `selectDT(el)` | CheckoutPage | `useState(selectedDT)` |
| `selectPay(el, type)` | CheckoutPage | `useState(payMethod)` |
| `selectUPI(el)` | CheckoutPage | `useState(selectedUPI)` |
| `placeOrder()` | CheckoutPage | `useState(orderPlaced)` modal |
| `setInterval ETA` | TrackingPage | `useEffect + setInterval` |
| `setTab(el)` | OrderHistoryPage | `useState(activeTab)` |
| `openRate()` / `closeRate()` | OrderHistoryPage | `useState(rateModal)` |
| `rateModal(n)` / `submitRate()` | OrderHistoryPage | `useState(rateValue)` |
| `rate(n)` inline stars | OrderHistoryPage | `useState(biryaniRating)` |
| `showPane(name, el)` | ProfilePage | `useState(activePane)` |
| `toggleEdit()` | ProfilePage | `useState(editing)` |
| `saveProfile(e)` | ProfilePage | form `onSubmit` |
| `togglePref(el)` | ProfilePage | `useState(prefs)` object |
| `approveRest(btn)` | AdminDashboard | `setPending` filter |
| `rejectRest(btn)` | AdminDashboard | `setPending` filter |
| `toggleDD(btn)` | AdminUsers | `useState(openDD)` + click-outside |
| `toggleAll(cb)` | AdminUsers | `useState(allChecked)` + per-row map |
| `handleRest(id, action)` | AdminRestaurants | `setRests` filter |
| BarChart (DOM `createElement`) | AdminDashboard, AdminReports | `<BarChart>` component |
| Donut SVG chart | AdminReports | JSX `<svg>` circles |
| `acceptOrder(btn)` | RestDashboard, RestOrders | `setLiveOrders` status update |
| `rejectOrder(btn)` | RestDashboard, RestOrders | `setLiveOrders` filter |
| Timer `setInterval` countdown | RestOrders | `useEffect + setInterval` |
| `setTab(el, tab)` | RestOrders | `useState(activeTab)` |
| `filterCat(el)` | RestMenu | `useState(activeCat)` |
| `openEdit(name, price, desc)` | RestMenu | `setEditData` + `setModalOpen(true)` |
| `saveItem()` | RestMenu | close modal + toast |
| `confirmDelete(btn)` | RestMenu | `useState(deleteTarget)` modal |
| `doDelete()` | RestMenu | `setItems` filter |
| `closeModal(id)` | RestMenu | `useState(modal)` false |
| `showToast(msg, type)` | All files | `useToast()` hook + `<ToastContainer>` |

---

## Quick Start

```bash
# 1. Create Vite project
npm create vite@latest bitebolt -- --template react
cd bitebolt

# 2. Clear src/ and copy all BiteBolt/ files into src/
rm -rf src/*
cp -r BiteBolt/* src/

# 3. Replace root index.html
cp src/index.html index.html   # or paste the CDN scripts

# 4. Install and run
npm install
npm run dev
# → http://localhost:5173
```

## Login Flow
| Click | Goes to |
|---|---|
| Sign In (any email) | Customer Portal (Home) |
| 🍴 Restaurant Login | Restaurant Portal |
| ⚙️ Admin Login | Admin Portal |
| Sign out (sidebar) | Back to Login |
