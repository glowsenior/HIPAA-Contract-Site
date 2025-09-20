const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');
const Contract = require('../models/Contract');
const auth = require('../middleware/auth');

const router = express.Router();

// Test route to check server status
router.get('/test', (req, res) => {
  res.json({ message: 'Documents API is working', timestamp: new Date() });
});

// @route   GET /api/documents/public/:id
// @desc    Public route to serve images (for preview)
// @access  Public (no auth required for image preview)
router.get('/public/:id', async (req, res) => {
  try {
    console.log('Requesting document:', req.params.id);
    const document = await Document.findById(req.params.id);

    if (!document) {
      console.log('Document not found:', req.params.id);
      return res.status(404).json({ message: 'Document not found' });
    }

    console.log('Document found:', {
      id: document._id,
      filename: document.filename,
      path: document.path,
      mimeType: document.mimeType
    });

    // Check if file exists
    if (!fs.existsSync(document.path)) {
      console.log('File not found at path:', document.path);
      return res.status(404).json({ message: 'File not found on server' });
    }

    console.log('File exists, serving:', document.path);

    // Set appropriate headers for image viewing
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    // Send the file with absolute path
    const absolutePath = path.resolve(document.path);
    res.sendFile(absolutePath);
  } catch (error) {
    console.error('Public view document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    const absoluteUploadPath = path.resolve(uploadPath);
    if (!fs.existsSync(absoluteUploadPath)) {
      fs.mkdirSync(absoluteUploadPath, { recursive: true });
    }
    cb(null, absoluteUploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images and PDFs
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and PDFs are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB default
  },
  fileFilter: fileFilter
});

// @route   POST /api/documents/upload
// @desc    Upload a document
// @access  Private
router.post('/upload', auth, upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { contractId, documentType } = req.body;

    if (!contractId || !documentType) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Contract ID and document type are required' });
    }

    // Verify contract exists and user has access
    const contract = await Contract.findById(contractId);
    if (!contract) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Contract not found' });
    }

    if (contract.client.toString() !== req.userId.toString() && 
        contract.contractor.toString() !== req.userId.toString()) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: 'Not authorized to upload to this contract' });
    }

    // Create document record
    const document = new Document({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedBy: req.userId,
      contract: contractId,
      documentType: documentType
    });

    await document.save();

    // Update contract with document reference
    if (documentType === 'dl-front') {
      contract.dlFront = document._id;
    } else if (documentType === 'dl-back') {
      contract.dlBack = document._id;
    } else {
      contract.documents.push(document._id);
    }

    await contract.save();

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: {
        id: document._id,
        filename: document.filename,
        originalName: document.originalName,
        size: document.size,
        mimeType: document.mimeType,
        documentType: document.documentType,
        uploadedAt: document.createdAt
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// @route   GET /api/documents/:id
// @desc    Get document details
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('contract')
      .populate('uploadedBy', 'firstName lastName email');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has access to this document
    const contract = document.contract;
    if (contract.client.toString() !== req.userId.toString() && 
        contract.contractor.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this document' });
    }

    res.json({ document });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/documents/:id/download
// @desc    Download a document
// @access  Private
router.get('/:id/download', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('contract');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has access to this document
    const contract = document.contract;
    if (contract.client.toString() !== req.userId.toString() && 
        contract.contractor.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to download this document' });
    }

    // Check if file exists
    if (!fs.existsSync(document.path)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    res.download(document.path, document.originalName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/documents/:id/view
// @desc    View/serve a document (for images)
// @access  Private
router.get('/:id/view', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('contract');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has access to this document
    const contract = document.contract;
    if (contract.client.toString() !== req.userId.toString() && 
        contract.contractor.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this document' });
    }

    // Check if file exists
    if (!fs.existsSync(document.path)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Set appropriate headers for image viewing
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    
    // Send the file
    res.sendFile(document.path);
  } catch (error) {
    console.error('View document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete a document
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('contract');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has access to this document
    const contract = document.contract;
    if (contract.client.toString() !== req.userId.toString() && 
        contract.contractor.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this document' });
    }

    // Delete file from filesystem
    if (fs.existsSync(document.path)) {
      fs.unlinkSync(document.path);
    }

    // Remove document reference from contract
    if (document.documentType === 'dl-front') {
      contract.dlFront = null;
    } else if (document.documentType === 'dl-back') {
      contract.dlBack = null;
    } else {
      contract.documents = contract.documents.filter(doc => doc.toString() !== document._id.toString());
    }

    await contract.save();
    await Document.findByIdAndDelete(req.params.id);

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/documents/:id/verify
// @desc    Verify a document
// @access  Private
router.put('/:id/verify', auth, async (req, res) => {
  try {
    const { isVerified, verificationNotes } = req.body;

    const document = await Document.findById(req.params.id)
      .populate('contract');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Check if user has access to this document
    const contract = document.contract;
    if (contract.client.toString() !== req.userId.toString() && 
        contract.contractor.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to verify this document' });
    }

    document.isVerified = isVerified;
    document.verificationNotes = verificationNotes || '';
    await document.save();

    res.json({
      message: 'Document verification updated successfully',
      document
    });
  } catch (error) {
    console.error('Verify document error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
