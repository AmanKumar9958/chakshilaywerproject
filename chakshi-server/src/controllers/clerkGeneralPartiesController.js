import ClerkGeneralParties from '../models/clerkGeneralPartiesModel.js';
import NewCaseModel from '../models/NewCaseModel.js';

console.log('🎯 ═══════════════════════════════════════');
console.log('📂 Clerk General Parties Controller Loaded');
console.log('🎯 ═══════════════════════════════════════\n');

// @desc    Create new party
// @route   POST /api/clerk-parties
// @access  Private
export const createParty = async (req, res) => {
  console.log('\n🔹 ═══════════════════════════════════════');
  console.log('📝 CREATE PARTY - START');
  console.log('🔹 ═══════════════════════════════════════');
  
  try {
    console.log('📋 Request Body:', JSON.stringify(req.body, null, 2));

    const {
      name,
      type,
      email,
      phone,
      address,
      occupation,
      company,
      panNumber,
      aadhaarNumber,
      notes
    } = req.body;

    // Validation
    if (!name || !email) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Name and Email are required'
      });
    }

    // Check if party already exists
    console.log(`🔍 Checking if party with email "${email}" exists...`);
    const existingParty = await ClerkGeneralParties.findOne({ email });
    
    if (existingParty) {
      console.log('❌ Party already exists');
      return res.status(400).json({
        success: false,
        message: 'Party with this email already exists'
      });
    }

    // Create party data object
    const partyData = {
      name,
      type: type || 'Individual',
      email,
      phone,
      address,
      occupation,
      company,
      notes,
      status: 'Active',
      rating: 0,
      linkedCases: 0,
      totalCases: 0,
      activeCases: 0,
      closedCases: 0,
      outstandingDues: 0,
      totalRevenue: 0,
      idProofs: []
    };

    // Add ID proofs if provided
    if (panNumber) {
      partyData.panCard = { number: panNumber, uploadedAt: new Date() };
      partyData.idProofs.push({
        type: 'PAN Card',
        number: panNumber,
        verified: false
      });
    }

    if (aadhaarNumber) {
      partyData.aadhaarCard = { number: aadhaarNumber, uploadedAt: new Date() };
      partyData.idProofs.push({
        type: 'Aadhaar',
        number: aadhaarNumber,
        verified: false
      });
    }

    console.log('💾 Saving party to database...');
    const newParty = await ClerkGeneralParties.create(partyData);
    
    console.log('✅ Party created successfully');
    console.log('   📊 Party ID:', newParty._id);
    console.log('   📊 Party Name:', newParty.name);
    console.log('🔹 ═══════════════════════════════════════\n');

    res.status(201).json({
      success: true,
      message: 'Party created successfully',
      data: newParty
    });

  } catch (error) {
    console.error('❌ ═══════════════════════════════════════');
    console.error('💥 CREATE PARTY ERROR');
    console.error('❌ ═══════════════════════════════════════');
    console.error('🔴 Error:', error.message);
    console.error('🔴 Stack:', error.stack);
    console.error('❌ ═══════════════════════════════════════\n');
    
    res.status(500).json({
      success: false,
      message: 'Failed to create party',
      error: error.message
    });
  }
};

// @desc    Get all parties with filters
// @route   GET /api/clerk-parties
// @access  Private
export const getAllParties = async (req, res) => {
  console.log('\n🔹 ═══════════════════════════════════════');
  console.log('📋 GET ALL PARTIES - START');
  console.log('🔹 ═══════════════════════════════════════');
  
  try {
    const { 
      type, 
      status, 
      search,
      page = 1,
      limit = 50
    } = req.query;

    console.log('📋 Query Parameters:', JSON.stringify(req.query, null, 2));

    // Build filter
    const filter = { isArchived: false };

    if (type && type !== 'All') {
      filter.type = type;
      console.log('🔍 Filter by type:', type);
    }

    if (status && status !== 'All') {
      filter.status = status;
      console.log('🔍 Filter by status:', status);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
      console.log('🔍 Search term:', search);
    }

    console.log('📊 Final Filter:', JSON.stringify(filter, null, 2));

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    console.log('🔍 Fetching parties from database...');
    const parties = await ClerkGeneralParties.find(filter)
      .populate('caseIds', 'caseNumber caseTitle status')
      .sort({ addedDate: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalParties = await ClerkGeneralParties.countDocuments(filter);

    console.log(`✅ Found ${parties.length} parties out of ${totalParties} total`);
    console.log('🔹 ═══════════════════════════════════════\n');

    res.status(200).json({
      success: true,
      count: parties.length,
      total: totalParties,
      page: pageNum,
      pages: Math.ceil(totalParties / limitNum),
      data: parties
    });

  } catch (error) {
    console.error('❌ GET ALL PARTIES ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch parties',
      error: error.message
    });
  }
};

// @desc    Get party by ID with cases and documents
// @route   GET /api/clerk-parties/:id
// @access  Private
export const getPartyById = async (req, res) => {
  console.log('\n🔹 GET PARTY BY ID:', req.params.id);
  
  try {
    const party = await ClerkGeneralParties.findById(req.params.id)
      .populate('caseIds', 'caseNumber caseTitle status court nextHearing')
      .populate('documentIds', 'name fileUrl uploadedAt');

    if (!party) {
      console.log('❌ Party not found\n');
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    console.log('✅ Party found:', party.name);

    // Get linked cases from NewCaseModel
    const linkedCases = await NewCaseModel.find({
      $or: [
        { clientName: party.name },
        { oppositeParty: party.name }
      ]
    }).select('caseNumber caseTitle status court nextHearing');

    console.log('📊 Linked cases found:', linkedCases.length, '\n');

    res.status(200).json({
      success: true,
      data: {
        ...party.toObject(),
        linkedCases
      }
    });

  } catch (error) {
    console.error('❌ GET PARTY ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch party',
      error: error.message
    });
  }
};

// @desc    Update party
// @route   PUT /api/clerk-parties/:id
// @access  Private
export const updateParty = async (req, res) => {
  console.log('\n🔹 UPDATE PARTY:', req.params.id);
  
  try {
    const party = await ClerkGeneralParties.findById(req.params.id);

    if (!party) {
      console.log('❌ Party not found\n');
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    console.log('✅ Party found:', party.name);
    console.log('📝 Updating fields...');

    // Update allowed fields
    const allowedFields = [
      'name', 'type', 'email', 'phone', 'address', 'occupation',
      'company', 'notes', 'status', 'rating'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        party[field] = req.body[field];
      }
    });

    // Update ID proofs if provided
    if (req.body.panNumber) {
      party.panCard = {
        number: req.body.panNumber,
        fileUrl: req.body.panCardUrl,
        uploadedAt: new Date()
      };
    }

    if (req.body.aadhaarNumber) {
      party.aadhaarCard = {
        number: req.body.aadhaarNumber,
        fileUrl: req.body.aadhaarCardUrl,
        uploadedAt: new Date()
      };
    }

    await party.save();
    console.log('✅ Party updated successfully\n');

    res.status(200).json({
      success: true,
      message: 'Party updated successfully',
      data: party
    });

  } catch (error) {
    console.error('❌ UPDATE PARTY ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update party',
      error: error.message
    });
  }
};

// @desc    Delete party (archive)
// @route   DELETE /api/clerk-parties/:id
// @access  Private
export const deleteParty = async (req, res) => {
  console.log('\n🔹 DELETE PARTY:', req.params.id);
  
  try {
    const party = await ClerkGeneralParties.findById(req.params.id);

    if (!party) {
      console.log('❌ Party not found\n');
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    console.log('✅ Party found:', party.name);
    console.log('🗃️ Archiving party...');
    
    party.isArchived = true;
    await party.save();
    
    console.log('✅ Party archived successfully\n');

    res.status(200).json({
      success: true,
      message: 'Party archived successfully'
    });

  } catch (error) {
    console.error('❌ DELETE PARTY ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete party',
      error: error.message
    });
  }
};

// @desc    Get party statistics
// @route   GET /api/clerk-parties/stats/overview
// @access  Private
export const getPartiesStats = async (req, res) => {
  console.log('\n🔹 GET PARTIES STATISTICS');
  
  try {
    console.log('📈 Calculating statistics...');
    
    const totalParties = await ClerkGeneralParties.countDocuments({ isArchived: false });
    const activeParties = await ClerkGeneralParties.countDocuments({ status: 'Active', isArchived: false });
    const inactiveParties = await ClerkGeneralParties.countDocuments({ status: 'Inactive', isArchived: false });
    
    const typeStats = await ClerkGeneralParties.aggregate([
      { $match: { isArchived: false } },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const stats = {
      totalParties,
      activeParties,
      inactiveParties,
      byType: typeStats
    };

    console.log('✅ Statistics calculated successfully\n');

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ GET STATS ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

// @desc    Add communication log
// @route   POST /api/clerk-parties/:id/communication
// @access  Private
export const addCommunication = async (req, res) => {
  console.log('\n🔹 ADD COMMUNICATION:', req.params.id);
  
  try {
    const party = await ClerkGeneralParties.findById(req.params.id);

    if (!party) {
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    const { type, subject, date, duration, status, notes } = req.body;

    party.communications.push({
      type,
      subject,
      date: date || new Date(),
      duration,
      status,
      notes
    });

    await party.save();
    console.log('✅ Communication added successfully\n');

    res.status(200).json({
      success: true,
      message: 'Communication added successfully',
      data: party.communications[party.communications.length - 1]
    });

  } catch (error) {
    console.error('❌ ADD COMMUNICATION ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add communication',
      error: error.message
    });
  }
};

// @desc    Add payment record
// @route   POST /api/clerk-parties/:id/payment
// @access  Private
export const addPayment = async (req, res) => {
  console.log('\n🔹 ADD PAYMENT:', req.params.id);
  
  try {
    const party = await ClerkGeneralParties.findById(req.params.id);

    if (!party) {
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    const { amount, method, invoice, date, status } = req.body;

    party.paymentHistory.push({
      amount,
      method,
      invoice,
      date: date || new Date(),
      status: status || 'Paid'
    });

    // Update financial stats
    if (status === 'Paid') {
      party.totalRevenue += amount;
    }

    await party.save();
    console.log('✅ Payment added successfully\n');

    res.status(200).json({
      success: true,
      message: 'Payment added successfully',
      data: party.paymentHistory[party.paymentHistory.length - 1]
    });

  } catch (error) {
    console.error('❌ ADD PAYMENT ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to add payment',
      error: error.message
    });
  }
};

// @desc    Upload ID proof
// @route   POST /api/clerk-parties/:id/upload-id
// @access  Private
export const uploadIdProof = async (req, res) => {
  console.log('\n🔹 UPLOAD ID PROOF:', req.params.id);
  
  try {
    const party = await ClerkGeneralParties.findById(req.params.id);

    if (!party) {
      return res.status(404).json({
        success: false,
        message: 'Party not found'
      });
    }

    const { type, number, fileUrl } = req.body;

    if (type === 'PAN Card') {
      party.panCard = {
        number,
        fileUrl,
        uploadedAt: new Date()
      };
    } else if (type === 'Aadhaar') {
      party.aadhaarCard = {
        number,
        fileUrl,
        uploadedAt: new Date()
      };
    }

    // Update or add to idProofs array
    const existingProofIndex = party.idProofs.findIndex(p => p.type === type);
    
    if (existingProofIndex !== -1) {
      party.idProofs[existingProofIndex] = {
        type,
        number,
        fileUrl,
        verified: false,
        uploadedAt: new Date()
      };
    } else {
      party.idProofs.push({
        type,
        number,
        fileUrl,
        verified: false,
        uploadedAt: new Date()
      });
    }

    await party.save();
    console.log('✅ ID proof uploaded successfully\n');

    res.status(200).json({
      success: true,
      message: 'ID proof uploaded successfully',
      data: party
    });

  } catch (error) {
    console.error('❌ UPLOAD ID PROOF ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to upload ID proof',
      error: error.message
    });
  }
};

console.log('✅ All Clerk General Parties Controller Functions Loaded');
console.log('📦 Exported Functions:');
console.log('   • createParty');
console.log('   • getAllParties');
console.log('   • getPartyById');
console.log('   • updateParty');
console.log('   • deleteParty');
console.log('   • getPartiesStats');
console.log('   • addCommunication');
console.log('   • addPayment');
console.log('   • uploadIdProof\n');
