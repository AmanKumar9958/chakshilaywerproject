import NewCaseModel from '../models/NewCaseModel.js';

console.log('🎯 ═══════════════════════════════════════');
console.log('📂 New Case Controller Loaded (ES6 Module)');
console.log('🎯 ═══════════════════════════════════════\n');

// @desc    Create new case
// @route   POST /api/new-case
// @access  Private
export const createNewCase = async (req, res) => {
  console.log('\n========================================');
  console.log('📌 CREATE NEW CASE CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Request Body:', JSON.stringify(req.body, null, 2));
  
  try {
    const {
      caseNumber,      // ✅ Fixed: was "number"
      status,
      clientName,      // ✅ Fixed: was "client"
      oppositeParty,
      court,
      filingDate,
      caseType,
      judge,
      description,
      actsSections,
      nextHearing,
      hearingTime,
      caseTitle
    } = req.body;

    console.log('✅ Request data extracted successfully');

    // Validation
    console.log('🔍 Validating required fields...');
    if (!caseNumber || !clientName || !oppositeParty || !court || !filingDate) {
      console.log('❌ Validation failed: Missing required fields');
      console.log('📊 Field check:', {
        caseNumber: caseNumber ? '✅' : '❌',
        clientName: clientName ? '✅' : '❌',
        oppositeParty: oppositeParty ? '✅' : '❌',
        court: court ? '✅' : '❌',
        filingDate: filingDate ? '✅' : '❌'
      });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: case number, client name, opposing party, court, and filing date'
      });
    }
    console.log('✅ All required fields validated');

    // Check if case number already exists
    console.log(`🔍 Checking if case number "${caseNumber}" already exists...`);
    const caseExists = await NewCaseModel.findOne({ caseNumber: caseNumber });
    if (caseExists) {
      console.log(`❌ Case number "${caseNumber}" already exists in database`);
      return res.status(400).json({
        success: false,
        message: 'Case number already exists'
      });
    }
    console.log('✅ Case number is unique');

    // Create case object
    console.log('📝 Creating case data object...');
    const caseData = {
      caseNumber: caseNumber,
      caseTitle: caseTitle || `${clientName} vs ${oppositeParty}`,
      status: status || 'Active',
      clientName: clientName,
      oppositeParty: oppositeParty,
      court,
      filingDate: new Date(filingDate),
      caseType: caseType || 'Civil',
      judge: judge || '',
      description: description || '',
      actsSections: actsSections || [],
      nextHearing: nextHearing ? new Date(nextHearing) : null,
      hearingTime: hearingTime || null,
      priority: 'Medium',
      lastUpdated: new Date()
    };
    console.log('✅ Case data object created');
    console.log('📋 Case data:', JSON.stringify(caseData, null, 2));

    // Create case
    console.log('💾 Saving case to database...');
    const newCase = await NewCaseModel.create(caseData);
    console.log('✅ Case created successfully with ID:', newCase._id);

    // Add initial timeline event
    console.log('📅 Adding initial timeline event...');
    newCase.timeline.push({
      stage: 'Case Filed',
      date: filingDate,
      status: 'Active',
      description: `Case filed at ${court}`
    });

    console.log('💾 Saving timeline to database...');
    await newCase.save();
    console.log('✅ Timeline saved successfully');
    console.log('🎉 Case creation completed successfully!');
    console.log('========================================\n');

    res.status(201).json({
      success: true,
      message: `Case ${caseNumber} created successfully`,
      data: newCase
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN CREATE CASE ❌❌❌');
    console.error('Error Details:', error.message);
    console.error('Error Stack:', error.stack);
    console.log('========================================\n');
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating case',
      error: error.message
    });
  }
};


// @desc    Get all cases
// @route   GET /api/new-case
// @access  Private
export const getAllNewCases = async (req, res) => {
  console.log('\n========================================');
  console.log('📋 GET ALL NEW CASES CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Query Parameters:', JSON.stringify(req.query, null, 2));
  
  try {
    const { 
      status, 
      priority, 
      court, 
      caseType, 
      search,
      sortBy = 'lastUpdated',
      sortOrder = 'desc',
      page = 1,
      limit = 50
    } = req.query;

    console.log('✅ Query parameters extracted');

    // Build filter
    const filter = { isArchived: false };

    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (court && court !== 'all') filter.court = court;
    if (caseType && caseType !== 'all') filter.caseType = caseType;

    if (search) {
      filter.$or = [
        { caseNumber: { $regex: search, $options: 'i' } },
        { caseTitle: { $regex: search, $options: 'i' } },
        { clientName: { $regex: search, $options: 'i' } },
        { oppositeParty: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('📊 Filter:', JSON.stringify(filter, null, 2));

    // Build sort
    const sort = {};
    const validSortFields = ['lastUpdated', 'caseNumber', 'filingDate', 'nextHearing', 'priority', 'status'];
    sort[validSortFields.includes(sortBy) ? sortBy : 'lastUpdated'] = sortOrder === 'asc' ? 1 : -1;

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    console.log('🔍 Fetching cases from database...');
    const cases = await NewCaseModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    const totalCases = await NewCaseModel.countDocuments(filter);

    console.log(`✅ Found ${cases.length} cases out of ${totalCases} total`);
    console.log('========================================\n');

    res.status(200).json({
      success: true,
      count: cases.length,
      total: totalCases,
      page: pageNum,
      pages: Math.ceil(totalCases / limitNum),
      data: cases
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN GET ALL CASES ❌❌❌');
    console.error('Error:', error.message);
    console.log('========================================\n');
    
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cases',
      error: error.message
    });
  }
};

// @desc    Get case by ID
// @route   GET /api/new-case/:id
// @access  Private
export const getNewCaseById = async (req, res) => {
  console.log('\n========================================');
  console.log('🔍 GET CASE BY ID:', req.params.id);
  console.log('========================================');
  
  try {
    const caseData = await NewCaseModel.findById(req.params.id);

    if (!caseData) {
      console.log('❌ Case not found\n');
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    console.log('✅ Case found:', caseData.caseNumber);
    console.log('========================================\n');

    res.status(200).json({
      success: true,
      data: caseData
    });

  } catch (error) {
    console.log('\n❌ ERROR:', error.message, '\n');
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update case
// @route   PUT /api/new-case/:id
// @access  Private
export const updateNewCase = async (req, res) => {
  console.log('\n========================================');
  console.log('✏️ UPDATE CASE:', req.params.id);
  console.log('========================================');
  
  try {
    const caseData = await NewCaseModel.findById(req.params.id);

    if (!caseData) {
      console.log('❌ Case not found\n');
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    console.log('✅ Case found:', caseData.caseNumber);
    console.log('📝 Updating fields...');

    const allowedFields = [
      'status', 'clientName', 'oppositeParty', 'court', 'judge',
      'caseType', 'priority', 'nextHearing', 'hearingTime',
      'description', 'actsSections', 'stage'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        caseData[field] = req.body[field];
      }
    });

    caseData.lastUpdated = new Date();

    await caseData.save();
    console.log('✅ Case updated successfully\n');

    res.status(200).json({
      success: true,
      message: 'Case updated successfully',
      data: caseData
    });

  } catch (error) {
    console.log('\n❌ ERROR:', error.message, '\n');
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete case (archive)
// @route   DELETE /api/new-case/:id
// @access  Private
export const deleteNewCase = async (req, res) => {
  console.log('\n========================================');
  console.log('🗑️ DELETE CASE:', req.params.id);
  console.log('========================================');
  
  try {
    const caseData = await NewCaseModel.findById(req.params.id);

    if (!caseData) {
      console.log('❌ Case not found\n');
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    console.log('✅ Case found:', caseData.caseNumber);
    console.log('🗃️ Archiving case...');
    
    caseData.isArchived = true;
    caseData.archivedAt = new Date();
    await caseData.save();
    
    console.log('✅ Case archived successfully\n');

    res.status(200).json({
      success: true,
      message: 'Case archived successfully'
    });

  } catch (error) {
    console.log('\n❌ ERROR:', error.message, '\n');
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get case statistics
// @route   GET /api/new-case/stats/overview
// @access  Private
export const getNewCaseStats = async (req, res) => {
  console.log('\n========================================');
  console.log('📊 GET CASE STATISTICS');
  console.log('========================================');
  
  try {
    console.log('📈 Calculating statistics...');
    
    const stats = await NewCaseModel.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: null,
          totalCases: { $sum: 1 },
          activeCases: {
            $sum: { $cond: [{ $eq: ['$status', 'Active'] }, 1, 0] }
          },
          pendingCases: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          closedCases: {
            $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] }
          }
        }
      }
    ]);

    const caseTypeStats = await NewCaseModel.aggregate([
      { $match: { isArchived: false } },
      {
        $group: {
          _id: '$caseType',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('✅ Statistics calculated successfully\n');

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || { totalCases: 0, activeCases: 0, pendingCases: 0, closedCases: 0 },
        byType: caseTypeStats
      }
    });

  } catch (error) {
    console.log('\n❌ ERROR:', error.message, '\n');
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

console.log('✅ All New Case Controller Functions Loaded (ES6)');
console.log('📦 Exported Functions:');
console.log('   • createNewCase');
console.log('   • getAllNewCases');
console.log('   • getNewCaseById');
console.log('   • updateNewCase');
console.log('   • deleteNewCase');
console.log('   • getNewCaseStats\n');
