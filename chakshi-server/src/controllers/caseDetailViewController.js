import mongoose from 'mongoose';
import Case from '../models/Case.js';
import { Timeline, Payment, Note } from '../models/CaseDetails.js';

console.log('🎯 ═══════════════════════════════════════════════════');
console.log('🎯 Case Detail View Controller Loading...');
console.log('🎯 ═══════════════════════════════════════════════════');

// Validate all models imported successfully
if (!Case || typeof Case.findById !== 'function') {
  console.error('❌ CRITICAL: Case model is invalid!');
  console.error('   Case:', Case);
  console.error('   Type:', typeof Case);
  if (Case) {
    console.error('   Available methods:', Object.keys(Case).join(', '));
  }
  process.exit(1);
}

if (!Timeline || !Payment || !Note) {
  console.error('❌ CRITICAL: CaseDetails models missing!');
  console.error('   Timeline:', Timeline ? '✅' : '❌');
  console.error('   Payment:', Payment ? '✅' : '❌');
  console.error('   Note:', Note ? '✅' : '❌');
  process.exit(1);
}

console.log('✅ All models validated successfully');
console.log('🎯 ═══════════════════════════════════════════════════\n');

// ═══════════════════════════════════════════════════════════════
// TIMELINE CONTROLLERS
// ═══════════════════════════════════════════════════════════════

export const addTimelineEntry = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { stage, date, status, description, remarks } = req.body;

    console.log('\n📅 ═══ ADD TIMELINE ENTRY ═══');
    console.log('Case ID:', caseId);
    console.log('Stage:', stage);
    console.log('Date:', date);
    console.log('Status:', status || 'ongoing');

    // Validate required fields
    if (!stage || !date) {
      console.error('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Stage and date are required'
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      console.error('❌ Invalid ObjectId format');
      return res.status(400).json({
        success: false,
        message: 'Invalid case ID format'
      });
    }

    console.log('🔍 Looking up case...');
    const caseData = await Case.findById(caseId);
    
    if (!caseData) {
      console.error('❌ Case not found');
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    console.log('✅ Case found:', caseData.caseNumber);

    const newTimeline = await Timeline.create({
      caseId,
      caseNumber: caseData.caseNumber,
      stage,
      date,
      status: status || 'ongoing',
      description: description || '',
      remarks: remarks || ''
    });

    console.log('✅ Timeline entry created successfully');
    console.log('Timeline ID:', newTimeline._id);
    console.log('═══════════════════════════════════\n');

    res.status(201).json({
      success: true,
      message: 'Timeline entry added successfully',
      data: newTimeline
    });
  } catch (error) {
    console.error('❌ Error adding timeline:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to add timeline entry',
      error: error.message
    });
  }
};

export const getTimeline = async (req, res) => {
  try {
    const { caseId } = req.params;
    
    console.log('\n📅 ═══ GET TIMELINE ═══');
    console.log('Case ID:', caseId);

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid case ID format'
      });
    }
    
    const timeline = await Timeline.findByCaseId(caseId);
    
    console.log('✅ Found', timeline.length, 'timeline entries');
    console.log('═══════════════════════════════════\n');

    res.status(200).json({
      success: true,
      count: timeline.length,
      data: timeline
    });
  } catch (error) {
    console.error('❌ Error fetching timeline:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timeline',
      error: error.message
    });
  }
};

export const updateTimelineStatus = async (req, res) => {
  try {
    const { timelineId } = req.params;
    const { status } = req.body;

    console.log('\n📅 ═══ UPDATE TIMELINE STATUS ═══');
    console.log('Timeline ID:', timelineId);
    console.log('New status:', status);

    if (!mongoose.Types.ObjectId.isValid(timelineId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid timeline ID format'
      });
    }

    if (!['completed', 'active', 'ongoing', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: completed, active, ongoing, or pending'
      });
    }

    const timeline = await Timeline.findByIdAndUpdate(
      timelineId,
      { status },
      { new: true, runValidators: true }
    );

    if (!timeline) {
      console.error('❌ Timeline entry not found');
      return res.status(404).json({
        success: false,
        message: 'Timeline entry not found'
      });
    }

    console.log('✅ Timeline status updated successfully');
    console.log('═══════════════════════════════════\n');

    res.status(200).json({
      success: true,
      message: 'Timeline status updated successfully',
      data: timeline
    });
  } catch (error) {
    console.error('❌ Error updating timeline:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update timeline status',
      error: error.message
    });
  }
};

export const deleteTimelineEntry = async (req, res) => {
  try {
    const { timelineId } = req.params;

    console.log('\n📅 ═══ DELETE TIMELINE ENTRY ═══');
    console.log('Timeline ID:', timelineId);

    if (!mongoose.Types.ObjectId.isValid(timelineId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid timeline ID format'
      });
    }

    const timeline = await Timeline.findByIdAndDelete(timelineId);

    if (!timeline) {
      console.error('❌ Timeline entry not found');
      return res.status(404).json({
        success: false,
        message: 'Timeline entry not found'
      });
    }

    console.log('✅ Timeline entry deleted successfully');
    console.log('═══════════════════════════════════\n');

    res.status(200).json({
      success: true,
      message: 'Timeline entry deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting timeline:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete timeline entry',
      error: error.message
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// PAYMENT CONTROLLERS
// ═══════════════════════════════════════════════════════════════

export const addPayment = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { description, amount, date, status, paymentMethod, transactionId, remarks } = req.body;

    console.log('\n💰 ═══ ADD PAYMENT ═══');
    console.log('Case ID:', caseId);
    console.log('Description:', description);
    console.log('Amount: ₹', amount);
    console.log('Date:', date);
    console.log('Status:', status || 'pending');

    // Validate required fields
    if (!description || !amount || !date) {
      console.error('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Description, amount, and date are required'
      });
    }

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      console.error('❌ Invalid ObjectId format');
      return res.status(400).json({
        success: false,
        message: 'Invalid case ID format'
      });
    }

    console.log('🔍 Looking up case with Case.findById...');
    console.log('   Case model type:', typeof Case);
    console.log('   Case.findById type:', typeof Case.findById);

    const caseData = await Case.findById(caseId);
    
    if (!caseData) {
      console.error('❌ Case not found with ID:', caseId);
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    console.log('✅ Case found:', caseData.caseNumber);

    const newPayment = await Payment.create({
      caseId,
      caseNumber: caseData.caseNumber,
      description,
      amount: parseFloat(amount),
      date,
      status: status || 'pending',
      paymentMethod: paymentMethod || 'cash',
      transactionId: transactionId || '',
      remarks: remarks || ''
    });

    console.log('✅ Payment created successfully');
    console.log('Payment ID:', newPayment._id);
    console.log('═══════════════════════════════════\n');

    res.status(201).json({
      success: true,
      message: 'Payment added successfully',
      data: newPayment
    });
  } catch (error) {
    console.error('❌ Error adding payment:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Failed to add payment',
      error: error.message
    });
  }
};

export const getPayments = async (req, res) => {
  try {
    const { caseId } = req.params;
    
    console.log('\n💰 ═══ GET PAYMENTS ═══');
    console.log('Case ID:', caseId);

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid case ID format'
      });
    }
    
    const payments = await Payment.findByCaseId(caseId);
    
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
    console.log('✅ Found', payments.length, 'payments');
    console.log('Total Amount: ₹', totalAmount.toLocaleString('en-IN'));
    console.log('═══════════════════════════════════\n');

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('❌ Error fetching payments:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    console.log('\n💰 ═══ UPDATE PAYMENT STATUS ═══');
    console.log('Payment ID:', paymentId);
    console.log('New status:', status);

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID format'
      });
    }

    if (!['paid', 'pending', 'due'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be: paid, pending, or due'
      });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true, runValidators: true }
    );

    if (!payment) {
      console.error('❌ Payment not found');
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    console.log('✅ Payment status updated successfully');
    console.log('═══════════════════════════════════\n');

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      data: payment
    });
  } catch (error) {
    console.error('❌ Error updating payment:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status',
      error: error.message
    });
  }
};

export const getPaymentStats = async (req, res) => {
  try {
    const { caseId } = req.params;
    
    console.log('\n💰 ═══ GET PAYMENT STATISTICS ═══');
    console.log('Case ID:', caseId);

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid case ID format'
      });
    }
    
    const stats = await Payment.getStatsByCaseId(caseId);
    
    console.log('✅ Payment Statistics:');
    console.log('   Total: ₹', stats.total.toLocaleString('en-IN'));
    console.log('   Paid: ₹', stats.paid.toLocaleString('en-IN'));
    console.log('   Pending: ₹', stats.pending.toLocaleString('en-IN'));
    console.log('   Due: ₹', stats.due.toLocaleString('en-IN'));
    console.log('   Outstanding: ₹', stats.outstanding.toLocaleString('en-IN'));
    console.log('═══════════════════════════════════\n');

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Error fetching payment stats:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment statistics',
      error: error.message
    });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;

    console.log('\n💰 ═══ DELETE PAYMENT ═══');
    console.log('Payment ID:', paymentId);

    if (!mongoose.Types.ObjectId.isValid(paymentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment ID format'
      });
    }

    const payment = await Payment.findByIdAndDelete(paymentId);

    if (!payment) {
      console.error('❌ Payment not found');
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    console.log('✅ Payment deleted successfully');
    console.log('═══════════════════════════════════\n');

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting payment:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment',
      error: error.message
    });
  }
};

// ═══════════════════════════════════════════════════════════════
// NOTES CONTROLLERS
// ═══════════════════════════════════════════════════════════════

export const addNote = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { content, author, category, tags } = req.body;

    console.log('\n📝 ═══ ADD NOTE ═══');
    console.log('Case ID:', caseId);
    console.log('Author:', author || 'Current User');
    console.log('Category:', category || 'general');
    console.log('Content length:', content?.length || 0, 'characters');

    if (!content) {
      console.error('❌ Validation failed: Content is required');
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid case ID format'
      });
    }

    const caseData = await Case.findById(caseId);
    if (!caseData) {
      console.error('❌ Case not found');
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    const newNote = await Note.create({
      caseId,
      caseNumber: caseData.caseNumber,
      content,
      author: author || 'Current User',
      category: category || 'general',
      tags: tags || []
    });

    console.log('✅ Note created successfully');
    console.log('Note ID:', newNote._id);
    console.log('═══════════════════════════════════\n');

    res.status(201).json({
      success: true,
      message: 'Note added successfully',
      data: newNote
    });
  } catch (error) {
    console.error('❌ Error adding note:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: error.message
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { caseId } = req.params;
    
    console.log('\n📝 ═══ GET NOTES ═══');
    console.log('Case ID:', caseId);

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid case ID format'
      });
    }
    
    const notes = await Note.findByCaseId(caseId);
    
    const pinnedCount = notes.filter(n => n.isPinned).length;
    console.log('✅ Found', notes.length, 'notes');
    console.log('   Pinned:', pinnedCount);
    console.log('   Regular:', notes.length - pinnedCount);
    console.log('═══════════════════════════════════\n');

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (error) {
    console.error('❌ Error fetching notes:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notes',
      error: error.message
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { content, category, tags, isPinned } = req.body;

    console.log('\n📝 ═══ UPDATE NOTE ═══');
    console.log('Note ID:', noteId);

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }

    const updateData = {};
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (tags !== undefined) updateData.tags = tags;
    if (isPinned !== undefined) updateData.isPinned = isPinned;

    const note = await Note.findByIdAndUpdate(
      noteId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!note) {
      console.error('❌ Note not found');
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    console.log('✅ Note updated successfully');
    console.log('═══════════════════════════════════\n');

    res.status(200).json({
      success: true,
      message: 'Note updated successfully',
      data: note
    });
  } catch (error) {
    console.error('❌ Error updating note:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update note',
      error: error.message
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    console.log('\n📝 ═══ DELETE NOTE ═══');
    console.log('Note ID:', noteId);

    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid note ID format'
      });
    }

    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      console.error('❌ Note not found');
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    console.log('✅ Note deleted successfully');
    console.log('═══════════════════════════════════\n');

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting note:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete note',
      error: error.message
    });
  }
};

console.log('✅ ═══════════════════════════════════════════════════');
console.log('✅ Case Detail View Controller Loaded Successfully');
console.log('✅ Timeline Controllers: 4 functions');
console.log('✅ Payment Controllers: 5 functions');
console.log('✅ Note Controllers: 4 functions');
console.log('✅ Total: 13 controller functions');
console.log('✅ ═══════════════════════════════════════════════════\n');
