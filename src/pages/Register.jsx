import { useState, useEffect } from "react";
import { Form, Input, Button, Tabs, Checkbox, message, Select } from "antd";
import {
  LockOutlined, MailOutlined, UserOutlined, PhoneOutlined,
  EyeInvisibleOutlined, EyeOutlined, MessageOutlined,
  CompassOutlined, TeamOutlined,
} from "@ant-design/icons";
import { useLogin, useRegister } from "../services/queries/authQueries";

const { TabPane } = Tabs;

const FEATURES = [
  { icon: "💬", text: "Share whispers across rooms & circles" },
  { icon: "📡", text: "Track chats, reactions & secret mentions" },
  { icon: "🔥", text: "Real-time pulse on who's saying what" },
];

const TAGLINES = [
  "Every whisper finds its way.",
  "Secrets travel fast here.",
  "The town square never sleeps.",
];

const ROLE_OPTIONS = [
  { value: "100", label: "Member" },
  { value: "200", label: "Moderator" },
  { value: "300", label: "Admin" },
];

export default function Login() {
  const loginMutation = useLogin();
  const { mutateAsync: registerMutation, error, loading } = useRegister();

  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const [activeTab, setActiveTab] = useState("login");
  const [mounted, setMounted] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [coords, setCoords] = useState({});
  const [locLoading, setLocLoading] = useState(false);
  const [tagline] = useState(() => TAGLINES[Math.floor(Math.random() * TAGLINES.length)]);

  useEffect(() => {
    document.documentElement.style.height = "100%";
    document.body.style.height = "100%";
    document.body.style.margin = "0";
    const t = setTimeout(() => { setMounted(true); detectLocation() }, 80);
    return () => clearTimeout(t);
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) { message.warning("Geolocation not supported."); return; }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => {
        registerForm.setFieldsValue({
          latitude: parseFloat(c.latitude.toFixed(4)),
          longitude: parseFloat(c.longitude.toFixed(4)),
        });
        setCoords(c)
        setLocLoading(false);
      },
      () => { setLocLoading(false); message.error("Could not get location."); }
    );
  };

  const handleLogin = async (values) => {
    setLoginLoading(true);
    try {
      await loginMutation.mutateAsync({ email: values.email, password: values.password });
      setLoginSuccess(true);
    } catch {
      message.error("Invalid credentials. Try again.");
    } finally { setLoginLoading(false); }
  };

  const handleRegister = async (values) => {
    setRegisterLoading(true);
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: '100',
      mobileNumber: values.mobileNumber,
      longitude: coords.longitude,
      latitude: coords.latitude,
    };
    try {
      await registerMutation(payload);
      setRegisterSuccess(true);
    } catch (err) {
      message.error(err?.data?.message || "Registration failed. Please try again.");
    } finally { setRegisterLoading(false); }
  };

  return (
    <>
      {/* ── Global styles: keyframes + Ant Design overrides ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;1,9..40,400&display=swap');

        @keyframes wave   { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(16deg)} 75%{transform:rotate(-12deg)} }
        @keyframes float  { 0%,100%{transform:translateY(0) rotate(-3deg)} 50%{transform:translateY(-10px) rotate(3deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(2deg)} 50%{transform:translateY(-14px) rotate(-2deg)} }
        @keyframes blink  { 0%,80%,100%{opacity:1} 40%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-glow { 0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,0.5)} 50%{box-shadow:0 0 0 6px rgba(74,222,128,0)} }

        .wave-hand  { display:inline-block; transform-origin:70% 70%; animation:wave 2.2s ease-in-out infinite; }
        .bubble-a   { animation:float  4s   ease-in-out infinite; }
        .bubble-b   { animation:floatB 5.2s ease-in-out infinite; }
        .typing-dot { animation:blink  1.4s ease-in-out infinite; }
        .typing-dot:nth-child(2){ animation-delay:.2s; }
        .typing-dot:nth-child(3){ animation-delay:.4s; }
        .fade-up    { animation:fadeUp .5s ease both; }
        .online-dot { animation:pulse-glow 2s ease-in-out infinite; }

        /* ── Ant Design Form overrides ── */
        .ck-form .ant-input-affix-wrapper {
          border-radius: 12px !important;
          border: 1.5px solid #e5e7eb !important;
          background: #f9fafb !important;
          padding: 0 14px !important;
          transition: all 0.2s !important;
        }
        .ck-form .ant-input-affix-wrapper .ant-input {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
          padding: 11px 6px !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 15px !important;
          color: #1e1b4b !important;
        }
        .ck-form .ant-input-affix-wrapper:hover  { border-color: #a5b4fc !important; }
        .ck-form .ant-input-affix-wrapper-focused,
        .ck-form .ant-input-affix-wrapper:focus  {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12) !important;
          background: white !important;
        }
        .ck-form .ant-input-prefix { color: #a5b4fc !important; margin-right:8px; }
        .ck-form .ant-input-password-icon,
        .ck-form .ant-input-password-icon:hover { color:#a5b4fc !important; }
        .ck-form .ant-input-password-icon:hover  { color:#6366f1 !important; }
        .ck-form .ant-form-item-label > label {
          font-family: 'Sora', sans-serif !important;
          font-weight: 700 !important;
          font-size: 13px !important;
          color: #374151 !important;
          letter-spacing: 0.01em !important;
        }
        .ck-form .ant-form-item { margin-bottom: 16px !important; }
        .ck-form .ant-form-item-explain-error { font-size:12px !important; margin-top:4px !important; }

        /* Plain input (coord fields) */
        .ck-form .ant-input {
          border-radius: 12px !important;
          border: 1.5px solid #e5e7eb !important;
          background: #f9fafb !important;
          padding: 11px 14px !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 15px !important;
          color: #1e1b4b !important;
          transition: all 0.2s !important;
        }
        .ck-form .ant-input:hover  { border-color: #a5b4fc !important; }
        .ck-form .ant-input:focus  {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12) !important;
          background: white !important;
        }

        /* Select */
        .ck-form .ant-select-selector {
          border-radius: 12px !important;
          border: 1.5px solid #e5e7eb !important;
          background: #f9fafb !important;
          min-height: 48px !important;
          align-items: center !important;
          font-family: 'DM Sans', sans-serif !important;
          font-size: 15px !important;
          color: #1e1b4b !important;
          padding: 4px 14px !important;
        }
        .ck-form .ant-select-selector:hover     { border-color: #a5b4fc !important; }
        .ck-form .ant-select-focused .ant-select-selector {
          border-color: #6366f1 !important;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.12) !important;
        }
        .ck-select-drop .ant-select-item-option-selected {
          background: #eef2ff !important; color: #6366f1 !important; font-weight:600 !important;
        }

        /* Checkbox */
        .ck-form .ant-checkbox-checked .ant-checkbox-inner { background:#6366f1 !important; border-color:#6366f1 !important; }
        .ck-form .ant-checkbox:hover .ant-checkbox-inner   { border-color:#6366f1 !important; }

        /* Tabs */
        .ck-tabs .ant-tabs-nav { margin-bottom:24px !important; }
        .ck-tabs .ant-tabs-tab {
          font-family:'Sora',sans-serif !important; font-weight:700 !important;
          font-size:14px !important; color:#9ca3af !important; padding:10px 20px !important;
        }
        .ck-tabs .ant-tabs-tab-active .ant-tabs-tab-btn { color:#6366f1 !important; }
        .ck-tabs .ant-tabs-tab:hover .ant-tabs-tab-btn  { color:#6366f1 !important; }
        .ck-tabs .ant-tabs-ink-bar { background:#6366f1 !important; height:3px !important; border-radius:4px !important; }

        /* Register scroll */
        .reg-scroll { overflow-y:auto; max-height:62vh; padding-right:4px; }
        .reg-scroll::-webkit-scrollbar       { width:4px; }
        .reg-scroll::-webkit-scrollbar-thumb { background:#e0e7ff; border-radius:4px; }
      `}</style>

      {/* ── Page wrapper ── */}
      <div className="min-h-screen min-w-screen flex items-center justify-center p-5 bg-gradient-to-br from-indigo-50 via-blue-100 to-violet-100"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>

        {/* Ambient blobs */}
        <div className="fixed top-[8%] left-[5%] w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)" }} />
        <div className="fixed bottom-[10%] right-[8%] w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)" }} />

        {/* ── Card ── */}
        <div
          className="w-[100] flex flex-row rounded-3xl overflow-hidden"
          style={{
            maxWidth: "100%",
            boxShadow: "0 24px 80px rgba(79,70,229,0.14), 0 2px 0 rgba(255,255,255,0.8) inset",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0) scale(1)" : "translateY(28px) scale(0.98)",
            transition: "opacity 0.65s cubic-bezier(.22,1,.36,1), transform 0.65s cubic-bezier(.22,1,.36,1)",
          }}
        >

          {/* ════ LEFT PANEL ════ */}
          <div
            className="relative flex flex-col text-white overflow-hidden"
            style={{
              width: "42%", minWidth: "300px", padding: "52px 40px",
              background: "linear-gradient(160deg, #4338ca 0%, #6366f1 55%, #7c3aed 100%)",
            }}
          >
            {/* Noise texture */}
            <div className="absolute inset-0 pointer-events-none opacity-50"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")` }} />
            {/* Deco blobs */}
            <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="absolute -bottom-24 -left-16 w-72 h-72 rounded-full" style={{ background: "rgba(196,181,253,0.10)" }} />

            {/* Floating chat bubbles */}
            <div className="bubble-a absolute top-[17%] right-[10%] pointer-events-none text-[12.5px]"
              style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "18px 18px 4px 18px", padding: "9px 14px", color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>
              psst… did you hear? 🤫
            </div>
            <div className="bubble-b absolute bottom-[24%] right-[6%] pointer-events-none text-xs"
              style={{ background: "rgba(255,255,255,0.09)", backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "18px 4px 18px 18px", padding: "9px 14px", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>
              🔥 trending now
            </div>

            {/* Logo */}
            <div className="flex items-center gap-3 mb-11">
              <div className="w-[50px] h-[50px] rounded-[14px] flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.15)", border: "1.5px solid rgba(255,255,255,0.28)", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
                <MessageOutlined className="text-xl text-white" />
              </div>
              <div>
                <h2 className="text-[15px] font-extrabold uppercase tracking-widest m-0" style={{ fontFamily: "'Sora',sans-serif" }}>
                  ✌ Chugalkhor ✌
                </h2>
                <p className="text-[11.5px] italic mt-0.5 m-0" style={{ opacity: 0.6 }}>Chat · Gossip · Connect</p>
              </div>
            </div>

            {/* Headline */}
            <h2 className="font-extrabold leading-tight mb-3 tracking-tight"
              style={{ fontSize: "clamp(24px,4vw,32px)", fontFamily: "'Sora',sans-serif" }}>
              {activeTab === "login"
                ? <><span className="wave-hand">👋</span> Welcome back</>
                : <>Join the chatter 🎉</>}
            </h2>

            <p className="text-[14.5px] leading-relaxed mb-8" style={{ opacity: 0.75 }}>
              {activeTab === "login"
                ? `${tagline} Sign back in and jump into the conversation.`
                : "Create your account and become part of the most candid community around."}
            </p>

            {/* Typing indicator */}
            <div className="flex items-center gap-2 mb-8" style={{ opacity: 0.65 }}>
              <div className="flex gap-1 items-center px-3 py-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }}>
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white inline-block" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white inline-block" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white inline-block" />
              </div>
              <span className="text-[12.5px] italic">someone is typing…</span>
            </div>

            {/* Features */}
            <ul className="mt-auto list-none p-0 m-0 flex flex-col gap-3.5">
              {FEATURES.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-[13.5px]">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[13px] flex-shrink-0"
                    style={{ background: "rgba(165,180,252,0.15)" }}>
                    {f.icon}
                  </span>
                  <span style={{ opacity: 0.85 }}>{f.text}</span>
                </li>
              ))}
            </ul>

            {/* Online badge */}
            <div className="mt-7 pt-4 flex items-center gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              <span className="online-dot w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <span className="text-[12.5px]" style={{ opacity: 0.65 }}>2,400+ active chugalkhors online</span>
            </div>
          </div>

          {/* ════ RIGHT PANEL ════ */}
          <div className="flex-1 bg-white flex flex-col justify-center min-w-0"
            style={{ padding: "clamp(28px,4.5vw,48px) clamp(24px,4vw,44px)" }}>

            {/* Brand pill */}
            <div className="inline-flex items-center self-start bg-indigo-50 rounded-full px-3.5 py-1.5 mb-3">
              <span className="text-[11px] font-extrabold text-indigo-500 uppercase tracking-widest"
                style={{ fontFamily: "'Sora',sans-serif" }}>
                ✌ Chugalkhor
              </span>
            </div>

            {/* ── TABS ── */}
            <Tabs activeKey={activeTab} onChange={setActiveTab} className="ck-tabs" destroyInactiveTabPane={false} tabBarGutter={8}>

              {/* ═══ SIGN IN ═══ */}
              <TabPane tab={<span><LockOutlined /> Sign In</span>} key="login">
                {loginSuccess ? (
                  <div className="fade-up flex flex-col items-center gap-4 py-10 text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)", boxShadow: "0 12px 40px rgba(99,102,241,0.35)" }}>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#1e1b4b] mb-1.5" style={{ fontFamily: "'Sora',sans-serif" }}>
                        You're in! 🎉
                      </h2>
                      <p className="text-gray-500 text-[15px]">The chatter awaits — heading to your feed…</p>
                    </div>
                  </div>
                ) : (
                  <Form form={loginForm} layout="vertical" onFinish={handleLogin} className="ck-form" requiredMark={false}>
                    <Form.Item name="email" label="Your Email"
                      rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
                      <Input prefix={<MailOutlined />} placeholder="you@chugalkhor.app" size="large" />
                    </Form.Item>

                    <Form.Item name="password" label="Password"
                      rules={[{ required: true, message: "Password is required" }]}>
                      <Input.Password prefix={<LockOutlined />} placeholder="••••••••" size="large"
                        iconRender={v => v ? <EyeOutlined /> : <EyeInvisibleOutlined />} />
                    </Form.Item>

                    <Form.Item>
                      <div className="flex justify-between items-center">
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                          <Checkbox className="text-[13.5px] text-gray-600" style={{ fontFamily: "'DM Sans',sans-serif" }}>
                            Keep me signed in
                          </Checkbox>
                        </Form.Item>
                        <a href="#" className="text-indigo-500 font-semibold text-[13.5px] no-underline hover:text-indigo-700 transition-colors">
                          Forgot password?
                        </a>
                      </div>
                    </Form.Item>

                    <Form.Item className="!mb-0">
                      <Button htmlType="submit" loading={loginLoading} block size="large"
                        className="!border-none !rounded-xl !h-[52px] !text-[15.5px] !font-bold !text-white hover:!opacity-90 transition-opacity"
                        style={{
                          background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                          boxShadow: "0 8px 28px rgba(99,102,241,0.35)",
                          fontFamily: "'Sora',sans-serif",
                        }}>
                        Enter the conversation →
                      </Button>
                    </Form.Item>
                  </Form>
                )}

                <p className="mt-5 text-center text-gray-400 text-[13.5px]">
                  New here?{" "}
                  <span onClick={() => setActiveTab("register")}
                    className="text-indigo-500 font-semibold cursor-pointer hover:text-indigo-700 transition-colors">
                    Create an account
                  </span>
                </p>
              </TabPane>

              {/* ═══ REGISTER ═══ */}
              <TabPane tab={<span><TeamOutlined /> Register</span>} key="register">
                {registerSuccess ? (
                  <div className="fade-up flex flex-col items-center gap-4 py-10 text-center">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)", boxShadow: "0 12px 40px rgba(99,102,241,0.35)" }}>
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-extrabold text-[#1e1b4b] mb-1.5" style={{ fontFamily: "'Sora',sans-serif" }}>
                        Account created! 🥳
                      </h2>
                      <p className="text-gray-500 text-[15px] mb-4">Welcome to Chugalkhor — time to make some noise.</p>
                      <Button onClick={() => setActiveTab("login")}
                        className="!rounded-xl !border-indigo-400 !text-indigo-500 !font-semibold hover:!border-indigo-600 hover:!text-indigo-700">
                        Sign in now
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="reg-scroll">
                    <Form
                      form={registerForm} layout="vertical" onFinish={handleRegister}
                      className="ck-form" requiredMark={false}
                      initialValues={{ role: "100", latitude: 28.7041, longitude: 69.1025 }}
                    >
                      {/* Name */}
                      <Form.Item name="name" label="Full Name"
                        rules={[{ required: true, message: "Name is required" }]}>
                        <Input prefix={<UserOutlined />} placeholder="Joya Khan" size="large" />
                      </Form.Item>

                      {/* Email */}
                      <Form.Item name="email" label="Email Address"
                        rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
                        <Input prefix={<MailOutlined />} placeholder="joya@example.com" size="large" />
                      </Form.Item>

                      {/* Password */}
                      <Form.Item name="password" label="Password"
                        rules={[{ required: true, min: 4, message: "Min 4 characters" }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="Min 4 characters" size="large"
                          iconRender={v => v ? <EyeOutlined /> : <EyeInvisibleOutlined />} />
                      </Form.Item>

                      {/* Mobile */}
                      <Form.Item name="mobileNumber" label="Mobile Number (Optional)"
                        rules={[{ required: true, pattern: /^\d{10}$/, message: "Enter a valid 10-digit number" }]}>
                        <Input prefix={<PhoneOutlined />} placeholder="9876543210" size="large" maxLength={10} />
                      </Form.Item>

                      {/* Submit */}
                      <Form.Item className="!mb-0 mt-1">
                        <Button htmlType="submit" loading={registerLoading} block size="large"
                          className="!border-none !rounded-xl !h-[52px] !text-[15.5px] !font-bold !text-white hover:!opacity-90 transition-opacity"
                          style={{
                            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
                            boxShadow: "0 8px 28px rgba(99,102,241,0.35)",
                            fontFamily: "'Sora',sans-serif",
                          }}>
                          Join Chugalkhor 🎉
                        </Button>
                      </Form.Item>
                    </Form>
                  </div>
                )}

                <p className="mt-4 text-center text-gray-400 text-[13.5px]">
                  Already have an account?{" "}
                  <span onClick={() => setActiveTab("login")}
                    className="text-indigo-500 font-semibold cursor-pointer hover:text-indigo-700 transition-colors">
                    Sign in
                  </span>
                </p>
              </TabPane>
            </Tabs>

            {/* Footer */}
            <div className="mt-3 pt-4 border-t border-gray-100">
              <p className="text-center text-gray-400 text-[13px] m-0">
                Can't get in? Ping your <strong className="text-gray-500">group admin</strong> or reach out to support.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}