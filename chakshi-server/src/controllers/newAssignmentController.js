const NewAssignment = require('../models/newAssignmentModel');

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Public (No middleware)
exports.createAssignment = async (req, res) => {
  console.log('\n========================================');
  console.log('📝 CREATE ASSIGNMENT CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Request Body:', JSON.stringify(req.body, null, 2));

  try {
    const {
      title,
      description,
      course,
      professor,
      assignmentType,
      submissionType,
      bloomLevel,
      status,
      priority,
      dueDate,
      points,
      estimatedTime,
      notes,
      tags,
      resources
    } = req.body;

    // Validation
    if (!title || !course || !dueDate) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide title, course, and dueDate'
      });
    }

    console.log('✅ Validation passed');

    // Create assignment
    console.log('📝 Creating assignment...');
    const assignmentData = {
      title,
      description: description || '',
      course,
      professor: professor || '',
      assignmentType: assignmentType || 'case-analysis',
      submissionType: submissionType || 'document',
      bloomLevel: bloomLevel || 'knowledge',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate,
      points: points || 100,
      estimatedTime: estimatedTime || '',
      notes: notes || '',
      tags: tags || [],
      resources: resources || [],
      progress: 0,
      isStarred: false,
      aiFeedback: false,
      isArchived: false
    };

    console.log('📄 Assignment Data:', JSON.stringify(assignmentData, null, 2));

    const newAssignment = await NewAssignment.create(assignmentData);
    console.log('✅ Assignment created successfully with ID:', newAssignment._id);

    console.log('🎉 Assignment creation completed!');
    console.log('========================================\n');

    res.status(201).json({
      success: true,
      message: `Assignment "${title}" created successfully`,
      data: newAssignment
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN CREATE ASSIGNMENT ❌❌❌');
    console.error('Error Details:', error);
    console.error('Error Message:', error.message);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Server error while creating assignment',
      error: error.message
    });
  }
};

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Public
exports.getAllAssignments = async (req, res) => {
  console.log('\n========================================');
  console.log('📋 GET ALL ASSIGNMENTS CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Query Parameters:', JSON.stringify(req.query, null, 2));

  try {
    const {
      status,
      priority,
      course,
      assignmentType,
      bloomLevel,
      isStarred,
      search,
      sortBy = 'dueDate',
      sortOrder = 'asc'
    } = req.query;

    console.log('✅ Query parameters extracted');

    // Build filter
    console.log('🔍 Building filter object...');
    const filter = { isDeleted: false };

    if (status && status !== 'all') {
      filter.status = status;
      console.log(`✅ Added status filter: ${status}`);
    }

    if (priority && priority !== 'all') {
      filter.priority = priority;
      console.log(`✅ Added priority filter: ${priority}`);
    }

    if (course && course !== 'all') {
      filter.course = course;
      console.log(`✅ Added course filter: ${course}`);
    }

    if (assignmentType && assignmentType !== 'all') {
      filter.assignmentType = assignmentType;
      console.log(`✅ Added assignment type filter: ${assignmentType}`);
    }

    if (bloomLevel && bloomLevel !== 'all') {
      filter.bloomLevel = bloomLevel;
      console.log(`✅ Added bloom level filter: ${bloomLevel}`);
    }

    if (isStarred === 'true') {
      filter.isStarred = true;
      console.log(`✅ Added starred filter`);
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { course: { $regex: search, $options: 'i' } }
      ];
      console.log(`✅ Added search filter: "${search}"`);
    }

    console.log('📊 Final Filter Object:', JSON.stringify(filter, null, 2));

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    console.log(`🔀 Sorting by: ${sortBy} (${sortOrder})`);

    // Fetch assignments
    console.log('🔍 Fetching assignments from database...');
    const assignments = await NewAssignment.find(filter)
      .sort(sort)
      .lean();

    console.log(`✅ Found ${assignments.length} assignments`);

    console.log('🎉 Assignments fetched successfully!');
    console.log('========================================\n');

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN GET ALL ASSIGNMENTS ❌❌❌');
    console.error('Error Details:', error);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Server error while fetching assignments',
      error: error.message
    });
  }
};

// @desc    Get single assignment by ID
// @route   GET /api/assignments/:id
// @access  Public
exports.getAssignmentById = async (req, res) => {
  console.log('\n========================================');
  console.log('🔍 GET ASSIGNMENT BY ID CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Assignment ID:', req.params.id);

  try {
    console.log('🔍 Fetching assignment from database...');
    const assignment = await NewAssignment.findById(req.params.id);

    if (!assignment || assignment.isDeleted) {
      console.log(`❌ Assignment not found with ID: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    console.log('✅ Assignment found:', assignment.title);
    console.log('========================================\n');

    res.status(200).json({
      success: true,
      data: assignment
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN GET ASSIGNMENT BY ID ❌❌❌');
    console.error('Error Details:', error);
    console.log('========================================\n');

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching assignment',
      error: error.message
    });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Public
exports.updateAssignment = async (req, res) => {
  console.log('\n========================================');
  console.log('✏️ UPDATE ASSIGNMENT CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Assignment ID:', req.params.id);
  console.log('📥 Update Data:', JSON.stringify(req.body, null, 2));

  try {
    const assignment = await NewAssignment.findById(req.params.id);

    if (!assignment || assignment.isDeleted) {
      console.log(`❌ Assignment not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    console.log('✅ Assignment found:', assignment.title);

    // Update fields
    console.log('📝 Updating assignment fields...');
    Object.keys(req.body).forEach(key => {
      assignment[key] = req.body[key];
    });

    await assignment.save();
    console.log('✅ Assignment updated successfully');

    console.log('========================================\n');

    res.status(200).json({
      success: true,
      message: 'Assignment updated successfully',
      data: assignment
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN UPDATE ASSIGNMENT ❌❌❌');
    console.error('Error Details:', error);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Server error while updating assignment',
      error: error.message
    });
  }
};

// @desc    Delete assignment (soft delete)
// @route   DELETE /api/assignments/:id
// @access  Public
exports.deleteAssignment = async (req, res) => {
  console.log('\n========================================');
  console.log('🗑️ DELETE ASSIGNMENT CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Assignment ID:', req.params.id);

  try {
    const assignment = await NewAssignment.findById(req.params.id);

    if (!assignment || assignment.isDeleted) {
      console.log(`❌ Assignment not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    console.log('✅ Assignment found:', assignment.title);

    // Soft delete
    console.log('🗃️ Soft deleting assignment...');
    assignment.isDeleted = true;
    assignment.deletedAt = new Date();
    await assignment.save();

    console.log('✅ Assignment soft deleted successfully');
    console.log('========================================\n');

    res.status(200).json({
      success: true,
      message: 'Assignment deleted successfully'
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN DELETE ASSIGNMENT ❌❌❌');
    console.error('Error Details:', error);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Server error while deleting assignment',
      error: error.message
    });
  }
};

// @desc    Get assignments by course
// @route   GET /api/assignments/course/:course
// @access  Public
exports.getAssignmentsByCourse = async (req, res) => {
  console.log('\n========================================');
  console.log('📚 GET ASSIGNMENTS BY COURSE CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Course:', req.params.course);

  try {
    const assignments = await NewAssignment.findByCourse(req.params.course);

    console.log(`✅ Found ${assignments.length} assignments for course`);
    console.log('========================================\n');

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments
    });

  } catch (error) {
    console.log('\n❌❌❌ ERROR IN GET ASSIGNMENTS BY COURSE ❌❌❌');
    console.error('Error Details:', error);
    console.log('========================================\n');

    res.status(500).json({
      success: false,
      message: 'Server error while fetching assignments',
      error: error.message
    });
  }
};

// @desc    Toggle starred status
// @route   PATCH /api/assignments/:id/star
// @access  Public
exports.toggleStar = async (req, res) => {
  console.log('\n========================================');
  console.log('⭐ TOGGLE STAR CONTROLLER CALLED');
  console.log('========================================');
  console.log('📥 Assignment ID:', req.params.id);

  try {
    const assignment = await NewAssignment.findById(req.params.id);

    if (!assignment || assignment.isDeleted) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    assignment.isStarred = !assignment.isStarred;
    await assignment.save();

    console.log(`✅ Starred status toggled to: ${assignment.isStarred}`);
    console.log('========================================\n');

    res.status(200).json({
      success: true,
      message: `Assignment ${assignment.isStarred ? 'starred' : 'unstarred'}`,
      data: assignment
    });

  } catch (error) {
    console.error('❌ ERROR IN TOGGLE STAR:', error);

    res.status(500).json({
      success: false,
      message: 'Server error while toggling star',
      error: error.message
    });
  }
};
