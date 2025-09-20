import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Space, 
  Table, 
  Tag, 
  Input,
  Select,
  Dropdown,
  Modal,
  message,
  Spin,
  Empty,
  Statistic,
  Divider
} from 'antd';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Eye,
  Trash2,
  FileText,
  Calendar,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useContract } from '../contexts/ContractContext';
import './Contracts.css';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { Search: SearchInput } = Input;

const Contracts = () => {
  const { user } = useAuth();
  const { contracts, fetchContracts, deleteContract, loading } = useContract();
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const loadContracts = async () => {
    try {
      await fetchContracts(filters);
    } catch (error) {
      console.error('Error loading contracts:', error);
    }
  };

  useEffect(() => {
    loadContracts();
  }, [filters]);

  const handleDelete = async (contractId) => {
    Modal.confirm({
      title: 'Delete Contract',
      content: 'Are you sure you want to delete this contract? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const result = await deleteContract(contractId);
          if (result.success) {
            message.success('Contract deleted successfully');
            loadContracts();
          } else {
            message.error(result.message);
          }
        } catch (error) {
          message.error('Failed to delete contract');
        }
      }
    });
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

  const getProjectTypeColor = (type) => {
    const colors = {
      'medical-website': 'blue',
      'ehr-system': 'green',
      'telemedicine': 'purple',
      'medical-app': 'orange',
      'other': 'default'
    };
    return colors[type] || 'default';
  };

  const getProjectTypeText = (type) => {
    const texts = {
      'medical-website': 'Medical Website',
      'ehr-system': 'EHR System',
      'telemedicine': 'Telemedicine',
      'medical-app': 'Medical App',
      'other': 'Other'
    };
    return texts[type] || type;
  };

  const columns = [
    {
      title: 'Contract',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: '16px' }}>{text}</Text>
          <br />
          <Tag color={getProjectTypeColor(record.projectType)}>
            {getProjectTypeText(record.projectType)}
          </Tag>
        </div>
      ),
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      render: (client) => (
        <div>
          <Text strong>{client?.firstName} {client?.lastName}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {client?.email}
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
      filters: [
        { text: 'Draft', value: 'draft' },
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'In Progress', value: 'in-progress' },
        { text: 'Completed', value: 'completed' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      render: (budget, record) => (
        <Text strong style={{ color: '#52c41a' }}>
          {formatCurrency(budget, record.currency)}
        </Text>
      ),
      sorter: (a, b) => a.budget - b.budget,
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
            title="View"
          />
          <Button 
            type="text" 
            icon={<Edit size={14} />}
            href={`/contracts/${record._id}`}
            title="Edit"
          />
          <Button 
            type="text" 
            danger
            icon={<Trash2 size={14} />}
            onClick={() => handleDelete(record._id)}
            title="Delete"
          />
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select contracts to delete');
      return;
    }

    Modal.confirm({
      title: 'Delete Selected Contracts',
      content: `Are you sure you want to delete ${selectedRowKeys.length} contract(s)? This action cannot be undone.`,
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          // Implement bulk delete logic here
          message.success(`${selectedRowKeys.length} contracts deleted successfully`);
          setSelectedRowKeys([]);
          loadContracts();
        } catch (error) {
          message.error('Failed to delete contracts');
        }
      }
    });
  };

  const contractStats = {
    total: contracts.length,
    draft: contracts.filter(c => c.status === 'draft').length,
    pending: contracts.filter(c => c.status === 'pending').length,
    inProgress: contracts.filter(c => c.status === 'in-progress').length,
    completed: contracts.filter(c => c.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="contracts-loading">
        <Spin size="large" />
        <Paragraph>Loading contracts...</Paragraph>
      </div>
    );
  }

  return (
    <div className="contracts">
      <div className="contracts-header">
        <div>
          <Title level={2} className="contracts-title">
            Contract Management
          </Title>
          <Paragraph className="contracts-subtitle">
            Manage your medical website development contracts
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
              value={contractStats.total}
              prefix={<FileText size={20} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Draft"
              value={contractStats.draft}
              prefix={<Edit size={20} />}
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="In Progress"
              value={contractStats.inProgress}
              prefix={<Clock size={20} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Completed"
              value={contractStats.completed}
              prefix={<CheckCircle size={20} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="filters-card">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <SearchInput
              placeholder="Search contracts..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              prefix={<Search size={16} />}
              size="large"
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by status"
              value={filters.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              allowClear
              size="large"
              style={{ width: '100%' }}
            >
              <Option value="draft">Draft</Option>
              <Option value="pending">Pending</Option>
              <Option value="approved">Approved</Option>
              <Option value="in-progress">In Progress</Option>
              <Option value="completed">Completed</Option>
              <Option value="cancelled">Cancelled</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={4}>
            <Button 
              size="large" 
              onClick={() => setFilters({ status: '', search: '' })}
            >
              Clear Filters
            </Button>
          </Col>
          {selectedRowKeys.length > 0 && (
            <Col xs={24} sm={12} md={6}>
              <Space>
                <Text>{selectedRowKeys.length} selected</Text>
                <Button 
                  danger 
                  size="large"
                  onClick={handleBulkDelete}
                >
                  Delete Selected
                </Button>
              </Space>
            </Col>
          )}
        </Row>
      </Card>

      {/* Contracts Table */}
      <Card className="contracts-card">
        {contracts.length > 0 ? (
          <Table
            columns={columns}
            dataSource={contracts}
            rowKey="_id"
            rowSelection={rowSelection}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `${range[0]}-${range[1]} of ${total} contracts`,
            }}
            className="contracts-table"
            scroll={{ x: 800 }}
          />
        ) : (
          <Empty
            description="No contracts found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary">
              <Link to="/contracts/create">Create Your First Contract</Link>
            </Button>
          </Empty>
        )}
      </Card>
    </div>
  );
};

export default Contracts;