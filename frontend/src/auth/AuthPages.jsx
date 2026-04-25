import { useState } from "react";
import { useToast, ToastContainer } from "../shared/components";

/* ═══════════════════════════════════════════════
   LOGIN PAGE — togglePwd(), handleLogin()
═══════════════════════════════════════════════ */
export function LoginPage({ onLogin, onNav }) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("arjun@example.com");
  const [password, setPassword] = useState("password");
  const { toasts, show } = useToast();

  // togglePwd()
  const togglePwd = () => setShowPw(p => !p);

  // handleLogin()
  const handleLogin = (e) => {
    e.preventDefault();
    show("Logging in...", "info");
    setTimeout(() => onLogin("customer"), 1000);
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
                <div style={{ width: 36, height: 36, background: "rgba(255,255,255,0.2)", borderRadius: "var(--radius-sm)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{icon}</div>
                <div><strong style={{ display: "block", fontSize: "0.88rem", fontWeight: 800 }}>{title}</strong><span style={{ fontSize: "0.75rem", opacity: 0.75 }}>{sub}</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, color: "var(--red)", marginBottom: 6 }}><i className="fa-solid fa-bolt"></i> BiteBolt</div>
              <h1 style={{ fontSize: "2rem", fontWeight: 900, marginBottom: 8 }}>Welcome back! 👋</h1>
              <p style={{ color: "var(--text2)", fontSize: "0.9rem" }}>Sign in to your account to order food</p>
            </div>

            <button type="button" className="social-btn" onClick={() => show("Google Auth mocked for demo", "info")}><img src="https://www.google.com/favicon.ico" width="18" alt="" /> Continue with Google</button>
            <button type="button" className="social-btn" onClick={() => show("Facebook Auth mocked for demo", "info")}><i className="fa-brands fa-facebook" style={{ color: "#1877F2" }}></i> Continue with Facebook</button>
            <div className="form-divider">or sign in with email</div>

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
              <button type="submit" className="btn btn-primary btn-full btn-lg">Sign In <i className="fa-solid fa-arrow-right"></i></button>
            </form>

            <div style={{ textAlign: "center", fontSize: "0.85rem", color: "var(--text2)", marginTop: 20 }}>
              New to BiteBolt? <a onClick={() => onNav("register")} style={{ color: "var(--red)", fontWeight: 800, cursor: "pointer" }}>Create account</a>
            </div>
            <div style={{ textAlign: "center", marginTop: 24, fontSize: "0.75rem", color: "var(--text3)" }}>
              <a onClick={() => onLogin("restaurant")} style={{ color: "var(--orange)", fontWeight: 700, cursor: "pointer" }}>🍴 Restaurant Login</a>
              {" · "}
              <a onClick={() => onLogin("admin")} style={{ color: "var(--teal)", fontWeight: 700, cursor: "pointer" }}>⚙️ Admin Login</a>
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
  const { toasts, show } = useToast();

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
  const handleRegister = (e) => {
    e.preventDefault();
    show("Account created! Redirecting to login...", "success");
    setTimeout(() => onNav("login"), 1200);
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

          <button type="button" className="social-btn" onClick={() => show("Google Auth mocked for demo", "info")}><img src="https://www.google.com/favicon.ico" width="18" alt="" /> Sign up with Google</button>
          <div className="form-divider">or fill in details</div>

          <form onSubmit={handleRegister}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 0 }}>
              <div className="form-group">
                <label className="form-label">First Name</label>
                <div className="input-wrap"><i className="fa-solid fa-user input-icon"></i><input type="text" className="form-input" placeholder="Arjun" required /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <div className="input-wrap"><i className="fa-solid fa-user input-icon"></i><input type="text" className="form-input" placeholder="Sharma" required /></div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap"><i className="fa-solid fa-envelope input-icon"></i><input type="email" className="form-input" placeholder="you@example.com" required /></div>
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ background: "var(--gray4)", border: "1.5px solid transparent", borderRadius: "var(--radius)", padding: "12px 14px", fontSize: "0.88rem", fontWeight: 700, color: "var(--text2)", whiteSpace: "nowrap" }}>🇮🇳 +91</div>
                <div className="input-wrap" style={{ flex: 1 }}><i className="fa-solid fa-phone input-icon"></i><input type="tel" className="form-input" placeholder="98765 43210" required /></div>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <i className="fa-solid fa-lock input-icon"></i>
                <input type={showPw ? "text" : "password"} className="form-input" placeholder="Min 8 characters" required onChange={e => checkStrength(e.target.value)} />
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
                  style={{ width: 46, height: 52, textAlign: "center", fontSize: "1.4rem", fontWeight: 800, background: "var(--gray4)", border: `1.5px solid ${v ? "var(--red)" : "transparent"}`, borderRadius: "var(--radius)", fontFamily: "var(--font-display)", transition: "all .2s" }} />
              ))}
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={goStep3}>Verify OTP</button>
            <p style={{ marginTop: 12, fontSize: "0.82rem", color: "var(--text3)" }}>Didn't receive? <a href="#" style={{ color: "var(--red)", fontWeight: 700 }}>Resend OTP</a></p>
          </div>
        )}

        {/* Step 3 — New Password */}
        {step === 3 && (
          <div>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label className="form-label">New Password</label>
              <div className="input-wrap"><i className="fa-solid fa-lock input-icon"></i><input type="password" className="form-input" placeholder="Min 8 characters" /></div>
            </div>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label className="form-label">Confirm Password</label>
              <div className="input-wrap"><i className="fa-solid fa-lock input-icon"></i><input type="password" className="form-input" placeholder="Repeat new password" /></div>
            </div>
            <button className="btn btn-primary btn-full btn-lg" onClick={resetDone}>Reset Password <i className="fa-solid fa-check"></i></button>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <div>
            <div style={{ fontSize: "4rem", margin: "16px 0" }}>✅</div>
            <p style={{ color: "var(--text2)", fontSize: "0.88rem", margin: "12px 0 20px" }}>Your password has been updated successfully.</p>
            <button className="btn btn-primary btn-full btn-lg" onClick={() => onNav("login")}>Back to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}
