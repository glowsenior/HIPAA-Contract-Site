const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contractor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  projectType: {
    type: String,
    enum: ['medical-website', 'ehr-system', 'telemedicine', 'medical-app', 'other'],
    required: true
  },
  budget: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  timeline: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    milestones: [{
      title: String,
      description: String,
      dueDate: Date,
      completed: {
        type: Boolean,
        default: false
      }
    }]
  },
  requirements: {
    features: [String],
    technologies: [String],
    integrations: [String],
    compliance: [String]
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'approved', 'in-progress', 'completed', 'cancelled'],
    default: 'draft'
  },
  documents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  }],
  dlFront: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  dlBack: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Document'
  },
  terms: {
    paymentSchedule: String,
    deliverables: [String],
    warranties: String,
    terminationClause: String
  },
  communication: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for better query performance
contractSchema.index({ client: 1, status: 1 });
contractSchema.index({ contractor: 1, status: 1 });
contractSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Contract', contractSchema);
