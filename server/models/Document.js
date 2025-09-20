const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  size: {
    type: Number,
    required: true
  },
  mimeType: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract',
    required: true
  },
  documentType: {
    type: String,
    enum: ['dl-front', 'dl-back', 'contract', 'proposal', 'invoice', 'other'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationNotes: {
    type: String,
    default: ''
  },
  metadata: {
    width: Number,
    height: Number,
    orientation: String
  }
}, {
  timestamps: true
});

// Index for better query performance
documentSchema.index({ contract: 1, documentType: 1 });
documentSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('Document', documentSchema);
