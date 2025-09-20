import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
import { useContract } from '../contexts/ContractContext';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  X, 
  Calendar,
  DollarSign,
  FileText,
  Shield,
  Users
} from 'lucide-react';
import './CreateContract.css';

const CreateContract = () => {
  const navigate = useNavigate();
  const { createContract } = useContract();
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contractor: '',
    projectType: 'medical-website',
    budget: '',
    currency: 'USD',
    timeline: {
      startDate: '',
      endDate: ''
    },
    requirements: {
      features: [],
      technologies: [],
      integrations: [],
      compliance: []
    },
    terms: {
      paymentSchedule: '',
      deliverables: [],
      warranties: '',
      terminationClause: ''
    }
  });

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    dueDate: ''
  });

  const [newFeature, setNewFeature] = useState('');
  const [newTechnology, setNewTechnology] = useState('');
  // const [newIntegration, setNewIntegration] = useState('');
  const [newCompliance, setNewCompliance] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');

  const projectTypes = [
    { value: 'medical-website', label: 'Medical Website' },
    { value: 'ehr-system', label: 'EHR System' },
    { value: 'telemedicine', label: 'Telemedicine Platform' },
    { value: 'medical-app', label: 'Medical Mobile App' },
    { value: 'other', label: 'Other' }
  ];

  const complianceOptions = [
    'HIPAA',
    'FDA',
    'ISO 27001',
    'SOC 2',
    'GDPR',
    'HITECH',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const contractData = {
        ...formData,
        budget: parseFloat(formData.budget),
        timeline: {
          ...formData.timeline,
          milestones: milestones
        }
      };

      const result = await createContract(contractData);
      
      if (result.success) {
        toast.success('Contract created successfully!');
        navigate(`/contracts/${result.contract._id}`);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.dueDate) {
      setMilestones(prev => [...prev, { ...newMilestone, dueDate: new Date(newMilestone.dueDate) }]);
      setNewMilestone({ title: '', description: '', dueDate: '' });
    }
  };

  const removeMilestone = (index) => {
    setMilestones(prev => prev.filter((_, i) => i !== index));
  };

  const addItem = (type, value, setter) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          [type]: [...prev.requirements[type], value.trim()]
        }
      }));
      setter('');
    }
  };

  const removeItem = (type, index) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [type]: prev.requirements[type].filter((_, i) => i !== index)
      }
    }));
  };

  const addDeliverable = () => {
    if (newDeliverable.trim()) {
      setFormData(prev => ({
        ...prev,
        terms: {
          ...prev.terms,
          deliverables: [...prev.terms.deliverables, newDeliverable.trim()]
        }
      }));
      setNewDeliverable('');
    }
  };

  const removeDeliverable = (index) => {
    setFormData(prev => ({
      ...prev,
      terms: {
        ...prev.terms,
        deliverables: prev.terms.deliverables.filter((_, i) => i !== index)
      }
    }));
  };

  return (
    <div className="create-contract">
      <div className="container">
        <div className="page-header">
          <button 
            className="back-button"
            onClick={() => navigate('/contracts')}
          >
            <ArrowLeft size={20} />
            Back to Contracts
          </button>
          <h1>Create New Contract</h1>
          <p>Set up a new medical development project contract</p>
        </div>

        <form onSubmit={handleSubmit} className="contract-form">
          <div className="form-sections">
            {/* Basic Information */}
            <div className="form-section">
              <div className="section-header">
                <Shield size={24} />
                <h2>Basic Information</h2>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Contract Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="e.g., Medical Practice Website Development"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="Describe the project requirements, goals, and scope..."
                  rows="4"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Project Type</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className="form-input form-select"
                    required
                  >
                    {projectTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Contractor</label>
                  <input
                    type="text"
                    name="contractor"
                    value={formData.contractor}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Contractor email or ID"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Budget & Timeline */}
            <div className="form-section">
              <div className="section-header">
                <DollarSign size={24} />
                <h2>Budget & Timeline</h2>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Budget</label>
                  <div className="budget-input">
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      className="form-input form-select currency-select"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="form-input budget-amount"
                      style={{ width: '100px' }}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={18} />
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="timeline.startDate"
                    value={formData.timeline.startDate}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={18} />
                    End Date
                  </label>
                  <input
                    type="date"
                    name="timeline.endDate"
                    value={formData.timeline.endDate}
                    onChange={handleChange}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="milestones-section">
                <label className="form-label">Project Milestones</label>
                <div className="milestones-list">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="milestone-item">
                      <div className="milestone-content">
                        <h4>{milestone.title}</h4>
                        <p>{milestone.description}</p>
                        <span className="milestone-date">
                          Due: {new Date(milestone.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="remove-milestone"
                        onClick={() => removeMilestone(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="add-milestone">
                  <div className="milestone-inputs">
                    <input
                      type="text"
                      placeholder="Milestone title"
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, title: e.target.value }))}
                      className="form-input"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newMilestone.description}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, description: e.target.value }))}
                      className="form-input"
                    />
                    <input
                      type="date"
                      value={newMilestone.dueDate}
                      onChange={(e) => setNewMilestone(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={addMilestone}
                  >
                    <Plus size={16} />
                    Add Milestone
                  </button>
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="form-section">
              <div className="section-header">
                <FileText size={24} />
                <h2>Project Requirements</h2>
              </div>

              {/* Features */}
              <div className="requirements-group">
                <label className="form-label">Features</label>
                <div className="requirements-list">
                  {formData.requirements.features.map((feature, index) => (
                    <div key={index} className="requirement-item">
                      <span>{feature}</span>
                      <button
                        type="button"
                        className="remove-requirement"
                        onClick={() => removeItem('features', index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="add-requirement">
                  <input
                    type="text"
                    placeholder="Add a feature"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="form-input"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('features', newFeature, setNewFeature))}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => addItem('features', newFeature, setNewFeature)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Technologies */}
              <div className="requirements-group">
                <label className="form-label">Technologies</label>
                <div className="requirements-list">
                  {formData.requirements.technologies.map((tech, index) => (
                    <div key={index} className="requirement-item">
                      <span>{tech}</span>
                      <button
                        type="button"
                        className="remove-requirement"
                        onClick={() => removeItem('technologies', index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="add-requirement">
                  <input
                    type="text"
                    placeholder="Add a technology"
                    value={newTechnology}
                    onChange={(e) => setNewTechnology(e.target.value)}
                    className="form-input"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('technologies', newTechnology, setNewTechnology))}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => addItem('technologies', newTechnology, setNewTechnology)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Compliance */}
              <div className="requirements-group">
                <label className="form-label">Compliance Requirements</label>
                <div className="requirements-list">
                  {formData.requirements.compliance.map((compliance, index) => (
                    <div key={index} className="requirement-item">
                      <span>{compliance}</span>
                      <button
                        type="button"
                        className="remove-requirement"
                        onClick={() => removeItem('compliance', index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="add-requirement">
                  <select
                    value={newCompliance}
                    onChange={(e) => setNewCompliance(e.target.value)}
                    className="form-input form-select"
                  >
                    <option value="">Select compliance requirement</option>
                    {complianceOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => addItem('compliance', newCompliance, setNewCompliance)}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="form-section">
              <div className="section-header">
                <Users size={24} />
                <h2>Terms & Conditions</h2>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Schedule</label>
                <textarea
                  name="terms.paymentSchedule"
                  value={formData.terms.paymentSchedule}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="Describe the payment schedule and milestones..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Deliverables</label>
                <div className="deliverables-list">
                  {formData.terms.deliverables.map((deliverable, index) => (
                    <div key={index} className="deliverable-item">
                      <span>{deliverable}</span>
                      <button
                        type="button"
                        className="remove-deliverable"
                        onClick={() => removeDeliverable(index)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="add-deliverable">
                  <input
                    type="text"
                    placeholder="Add a deliverable"
                    value={newDeliverable}
                    onChange={(e) => setNewDeliverable(e.target.value)}
                    className="form-input"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDeliverable())}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={addDeliverable}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Warranties</label>
                <textarea
                  name="terms.warranties"
                  value={formData.terms.warranties}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="Describe any warranties or guarantees..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Termination Clause</label>
                <textarea
                  name="terms.terminationClause"
                  value={formData.terms.terminationClause}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="Describe termination conditions..."
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/contracts')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Creating Contract...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Contract
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContract;
