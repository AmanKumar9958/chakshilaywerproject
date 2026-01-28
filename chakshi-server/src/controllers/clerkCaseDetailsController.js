import ClerkCaseDetails from '../models/ClerkCaseDetails.js';

// Get single case details
export const getClerkCaseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const caseDetails = await ClerkCaseDetails.findById(id)
      .populate('createdBy', 'name email')
      .populate('updatedBy', 'name email');

    if (!caseDetails) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    res.status(200).json({
      success: true,
      data: caseDetails
    });

  } catch (error) {
    console.error('Get Clerk Case Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch case details',
      error: error.message
    });
  }
};

// Get all cases
export const getAllClerkCaseDetails = async (req, res) => {
  try {
    const { status, priority, court, search, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (court) filter.court = { $regex: court, $options: 'i' };
    if (search) {
      filter.$or = [
        { caseNumber: { $regex: search, $options: 'i' } },
        { caseTitle: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { oppositeParty: { $regex: search, $options: 'i' } }
      ];
    }

    const cases = await ClerkCaseDetails.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('createdBy', 'name email');

    const total = await ClerkCaseDetails.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: cases.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
      data: cases
    });

  } catch (error) {
    console.error('Get All Clerk Case Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cases',
      error: error.message
    });
  }
};

// Create new case
export const createClerkCaseDetails = async (req, res) => {
  try {
    const caseData = {
      ...req.body,
      createdBy: req.body.userId || '507f1f77bcf86cd799439011',
      caseHistory: [{
        event: 'Case filed',
        details: `Case ${req.body.caseNumber} has been filed`,
        date: req.body.filingDate || new Date(),
        time: '09:00',
        by: 'System',
        completed: true,
        remarks: []
      }]
    };

    const newCase = await ClerkCaseDetails.create(caseData);

    res.status(201).json({
      success: true,
      message: 'Clerk case created successfully',
      data: newCase
    });

  } catch (error) {
    console.error('Create Clerk Case Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create case',
      error: error.message
    });
  }
};

// Update case details
export const updateClerkCaseDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const caseDetails = await ClerkCaseDetails.findByIdAndUpdate(
      id,
      {
        $set: {
          ...updates,
          updatedBy: updates.userId || null
        }
      },
      { new: true, runValidators: true }
    );

    if (!caseDetails) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Clerk case updated successfully',
      data: caseDetails
    });

  } catch (error) {
    console.error('Update Clerk Case Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update case',
      error: error.message
    });
  }
};

// Add case history/milestone
export const addClerkCaseHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { event, details, date, time, by } = req.body;

    const caseDetails = await ClerkCaseDetails.findByIdAndUpdate(
      id,
      {
        $push: {
          caseHistory: {
            $each: [{
              event,
              details,
              date: date || new Date(),
              time: time || '10:00',
              by: by || 'Unknown User',
              completed: false,
              remarks: []
            }],
            $position: 0
          }
        }
      },
      { new: true }
    );

    if (!caseDetails) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Case history added successfully',
      data: caseDetails
    });

  } catch (error) {
    console.error('Add Clerk Case History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add case history',
      error: error.message
    });
  }
};

// Update case history
export const updateClerkCaseHistory = async (req, res) => {
  try {
    const { id, historyId } = req.params;
    const updates = req.body;

    const caseDetails = await ClerkCaseDetails.findOneAndUpdate(
      { _id: id, 'caseHistory._id': historyId },
      {
        $set: {
          'caseHistory.$.event': updates.event,
          'caseHistory.$.details': updates.details,
          'caseHistory.$.date': updates.date,
          'caseHistory.$.time': updates.time
        }
      },
      { new: true }
    );

    if (!caseDetails) {
      return res.status(404).json({
        success: false,
        message: 'Case or history entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Clerk case history updated successfully',
      data: caseDetails
    });

  } catch (error) {
    console.error('Update Clerk Case History Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update case history',
      error: error.message
    });
  }
};

// Mark milestone as complete
export const markClerkCaseMilestoneComplete = async (req, res) => {
  try {
    const { id, historyId } = req.params;
    const { completedBy } = req.body;

    const caseDetails = await ClerkCaseDetails.findOneAndUpdate(
      { _id: id, 'caseHistory._id': historyId },
      {
        $set: {
          'caseHistory.$.completed': true,
          'caseHistory.$.completedAt': new Date(),
          'caseHistory.$.completedBy': completedBy || 'Unknown User'
        }
      },
      { new: true }
    );

    if (!caseDetails) {
      return res.status(404).json({
        success: false,
        message: 'Case or milestone not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Milestone marked as complete',
      data: caseDetails
    });

  } catch (error) {
    console.error('Mark Clerk Case Milestone Complete Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark milestone as complete',
      error: error.message
    });
  }
};

// Add remark to case history
export const addClerkCaseHistoryRemark = async (req, res) => {
  try {
    const { id, historyId } = req.params;
    const { text, by } = req.body;

    const remark = {
      text,
      by: by || 'Unknown User',
      date: new Date()
    };

    const caseDetails = await ClerkCaseDetails.findOneAndUpdate(
      { _id: id, 'caseHistory._id': historyId },
      {
        $push: {
          'caseHistory.$.remarks': remark
        }
      },
      { new: true }
    );

    if (!caseDetails) {
      return res.status(404).json({
        success: false,
        message: 'Case or history entry not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Remark added successfully',
      data: caseDetails
    });

  } catch (error) {
    console.error('Add Clerk Case Remark Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add remark',
      error: error.message
    });
  }
};

// Add hearing
export const addClerkCaseHearing = async (req, res) => {
  try {
    const { id } = req.params;
    const hearingData = {
      id: Date.now(),
      ...req.body,
      remarks: []
    };

    const caseDetails = await ClerkCaseDetails.findByIdAndUpdate(
      id,
      {
        $push: { hearings: hearingData }
      },
      { new: true }
    );

    if (!caseDetails) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hearing added successfully',
      data: caseDetails
    });

  } catch (error) {
    console.error('Add Clerk Case Hearing Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add hearing',
      error: error.message
    });
  }
};

// Update hearing
export const updateClerkCaseHearing = async (req, res) => {
  try {
    const { id, hearingId } = req.params;
    const updates = req.body;

    const caseDetails = await ClerkCaseDetails.findOneAndUpdate(
      { _id: id, 'hearings.id': parseInt(hearingId) },
      {
        $set: {
          'hearings.$.name': updates.name,
          'hearings.$.date': updates.date,
          'hearings.$.time': updates.time,
          'hearings.$.court': updates.court,
          'hearings.$.judge': updates.judge
        }
      },
      { new: true }
    );

    if (!caseDetails) {
      return res.status(404).json({
        success: false,
        message: 'Case or hearing not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hearing updated successfully',
      data: caseDetails
    });

  } catch (error) {
    console.error('Update Clerk Case Hearing Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hearing',
      error: error.message
    });
  }
};

// Delete hearing
export const deleteClerkCaseHearing = async (req, res) => {
  try {
    const { id, hearingId } = req.params;

    const caseDetails = await ClerkCaseDetails.findByIdAndUpdate(
      id,
      {
        $pull: { hearings: { id: parseInt(hearingId) } }
      },
      { new: true }
    );

    if (!caseDetails) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Hearing deleted successfully',
      data: caseDetails
    });

  } catch (error) {
    console.error('Delete Clerk Case Hearing Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete hearing',
      error: error.message
    });
  }
};

// Delete case
export const deleteClerkCaseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const caseDetails = await ClerkCaseDetails.findByIdAndDelete(id);

    if (!caseDetails) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Clerk case deleted successfully'
    });

  } catch (error) {
    console.error('Delete Clerk Case Details Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete case',
      error: error.message
    });
  }
};
