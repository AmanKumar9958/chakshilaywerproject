import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Scale, Users, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user has a role, redirect to appropriate dashboard
  useEffect(() => {
    if (user?.role) {
      switch (user.role) {
        case 'advocate':
          navigate('/advocate/dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        case 'clerk':
          navigate('/clerk/dashboard');
          break;
        default:
          // Stay on this page for role selection
          break;
      }
    }
  }, [user, navigate]);

  const handleRoleSelect = (role) => {
    // In a real app, you'd update the user's role in the database
    // For now, just navigate to the appropriate dashboard
    switch (role) {
      case 'advocate':
        navigate('/advocate/dashboard');
        break;
      case 'student':
        navigate('/student/dashboard');
        break;
      case 'clerk':
        navigate('/clerk/dashboard');
        break;
      default:
        break;
    }
  };

  const roles = [
    {
      id: 'advocate',
      title: 'Legal Advocate',
      description: 'Access contract analysis, research tools, and client management features.',
      icon: Scale,
      color: 'navy',
      features: ['Contract Analysis', 'Legal Research', 'Client Management', 'Document Generation']
    },
    {
      id: 'student',
      title: 'Law Student',
      description: 'Study materials, exam preparation, moot court practice, and career guidance.',
      icon: GraduationCap,
      color: 'gold',
      features: ['Study Materials', 'Exam Prep', 'Moot Court', 'Career Guidance']
    },
    {
      id: 'clerk',
      title: 'Legal Clerk',
      description: 'Case management, hearing schedules, document tracking, and administrative tools.',
      icon: Briefcase,
      color: 'emerald',
      features: ['Case Management', 'Hearing Calendar', 'Document Tracking', 'SMS Alerts']
    }
  ];

  return (
    <section className="pro-section bg-navy-50 relative overflow-hidden min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="blob-container">
          <div className="blob blob-1 bg-gradient-to-r from-navy-200/20 to-gold-200/20"></div>
          <div className="blob blob-2 bg-gradient-to-r from-gold-200/20 to-navy-200/20"></div>
        </div>
      </div>
      
      <div className="pro-container relative z-10 py-20">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="w-20 h-20 bg-gradient-to-br from-navy-600 to-navy-800 pro-rounded-2xl pro-flex-center mx-auto mb-8 shadow-xl ring-4 ring-gold-200/30">
            <Users className="w-10 h-10 text-gold-400" />
          </div>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-navy-800 to-navy-600 bg-clip-text text-transparent mb-6 leading-tight">
              Welcome to Chakshi
            </h1>
            <p className="text-xl text-navy-600 max-w-3xl mx-auto leading-relaxed font-medium">
              Choose your role to access specialized legal tools and features designed for your profession.
            </p>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-navy-800 mb-12 text-center">Select Your Role</h2>
          <div className="pro-grid lg:grid-cols-3 md:grid-cols-2 pro-gap-8">
            {roles.map((role) => {
              const IconComponent = role.icon;
              
              return (
                <button
                  key={role.id}
                  className="group relative overflow-hidden text-left transition-all duration-500 transform hover:scale-105 hover:shadow-xl hover:shadow-navy-200/30"
                  onClick={() => handleRoleSelect(role.id)}
                >
                  <div className="pro-glass-card p-8 h-full border-2 border-navy-200/30 bg-white/70 backdrop-blur-lg hover:border-gold-200/50 transition-all duration-500">
                    <div className="pro-flex flex-col items-center text-center">
                      <div className={`w-16 h-16 pro-rounded-2xl pro-flex-center transition-all duration-500 shadow-lg mb-6 ${
                        role.color === 'navy' ? 'bg-gradient-to-br from-navy-500 to-navy-700' :
                        role.color === 'gold' ? 'bg-gradient-to-br from-gold-400 to-gold-600' :
                        'bg-gradient-to-br from-emerald-400 to-emerald-600'
                      }`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-bold text-navy-800 mb-3 group-hover:text-navy-900 transition-colors duration-500">
                        {role.title}
                      </h3>
                      
                      <p className="text-navy-600 mb-6 leading-relaxed">
                        {role.description}
                      </p>
                      
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-navy-700 mb-3">Key Features:</h4>
                        <ul className="space-y-2">
                          {role.features.map((feature, index) => (
                            <li key={index} className="text-sm text-navy-600 flex items-center">
                              <div className="w-1.5 h-1.5 bg-gold-400 rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-auto flex items-center justify-center text-gold-600 font-semibold group-hover:text-gold-700 transition-colors duration-300">
                        Access Dashboard
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                    
                    {/* Gradient overlay for hover state */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gold-400/5 to-navy-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-16">
          <div className="pro-glass-card bg-gradient-to-br from-white/80 to-navy-50/80 backdrop-blur-xl border-2 border-navy-200/30 p-8 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-navy-800 mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-navy-600 leading-relaxed">
              Each role provides specialized tools and features tailored to your specific needs in the legal profession. 
              You can always switch between roles or access different areas based on your requirements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;