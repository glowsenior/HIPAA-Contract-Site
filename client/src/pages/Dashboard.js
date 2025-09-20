import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Button, 
  Typography, 
  Space, 
  Table, 
  Tag, 
  Progress,
  Spin,
  Empty,
  Alert
} from 'antd';
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  ArrowRight,
  Calendar,
  Shield,
  Eye,
  Edit
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useContract } from '../contexts/ContractContext';
import './Dashboard.css';

const { Title, Paragraph, Text } = Typography;

const Dashboard = () => {
  const { user } = useAuth();
  const { contracts, fetchContracts, loading } = useContract();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const data = await fetchContracts({ limit: 10 });
        calculateStats(data.contracts);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  const calculateStats = (contractsData) => {
    const stats = {
      total: contractsData.length,
      pending: contractsData.filter(c => c.status === 'pending').length,
      inProgress: contractsData.filter(c => c.status === 'in-progress').length,
      completed: contractsData.filter(c => c.status === 'completed').length
    };
    setStats(stats);
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      pending: 'warning',
      approved: 'success',
      'in-progress': 'processing',
      completed: 'success',
      cancelled: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      draft: 'Draft',
      pending: 'Pending',
      approved: 'Approved',
      'in-progress': 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return texts[status] || status;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const recentContracts = contracts.slice(0, 5);

  const columns = [
    {
      title: 'Contract',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.projectType}
          </Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget, record) => (
        <Text strong>{formatCurrency(budget, record.currency)}</Text>
      ),
    },
    {
      title: 'Timeline',
      dataIndex: 'timeline',
      key: 'timeline',
      render: (timeline) => (
        <div>
          <Text style={{ fontSize: '12px' }}>
            {formatDate(timeline.startDate)} - {formatDate(timeline.endDate)}
          </Text>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="text" 
            icon={<Eye size={14} />}
            href={`/contracts/${record._id}`}
          />
          <Button 
            type="text" 
            icon={<Edit size={14} />}
            href={`/contracts/${record._id}`}
          />
        </Space>
      ),
    },
  ];

  const quickActions = [
    {
      title: 'Create New Contract',
      description: 'Start a new medical website project',
      icon: <Plus size={24} />,
      link: '/contracts/create',
      color: '#1890ff'
    },
    {
      title: 'View All Contracts',
      description: 'Manage your existing contracts',
      icon: <FileText size={24} />,
      link: '/contracts',
      color: '#52c41a'
    },
    {
      title: 'Update Profile',
      description: 'Manage your account settings',
      icon: <Users size={24} />,
      link: '/profile',
      color: '#722ed1'
    }
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <Spin size="large" />
        <Paragraph>Loading your dashboard...</Paragraph>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <Title level={2} className="dashboard-title">
            Welcome back, {user?.firstName}! 👋
          </Title>
          <Paragraph className="dashboard-subtitle">
            Here's what's happening with your medical website contracts today.
          </Paragraph>
        </div>
        <Button type="primary" size="large" icon={<Plus size={16} />}>
          <Link to="/contracts/create">New Contract</Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} className="stats-section">
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Contracts"
              value={stats.total}
              prefix={<FileText size={20} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Pending Review"
              value={stats.pending}
              prefix={<Clock size={20} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="In Progress"
              value={stats.inProgress}
              prefix={<TrendingUp size={20} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Completed"
              value={stats.completed}
              prefix={<CheckCircle size={20} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} className="dashboard-content">
        {/* Recent Contracts */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <FileText size={20} />
                Recent Contracts
              </Space>
            }
            extra={
              <Button type="link">
                <Link to="/contracts">View All</Link>
                <ArrowRight size={14} />
              </Button>
            }
            className="contracts-card"
          >
            {recentContracts.length > 0 ? (
              <Table
                columns={columns}
                dataSource={recentContracts}
                rowKey="_id"
                pagination={false}
                size="small"
                className="contracts-table"
              />
            ) : (
              <Empty
                description="No contracts yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary">
                  <Link to="/contracts/create">Create Your First Contract</Link>
                </Button>
              </Empty>
            )}
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <Shield size={20} />
                Quick Actions
              </Space>
            }
            className="actions-card"
          >
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {quickActions.map((action, index) => (
                <Card
                  key={index}
                  hoverable
                  className="action-card"
                  onClick={() => window.location.href = action.link}
                >
                  <div className="action-content">
                    <div 
                      className="action-icon"
                      style={{ color: action.color }}
                    >
                      {action.icon}
                    </div>
                    <div className="action-text">
                      <Text strong>{action.title}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {action.description}
                      </Text>
                    </div>
                    <ArrowRight size={16} className="action-arrow" />
                  </div>
                </Card>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Progress Overview */}
      {stats.total > 0 && (
        <Row gutter={[24, 24]} className="progress-section">
          <Col span={24}>
            <Card 
              title={
                <Space>
                  <TrendingUp size={20} />
                  Project Progress Overview
                </Space>
              }
              className="progress-card"
            >
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={8}>
                  <div className="progress-item">
                    <Text strong>Pending Approval</Text>
                    <Progress 
                      percent={stats.total > 0 ? (stats.pending / stats.total) * 100 : 0} 
                      strokeColor="#faad14"
                      showInfo={false}
                    />
                    <Text type="secondary">{stats.pending} contracts</Text>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="progress-item">
                    <Text strong>In Progress</Text>
                    <Progress 
                      percent={stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0} 
                      strokeColor="#1890ff"
                      showInfo={false}
                    />
                    <Text type="secondary">{stats.inProgress} contracts</Text>
                  </div>
                </Col>
                <Col xs={24} sm={8}>
                  <div className="progress-item">
                    <Text strong>Completed</Text>
                    <Progress 
                      percent={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} 
                      strokeColor="#52c41a"
                      showInfo={false}
                    />
                    <Text type="secondary">{stats.completed} contracts</Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;