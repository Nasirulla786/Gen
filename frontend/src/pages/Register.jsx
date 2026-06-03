import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ServerURL } from "../App";
import { useNavigate } from "react-router-dom";

const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const InputField = ({ label, id, type = "text", value, onChange, placeholder, suffix, error, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    style={{ marginBottom: "1.25rem" }}
  >
    <label htmlFor={id} style={{
      display: "block",
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "#9CA3AF",
      marginBottom: "8px",
      fontFamily: "'DM Mono', monospace",
    }}>
      {label}
    </label>
    <div style={{ position: "relative" }}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        style={{
          width: "100%",
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${error ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "10px",
          padding: suffix ? "13px 48px 13px 16px" : "13px 16px",
          fontSize: "15px",
          color: "#F9FAFB",
          fontFamily: "'DM Sans', sans-serif",
          outline: "none",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxSizing: "border-box",
        }}
        onFocus={e => {
          e.target.style.borderColor = "#A78BFA";
          e.target.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.12)";
        }}
        onBlur={e => {
          e.target.style.borderColor = error ? "#EF4444" : "rgba(255,255,255,0.1)";
          e.target.style.boxShadow = "none";
        }}
      />
      {suffix && (
        <div style={{
          position: "absolute", right: "14px", top: "50%",
          transform: "translateY(-50%)", cursor: "pointer", color: "#6B7280",
        }}>
          {suffix}
        </div>
      )}
    </div>
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          style={{ margin: "6px 0 0", fontSize: "12px", color: "#EF4444", fontFamily: "'DM Sans', sans-serif" }}
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

const PasswordStrength = ({ password }) => {
  const checks = [
    { label: "8+ characters", pass: password.length >= 8 },
    { label: "Uppercase", pass: /[A-Z]/.test(password) },
    { label: "Number", pass: /\d/.test(password) },
    { label: "Symbol", pass: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.pass).length;
  const colors = ["#374151", "#EF4444", "#F59E0B", "#10B981", "#A78BFA"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      style={{ marginTop: "10px", marginBottom: "1.25rem" }}
    >
      <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
        {[1, 2, 3, 4].map(i => (
          <motion.div
            key={i}
            style={{
              flex: 1, height: "3px", borderRadius: "999px",
              background: i <= score ? colors[score] : "rgba(255,255,255,0.08)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {checks.map(c => (
          <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{
              width: "14px", height: "14px", borderRadius: "50%",
              background: c.pass ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.05)",
              border: `1px solid ${c.pass ? "#A78BFA" : "rgba(255,255,255,0.1)"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#A78BFA", transition: "all 0.2s",
              flexShrink: 0,
            }}>
              {c.pass && <CheckIcon />}
            </div>
            <span style={{
              fontSize: "11px", fontFamily: "'DM Sans', sans-serif",
              color: c.pass ? "#D1D5DB" : "#6B7280", transition: "color 0.2s",
            }}>
              {c.label}
            </span>
          </div>
        ))}
      </div>
      <p style={{
        marginTop: "6px", fontSize: "11px", fontFamily: "'DM Mono', monospace",
        color: colors[score], letterSpacing: "0.05em", transition: "color 0.3s",
      }}>
        {labels[score]}
      </p>
    </motion.div>
  );
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    else if (username.length < 3) newErrors.username = "Must be at least 3 characters";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Enter a valid email";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 8) newErrors.password = "Must be at least 8 characters";
    return newErrors;
  };
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {

      const res = await axios.post(`${ServerURL}/api/auth/register` , {username , email , password} ,{withCredentials:true});
      navigate("/")


    } catch (error) {
      console.log("Register frontend error",error);

    }

  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        input::placeholder { color: rgba(156,163,175,0.5); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #0f0f14 inset !important;
          -webkit-text-fill-color: #F9FAFB !important;
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#0B0B10",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Ambient glow blobs */}
        <div style={{
          position: "absolute", width: "500px", height: "500px",
          borderRadius: "50%", left: "-100px", top: "-100px",
          background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", width: "400px", height: "400px",
          borderRadius: "50%", right: "-80px", bottom: "-60px",
          background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: "center", padding: "3rem" }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                style={{
                  width: "72px", height: "72px", borderRadius: "50%",
                  background: "rgba(167,139,250,0.12)", border: "1px solid #A78BFA",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 1.5rem",
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
              <h2 style={{ fontSize: "24px", fontFamily: "'Syne', sans-serif", color: "#F9FAFB", marginBottom: "8px" }}>
                You're in.
              </h2>
              <p style={{ color: "#6B7280", fontSize: "14px" }}>Account created for <span style={{ color: "#A78BFA" }}>{email}</span></p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              style={{
                width: "100%", maxWidth: "420px",
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
                padding: "2.5rem",
                backdropFilter: "blur(20px)",
              }}
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ marginBottom: "2rem" }}
              >
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)",
                  borderRadius: "999px", padding: "4px 12px",
                  marginBottom: "1.25rem",
                }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#A78BFA" }} />
                  <span style={{ fontSize: "11px", color: "#A78BFA", fontFamily: "'DM Mono', monospace", letterSpacing: "0.08em" }}>
                    NEW ACCOUNT
                  </span>
                </div>
                <h1 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "30px", fontWeight: 800,
                  color: "#F9FAFB", lineHeight: 1.15,
                  marginBottom: "8px",
                }}>
                  Create your<br />
                  <span style={{ color: "#A78BFA" }}>account</span>
                </h1>
                <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: 1.6 }}>
                  Already have one?{" "}
                  <span onClick={()=>navigate("/login")} style={{ color: "#A78BFA", cursor: "pointer", fontWeight: 500 }}>Sign in</span>
                </p>
              </motion.div>

              {/* Fields */}
              <InputField
                label="Username"
                id="username"
                value={username}
                onChange={e => { setUsername(e.target.value); setErrors(p => ({ ...p, username: "" })); }}
                placeholder="your_handle"
                error={errors.username}
                delay={0.1}
              />
              <InputField
                label="Email address"
                id="email"
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
                placeholder="hello@example.com"
                error={errors.email}
                delay={0.2}
              />
              <InputField
                label="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: "" })); }}
                placeholder="min. 8 characters"
                error={errors.password}
                delay={0.3}
                suffix={
                  <div onClick={() => setShowPassword(p => !p)} style={{ color: "#6B7280" }}>
                    <EyeIcon open={showPassword} />
                  </div>
                }
              />

              <AnimatePresence>
                {password && <PasswordStrength password={password} />}
              </AnimatePresence>

              {/* Terms */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ fontSize: "12px", color: "#6B7280", lineHeight: 1.6, marginBottom: "1.5rem" }}
              >
                By registering, you agree to our{" "}
                <span style={{ color: "#A78BFA", cursor: "pointer" }}>Terms of Service</span>
                {" "}and{" "}
                <span style={{ color: "#A78BFA", cursor: "pointer" }}>Privacy Policy</span>.
              </motion.p>

              {/* Submit */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.4 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #7C3AED, #6D28D9)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: 600,
                  fontFamily: "'DM Sans', sans-serif",
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <span style={{ position: "relative", zIndex: 1 }}>Create Account →</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Register;
