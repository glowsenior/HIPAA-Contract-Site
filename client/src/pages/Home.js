import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Typography, Space, Statistic, Divider } from 'antd';
import { 
  Shield, 
  FileText, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Stethoscope,
  Heart,
  Activity,
  Zap,
  Star,
  Award,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FileText size={32} />,
      title: 'Contract Management',
      description: 'Create, manage, and track medical website development contracts with ease.',
      color: '#1890ff'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure Document Upload',
      description: 'Safely upload and manage DL front/back documents with encryption.',
      color: '#52c41a'
    },
    {
      icon: <Users size={32} />,
      title: 'Client-Contractor Collaboration',
      description: 'Seamless communication between clients and contractors.',
      color: '#722ed1'
    },
    {
      icon: <Clock size={32} />,
      title: 'Timeline Tracking',
      description: 'Monitor project milestones and deadlines with real-time updates.',
      color: '#faad14'
    },
    {
      icon: <CheckCircle size={32} />,
      title: 'Compliance Management',
      description: 'Ensure HIPAA compliance and medical industry standards.',
      color: '#13c2c2'
    },
    {
      icon: <Activity size={32} />,
      title: 'Progress Monitoring',
      description: 'Track project progress with detailed analytics and reporting.',
      color: '#eb2f96'
    }
  ];

  const stats = [
    { title: 'Active Contracts', value: 150, prefix: <FileText size={20} /> },
    { title: 'Happy Clients', value: 89, prefix: <Users size={20} /> },
    { title: 'Projects Completed', value: 234, prefix: <CheckCircle size={20} /> },
    { title: 'Success Rate', value: 98, suffix: '%', prefix: <TrendingUp size={20} /> }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Medical Director',
      content: 'This platform revolutionized how we manage our medical website contracts. The security and ease of use are unmatched.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Healthcare IT Manager',
      content: 'The collaboration features have streamlined our development process. Highly recommended for medical projects.',
      rating: 5
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Clinic Owner',
      content: 'Finally, a platform that understands the unique needs of medical website development. Excellent service!',
      rating: 5
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div className="hero-content">
                <div className="hero-badge">
                  <Stethoscope size={16} />
                  <Text>Medical Contract Management Platform</Text>
                </div>
                <Title level={1} className="hero-title">
                  Build Better Medical Websites with{' '}
                  <span className="gradient-text">Secure Contracts</span>
                </Title>
                <Paragraph className="hero-description">
                  Streamline your medical website development process with our comprehensive 
                  contract management platform. Secure, compliant, and designed specifically 
                  for healthcare professionals.
                </Paragraph>
                <Space size="large" className="hero-actions">
                  {isAuthenticated ? (
                    <Button type="primary" size="large">
                      <Link to="/dashboard">Go to Dashboard</Link>
                    </Button>
                  ) : (
                    <>
                      <Button type="primary" size="large">
                        <Link to="/register">Get Started Free</Link>
                      </Button>
                      <Button size="large">
                        <Link to="/login">Sign In</Link>
                      </Button>
                    </>
                  )}
                </Space>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="hero-visual">
                <Card className="hero-card" bordered={false}>
                  <div className="hero-stats">
                    <Row gutter={[16, 16]}>
                      {stats.map((stat, index) => (
                        <Col span={12} key={index}>
                          <Statistic
                            title={stat.title}
                            value={stat.value}
                            prefix={stat.prefix}
                            suffix={stat.suffix}
                            valueStyle={{ color: '#1890ff' }}
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Card>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Why Choose Our Platform?
            </Title>
            <Paragraph className="section-description">
              Built specifically for medical website development with healthcare compliance in mind.
            </Paragraph>
          </div>
          
          <Row gutter={[24, 24]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={8} key={index}>
                <Card 
                  className="feature-card"
                  hoverable
                  bordered={false}
                >
                  <div className="feature-icon" style={{ color: feature.color }}>
                    {feature.icon}
                  </div>
                  <Title level={4} className="feature-title">
                    {feature.title}
                  </Title>
                  <Paragraph className="feature-description">
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">
              Trusted by Healthcare Professionals
            </Title>
            <Paragraph className="section-description">
              See what our clients say about our platform.
            </Paragraph>
          </div>
          
          <Row gutter={[24, 24]}>
            {testimonials.map((testimonial, index) => (
              <Col xs={24} lg={8} key={index}>
                <Card className="testimonial-card" bordered={false}>
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#faad14" color="#faad14" />
                    ))}
                  </div>
                  <Paragraph className="testimonial-content">
                    "{testimonial.content}"
                  </Paragraph>
                  <div className="testimonial-author">
                    <Text strong>{testimonial.name}</Text>
                    <Text type="secondary">{testimonial.role}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <Card className="cta-card" bordered={false}>
            <div className="cta-content">
              <Title level={2} className="cta-title">
                Ready to Streamline Your Medical Website Development?
              </Title>
              <Paragraph className="cta-description">
                Join hundreds of healthcare professionals who trust our platform for their contract management needs.
              </Paragraph>
              <Space size="large">
                {isAuthenticated ? (
                  <Button type="primary" size="large">
                    <Link to="/contracts/create">Create New Contract</Link>
                  </Button>
                ) : (
                  <>
                    <Button type="primary" size="large">
                      <Link to="/register">Start Free Trial</Link>
                    </Button>
                    <Button size="large">
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </>
                )}
              </Space>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;