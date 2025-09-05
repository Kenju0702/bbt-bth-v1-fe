import React, { useState } from "react";
import { Layout, Menu, Modal } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  ProjectOutlined,
  HomeOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  FileDoneOutlined,
  TrophyOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { resetUser } from "../../../redux/slices/userSlice";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const user = useSelector((state) => state.user.user);

  const showLogoutConfirm = () => setIsLogoutModalOpen(true);
  const handleConfirmLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    dispatch(resetUser());
    setIsLogoutModalOpen(false);
    navigate("/sign-in");
  };
  const handleCancelLogout = () => setIsLogoutModalOpen(false);

  const getMenuItems = () => {
    const items = [];

    if (user?.roles?.includes("admin")) {
      items.push(
        {
          key: "/system/admin/report",
          label: <Link to="/system/admin/report">Báo cáo & Thống kê</Link>,
          icon: <FileTextOutlined />,
        },
        {
          key: "/system/admin/citizens",
          label: <Link to="/system/admin/citizens">Quản lý hộ dân</Link>,
          icon: <UserOutlined />,
        },
        {
          key: "/system/admin/employees",
          label: <Link to="/system/admin/employees">Quản lý nhân viên</Link>,
          icon: <TeamOutlined />,
        },
        {
          key: "/system/admin/project",
          label: <Link to="/system/admin/project">Quản lý dự án</Link>,
          icon: <ProjectOutlined />,
        },
        {
          key: "/system/admin/lands",
          label: <Link to="/system/admin/lands">Quản lý đất</Link>,
          icon: <HomeOutlined />,
        }
      );
    }

    if (user?.roles?.includes("employee")) {
      items.push(
        {
          key: "/system/teacher/schedule",
          label: <Link to="/system/teacher/schedule">Lịch giảng dạy</Link>,
          icon: <CalendarOutlined />,
        },
        {
          key: "/system/teacher/attendance-management",
          label: (
            <Link to="/system/teacher/attendance-management">
              Quản lý điểm danh
            </Link>
          ),
          icon: <CheckCircleOutlined />,
        },
        {
          key: "/system/teacher/exams",
          label: <Link to="/system/teacher/exams">Quản lý bài thi</Link>,
          icon: <FileDoneOutlined />,
        },
        {
          key: "/system/teacher/score-management",
          label: <Link to="/system/teacher/score-management">Quản lý điểm</Link>,
          icon: <TrophyOutlined />,
        }
      );
    }

    items.push({
      key: "logout",
      label: "Thoát", // mặc định đen
      icon: <LogoutOutlined />,
      className: "logout-item",
      onClick: showLogoutConfirm,
    });

    return items;
  };

  return (
    <Sider
      width={240}
      theme="light"
      className="bg-white shadow-lg h-screen sticky top-0"
    >
      {/* Logo & Title */}
      <div className="flex flex-col items-center p-4">
        <Link to="/system/admin" className="flex flex-col items-center">
          <img
            src="https://qlvb.tphcm.gov.vn/qlvbdh/login/img/logo-header.png"
            alt="Logo"
            className="w-20 h-20 rounded-md mb-2"
          />
          <h3 className="text-blue-600 text-center text-sm font-semibold truncate">
            Ban bồi thường giải phóng
          </h3>
          <h3 className="text-blue-600 text-center text-sm font-semibold mb-1 truncate">
            mặt bằng quận bình thạnh
          </h3>
          <span className="text-green-500 text-xs">● Online</span>
        </Link>
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[location.pathname]}
        items={getMenuItems()}
        className="
          bg-white border-r-0
          [&_.ant-menu-item]:!py-3
          [&_.ant-menu-item]:!flex [&_.ant-menu-item]:!items-center [&_.ant-menu-item]:!gap-3
          [&_.ant-menu-item-selected]:!bg-blue-50
          [&_.ant-menu-item-selected]:!border-l-4 [&_.ant-menu-item-selected]:!border-blue-600
          [&_.ant-menu-item-selected]:!text-blue-600
          [&_.ant-menu-item:hover]:!text-blue-600
          [&_.logout-item:hover]:!text-red-500
        "
      />

      <Modal
        title="Xác nhận đăng xuất"
        open={isLogoutModalOpen}
        onOk={handleConfirmLogout}
        onCancel={handleCancelLogout}
        okText="Đăng xuất"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn thoát không?</p>
      </Modal>
    </Sider>
  );
};

export default Sidebar;
