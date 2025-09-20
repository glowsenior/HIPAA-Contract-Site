const express = require('express');
const { body, validationResult } = require('express-validator');
const Contract = require('../models/Contract');
const Document = require('../models/Document');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/contracts
// @desc    Get all contracts for the authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {
      $or: [
        { client: req.userId },
        { contractor: req.userId }
      ]
    };

    if (status) {
      query.status = status;
    }

    const contracts = await Contract.find(query)
      .populate('client', 'firstName lastName email company')
      .populate('contractor', 'firstName lastName email company')
      .populate('documents')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Contract.countDocuments(query);

    res.json({
      contracts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get contracts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/contracts/:id
// @desc    Get a specific contract
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('client', 'firstName lastName email company phone')
      .populate('contractor', 'firstName lastName email company phone')
      .populate('documents')
      .populate('dlFront')
      .populate('dlBack');

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user is authorized to view this contract
    if (contract.client._id.toString() !== req.userId.toString() && 
        contract.contractor._id.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this contract' });
    }

    res.json({ contract });
  } catch (error) {
    console.error('Get contract error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/contracts
// @desc    Create a new contract
// @access  Private
router.post('/', auth, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('contractor').isMongoId().withMessage('Valid contractor ID is required'),
  body('projectType').isIn(['medical-website', 'ehr-system', 'telemedicine', 'medical-app', 'other']).withMessage('Invalid project type'),
  body('budget').isNumeric().withMessage('Budget must be a number'),
  body('timeline.startDate').isISO8601().withMessage('Valid start date is required'),
  body('timeline.endDate').isISO8601().withMessage('Valid end date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contractData = {
      ...req.body,
      client: req.userId
    };

    const contract = new Contract(contractData);
    await contract.save();

    const populatedContract = await Contract.findById(contract._id)
      .populate('client', 'firstName lastName email company')
      .populate('contractor', 'firstName lastName email company');

    res.status(201).json({
      message: 'Contract created successfully',
      contract: populatedContract
    });
  } catch (error) {
    console.error('Create contract error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/contracts/:id
// @desc    Update a contract
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check if user is authorized to update this contract
    if (contract.client.toString() !== req.userId.toString() && 
        contract.contractor.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this contract' });
    }

    const updatedContract = await Contract.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('client', 'firstName lastName email company')
     .populate('contractor', 'firstName lastName email company');

    res.json({
      message: 'Contract updated successfully',
      contract: updatedContract
    });
  } catch (error) {
    console.error('Update contract error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/contracts/:id
// @desc    Delete a contract
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Only client can delete the contract
    if (contract.client.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this contract' });
    }

    // Delete associated documents
    await Document.deleteMany({ contract: contract._id });

    await Contract.findByIdAndDelete(req.params.id);

    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    console.error('Delete contract error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/contracts/:id/status
// @desc    Update contract status
// @access  Private
router.post('/:id/status', auth, [
  body('status').isIn(['draft', 'pending', 'approved', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check authorization
    if (contract.client.toString() !== req.userId.toString() && 
        contract.contractor.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this contract' });
    }

    contract.status = req.body.status;
    await contract.save();

    res.json({
      message: 'Contract status updated successfully',
      contract
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/contracts/:id/message
// @desc    Add message to contract communication
// @access  Private
router.post('/:id/message', auth, [
  body('message').trim().notEmpty().withMessage('Message is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // Check authorization
    if (contract.client.toString() !== req.userId.toString() && 
        contract.contractor.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to message on this contract' });
    }

    contract.communication.push({
      sender: req.userId,
      message: req.body.message
    });

    await contract.save();

    res.json({
      message: 'Message added successfully',
      contract
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
