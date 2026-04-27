import { useState, useRef } from "react";
import { useToast, ToastContainer } from "../shared/components";
import { useGoogleLogin } from '@react-oauth/google';

/* ═══════════════════════════════════════════════
   LOGIN PAGE — togglePwd(), handleLogin()
═══════════════════════════════════════════════ */
export function LoginPage({ onLogin, onNav }) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toasts, show } = useToast();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      show("Verifying Google Auth...", "info");
      try {
        // useGoogleLogin gives access_token, we need to handle this in backend or get user info
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const userInfo = await res.json();
        
        // Now send this info to our backend to login/register
        const backendRes = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            isCustom: true,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            sub: userInfo.sub
          })
        });
        const data = await backendRes.json();
        if (!backendRes.ok) throw new Error(data.message || "Google Login failed");
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setTimeout(() => onLogin(data.role), 500);
      } catch (err) {
        show(err.message, "error");
      }
    },
    onError: () => show('Google Login Failed', 'error')
  });

  const DEMO_ACCOUNTS = [
    { label: "👤 Customer",   email: "gaurav@okaxis",          password: "password123",   role: "customer",   color: "var(--red)" },
    { label: "🍴 Restaurant", email: "restaurant@bitebolt.com", password: "restaurant123", role: "restaurant", color: "var(--orange)" },
    { label: "⚙️ Admin",     email: "admin@bitebolt.com",      password: "admin123",      role: "admin",      color: "var(--teal)" },
  ];

  const quickLogin = async (acc) => {
    show(`Logging in as ${acc.label}...`, "info");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: acc.email, password: acc.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setTimeout(() => onLogin(data.role), 400);
    } catch (err) {
      show(err.message, "error");
    }
  };

  // togglePwd()
  const togglePwd = () => setShowPw(p => !p);

  // handleLogin()
  const handleLogin = async (e) => {
    e.preventDefault();
    show("Logging in...", "info");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      
      setTimeout(() => onLogin(data.role), 500);
    } catch (err) {
      show(err.message, "error");
    }
  };

  return (
    <div style={{ background: "var(--bg)" }}>
      <div className="auth-wrap">
        {/* LEFT PANEL */}
        <div className="auth-left">
          <div style={{ textAlign: "center", position: "relative", zIndex: 1, color: "#fff" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "2.8rem", fontWeight: 900, marginBottom: 10 }}>
              <i className="fa-solid fa-bolt"></i> BiteBolt
            </div>
            <div style={{ fontSize: "1.1rem", opacity: 0.85, marginBottom: 40 }}>Delicious food, delivered fast 🚀</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16, position: "relative", zIndex: 1, width: "100%", maxWidth: 320 }}>
            {[["⚡", "30 Min Delivery", "Average delivery time"], ["🔒", "100% Secure", "Safe payments guaranteed"], ["⭐", "500+ Restaurants", "Best picks near you"]].map(([icon, title, sub]) => (
              <div key={title} style={{ display: "flex", alignItems: "center", gap: 14, background: "rgba(255,255,255,0.12)", borderRadius: "var(--radius)", padding: "14px 18px", color: "#fff", backdropFilter: "blur(4px)" }}>
                <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyItems: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
                <div><strong style={{ display: "block", fontSize: "0.88rem", fontWeight: 800 }}>{title}</strong><span style={{ fontSize: "0.75rem", opacity: 0.75 }}>{sub}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <div style={{ marginBottom: 32, textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "var(--red)", marginBottom: 12 }}><i className="fa-solid fa-bolt"></i> BiteBolt</div>
              <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, fontFamily: "var(--font-body)", letterSpacing: "-0.02em" }}>Welcome back! 👋</h1>
              <p style={{ color: "var(--text2)", fontSize: "0.95rem", fontWeight: 500 }}>Sign in to your account to order food</p>
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <button 
                type="button" 
                className="social-btn" 
                onClick={() => googleLogin()}
                style={{ 
                  width: "100%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: 12, 
                  padding: "12px", 
                  borderRadius: "var(--radius-full)", 
                  border: "1.5px solid var(--border)",
                  background: "#fff",
                  color: "var(--text)",
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all var(--transition)"
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.background = "var(--red-light)"; e.currentTarget.style.color = "var(--red)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "var(--text)"; }}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 18, height: 18 }} />
                Continue with Google
              </button>
            </div>
            <div className="form-divider" style={{ fontFamily: "var(--font-body)", fontWeight: 600 }}>or sign in with email</div>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-envelope input-icon"></i>
                  <input type="email" className="form-input" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrap">
                  <i className="fa-solid fa-lock input-icon"></i>
                  <input type={showPw ? "text" : "password"} className="form-input" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
                  {/* togglePwd */}
                  <button type="button" className="input-toggle" onClick={togglePwd}>
                    <i className={`fa-solid ${showPw ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center mb-20">
                <label className="form-check"><input type="checkbox" defaultChecked /> Remember me</label>
                <a onClick={() => onNav("forgot")} style={{ fontSize: "0.82rem", color: "var(--red)", fontWeight: 700, cursor: "pointer" }}>Forgot password?</a>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" style={{ fontFamily: "var(--font-body)", fontSize: "1rem", fontWeight: 700 }}>Sign In <i className="fa-solid fa-arrow-right"></i></button>
            </form>

            <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text2)", marginTop: 20 }}>
              New to BiteBolt? <a onClick={() => onNav("register")} style={{ color: "var(--red)", fontWeight: 800, cursor: "pointer" }}>Create account</a>
            </div>
            {/* Quick Demo Login */}
            <div style={{ marginTop: 20, background: "var(--bg2)", borderRadius: "var(--radius-lg)", padding: "14px 18px", border: "1.5px dashed var(--border)" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text3)", marginBottom: 10 }}>⚡ Quick Demo Login</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {DEMO_ACCOUNTS.map(acc => (
                  <button key={acc.role} type="button" onClick={() => quickLogin(acc)}
                    style={{ padding: "7px 14px", borderRadius: "var(--radius-full)", border: `1.5px solid ${acc.color}`, background: "transparent", color: acc.color, fontSize: "0.78rem", fontWeight: 800, cursor: "pointer", transition: "all var(--transition)" }}
                    onMouseOver={e => { e.currentTarget.style.background = acc.color; e.currentTarget.style.color = "#fff"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = acc.color; }}>
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   REGISTER PAGE — togglePwd(), checkStrength(), handleRegister()
═══════════════════════════════════════════════ */
export function RegisterPage({ onLogin, onNav }) {
  const [showPw, setShowPw] = useState(false);
  const [strength, setStrength] = useState({ w: "0%", c: "", t: "Enter password" });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const { toasts, show } = useToast();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      show("Verifying Google Auth...", "info");
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        const userInfo = await res.json();
        
        const backendRes = await fetch("/api/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            isCustom: true,
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            sub: userInfo.sub
          })
        });
        const data = await backendRes.json();
        if (!backendRes.ok) throw new Error(data.message || "Google Login failed");
        
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        setTimeout(() => onLogin(data.role), 500);
      } catch (err) {
        show(err.message, "error");
      }
    },
    onError: () => show('Google Login Failed', 'error')
  });

  // checkStrength(v)
  const checkStrength = (v) => {
    let s = 0;
    if (v.length >= 8) s++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
    if (/[0-9]/.test(v)) s++;
    if (/[^A-Za-z0-9]/.test(v)) s++;
    const map = [["0%", "", "Enter password"], ["25%", "var(--red)", "Weak"], ["50%", "var(--orange)", "Fair"], ["75%", "var(--yellow)", "Good"], ["100%", "var(--green)", "Strong 💪"]];
    const [w, c, t] = map[Math.min(s, 4)];
    setStrength({ w, c, t });
  };

  // handleRegister(e)
  const handleRegister = async (e) => {
    e.preventDefault();
    show("Creating your account...", "info");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`.trim(),
          email: regEmail,
          password: regPassword,
          phone
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      show("Account created! Redirecting to login...", "success");
      setTimeout(() => onNav("login"), 1200);
    } catch (err) {
      show(err.message, "error");
    }
  };



  return (
    <div style={{ background: "linear-gradient(135deg,#FFF5EE,#FFEBE0)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 520, background: "var(--card)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)", overflow: "hidden", animation: "fadeUp 0.5s ease" }}>
        <div style={{ background: "linear-gradient(135deg,var(--red),var(--orange))", padding: "28px 32px", color: "#fff", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, marginBottom: 6 }}><i className="fa-solid fa-bolt"></i> BiteBolt</div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: 4 }}>Create your account 🎉</h2>
          <p style={{ opacity: 0.85, fontSize: "0.88rem" }}>Join 2M+ food lovers. First order 50% off!</p>
        </div>
        <div style={{ padding: 32 }}>
          {/* Step dots */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
            {[true, true, false].map((active, i) => (
              <div key={i} style={{ height: 6, borderRadius: 3, background: active ? "var(--red)" : "var(--gray3)", width: active ? 36 : 28, transition: "all 0.3s" }}></div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <button 
              type="button" 
              className="social-btn" 
              onClick={() => googleLogin()}
              style={{ 
                width: "100%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center", 
                gap: 12, 
                padding: "12px", 
                borderRadius: "var(--radius-full)", 
                border: "1.5px solid var(--border)",
                background: "#fff",
                color: "var(--text)",
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all var(--transition)"
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = "var(--red)"; e.currentTarget.style.background = "var(--red-light)"; e.currentTarget.style.color = "var(--red)"; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "var(--text)"; }}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 18, height: 18 }} />
              Sign up with Google
            </button>
          </div>
          <div className="form-divider">or fill in details</div>

          <form onSubmit={handleRegister}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="input-wrap"><i className="fa-solid fa-user input-icon"></i><input type="text" className="form-input" placeholder="Arjun" required value={firstName} onChange={e => setFirstName(e.target.value)} /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div className="input-wrap"><i className="fa-solid fa-user input-icon"></i><input type="text" className="form-input" placeholder="Sharma" required value={lastName} onChange={e => setLastName(e.target.value)} /></div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap"><i className="fa-solid fa-envelope input-icon"></i><input type="email" className="form-input" placeholder="you@example.com" required value={regEmail} onChange={e => setRegEmail(e.target.value)} /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ background: "var(--gray4)", border: "1.5px solid transparent", borderRadius: "var(--radius)", padding: "12px 14px", fontSize: "0.88rem", fontWeight: 700, color: "var(--text2)", whiteSpace: "nowrap" }}>🇮🇳 +91</div>
                <div className="input-wrap" style={{ flex: 1 }}><i className="fa-solid fa-phone input-icon"></i><input type="tel" className="form-input" placeholder="98765 43210" required value={phone} onChange={e => setPhone(e.target.value)} /></div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <i className="fa-solid fa-lock input-icon"></i>
                <input type={showPw ? "text" : "password"} className="form-input" placeholder="Min 8 characters" required value={regPassword} onChange={e => { setRegPassword(e.target.value); checkStrength(e.target.value); }} />
                {/* togglePwd */}
                <button type="button" className="input-toggle" onClick={() => setShowPw(p => !p)}>
                  <i className={`fa-solid ${showPw ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              {/* checkStrength bar */}
              <div className="progress-track" style={{ marginTop: 8 }}>
                <div className="progress-fill" style={{ width: strength.w, background: strength.c }}></div>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: 4 }}>{strength.t}</div>
            </div>
            <div className="form-group mb-20">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrap"><i className="fa-solid fa-lock input-icon"></i><input type="password" className="form-input" placeholder="Repeat password" required /></div>
            </div>
            <div className="flex items-center gap-8 mb-20" style={{ fontSize: "0.82rem", color: "var(--text2)" }}>
              <input type="checkbox" style={{ accentColor: "var(--red)", width: 16, height: 16 }} required />
              <span>I agree to <a href="#" style={{ color: "var(--red)", fontWeight: 700 }}>Terms</a> & <a href="#" style={{ color: "var(--red)", fontWeight: 700 }}>Privacy Policy</a></span>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg">Create Account <i className="fa-solid fa-arrow-right"></i></button>
          </form>
          <p style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text2)", marginTop: 16 }}>
            Already have an account? <a onClick={() => onNav("login")} style={{ color: "var(--red)", fontWeight: 800, cursor: "pointer" }}>Sign In</a>
          </p>
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FORGOT PASSWORD — goStep2(), goStep3(), resetDone(), otpNext()
═══════════════════════════════════════════════ */
export function ForgotPasswordPage({ onNav }) {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newpwd, 4=done
  const [email, setEmail] = useState("arjun@example.com");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef([]);

  // goStep2()
  const goStep2 = () => setStep(2);
  // goStep3()
  const goStep3 = () => setStep(3);
  // resetDone()
  const resetDone = () => setStep(4);

  // otpNext(val, i)
  const otpNext = (val, i) => {
    const next = [...otp]; next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const stepMeta = [
    { icon: "fa-lock", color: "var(--red)", iconBg: "var(--red-light)", title: "Forgot Password?", sub: "No worries! Enter your email and we'll send you a reset link." },
    { icon: "fa-key", color: "var(--orange)", iconBg: "var(--orange-light)", title: "Enter OTP", sub: `Enter the 6-digit OTP sent to ${email}` },
    { icon: "fa-shield-halved", color: "var(--green)", iconBg: "var(--green-light)", title: "New Password", sub: "Choose a strong new password" },
    { icon: "fa-check-circle", color: "var(--green)", iconBg: "var(--green-light)", title: "Password Reset!", sub: "Your password has been updated successfully." },
  ];

  const meta = stepMeta[Math.min(step - 1, 3)];

  return (
    <div style={{ background: "linear-gradient(135deg,#FFF5EE,#FFEBE0)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "var(--card)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)", padding: 40, maxWidth: 440, width: "100%", textAlign: "center", animation: "fadeUp .5s ease" }}>
        <a onClick={() => onNav("login")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.82rem", fontWeight: 700, color: "var(--text3)", marginBottom: 20, cursor: "pointer", textDecoration: "none", justifyContent: "flex-start" }}>
          <i className="fa-solid fa-arrow-left"></i> Back to Login
        </a>

        {/* Icon */}
        <div style={{ width: 80, height: 80, background: meta.iconBg, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", fontSize: 32 }}>
          <i className={`fa-solid ${meta.icon}`} style={{ color: meta.color }}></i>
        </div>
        <h2 style={{ fontSize: "1.6rem", marginBottom: 8 }}>{meta.title}</h2>
        <p style={{ color: "var(--text2)", fontSize: "0.88rem", marginBottom: 24 }}>{meta.sub}</p>

        {/* Step bar */}
        {step < 4 && (
          <div style={{ display: "flex", gap: 0, marginBottom: 28 }}>
            {["Email", "Verify OTP", "New Password"].map((lbl, i) => (
              <div key={lbl} style={{ flex: 1, textAlign: "center", position: "relative" }}>
                {i < 2 && <div style={{ position: "absolute", top: 15, left: "50%", width: "100%", height: 2, background: i < step - 1 ? "var(--green)" : "var(--gray3)", zIndex: 0 }}></div>}
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: i < step ? (i === step - 1 ? "var(--red)" : "var(--green)") : "var(--gray3)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 800, margin: "0 auto 6px", position: "relative", zIndex: 1 }}>{i < step - 1 ? "✓" : i + 1}</div>
                <div style={{ fontSize: "0.72rem", fontWeight: 700, color: i === step - 1 ? "var(--red)" : "var(--text3)" }}>{lbl}</div>
              </div>
            ))}
          </div>
        )}

        {/* Step 1 — Email */}
        {step === 1 && (
          <div>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label className="form-label">Email Address</label>
              <div className="input-wrap"><i className="fa-solid fa-envelope input-icon"></i><input type="email" className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={goStep2}>Send Reset Link <i className="fa-solid fa-paper-plane"></i></button>
          </div>
        )}

        {/* Step 2 — OTP */}
        {step === 2 && (
          <div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 20 }}>
              {otp.map((v, i) => (
                <input key={i} ref={el => (otpRefs.current[i] = el)} type="text" maxLength={1} value={v}
                  onChange={e => otpNext(e.target.value, i)}
                  onKeyDown={e => { if (e.key === 'Backspace' && !v && i > 0) otpRefs.current[i - 1]?.focus(); }}
                  style={{ width: 44, height: 50, textAlign: "center", fontSize: "1.2rem", fontWeight: 800, border: "2px solid var(--border)", borderRadius: "var(--radius)", background: "var(--bg2)", transition: "all var(--transition)" }}
                  onFocus={e => e.target.style.borderColor = "var(--red)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              ))}
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={goStep3}>Verify OTP</button>
            <p style={{ fontSize: "0.82rem", color: "var(--text3)", marginTop: 16 }}>Didn't receive? <a style={{ color: "var(--red)", fontWeight: 700, cursor: "pointer" }}>Resend in 0:45</a></p>
          </div>
        )}

        {/* Step 3 — New Pwd */}
        {step === 3 && (
          <div>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label className="form-label">New Password</label>
              <div className="input-wrap"><i className="fa-solid fa-lock input-icon"></i><input type="password" className="form-input" placeholder="Min 8 characters" /></div>
            </div>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label className="form-label">Confirm Password</label>
              <div className="input-wrap"><i className="fa-solid fa-lock input-icon"></i><input type="password" className="form-input" placeholder="Repeat password" /></div>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={resetDone}>Reset Password</button>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <div>
            <button className="btn btn-primary btn-full btn-lg" onClick={() => onNav("login")}>Sign In Now</button>
          </div>
        )}
      </div>
    </div>
  );
}
