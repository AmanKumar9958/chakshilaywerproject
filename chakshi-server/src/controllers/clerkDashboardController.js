import ClerkDashboard from '../models/ClerkDashboard.js';
import NewCaseModel from '../models/NewCaseModel.js'; // Main case model
import ClerkCaseDetails from '../models/ClerkCaseDetails.js'; // Only for hearings

console.log('🎯 ═══════════════════════════════════════');
console.log('📂 Clerk Dashboard Controller Loaded');
console.log('📋 Using Models:');
console.log('   • NewCaseModel (cases, stats, recent cases)');
console.log('   • ClerkCaseDetails (upcoming hearings only)');
console.log('🎯 ═══════════════════════════════════════\n');

// Get dashboard data
export const getClerkDashboard = async (req, res) => {
  console.log('\n🔹 ═══════════════════════════════════════');
  console.log('📊 GET CLERK DASHBOARD - START');
  console.log('🔹 ═══════════════════════════════════════');
  
  try {
    const { clerkId } = req.params;

    console.log('📋 Request Details:');
    console.log('   👤 Clerk ID:', clerkId);
    console.log('   ⏰ Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    console.log('   🔗 Route:', req.originalUrl);

    console.log('\n🔍 Searching for dashboard...');

    // Get or create dashboard
    let dashboard = await ClerkDashboard.findOne({ clerkId })
      .populate('recentCases.caseId', 'caseNumber caseTitle status priority')
      .populate('upcomingHearings.caseId', 'caseNumber caseTitle');

    if (!dashboard) {
      console.log('⚠️ Dashboard not found, creating new one...');
      
      dashboard = await ClerkDashboard.create({
        clerkId,
        stats: {
          totalCases: 0,
          activeCases: 0,
          pendingCases: 0,
          closedCases: 0,
          upcomingHearings: 0
        },
        recentCases: [],
        upcomingHearings: [],
        notifications: []
      });

      console.log('✅ New dashboard created successfully');
      console.log('   📊 Dashboard ID:', dashboard._id);
    } else {
      console.log('✅ Dashboard found successfully');
      console.log('   📊 Dashboard ID:', dashboard._id);
      console.log('   📈 Stats:', JSON.stringify(dashboard.stats, null, 2));
      console.log('   📝 Recent Cases Count:', dashboard.recentCases.length);
      console.log('   📅 Upcoming Hearings Count:', dashboard.upcomingHearings.length);
      console.log('   🔔 Notifications Count:', dashboard.notifications.length);
    }

    console.log('\n✅ Dashboard data fetched successfully');
    console.log('🔹 ═══════════════════════════════════════\n');

    res.status(200).json({
      success: true,
      data: dashboard
    });

  } catch (error) {
    console.error('\n❌ ═══════════════════════════════════════');
    console.error('💥 GET CLERK DASHBOARD ERROR');
    console.error('❌ ═══════════════════════════════════════');
    console.error('🔴 Error Name:', error.name);
    console.error('🔴 Error Message:', error.message);
    console.error('🔴 Error Stack:', error.stack);
    console.error('❌ ═══════════════════════════════════════\n');
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

// Get dashboard stats (FROM NewCaseModel)
export const getClerkDashboardStats = async (req, res) => {
  console.log('\n🔹 ═══════════════════════════════════════');
  console.log('📈 GET DASHBOARD STATS - START');
  console.log('🔹 ═══════════════════════════════════════');
  
  try {
    const { clerkId } = req.params;

    console.log('📋 Request Details:');
    console.log('   👤 Clerk ID:', clerkId);
    console.log('   🔍 Clerk ID Type:', typeof clerkId);
    console.log('   📏 Clerk ID Length:', clerkId.length);
    console.log('   ⏰ Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    console.log('   📦 Source Model: NewCaseModel');

    console.log('\n🔍 Querying NewCaseModel for stats...');

    // ✅ Query NewCaseModel instead of ClerkCaseDetails
    console.log('\n📊 Counting total cases from NewCaseModel...');
    const totalCases = await NewCaseModel.countDocuments({});
    console.log('   ✅ Total Cases:', totalCases);

    console.log('\n📊 Counting active cases...');
    const activeCases = await NewCaseModel.countDocuments({ 
      status: 'Active'
    });
    console.log('   ✅ Active Cases:', activeCases);

    console.log('\n📊 Counting pending cases...');
    const pendingCases = await NewCaseModel.countDocuments({ 
      status: 'Pending' 
    });
    console.log('   ✅ Pending Cases:', pendingCases);

    console.log('\n📊 Counting closed cases...');
    const closedCases = await NewCaseModel.countDocuments({ 
      status: 'Closed' 
    });
    console.log('   ✅ Closed Cases:', closedCases);

    const stats = {
      totalCases,
      activeCases,
      pendingCases,
      closedCases
    };

    console.log('\n✅ Stats Fetched Successfully from NewCaseModel:');
    console.log('   📊 Summary:', JSON.stringify(stats, null, 2));
    console.log('🔹 ═══════════════════════════════════════\n');

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('\n❌ ═══════════════════════════════════════');
    console.error('💥 GET STATS ERROR');
    console.error('❌ ═══════════════════════════════════════');
    console.error('🔴 Error Name:', error.name);
    console.error('🔴 Error Message:', error.message);
    console.error('🔴 Error Stack:', error.stack);
    console.error('🔴 Clerk ID:', req.params.clerkId);
    console.error('❌ ═══════════════════════════════════════\n');
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
};

// Get recent cases (FROM NewCaseModel)
export const getRecentCases = async (req, res) => {
  console.log('\n🔹 ═══════════════════════════════════════');
  console.log('📝 GET RECENT CASES - START');
  console.log('🔹 ═══════════════════════════════════════');
  
  try {
    const { clerkId } = req.params;
    const { limit = 5 } = req.query;

    console.log('📋 Request Details:');
    console.log('   👤 Clerk ID:', clerkId);
    console.log('   📊 Limit:', limit);
    console.log('   ⏰ Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    console.log('   📦 Source Model: NewCaseModel');

    console.log('\n🔍 Querying recent cases from NewCaseModel...');
    console.log('   🔎 Query: All cases');
    console.log('   📈 Sort: { updatedAt: -1 }');
    console.log('   📏 Limit:', parseInt(limit));

    // ✅ Query NewCaseModel instead of ClerkCaseDetails
    const recentCases = await NewCaseModel.find({})
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .select('caseNumber caseTitle status priority updatedAt clientName');

    console.log('   ✅ Cases found:', recentCases.length);

    if (recentCases.length > 0) {
      console.log('\n📋 Recent Cases Details:');
      recentCases.forEach((caseItem, index) => {
        console.log(`   ${index + 1}. ${caseItem.caseNumber} - ${caseItem.caseTitle}`);
        console.log(`      Status: ${caseItem.status}, Priority: ${caseItem.priority}`);
        console.log(`      Client: ${caseItem.clientName || 'N/A'}`);
      });
    }

    const formattedCases = recentCases.map(caseItem => ({
      id: caseItem._id,
      number: caseItem.caseNumber || 'N/A',
      title: caseItem.caseTitle || 'Untitled Case',
      status: caseItem.status || 'Pending',
      priority: caseItem.priority || 'Medium',
      lastUpdate: getTimeAgo(caseItem.updatedAt)
    }));

    console.log('\n✅ Recent cases formatted successfully from NewCaseModel');
    console.log('   📊 Count:', formattedCases.length);
    console.log('🔹 ═══════════════════════════════════════\n');

    res.status(200).json({
      success: true,
      count: formattedCases.length,
      data: formattedCases
    });

  } catch (error) {
    console.error('\n❌ ═══════════════════════════════════════');
    console.error('💥 GET RECENT CASES ERROR');
    console.error('❌ ═══════════════════════════════════════');
    console.error('🔴 Error Name:', error.name);
    console.error('🔴 Error Message:', error.message);
    console.error('🔴 Error Stack:', error.stack);
    console.error('🔴 Clerk ID:', req.params.clerkId);
    console.error('❌ ═══════════════════════════════════════\n');
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent cases',
      error: error.message
    });
  }
};

// Get upcoming hearings (FROM ClerkCaseDetails)
export const getUpcomingHearings = async (req, res) => {
  console.log('\n🔹 ═══════════════════════════════════════');
  console.log('📅 GET UPCOMING HEARINGS - START');
  console.log('🔹 ═══════════════════════════════════════');
  
  try {
    const { clerkId } = req.params;
    const { limit = 5 } = req.query;

    console.log('📋 Request Details:');
    console.log('   👤 Clerk ID:', clerkId);
    console.log('   📊 Limit:', limit);
    console.log('   ⏰ Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
    console.log('   📦 Source Model: ClerkCaseDetails');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('\n🔍 Querying upcoming hearings from ClerkCaseDetails...');
    console.log('   🔎 Query: { nextHearing: { $gte:', today.toLocaleDateString(), '} }');
    console.log('   📈 Sort: { nextHearing: 1 }');

    // ✅ ClerkCaseDetails is correct for hearings
    const cases = await ClerkCaseDetails.find({
      nextHearing: { $gte: today }
    })
      .sort({ nextHearing: 1 })
      .limit(parseInt(limit))
      .select('caseNumber caseTitle court judge nextHearing hearingTime');

    console.log('   ✅ Hearings found:', cases.length);

    if (cases.length > 0) {
      console.log('\n📅 Upcoming Hearings Details:');
      cases.forEach((caseItem, index) => {
        console.log(`   ${index + 1}. ${caseItem.caseNumber} - ${caseItem.caseTitle}`);
        console.log(`      Date: ${caseItem.nextHearing?.toLocaleDateString()}, Court: ${caseItem.court}`);
        console.log(`      Judge: ${caseItem.judge}, Time: ${caseItem.hearingTime}`);
      });
    }

    const formattedHearings = cases.map(caseItem => ({
      id: caseItem._id,
      caseNumber: caseItem.caseNumber || 'N/A',
      title: caseItem.caseTitle || 'Untitled Case',
      court: caseItem.court || 'Not Assigned',
      judge: caseItem.judge || 'TBD',
      date: formatDate(caseItem.nextHearing),
      time: caseItem.hearingTime || '10:00 AM'
    }));

    console.log('\n✅ Upcoming hearings formatted successfully from ClerkCaseDetails');
    console.log('   📊 Count:', formattedHearings.length);
    console.log('🔹 ═══════════════════════════════════════\n');

    res.status(200).json({
      success: true,
      count: formattedHearings.length,
      data: formattedHearings
    });

  } catch (error) {
    console.error('\n❌ ═══════════════════════════════════════');
    console.error('💥 GET UPCOMING HEARINGS ERROR');
    console.error('❌ ═══════════════════════════════════════');
    console.error('🔴 Error Name:', error.name);
    console.error('🔴 Error Message:', error.message);
    console.error('🔴 Error Stack:', error.stack);
    console.error('🔴 Clerk ID:', req.params.clerkId);
    console.error('❌ ═══════════════════════════════════════\n');
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming hearings',
      error: error.message
    });
  }
};

// Update dashboard
export const updateClerkDashboard = async (req, res) => {
  console.log('\n🔹 ═══════════════════════════════════════');
  console.log('🔄 UPDATE DASHBOARD - START');
  console.log('🔹 ═══════════════════════════════════════');
  
  try {
    const { clerkId } = req.params;
    const updates = req.body;

    console.log('📋 Request Details:');
    console.log('   👤 Clerk ID:', clerkId);
    console.log('   📝 Updates:', JSON.stringify(updates, null, 2));
    console.log('   ⏰ Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

    console.log('\n🔍 Updating dashboard...');

    const dashboard = await ClerkDashboard.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          ...updates,
          lastUpdated: new Date()
        }
      },
      { new: true, upsert: true }
    );

    console.log('✅ Dashboard updated successfully');
    console.log('   📊 Dashboard ID:', dashboard._id);
    console.log('🔹 ═══════════════════════════════════════\n');

    res.status(200).json({
      success: true,
      message: 'Dashboard updated successfully',
      data: dashboard
    });

  } catch (error) {
    console.error('\n❌ ═══════════════════════════════════════');
    console.error('💥 UPDATE DASHBOARD ERROR');
    console.error('❌ ═══════════════════════════════════════');
    console.error('🔴 Error Name:', error.name);
    console.error('🔴 Error Message:', error.message);
    console.error('🔴 Error Stack:', error.stack);
    console.error('❌ ═══════════════════════════════════════\n');
    
    res.status(500).json({
      success: false,
      message: 'Failed to update dashboard',
      error: error.message
    });
  }
};

// Add notification
export const addNotification = async (req, res) => {
  console.log('\n🔹 ═══════════════════════════════════════');
  console.log('🔔 ADD NOTIFICATION - START');
  console.log('🔹 ═══════════════════════════════════════');
  
  try {
    const { clerkId } = req.params;
    const { title, message, type } = req.body;

    console.log('📋 Request Details:');
    console.log('   👤 Clerk ID:', clerkId);
    console.log('   📌 Title:', title);
    console.log('   📝 Message:', message);
    console.log('   🏷️ Type:', type || 'info');
    console.log('   ⏰ Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

    console.log('\n🔍 Adding notification...');

    const dashboard = await ClerkDashboard.findOneAndUpdate(
      { clerkId },
      {
        $push: {
          notifications: {
            title,
            message,
            type: type || 'info',
            read: false,
            createdAt: new Date()
          }
        }
      },
      { new: true, upsert: true }
    );

    console.log('✅ Notification added successfully');
    console.log('   📊 Total Notifications:', dashboard.notifications.length);
    console.log('🔹 ═══════════════════════════════════════\n');

    res.status(200).json({
      success: true,
      message: 'Notification added successfully',
      data: dashboard.notifications[dashboard.notifications.length - 1]
    });

  } catch (error) {
    console.error('\n❌ ═══════════════════════════════════════');
    console.error('💥 ADD NOTIFICATION ERROR');
    console.error('❌ ═══════════════════════════════════════');
    console.error('🔴 Error Name:', error.name);
    console.error('🔴 Error Message:', error.message);
    console.error('🔴 Error Stack:', error.stack);
    console.error('❌ ═══════════════════════════════════════\n');
    
    res.status(500).json({
      success: false,
      message: 'Failed to add notification',
      error: error.message
    });
  }
};

// Mark notification as read
export const markNotificationRead = async (req, res) => {
  console.log('\n🔹 ═══════════════════════════════════════');
  console.log('✅ MARK NOTIFICATION READ - START');
  console.log('🔹 ═══════════════════════════════════════');
  
  try {
    const { clerkId, notificationId } = req.params;

    console.log('📋 Request Details:');
    console.log('   👤 Clerk ID:', clerkId);
    console.log('   🔔 Notification ID:', notificationId);
    console.log('   ⏰ Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

    console.log('\n🔍 Marking notification as read...');

    const dashboard = await ClerkDashboard.findOneAndUpdate(
      { clerkId, 'notifications._id': notificationId },
      {
        $set: { 'notifications.$.read': true }
      },
      { new: true }
    );

    if (!dashboard) {
      console.log('⚠️ Notification not found');
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    console.log('✅ Notification marked as read successfully');
    console.log('🔹 ═══════════════════════════════════════\n');

    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('\n❌ ═══════════════════════════════════════');
    console.error('💥 MARK NOTIFICATION READ ERROR');
    console.error('❌ ═══════════════════════════════════════');
    console.error('🔴 Error Name:', error.name);
    console.error('🔴 Error Message:', error.message);
    console.error('🔴 Error Stack:', error.stack);
    console.error('❌ ═══════════════════════════════════════\n');
    
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

// Get notifications
export const getNotifications = async (req, res) => {
  console.log('\n🔹 ═══════════════════════════════════════');
  console.log('📬 GET NOTIFICATIONS - START');
  console.log('🔹 ═══════════════════════════════════════');
  
  try {
    const { clerkId } = req.params;
    const { unreadOnly } = req.query;

    console.log('📋 Request Details:');
    console.log('   👤 Clerk ID:', clerkId);
    console.log('   🔍 Unread Only:', unreadOnly || 'false');
    console.log('   ⏰ Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

    console.log('\n🔍 Fetching notifications...');

    const dashboard = await ClerkDashboard.findOne({ clerkId });

    if (!dashboard) {
      console.log('⚠️ Dashboard not found');
      return res.status(404).json({
        success: false,
        message: 'Dashboard not found'
      });
    }

    let notifications = dashboard.notifications;

    if (unreadOnly === 'true') {
      console.log('   🔍 Filtering unread notifications only...');
      notifications = notifications.filter(n => !n.read);
    }

    // Sort by date descending
    notifications.sort((a, b) => b.createdAt - a.createdAt);

    console.log('✅ Notifications fetched successfully');
    console.log('   📊 Total Count:', notifications.length);
    console.log('   📬 Unread Count:', notifications.filter(n => !n.read).length);
    console.log('🔹 ═══════════════════════════════════════\n');

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });

  } catch (error) {
    console.error('\n❌ ═══════════════════════════════════════');
    console.error('💥 GET NOTIFICATIONS ERROR');
    console.error('❌ ═══════════════════════════════════════');
    console.error('🔴 Error Name:', error.name);
    console.error('🔴 Error Message:', error.message);
    console.error('🔴 Error Stack:', error.stack);
    console.error('❌ ═══════════════════════════════════════\n');
    
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
};

// Refresh dashboard (recalculate everything)
export const refreshDashboard = async (req, res) => {
  console.log('\n🔹 ═══════════════════════════════════════');
  console.log('🔄 REFRESH DASHBOARD - START');
  console.log('🔹 ═══════════════════════════════════════');
  
  try {
    const { clerkId } = req.params;

    console.log('📋 Request Details:');
    console.log('   👤 Clerk ID:', clerkId);
    console.log('   ⏰ Time:', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

    console.log('\n🔍 Step 1: Recalculating stats from NewCaseModel...');

    // ✅ Recalculate stats from NewCaseModel
    const totalCases = await NewCaseModel.countDocuments({});
    console.log('   ✅ Total Cases:', totalCases);

    const activeCases = await NewCaseModel.countDocuments({ 
      status: 'Active' 
    });
    console.log('   ✅ Active Cases:', activeCases);

    const pendingCases = await NewCaseModel.countDocuments({ 
      status: 'Pending' 
    });
    console.log('   ✅ Pending Cases:', pendingCases);

    const closedCases = await NewCaseModel.countDocuments({ 
      status: 'Closed' 
    });
    console.log('   ✅ Closed Cases:', closedCases);

    console.log('\n🔍 Step 2: Fetching recent cases from NewCaseModel...');
    const recentCases = await NewCaseModel.find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .select('caseNumber caseTitle status priority updatedAt');
    console.log('   ✅ Recent Cases Found:', recentCases.length);

    console.log('\n🔍 Step 3: Fetching upcoming hearings from ClerkCaseDetails...');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingCases = await ClerkCaseDetails.find({
      nextHearing: { $gte: today }
    })
      .sort({ nextHearing: 1 })
      .limit(5)
      .select('caseNumber caseTitle court judge nextHearing hearingTime');
    console.log('   ✅ Upcoming Hearings Found:', upcomingCases.length);

    console.log('\n🔍 Step 4: Updating dashboard...');
    const dashboard = await ClerkDashboard.findOneAndUpdate(
      { clerkId },
      {
        $set: {
          stats: {
            totalCases,
            activeCases,
            pendingCases,
            closedCases,
            upcomingHearings: upcomingCases.length
          },
          recentCases: recentCases.map(c => ({
            caseId: c._id,
            caseNumber: c.caseNumber,
            title: c.caseTitle,
            status: c.status,
            priority: c.priority,
            lastUpdate: c.updatedAt
          })),
          upcomingHearings: upcomingCases.map(c => ({
            caseId: c._id,
            caseNumber: c.caseNumber,
            title: c.caseTitle,
            court: c.court,
            judge: c.judge,
            date: c.nextHearing,
            time: c.hearingTime
          })),
          lastUpdated: new Date()
        }
      },
      { new: true, upsert: true }
    );

    console.log('\n✅ Dashboard refreshed successfully');
    console.log('   📊 Dashboard ID:', dashboard._id);
    console.log('   📈 Stats Updated:', JSON.stringify(dashboard.stats, null, 2));
    console.log('   📦 Data Sources:');
    console.log('      • Stats & Recent Cases: NewCaseModel');
    console.log('      • Upcoming Hearings: ClerkCaseDetails');
    console.log('🔹 ═══════════════════════════════════════\n');

    res.status(200).json({
      success: true,
      message: 'Dashboard refreshed successfully',
      data: dashboard
    });

  } catch (error) {
    console.error('\n❌ ═══════════════════════════════════════');
    console.error('💥 REFRESH DASHBOARD ERROR');
    console.error('❌ ═══════════════════════════════════════');
    console.error('🔴 Error Name:', error.name);
    console.error('🔴 Error Message:', error.message);
    console.error('🔴 Error Stack:', error.stack);
    console.error('🔴 Clerk ID:', req.params.clerkId);
    console.error('❌ ═══════════════════════════════════════\n');
    
    res.status(500).json({
      success: false,
      message: 'Failed to refresh dashboard',
      error: error.message
    });
  }
};

// Helper functions
function getTimeAgo(date) {
  if (!date) return 'N/A';
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  return date.toLocaleDateString();
}

function formatDate(date) {
  if (!date) return 'N/A';
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

console.log('✅ All Clerk Dashboard Controller Functions Loaded');
console.log('📦 Data Source Summary:');
console.log('   • NewCaseModel: Stats, Recent Cases');
console.log('   • ClerkCaseDetails: Upcoming Hearings Only\n');
