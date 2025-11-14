"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ChevronDown,
  Search,
  User,
  Menu,
  X,
  LogOut,
  Heart,
  Clock,
  Settings,
} from "lucide-react";
import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
// import UserMenu from "./UserMenu";
const toSlug = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD") // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xóa dấu
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-") // thay khoảng trắng và ký tự đặc biệt bằng '-'
    .replace(/^-+|-+$/g, ""); // xóa dấu '-' thừa ở đầu/cuối
const Navbar = (): JSX.Element => {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // ✅ Lấy user khi mount + nghe thay đổi từ localStorage
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();

    // Lắng nghe thay đổi từ các tab khác hoặc sự kiện tùy chỉnh
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "user") loadUser();
    };
    const handleUserChange = () => loadUser();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("userChanged", handleUserChange);

    // Scroll + resize event
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userChanged", handleUserChange);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ✅ Khi đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged")); // 🔥 Báo cho Navbar cập nhật
    setUser(null);
    router.push("/");
  };

  return (
    <nav
      className={`fixed w-full transition-all duration-200 text-gray-100 z-50 ${
        scrolled
          ? "bg-gradient-to-r from-gray-900/95 to-gray-800/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      {/* ===== DESKTOP NAVBAR ===== */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3 max-w-full mx-auto">
        {/* LEFT: Logo + Search */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="SoranoHaru"
              width={40}
              height={40}
              className="w-9 h-9 rounded-md"
            />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold text-white text-lg">
                SoranoHaru
              </span>
              <span className="text-xs text-gray-400">Phim hay cả trời</span>
            </div>
          </Link>

          {/* Search */}
          <div className="flex items-center gap-2 rounded-full bg-gray-800/70 px-4 py-2 text-sm text-gray-300 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200 w-80">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              placeholder="Tìm kiếm phim, diễn viên..."
              className="bg-transparent outline-none w-full text-gray-100"
            />
          </div>
        </div>

        {/* CENTER: Menu */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/category/phim-le" className="hover:text-blue-400">
            Phim Lẻ
          </Link>
          <Link href="/category/phim-bo" className="hover:text-blue-400">
            Phim Bộ
          </Link>

          <div className="relative">
            <button
              onClick={() => toggleMenu("theloai")}
              className="flex items-center gap-1 hover:text-blue-400"
            >
              Thể loại <ChevronDown className="w-4 h-4" />
            </button>
            {openMenu === "theloai" && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 z-50">
                {["Anime", "Hành Động", "Lãng Mạn", "Kinh Dị"].map((t) => (
                  <Link
                    key={t}
                    href={`/category/${toSlug(t)}`}
                    className="block px-3 py-1 hover:bg-gray-700 rounded transition-colors"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: User */}
        <div
          className="relative"
          onMouseEnter={() => setUserMenuOpen(true)}
          onMouseLeave={() => setUserMenuOpen(false)}
        >
          {/* {!user ? (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-800 hover:bg-gray-200 transition font-medium"
            >
              <User className="w-5 h-5" />
              <span>Đăng nhập</span>
            </Link>
          ) : (
            <UserMenu />
          )} */}
        </div>
      </div>

      {/* ===== MOBILE NAVBAR ===== */}
      <div className="flex lg:hidden items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-gray-300 hover:text-blue-400"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          <Image src="/logo.png" alt="logo" width={36} height={36} />
          <span className="font-semibold">SoranoHaru</span>
        </div>

        <Search className="w-5 h-5 text-gray-300" />
      </div>

      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-[#1e2942] text-white p-4 space-y-4 z-40 rounded-b-2xl shadow-lg">
          {!user ? (
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-800 rounded-full py-2 font-medium"
            >
              <User className="w-5 h-5" /> Đăng nhập
            </Link>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt="avatar"
                  width={36}
                  height={36}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">{user.username}</p>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 hover:text-red-300"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <Link href="/user/favorites">Yêu thích</Link>
                <Link href="/user/watched">Đã xem</Link>
                <Link href="/user/profile">Cá nhân</Link>
                <Link href="/category/phim-le">Phim Lẻ</Link>
                <Link href="/category/phim-bo">Phim Bộ</Link>
                <Link href="/xem-chung">Xem Chung</Link>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
