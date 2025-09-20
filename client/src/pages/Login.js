import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Typography, 
  Space, 
  Divider,
  Alert,
  Spin
} from 'antd';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

const { Title, Paragraph, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await login(values.email, values.password);
      if (result.success) {
        toast.success('Login successful!');
        navigate(from, { replace: true });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
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
              Welcome Back
            </Title>
            <Paragraph className="auth-subtitle">
              Sign in to your Medical Contract Builder account
            </Paragraph>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            layout="vertical"
            size="large"
            className="auth-form"
          >
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
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<Lock size={16} />}
                placeholder="Enter your password"
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
                {loading ? <Spin size="small" /> : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <Divider className="auth-divider">
            <Text type="secondary">Don't have an account?</Text>
          </Divider>

          <div className="auth-footer">
            <Button block size="large" className="auth-register-btn">
              <Link to="/register">
                Create New Account
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>

          <div className="auth-features">
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div className="feature-item">
                <User size={16} />
                <Text>Secure authentication</Text>
              </div>
              <div className="feature-item">
                <Shield size={16} />
                <Text>HIPAA compliant</Text>
              </div>
              <div className="feature-item">
                <Lock size={16} />
                <Text>End-to-end encryption</Text>
              </div>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;