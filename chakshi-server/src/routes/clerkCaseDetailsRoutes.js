import express from 'express';

const router = express.Router();

// Temporary mock data (replace with actual controller later)
const mockCases = [
  {
    id: '1',
    caseNumber: 'CLK-2024-001',
    caseTitle: 'Sample Case 1',
    status: 'Active',
    priority: 'High'
  }
];

// GET all cases
router.get('/', (req, res) => {
  console.log('✅ GET /api/clerkcasedetails called');
  res.json({
    success: true,
    count: mockCases.length,
    data: mockCases
  });
});

// GET single case
router.get('/:id', (req, res) => {
  console.log('✅ GET /api/clerkcasedetails/:id called');
  const { id } = req.params;
  const caseData = mockCases.find(c => c.id === id);
  
  if (!caseData) {
    return res.status(404).json({
      success: false,
      message: 'Case not found'
    });
  }
  
  res.json({
    success: true,
    data: caseData
  });
});

// POST create case
router.post('/', (req, res) => {
  console.log('✅ POST /api/clerkcasedetails called');
  console.log('Body:', req.body);
  
  const newCase = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: new Date()
  };
  
  mockCases.push(newCase);
  
  res.status(201).json({
    success: true,
    message: 'Case created successfully',
    data: newCase
  });
});

// PUT update case
router.put('/:id', (req, res) => {
  console.log('✅ PUT /api/clerkcasedetails/:id called');
  const { id } = req.params;
  
  res.json({
    success: true,
    message: 'Case updated successfully',
    data: { id, ...req.body }
  });
});

// DELETE case
router.delete('/:id', (req, res) => {
  console.log('✅ DELETE /api/clerkcasedetails/:id called');
  const { id } = req.params;
  
  res.json({
    success: true,
    message: 'Case deleted successfully'
  });
});

// POST add history
router.post('/:id/history', (req, res) => {
  console.log('✅ POST /api/clerkcasedetails/:id/history called');
  res.json({
    success: true,
    message: 'Case history added successfully'
  });
});

// POST add remark
router.post('/:id/history/:historyId/remark', (req, res) => {
  console.log('✅ POST /api/clerkcasedetails/:id/history/:historyId/remark called');
  res.json({
    success: true,
    message: 'Remark added successfully'
  });
});

// PUT mark milestone complete
router.put('/:id/history/:historyId/complete', (req, res) => {
  console.log('✅ PUT /api/clerkcasedetails/:id/history/:historyId/complete called');
  res.json({
    success: true,
    message: 'Milestone marked as complete'
  });
});

// POST add hearing
router.post('/:id/hearings', (req, res) => {
  console.log('✅ POST /api/clerkcasedetails/:id/hearings called');
  res.json({
    success: true,
    message: 'Hearing added successfully'
  });
});

// PUT update hearing
router.put('/:id/hearings/:hearingId', (req, res) => {
  console.log('✅ PUT /api/clerkcasedetails/:id/hearings/:hearingId called');
  res.json({
    success: true,
    message: 'Hearing updated successfully'
  });
});

// DELETE hearing
router.delete('/:id/hearings/:hearingId', (req, res) => {
  console.log('✅ DELETE /api/clerkcasedetails/:id/hearings/:hearingId called');
  res.json({
    success: true,
    message: 'Hearing deleted successfully'
  });
});

export default router;
