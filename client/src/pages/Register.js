import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Divider,
  Select,
  Row,
  Col,
  Spin
} from 'antd';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, User, Building, Phone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await register(values);
      if (result.success) {
        toast.success('Registration successful! Please check your email to verify your account.');
        navigate('/login');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-pattern"></div>
      </div>
      
      <div className="auth-content">
        <Card className="auth-card" bordered={false}>
          <div className="auth-header">
            <div className="auth-logo">
              <Shield size={32} />
            </div>
            <Title level={2} className="auth-title">
              Create Account
            </Title>
            <Paragraph className="auth-subtitle">
              Join the Medical Contract Builder platform
            </Paragraph>
          </div>

          <Form
            form={form}
            name="register"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            className="auth-form"
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    { required: true, message: 'Please input your first name!' },
                    { min: 2, message: 'First name must be at least 2 characters!' }
                  ]}
                >
                  <Input
                    prefix={<User size={16} />}
                    placeholder="First name"
                    className="auth-input"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    { required: true, message: 'Please input your last name!' },
                    { min: 2, message: 'Last name must be at least 2 characters!' }
                  ]}
                >
                  <Input
                    prefix={<User size={16} />}
                    placeholder="Last name"
                    className="auth-input"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<Mail size={16} />}
                placeholder="Enter your email"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[
                { required: true, message: 'Please input your phone number!' },
                { pattern: /^[\+]?[1-9][\d]{0,15}$/, message: 'Please enter a valid phone number!' }
              ]}
            >
              <Input
                prefix={<Phone size={16} />}
                placeholder="Enter your phone number"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="company"
              label="Company/Organization"
              rules={[
                { required: true, message: 'Please input your company name!' },
                { min: 2, message: 'Company name must be at least 2 characters!' }
              ]}
            >
              <Input
                prefix={<Building size={16} />}
                placeholder="Enter your company name"
                className="auth-input"
              />
            </Form.Item>

            <Form.Item
              name="role"
              label="Role"
              rules={[{ required: true, message: 'Please select your role!' }]}
            >
              <Select placeholder="Select your role" className="auth-select">
                <Option value="client">Client</Option>
                <Option value="contractor">Contractor</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<Lock size={16} />}
                placeholder="Create a password"
                className="auth-input"
                iconRender={(visible) => (visible ? <EyeOff size={16} /> : <Eye size={16} />)}
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<Lock size={16} />}
                placeholder="Confirm your password"
                className="auth-input"
                iconRender={(visible) => (visible ? <EyeOff size={16} /> : <Eye size={16} />)}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                className="auth-submit"
              >
                {loading ? <Spin size="small" /> : 'Create Account'}
              </Button>
            </Form.Item>
          </Form>

          <Divider className="auth-divider">
            <Text type="secondary">Already have an account?</Text>
          </Divider>

          <div className="auth-footer">
            <Button block size="large" className="auth-login-btn">
              <Link to="/login">
                Sign In Instead
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          <div className="auth-features">
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div className="feature-item">
                <User size={16} />
                <Text>Free to get started</Text>
              </div>
              <div className="feature-item">
                <Shield size={16} />
                <Text>HIPAA compliant platform</Text>
              </div>
              <div className="feature-item">
                <Lock size={16} />
                <Text>Secure document handling</Text>
              </div>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;