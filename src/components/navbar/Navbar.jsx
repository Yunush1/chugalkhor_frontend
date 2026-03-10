import { useState, useEffect } from "react";
import { Drawer, Badge, Avatar, Tooltip } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  MessageOutlined,
  LoginOutlined,
  UserAddOutlined,
  MenuOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  HomeOutlined,
  BellOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";

const NAV_ITEMS = [
  { key: "/", label: "Rooms", icon: <HomeOutlined /> },
  { key: "/nearby", label: "Nearby", icon: <EnvironmentOutlined /> },
];

export default function Navbar() {
  const queryClient = useQueryClient();
  const { user } = queryClient.getQueryData(['auth']) || {}
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const isActive = (key) => location.pathname === key;

  // Helper to get display name
  const displayName = user
    ? user.name || user.username || user.email?.split("@")[0] || "User"
    : "Guest";

  const avatarSrc = user?.avatar || user?.photoURL || null;

  return (
    <div className="font-sora">
      {/* Header */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-[1000] h-16 
          flex items-center justify-between px-8
          backdrop-blur-xl transition-all duration-300 ease-out
          border-b
          ${scrolled
            ? "bg-slate-950/92 border-white/9 shadow-2xl shadow-black/45"
            : "bg-slate-950/78 border-white/4"
          }
        `}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 select-none">
          <div
            className="
            w-9 h-9 rounded-xl flex items-center justify-center text-white text-[17px] shrink-0
            bg-gradient-to-br from-[#4f8cff] to-[#a259f7]
            shadow-[0_0_18px_rgba(79,140,255,0.35)]
          "
          >
            <MessageOutlined />
          </div>

          <div className="flex items-center gap-2">
            <span
              className="
              text-[17px] font-bold tracking-[-0.3px]
              bg-gradient-to-r from-white via-white to-[#a0b4d6] bg-clip-text text-transparent
            "
            >
              Chugalkhor
            </span>

            <span
              className="
              text-[9px] font-semibold tracking-wider uppercase
              text-[#4f8cff] bg-[#4f8cff]/12 border border-[#4f8cff]/25
              rounded px-1.5 py-0.5 leading-none self-center
            "
            >
              Beta
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        {!isMobile && (
          <nav className="flex items-center gap-1 ml-9">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={item.key}
                className={`
                  relative flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium tracking-tight
                  transition-all duration-200
                  ${isActive(item.key)
                    ? "text-white bg-[#4f8cff]/13"
                    : "text-white/55 hover:text-white/92 hover:bg-white/7"
                  }
                `}
              >
                <span className="text-[13px] opacity-75">{item.icon}</span>
                {item.label}

                {isActive(item.key) && (
                  <span
                    className="
                    absolute bottom-0 left-4 right-4 h-0.5 rounded-t-sm opacity-85
                    bg-gradient-to-r from-[#4f8cff] to-[#a259f7]
                  "
                  />
                )}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side — Desktop */}
        {!isMobile && (
          <div className="flex items-center gap-3">
            <Tooltip title="Notifications" placement="bottom">
              <Badge count={3} size="small" offset={[-2, 2]}>
                <div
                  className="
                  w-9 h-9 flex items-center justify-center rounded-lg text-white/50
                  border border-white/9 cursor-pointer transition-all
                  hover:text-white hover:bg-white/7 hover:border-white/20
                "
                >
                  <BellOutlined className="text-[15px]" />
                </div>
              </Badge>
            </Tooltip>

            {user ? (
              <Tooltip
                title={
                  <div className="text-xs">
                    <div>{user.name || "User"}</div>
                    <div className="text-white/60">{user.email}</div>
                    {user.username && <div>@{user.username}</div>}
                  </div>
                }
                placement="bottomRight"
              >
                <div className="flex items-center gap-2.5 cursor-pointer group">
                  <Avatar
                    size={38}
                    src={avatarSrc}
                    className="bg-gradient-to-br from-[#4f8cff] to-[#a259f7]"
                  >
                    {displayName[0]?.toUpperCase()}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-white/95 group-hover:text-white">
                      {displayName}
                    </span>
                    <span className="text-xs text-white/45">{user.email}</span>
                  </div>
                  <DownOutlined className="text-white/50 text-xs" />
                </div>
              </Tooltip>
            ) : (
              <>
                <div className="w-px h-[22px] bg-white/10 mx-1" />
                <Link to="/register">
                  <button
                    className="
                      h-9 px-4 flex items-center gap-1.5 text-[13.5px] font-medium
                      text-white/75 border border-white/15 rounded-lg
                      hover:text-white hover:border-white/35 hover:bg-white/7
                      transition-all duration-200
                    "
                  >
                    <LoginOutlined />
                    Sign in
                  </button>
                </Link>
              </>
            )}
          </div>
        )}

        {/* Hamburger — Mobile */}
        {isMobile && (
          <button
            onClick={() => setDrawerOpen(true)}
            className="
              w-9 h-9 flex items-center justify-center rounded-lg
              text-white/70 border border-white/10
              hover:text-white hover:bg-white/7
              transition-all
            "
          >
            <MenuOutlined className="text-[15px]" />
          </button>
        )}
      </header>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
        size="large"
        closeIcon={null}
        styles={{
          body: { padding: "20px 16px", background: "#0a0f1e" },
          wrapper: { boxShadow: "-8px 0 40px rgba(0,0,0,0.6)" },
        }}
        classNames={{ body: "flex flex-col gap-0 h-full" }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2.5">
            <div
              className="
              w-8 h-8 rounded-lg flex items-center justify-center text-white text-base
              bg-gradient-to-br from-[#4f8cff] to-[#a259f7]
            "
            >
              <MessageOutlined />
            </div>
            <span className="font-bold text-base text-white">Chugalkhor</span>
          </div>

          <button
            onClick={() => setDrawerOpen(false)}
            className="
              w-[34px] h-[34px] flex items-center justify-center rounded-lg
              text-white/60 bg-white/7 border border-white/10
              hover:text-white
            "
          >
            <CloseOutlined className="text-[13px]" />
          </button>
        </div>

        {/* Nav Links */}
        <div className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.key}
              onClick={() => setDrawerOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium
                transition-colors
                ${isActive(item.key)
                  ? "text-white bg-[#4f8cff]/13"
                  : "text-white/65 hover:text-white hover:bg-[#4f8cff]/13"
                }
              `}
            >
              <span className="text-lg opacity-80">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="h-px bg-white/8 my-4" />

        {/* Auth / User Section */}
        {user ? (
          <div className="px-3 py-4 bg-white/5 rounded-xl border border-white/8">
            <div className="flex items-center gap-3">
              <Avatar
                size={48}
                src={avatarSrc}
                className="bg-gradient-to-br from-[#4f8cff] to-[#a259f7]"
              >
                {displayName[0]?.toUpperCase()}
              </Avatar>
              <div>
                <div className="font-medium text-white text-base">
                  {displayName}
                </div>
                <div className="text-white/60 text-sm">{user.email}</div>
                {user.username && (
                  <div className="text-white/45 text-xs">@{user.username}</div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            <Link to="/register" onClick={() => setDrawerOpen(false)}>
              <button
                className="
                  w-full h-[42px] flex items-center justify-center gap-2
                  text-sm font-medium text-white/75
                  border border-white/15 rounded-xl
                  hover:text-white hover:border-white/35 hover:bg-white/7
                  transition-all
                "
              >
                <LoginOutlined /> Sign in
              </button>
            </Link>
            <Link to="/register" onClick={() => setDrawerOpen(false)}>
              <button
                className="
                  w-full h-[42px] flex items-center justify-center gap-2
                  text-sm font-medium text-[#4f8cff]
                  border border-[#4f8cff]/30 rounded-xl
                  hover:border-[#4f8cff]/50 hover:bg-[#4f8cff]/8
                  transition-all
                "
              >
                <UserAddOutlined /> Create account
              </button>
            </Link>
          </div>
        )}

        {/* Footer / Spacer */}
        <div className="mt-auto pt-8 border-t border-white/6" />
      </Drawer>
    </div>
  );
}