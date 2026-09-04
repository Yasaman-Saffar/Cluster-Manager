import {
  AppstoreOutlined,
  CloudServerOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, Switch, Typography, theme } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";

import AppRoutes from "../routes/AppRoutes";
import "../styles/AppLayout.css";

const { Header, Sider, Content } = Layout;

function getBreadcrumbItems(pathname) {
  const items = [
    {
      title: <Link to="/clusters">Clusters</Link>,
    },
  ];

  if (pathname.endsWith("/apps/new")) {
    items.push(
      {
        title: "Cluster Details",
      },
      {
        title: "Create App",
      },
    );

    return items;
  }

  if (pathname.startsWith("/apps/") && pathname.endsWith("/edit")) {
    items.push({
      title: "Edit App",
    });

    return items;
  }

  if (pathname.startsWith("/clusters/") && pathname !== "/clusters") {
    items.push({
      title: "Cluster Details",
    });
  }

  return items;
}

function DashboardLayout({ darkMode, onThemeChange }) {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    token: {
      colorBgContainer,
      colorBgLayout,
      colorBorderSecondary,
      colorPrimary,
      colorText,
    },
  } = theme.useToken();

  const menuItems = [
    {
      key: "/clusters",
      icon: <CloudServerOutlined />,
      label: "Clusters",
    },
  ];

  const selectedMenuKey = location.pathname.startsWith("/clusters")
    ? "/clusters"
    : "";

  const breadcrumbItems = getBreadcrumbItems(location.pathname);

  return (
    <Layout className="app-shell" style={{ background: colorBgLayout }}>
      <Header
        className="app-header"
        style={{
          background: colorBgContainer,
          borderBottomColor: colorBorderSecondary,
        }}
      >
        <Link to="/clusters" className="app-brand">
          <span className="app-brand-icon" style={{ background: colorPrimary }}>
            <AppstoreOutlined />
          </span>

          <Typography.Title
            level={4}
            className="app-brand-title"
            style={{ color: colorText }}
          >
            Cluster Manager
          </Typography.Title>
        </Link>

        <div className="app-header-actions">
          <span className="theme-label">{darkMode ? "Dark" : "Light"}</span>

          <Switch
            checked={darkMode}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            onChange={onThemeChange}
            aria-label="Change color theme"
          />
        </div>
      </Header>

      <Layout>
        <Sider
          width={220}
          breakpoint="lg"
          collapsedWidth={72}
          className="app-sidebar"
          style={{
            background: colorBgContainer,
            borderInlineEndColor: colorBorderSecondary,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[selectedMenuKey]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            className="app-menu"
          />
        </Sider>

        <Layout style={{ background: colorBgLayout }}>
          <Content className="app-main">
            <Breadcrumb className="app-breadcrumb" items={breadcrumbItems} />

            <div className="app-page-content">
              <AppRoutes />
            </div>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout;
