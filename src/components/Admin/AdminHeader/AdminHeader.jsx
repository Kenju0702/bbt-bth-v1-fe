import React, { useState, useEffect } from "react"
import { useLocation, Link } from "react-router-dom"
import {
  HomeIcon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  CloudIcon
} from "@heroicons/react/24/outline"

const Header = () => {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [weather, setWeather] = useState(null)
  const [time, setTime] = useState(new Date())
  const formattedTime = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(time)
  const pathMap = {
    system: "Hệ thống",
    report:"Thống kê",
    admin: "Quản trị",
    lands: "Quản lý đất đai",
    project: "Dự án",
    employees: "Nhân viên",
    households: "Hộ dân trong dự án",
    citizens:"Hộ dân",
    new: "Thêm mới",
    add: "Thêm",
    edit: "Chỉnh sửa",
    detail: "Chi tiết",
  };
  // ⏰ Cập nhật giờ realtime
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 🌤 Gọi API thời tiết
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "7cc3df2098e7bf83644cb88ad46cfc9c"
        const city = "Ho Chi Minh"
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=vi`
        )
        const data = await res.json()
        if (data.main) {
          setWeather({
            temp: Math.round(data.main.temp),
            desc: data.weather[0].description,
            icon: data.weather[0].main
          })
        }
      } catch (error) {
        console.error("Lỗi khi gọi API thời tiết:", error)
      }
    }
    fetchWeather()
  }, [])

  // 📍 Tạo breadcrumb từ path
  // 📍 Tạo breadcrumb từ path
  const buildBreadcrumb = (pathname) => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.map((p, i) => ({
      name: pathMap[p] || (p.charAt(0).toUpperCase() + p.slice(1)), // dịch sang VI nếu có
      path: "/" + parts.slice(0, i + 1).join("/"),
    }));
  };
  const breadcrumbs = buildBreadcrumb(location.pathname)

  return (
    <header className="flex justify-between items-center bg-white shadow px-4 py-2 sticky top-0 z-10 h-14">
      {/* Left: Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <HomeIcon className="w-5 h-5 text-blue-500" />
        <div className="flex gap-1">
          {breadcrumbs.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              <Link to={b.path} className="hover:text-blue-500 transition">
                {b.name}
              </Link>
              {i < breadcrumbs.length - 1 && <span>/</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-8 pr-3 py-1.5 border rounded-full w-44 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Weather */}
        {weather && (
          <div className="flex items-center gap-2 text-gray-700 text-sm bg-blue-50 px-3 py-1.5 rounded-lg shadow-sm border border-blue-100">
            {weather.icon === "Clear" && (
              <SunIcon className="w-5 h-5 text-yellow-400" />
            )}
            {weather.icon === "Clouds" && (
              <CloudIcon className="w-5 h-5 text-blue-400" />
            )}
            {weather.icon === "Rain" && (
              <CloudIcon className="w-5 h-5 text-blue-600 animate-pulse" />
            )}
            {weather.icon === "Thunderstorm" && (
              <CloudIcon className="w-5 h-5 text-purple-600" />
            )}
            {weather.icon === "Snow" && (
              <CloudIcon className="w-5 h-5 text-cyan-400" />
            )}
            <span className="font-semibold">{weather.temp}°C</span>
            <span className="hidden sm:inline text-gray-600 capitalize">
              {weather.desc}
            </span>
          </div>
        )}

        {/* Time */}
        <div className="text-sm text-gray-600 font-medium min-w-[120px] text-right">
          <span className="tabular-nums">{formattedTime}</span>
          <span className="hidden sm:inline"> - {time.toLocaleDateString("vi-VN")}</span>
        </div>

        {/* Notification */}
        <div className="relative cursor-pointer">
          <BellIcon className="w-5 h-5 text-gray-600 hover:text-blue-500 transition" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 shadow">
            3
          </span>
        </div>

        {/* Avatar */}
        <div className="relative">
          <img
            src="https://i.pravatar.cc/100?img=3"
            alt="avatar"
            className="w-9 h-9 rounded-full cursor-pointer border-2 border-gray-200 hover:border-blue-400 hover:scale-105 transition"
            onClick={() => setOpen(!open)}
          />
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border text-sm overflow-hidden">
              <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50">
                <UserCircleIcon className="w-4 h-4 text-gray-600" />
                Thông tin
              </button>
              <hr />
              <button
                className="flex items-center gap-2 px-4 py-2 w-full text-red-600 hover:bg-red-50"
                onClick={() => console.log("Đăng xuất")}
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
