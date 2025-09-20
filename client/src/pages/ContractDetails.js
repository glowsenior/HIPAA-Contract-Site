import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, 
  Col, 
  Card, 
  Button, 
  Typography, 
  Space, 
  Tag, 
  Statistic, 
  Progress,
  Spin,
  Upload,
  Image,
  Modal,
  Input,
  message,
  Divider,
  Timeline,
  Avatar,
  Alert,
  Badge,
  Tooltip,
  Empty
} from 'antd';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Upload as UploadIcon, 
  Download,
  Calendar,
  DollarSign,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Shield,
  Send,
  X,
  Eye,
  Plus,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useContract } from '../contexts/ContractContext';
import { toast } from 'react-toastify';
import './ContractDetails.css';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentContract, fetchContract, updateContractStatus, addContractMessage, uploadDocument, downloadDocument, deleteDocument } = useContract();
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [dlFrontPreview, setDlFrontPreview] = useState(null);
  const [dlBackPreview, setDlBackPreview] = useState(null);
  const [imageErrors, setImageErrors] = useState({ dlFront: false, dlBack: false });
  const [uploading, setUploading] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);

  const loadContract = async () => {
    try {
      setLoading(true);
      await fetchContract(id);
    } catch (error) {
      console.error('Error loading contract:', error);
      toast.error('Failed to load contract');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContract();
  }, [id]);

  // Set preview images when contract loads
  useEffect(() => {
    if (currentContract) {
      // Check if there are existing DL documents and show them
      if (currentContract.dlFront) {
        // Handle both populated objects and ObjectIds
        const dlFrontId = currentContract.dlFront._id || currentContract.dlFront;
        const dlFrontUrl = `/api/documents/public/${dlFrontId}`;
        setDlFrontPreview(dlFrontUrl);
      }
      if (currentContract.dlBack) {
        // Handle both populated objects and ObjectIds
        const dlBackId = currentContract.dlBack._id || currentContract.dlBack;
        const dlBackUrl = `/api/documents/public/${dlBackId}`;
        setDlBackPreview(dlBackUrl);
      }
    }
  }, [currentContract]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const result = await updateContractStatus(id, newStatus);
      if (result.success) {
        toast.success('Contract status updated successfully');
        loadContract();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update contract status');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const result = await addContractMessage(id, newMessage);
      if (result.success) {
        setNewMessage('');
        setMessageModalVisible(false);
        toast.success('Message sent successfully');
        loadContract();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  const handleFilePreview = (file, documentType) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (documentType === 'dl-front') {
          setDlFrontPreview(e.target.result);
        } else if (documentType === 'dl-back') {
          setDlBackPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async (file, documentType) => {
    try {
      setUploading(true);
      // Show preview for images
      handleFilePreview(file, documentType);
      
      const result = await uploadDocument(id, file, documentType);
      if (result.success) {
        toast.success('Document uploaded successfully');
        // Clear any previous image errors
        setImageErrors(prev => ({ ...prev, [documentType]: false }));
        loadContract(); // Refresh contract data
      } else {
        toast.error(result.message);
        // Clear preview on error
        if (documentType === 'dl-front') {
          setDlFrontPreview(null);
        } else if (documentType === 'dl-back') {
          setDlBackPreview(null);
        }
      }
    } catch (error) {
      toast.error('Failed to upload document');
      // Clear preview on error
      if (documentType === 'dl-front') {
        setDlFrontPreview(null);
      } else if (documentType === 'dl-back') {
        setDlBackPreview(null);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleImageError = (documentType) => {
    setImageErrors(prev => ({ ...prev, [documentType]: true }));
    console.error(`Failed to load ${documentType} image`);
  };

  const handleDownload = async (documentId) => {
    try {
      const result = await downloadDocument(documentId);
      if (!result.success) {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const handleDeleteDocument = async (documentId) => {
    Modal.confirm({
      title: 'Delete Document',
      content: 'Are you sure you want to delete this document? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const result = await deleteDocument(documentId);
          if (result.success) {
            toast.success('Document deleted successfully');
            loadContract();
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          toast.error('Failed to delete document');
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

  if (loading) {
    return (
      <div className="contract-details-loading">
        <Spin size="large" />
        <Paragraph>Loading contract details...</Paragraph>
      </div>
    );
  }

  if (!currentContract) {
    return (
      <div className="contract-details-error">
        <Alert
          message="Contract Not Found"
          description="The contract you're looking for doesn't exist or you don't have permission to view it."
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/contracts')}>
              Back to Contracts
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="contract-details">
      <div className="contract-header">
        <div className="contract-header-content">
          <Button 
            icon={<ArrowLeft size={16} />} 
            onClick={() => navigate('/contracts')}
            className="back-button"
          >
            Back to Contracts
          </Button>
          <div className="contract-title-section">
            <Title level={1} className="contract-title">
              {currentContract.title}
            </Title>
            <div className="contract-meta">
              <Tag color={getStatusColor(currentContract.status)}>
                {getStatusText(currentContract.status)}
              </Tag>
              <Tag color={getProjectTypeColor(currentContract.projectType)}>
                {getProjectTypeText(currentContract.projectType)}
              </Tag>
            </div>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]} className="contract-content">
        {/* Main Content */}
        <Col xs={24} lg={16}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Contract Information */}
            <Card title="Contract Information" className="info-card">
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="Budget"
                    value={currentContract.budget}
                    prefix={<DollarSign size={20} />}
                    formatter={(value) => formatCurrency(value, currentContract.currency)}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <Statistic
                    title="Timeline"
                    value={`${formatDate(currentContract.timeline.startDate)} - ${formatDate(currentContract.timeline.endDate)}`}
                    prefix={<Calendar size={20} />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
              </Row>
              
              <Divider />
              
              <div className="contract-description">
                <Title level={4}>Description</Title>
                <Paragraph>{currentContract.description}</Paragraph>
              </div>
            </Card>

            {/* Parties Information */}
            <Card title="Parties" className="parties-card">
              <Row gutter={[24, 24]}>
                <Col xs={24} sm={12}>
                  <div className="party-info">
                    <div className="party-header">
                      <Users size={18} />
                      <Text strong>Client</Text>
                    </div>
                    <div className="party-details">
                      <Title level={5}>{currentContract.client?.firstName} {currentContract.client?.lastName}</Title>
                      <Paragraph>{currentContract.client?.email}</Paragraph>
                      {currentContract.client?.company && (
                        <Text type="secondary">{currentContract.client.company}</Text>
                      )}
                    </div>
                  </div>
                </Col>
                <Col xs={24} sm={12}>
                  <div className="party-info">
                    <div className="party-header">
                      <Users size={18} />
                      <Text strong>Contractor</Text>
                    </div>
                    <div className="party-details">
                      <Title level={5}>{currentContract.contractor?.firstName} {currentContract.contractor?.lastName}</Title>
                      <Paragraph>{currentContract.contractor?.email}</Paragraph>
                      {currentContract.contractor?.company && (
                        <Text type="secondary">{currentContract.contractor.company}</Text>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Milestones */}
            {currentContract.timeline?.milestones?.length > 0 && (
              <Card title="Project Milestones" className="milestones-card">
                <Timeline>
                  {currentContract.timeline.milestones.map((milestone, index) => (
                    <Timeline.Item
                      key={index}
                      dot={milestone.completed ? <CheckCircle size={16} /> : <Clock size={16} />}
                      color={milestone.completed ? 'green' : 'blue'}
                    >
                      <div className="milestone-content">
                        <Title level={5}>{milestone.title}</Title>
                        <Paragraph>{milestone.description}</Paragraph>
                        <Text type="secondary">Due: {formatDate(milestone.dueDate)}</Text>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            )}

            {/* Requirements */}
            <Card title="Requirements" className="requirements-card">
              <Row gutter={[24, 24]}>
                {currentContract.requirements?.features?.length > 0 && (
                  <Col xs={24} sm={12}>
                    <Title level={5}>Features</Title>
                    <Space wrap>
                      {currentContract.requirements.features.map((feature, index) => (
                        <Tag key={index} color="blue">{feature}</Tag>
                      ))}
                    </Space>
                  </Col>
                )}
                {currentContract.requirements?.technologies?.length > 0 && (
                  <Col xs={24} sm={12}>
                    <Title level={5}>Technologies</Title>
                    <Space wrap>
                      {currentContract.requirements.technologies.map((tech, index) => (
                        <Tag key={index} color="green">{tech}</Tag>
                      ))}
                    </Space>
                  </Col>
                )}
                {currentContract.requirements?.compliance?.length > 0 && (
                  <Col xs={24}>
                    <Title level={5}>Compliance</Title>
                    <Space wrap>
                      {currentContract.requirements.compliance.map((compliance, index) => (
                        <Tag key={index} color="purple">{compliance}</Tag>
                      ))}
                    </Space>
                  </Col>
                )}
              </Row>
            </Card>
          </Space>
        </Col>

        {/* Sidebar */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Document Upload */}
            <Card title="Documents" className="documents-card">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div className="dl-upload-section">
                  <Title level={5}>Driver's License</Title>
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <div className="dl-upload-zone">
                        {dlFrontPreview ? (
                          <div className="dl-preview">
                            <Image
                              src={dlFrontPreview}
                              alt="DL Front Preview"
                              className="dl-preview-image"
                              onError={() => handleImageError('dlFront')}
                            />
                            <Button
                              type="text"
                              danger
                              icon={<X size={16} />}
                              className="remove-preview"
                              onClick={() => {
                                setDlFrontPreview(null);
                                setImageErrors(prev => ({ ...prev, dlFront: false }));
                              }}
                            />
                            <div className="preview-label">DL Front</div>
                          </div>
                        ) : imageErrors.dlFront ? (
                          <div className="upload-error">
                            <AlertCircle size={24} />
                            <Text>Failed to load image</Text>
                            <Button 
                              size="small"
                              onClick={() => setImageErrors(prev => ({ ...prev, dlFront: false }))}
                            >
                              Retry
                            </Button>
                          </div>
                        ) : (
                          <Upload
                            beforeUpload={(file) => {
                              handleFileUpload(file, 'dl-front');
                              return false;
                            }}
                            accept="image/*"
                            showUploadList={false}
                            disabled={uploading}
                          >
                            <div className="upload-placeholder">
                              <UploadIcon size={24} />
                              <Text>DL Front</Text>
                            </div>
                          </Upload>
                        )}
                      </div>
                    </Col>
                    <Col span={12}>
                      <div className="dl-upload-zone">
                        {dlBackPreview ? (
                          <div className="dl-preview">
                            <Image
                              src={dlBackPreview}
                              alt="DL Back Preview"
                              className="dl-preview-image"
                              onError={() => handleImageError('dlBack')}
                            />
                            <Button
                              type="text"
                              danger
                              icon={<X size={16} />}
                              className="remove-preview"
                              onClick={() => {
                                setDlBackPreview(null);
                                setImageErrors(prev => ({ ...prev, dlBack: false }));
                              }}
                            />
                            <div className="preview-label">DL Back</div>
                          </div>
                        ) : imageErrors.dlBack ? (
                          <div className="upload-error">
                            <AlertCircle size={24} />
                            <Text>Failed to load image</Text>
                            <Button 
                              size="small"
                              onClick={() => setImageErrors(prev => ({ ...prev, dlBack: false }))}
                            >
                              Retry
                            </Button>
                          </div>
                        ) : (
                          <Upload
                            beforeUpload={(file) => {
                              handleFileUpload(file, 'dl-back');
                              return false;
                            }}
                            accept="image/*"
                            showUploadList={false}
                            disabled={uploading}
                          >
                            <div className="upload-placeholder">
                              <UploadIcon size={24} />
                              <Text>DL Back</Text>
                            </div>
                          </Upload>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Document List */}
                {currentContract.documents?.length > 0 && (
                  <div className="document-list">
                    <Title level={5}>Other Documents</Title>
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      {currentContract.documents.map((doc, index) => (
                        <div key={index} className="document-item">
                          <FileText size={16} />
                          <Text className="document-name">{doc.originalName}</Text>
                          <Space>
                            <Button
                              type="text"
                              size="small"
                              icon={<Download size={14} />}
                              onClick={() => handleDownload(doc._id)}
                            />
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<Trash2 size={14} />}
                              onClick={() => handleDeleteDocument(doc._id)}
                            />
                          </Space>
                        </div>
                      ))}
                    </Space>
                  </div>
                )}
              </Space>
            </Card>

            {/* Status Actions */}
            <Card title="Status Actions" className="status-card">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {currentContract.status === 'draft' && (
                  <Button
                    type="primary"
                    block
                    onClick={() => handleStatusUpdate('pending')}
                  >
                    Submit for Approval
                  </Button>
                )}
                {currentContract.status === 'pending' && user?.role === 'contractor' && (
                  <Button
                    type="primary"
                    block
                    onClick={() => handleStatusUpdate('approved')}
                  >
                    Approve Contract
                  </Button>
                )}
                {currentContract.status === 'approved' && (
                  <Button
                    type="primary"
                    block
                    onClick={() => handleStatusUpdate('in-progress')}
                  >
                    Start Project
                  </Button>
                )}
                {currentContract.status === 'in-progress' && (
                  <Button
                    type="primary"
                    block
                    onClick={() => handleStatusUpdate('completed')}
                  >
                    Mark as Completed
                  </Button>
                )}
              </Space>
            </Card>

            {/* Communication */}
            <Card 
              title="Communication" 
              className="communication-card"
              extra={
                <Button 
                  type="primary" 
                  icon={<MessageCircle size={16} />}
                  onClick={() => setMessageModalVisible(true)}
                >
                  Send Message
                </Button>
              }
            >
              {currentContract.communication?.length > 0 ? (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {currentContract.communication.slice(-5).map((msg, index) => (
                    <div key={index} className="message-item">
                      <div className="message-header">
                        <Avatar size="small" icon={<Users size={16} />} />
                        <Text strong>{msg.sender?.firstName} {msg.sender?.lastName}</Text>
                        <Text type="secondary">{formatDate(msg.timestamp)}</Text>
                      </div>
                      <Paragraph className="message-content">{msg.message}</Paragraph>
                    </div>
                  ))}
                </Space>
              ) : (
                <Empty
                  description="No messages yet"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Message Modal */}
      <Modal
        title="Send Message"
        open={messageModalVisible}
        onCancel={() => setMessageModalVisible(false)}
        onOk={handleSendMessage}
        okText="Send"
        cancelText="Cancel"
      >
        <TextArea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={4}
        />
      </Modal>
    </div>
  );
};

export default ContractDetails;