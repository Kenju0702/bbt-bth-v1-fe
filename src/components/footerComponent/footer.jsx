import React from "react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-3 text-center text-sm text-gray-500">
          © {year} Ban Bồi thương, giải phóng mặt bằng Quận Bình Thạnh. Giữ mọi quyền.
        </div>
      </div>
    </footer>

  );
}
