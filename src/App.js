import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from "./components/Navbar";
import AdvocateNavbar from "./Advocate components/Navbar";
import AdvocateSidebar from "./Advocate components/Sidebar";
// import DocumentAnalysisWorkspace from "./Advocate pages/DocumentsComparison";

import StudentLayout from "./Student components/Layout";
import ClerkLayout from "./Clerk components/Layout";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Features from "./components/Features";
import FreeQueryWidget from "./components/FreeQueryWidget";
import FreeTools from "./components/FreeTools";
// import CourtroomSimulatorDemo from "./components/CourtroomSimulatorDemo";
import RoleGateway from "./components/RoleGateway";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import SearchResults from "./components/SearchResults";
import Dashboard from "./components/Dashboard";
import AnalyticsDashboard from "./Advocate pages/Analytics";
import Cases from "./Advocate pages/Cases";
import Clients from "./Advocate pages/Clients";
import ContractComparison from "./Advocate pages/ContractComparison";
import Documents from "./Advocate pages/Documents";
import AIHub from "./Advocate pages/AIHub";
import Integrations from "./Advocate pages/Integrations";
import Research from "./Advocate pages/Research";
import Settings from "./Advocate pages/Settings";
import Simulation from "./Advocate pages/Simulation";
import StudentDashboard from "./Student pages/Dashboard";
import Courses from "./Student pages/Courses";
import Assignments from "./Student pages/Assignments";
// import Library from "./Student pages/Library";
import Calendar from "./Student pages/Calendar";
// import Career from "./Student pages/Career-simple";
// import ExamPrep from "./Student pages/ExamPrep";
import StudentResearch from "./Student pages/Research";
import StudentNotifications from "./Student pages/Notifications";
import StudentAllFeatures from "./Student pages/AllFeatures";
import StudentProfile from "./Student pages/Profile";
import StudentSettings from "./Student pages/Settings";
import StudentHelp from "./Student pages/Help";
import Mydocuments from "./Student pages/MyDocuments_harsh";
import ClerkDashboard from "./Clerk components/Dashboard";
import CaseList from "./Clerk components/CaseList";
import CaseDetails from "./Clerk components/CaseDetails";
import SmsLog from "./Clerk components/SmsLog";
import QuickActions from "./Clerk components/QuickActions";
import OfflineModeToggle from "./Clerk components/OfflineModeToggle";
import ClerkIntegrations from "./Clerk components/Integrations";
import ClerkSettings from "./Clerk components/Settings";
import ClerkCalendar from "./Clerk components/Calendar";
import ClerkDocuments from "./Clerk components/Documents";
import ClerkReports from "./Clerk components/Reports";
import ClerkHelp from "./Clerk components/Help";
import AdminLayout from "./Admin components/Layout";
import AdminDashboard from "./Admin pages/Dashboard";
import AdminUsers from "./Admin pages/Users";
import AdminAnalytics from "./Admin pages/Analytics";
import AdminPayments from "./Admin pages/Payments";
import AdminContent from "./Admin pages/Content";
import AdminSettings from "./Admin pages/Settings";
import AdminReports from "./Admin pages/Reports";
import AdminCourses from "./Admin pages/Courses";
import AdminNotifications from "./Admin pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";
import DocumentAnalysis from "./Student pages/DocumentAnalysis";
import ClerkDocumentComparison from "./Clerk components/ClerkDocumentComparison";
// Loading component with professional SaaS styling
const SaaSLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
    {/* Animated background elements */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
    </div>
    
    <div className="text-center z-10">
      <div className="relative mb-8">
        <div className="w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-purple-500 to-blue-500 opacity-20 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 to-indigo-500 opacity-40 animate-spin" style={{animationDirection: 'reverse', animationDuration: '3s'}}></div>
          <div className="absolute inset-4 rounded-full border-4 border-transparent bg-gradient-to-r from-indigo-500 to-purple-500 animate-spin" style={{animationDuration: '2s'}}></div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
        Chakshi Pro
      </h2>
      <p className="text-slate-400 text-sm font-medium tracking-wide">
        Initializing Legal Intelligence Suite...
      </p>
      
      <div className="mt-8 flex justify-center space-x-1">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  </div>
);

// Home component with enhanced animations
const Home = () => {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-500/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <Hero />
        <div className="stagger-fade-in">
          <RoleGateway />
        </div>
        <div className="stagger-fade-in">
          <Features />
        </div>
        <div className="stagger-fade-in">
          <FreeTools />
        </div>
        <div className="stagger-fade-in">
          <FreeQueryWidget />
        </div>
        <div className="stagger-fade-in">
          <Stats />
        </div>
        <div className="stagger-fade-in">
          <Pricing />
        </div>
        <div className="stagger-fade-in">
          <Testimonials />
        </div>
      </div>
    </div>
  );
};

const AdvocateLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for smooth transition
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <SaaSLoader />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <AdvocateSidebar 
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdvocateNavbar 
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
          <div className="slide-in-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

function AppContent() {
  const { loading } = useAuth();
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    // App initialization with smooth loading
    const initTimer = setTimeout(() => {
      setAppInitialized(true);
    }, 1500);
    return () => clearTimeout(initTimer);
  }, []);

  if (loading || !appInitialized) {
    return <SaaSLoader />;
  }

  return (
    <div className="App relative">
      {/* Global background pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 -z-50"></div>
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              <Home />
            </div>
            <Footer />
          </div>
        } />
        
        {/* Search Results Route */}
        <Route path="/search" element={
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              <SearchResults />
            </div>
            <Footer />
          </div>
        } />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 zoom-in">
            <div className="flex-grow">
              <Login />
            </div>
            <Footer />
          </div>
        } />
        <Route path="/register" element={
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 zoom-in">
            <div className="flex-grow">
              <Register />
            </div>
            <Footer />
          </div>
        } />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 slide-in-up">
              <div className="flex-grow">
                <Dashboard />
              </div>
              <Footer />
            </div>
          </ProtectedRoute>
        } />
        
        {/* Advocate Routes */}
        <Route path="/advocate/*" element={
          <ProtectedRoute>
            <AdvocateLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AnalyticsDashboard />} />
          {/* explicit analytics path (also allow /advocate/analytics) */}
          <Route path="analytics" element={<AnalyticsDashboard />} />
          <Route path="cases" element={<Cases />} />
          <Route path="clients" element={<Clients />} />
          <Route path="contractcomparison" element={<ContractComparison />} />
          <Route path="aihub" element={<AIHub />} />
          <Route path="documents" element={<Documents />} />
            {/* <Route path="document-analysis" element={<DocumentAnalysisWorkspace />} /> */}
          <Route path="integrations" element={<Integrations />} />
          {/* <Route path="research" element={<Research />} /> */}
          <Route path="settings" element={<Settings />} />
          <Route path="simulation" element={<Simulation />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student/*" element={
          <ProtectedRoute>
            <div className="slide-in-left">
              <StudentLayout />
            </div>
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="document-analysis" element={<DocumentAnalysis />} />
          {/* <Route path="library" element={<Library />} /> */}
          <Route path="calendar" element={<Calendar />} />
          {/* <Route path="career" element={<Career />} /> */}
          {/* <Route path="examprep" element={<ExamPrep />} /> */}
          <Route path="research" element={<StudentResearch />} />
          <Route path="notifications" element={<StudentNotifications />} />
          <Route path="all-features" element={<StudentAllFeatures />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="settings" element={<StudentSettings />} />
          <Route path="help" element={<StudentHelp />} />
          <Route path="mydocuments" element={<Mydocuments />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* Clerk Routes */}
        <Route path="/clerk/*" element={
          <ProtectedRoute>
            <div className="slide-in-right">
              <ClerkLayout />
            </div>
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<ClerkDashboard />} />
          <Route path="cases" element={<CaseList />} />
          <Route path="case/:id" element={<CaseDetails />} />
          <Route path="calendar" element={<ClerkCalendar />} />
          <Route path="documents" element={<ClerkDocuments />} />
          <Route path="sms-log" element={<SmsLog />} />
          <Route path="quick-actions" element={<QuickActions />} />
          {/* FakeCaseChecker removed */}
          <Route path="reports" element={<ClerkReports />} />
          <Route path="integrations" element={<ClerkIntegrations />} />
          <Route path="settings" element={<ClerkSettings />} />
          <Route path="help" element={<ClerkHelp />} />
          <Route path="offline-mode" element={<OfflineModeToggle />} />
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="ClerkDocumentComparison" element={<ClerkDocumentComparison/>}/>
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute>
            <div className="fade-in">
              <AdminLayout />
            </div>
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="reports" element={<AdminReports />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>
        
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;