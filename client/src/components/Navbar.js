import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, Space, Typography, Drawer } from 'antd';
import { 
  Stethoscope, 
  User, 
  LogOut, 
  Menu as MenuIcon, 
  X,
  FileText,
  Home,
  Plus,
  Users,
  Table,
  UserCircle,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserCircle size={16} />,
      label: <Link to="/profile">Profile</Link>,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogOut size={16} />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: 'home',
      icon: <Home size={16} />,
      label: <Link to="/">Home</Link>,
    },
    ...(isAuthenticated ? [
      {
        key: 'dashboard',
        icon: <Table size={16} />,
        label: <Link to="/dashboard">Dashboard</Link>,
      },
      {
        key: 'contracts',
        icon: <FileText size={16} />,
        label: <Link to="/contracts">Contracts</Link>,
      },
      {
        key: 'create',
        icon: <Plus size={16} />,
        label: <Link to="/contracts/create">New Contract</Link>,
      },
    ] : []),
  ];

  const mobileMenuItems = [
    {
      key: 'home',
      icon: <Home size={16} />,
      label: <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>,
    },
    ...(isAuthenticated ? [
      {
        key: 'dashboard',
        icon: <Table size={16} />,
        label: <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>,
      },
      {
        key: 'contracts',
        icon: <FileText size={16} />,
        label: <Link to="/contracts" onClick={() => setMobileMenuOpen(false)}>Contracts</Link>,
      },
      {
        key: 'create',
        icon: <Plus size={16} />,
        label: <Link to="/contracts/create" onClick={() => setMobileMenuOpen(false)}>New Contract</Link>,
      },
      {
        key: 'profile',
        icon: <UserCircle size={16} />,
        label: <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>,
      },
    ] : []),
  ];

  return (
    <Header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Shield className="brand-icon" />
          <span>Medical Contract Builder</span>
        </Link>

        <div className="navbar-desktop">
          <Menu
            mode="horizontal"
            items={menuItems}
            className="navbar-menu"
            style={{ border: 'none', backgroundColor: 'transparent' }}
          />

          <div className="navbar-auth">
            {isAuthenticated ? (
              <Space>
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={['click']}
                >
                  <Button type="text" className="user-button">
                    <Avatar 
                      size="small" 
                      icon={<User size={16} />}
                      style={{ backgroundColor: '#1890ff' }}
                    />
                    <Text className="user-name">
                      {user?.firstName} {user?.lastName}
                    </Text>
                  </Button>
                </Dropdown>
              </Space>
            ) : (
              <Space>
                <Button type="text">
                  <Link to="/login">Login</Link>
                </Button>
                <Button type="primary">
                  <Link to="/register">Get Started</Link>
                </Button>
              </Space>
            )}
          </div>
        </div>

        <Button
          type="text"
          className="navbar-toggle"
          onClick={() => setMobileMenuOpen(true)}
        >
          <MenuIcon size={20} />
        </Button>
      </div>

      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        className="mobile-drawer"
      >
        <Menu
          mode="vertical"
          items={mobileMenuItems}
          className="mobile-menu"
          style={{ border: 'none' }}
        />
        
        {!isAuthenticated && (
          <div className="mobile-auth-buttons">
            <Button block style={{ marginBottom: 8 }}>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
            </Button>
            <Button type="primary" block>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Get Started</Link>
            </Button>
          </div>
        )}

        {isAuthenticated && (
          <div className="mobile-auth-buttons">
            <Button 
              type="primary" 
              danger 
              block
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        )}
      </Drawer>
    </Header>
  );
};

export default Navbar;