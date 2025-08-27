import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Space, Spin, message } from "antd";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { FaList, FaRegNewspaper, FaRegUser } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { handleGetApi, removeCookie } from "../../config";
import { MainContext } from "../../context/MainContext";

// Types
interface User {
  id: string;
  username: string;
  email?: string;
  role?: string;
  avatar?: string;
}

interface ApiResponse {
  data: User;
  statusCode?: number;
}

interface LayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data - only run once when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = (await handleGetApi("/auth/me")) as ApiResponse;
        const userData = response.data;
        if (response?.statusCode === 401 || response?.statusCode === 502) {
          // Clear invalid tokens and redirect to login
          removeCookie("access_token");
          removeCookie("refresh_token");
          removeCookie("authToken");
          setUser(null);
          // Force redirect to break any potential loop
          window.location.href = "/login";
          return;
        } else {
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Clear potentially invalid tokens and redirect to login
        removeCookie("access_token");
        removeCookie("refresh_token");
        removeCookie("authToken");
        setUser(null);
        // Force redirect to break any potential loop
        window.location.href = "/login";
        return;
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []); // Empty dependency array - only run once on mount

  // Menu items - Admin layout (no role filtering for now)
  const menuItems = [
    {
      key: "/user",
      icon: <FaRegUser size={22} />,
      label: <Link to="/user">User Management</Link>,
    },
    {
      key: "/post",
      icon: <FaRegNewspaper size={22} />,
      label: <Link to="/post">Post Management</Link>,
    },
    {
      key: "/category",
      icon: <FaList size={22} />,
      label: <Link to="/category">Category Management</Link>,
    },
  ];

  // Generate breadcrumb items
  // const getBreadcrumbItems = () => {
  //   const pathname = location.pathname;
  //   const parentMenu = menuItems.find((item) => pathname.includes(item.key));

  //   // Find selected child menu
  //   const childMenu = parentMenu?.children?.find((child: any) =>
  //     pathname.includes(child.key)
  //   );

  //   const breadcrumbs = [
  //     {
  //       title: "Trang chủ",
  //     },
  //   ];

  //   // Add parent menu if exists
  //   if (parentMenu && typeof parentMenu.label === "string") {
  //     breadcrumbs.push({
  //       title: parentMenu.label,
  //     });
  //   } else if (parentMenu && typeof parentMenu.label === "object") {
  //     breadcrumbs.push({
  //       title: (parentMenu.label as any).props?.children || "Menu",
  //     });
  //   }

  //   // Add child menu if exists
  //   if (childMenu) {
  //     breadcrumbs.push({
  //       title: (childMenu.label as any).props?.children || "Submenu",
  //     });
  //   }

  //   return breadcrumbs;
  // };

  // Handle logout
  const handleLogout = () => {
    removeCookie("access_token");
    removeCookie("refresh_token");
    removeCookie("authToken");
    message.success("Đăng xuất thành công");
    navigate("/login");
  };

  // Admin dropdown items
  const adminDropdownItems = [
    {
      icon: <LogoutOutlined />,
      label: (
        <div
          style={{ width: 100 }}
          onClick={handleLogout}
          className="cursor-pointer"
        >
          Đăng xuất
        </div>
      ),
      key: "0",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <MainContext.Provider value={{ user, setUser }}>
      <div className="flex overflow-y-auto min-h-screen">
        {/* Sidebar */}
        <div className="bg-white z-50 min-h-screen h-full flex flex-col shadow-lg">
          {/* Logo */}
          <div className="flex justify-between items-center gap-y-3">
            <div className="flex w-full py-2 px-4 bg-blue-500">
              <img
                src={logo}
                className="object-cover h-12 mx-auto"
                alt="logo"
              />
            </div>
          </div>

          {/* Menu */}
          <Menu
            className="mt-2 w-[260px] px-2 flex-grow max-h-screen overflow-y-auto"
            defaultSelectedKeys={[location.pathname]}
            mode="inline"
            theme="light"
            items={menuItems}
          />
        </div>

        {/* Main Content */}
        <div className="flex-grow flex flex-col h-screen overflow-x-hidden bg-[#f5f7f8]">
          {/* Header */}
          <div className="bg-white py-2 px-4 md:px-6 flex h-[55px] justify-between items-center border-b border-gray-200 sticky top-0 z-50">
            {/* Breadcrumb */}
            {/* <div>
              <Breadcrumb separator=">" items={getBreadcrumbItems()} />
            </div> */}

            {/* User Dropdown */}
            <div className="cursor-pointer">
              <Dropdown
                menu={{ items: adminDropdownItems }}
                trigger={["click"]}
                placement="bottomLeft"
              >
                <a
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Space>
                    <UserOutlined />
                    <span>{user?.username || "Admin"}</span>
                    <DownOutlined />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>

          {/* Page Content */}
          <div
            style={{ height: "calc(100% - 70px)" }}
            className="flex flex-col"
          >
            {children}
          </div>
        </div>
      </div>
    </MainContext.Provider>
  );
};

export default MainLayout;
