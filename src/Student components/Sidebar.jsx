import React from 'react';
import { 
  Home, 
  FileText, 
  Book, 
  Calendar, 
  Search, 
  Briefcase,
  Scale 
} from 'lucide-react';

const Sidebar = ({ isOpen = true }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', active: true },
    { id: 'assignments', icon: FileText, label: 'My Assignments', section: 'STUDY & LEARN CENTER' },
    { id: 'documents', icon: Book, label: 'My Documents', section: 'STUDY & LEARN CENTER' },
    { id: 'calendar', icon: Calendar, label: 'Study Calendar', section: 'SCHEDULE' },
    { id: 'research', icon: Search, label: 'Research Center', section: 'TOOLS' },
    { id: 'career', icon: Briefcase, label: 'Career & Exam Prep', section: 'TOOLS' },
  ];

  let currentSection = '';

  return (
    <aside className={`${isOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-white border-r border-stone-200 overflow-hidden flex flex-col shadow-lg h-full`}>
      {/* Chakshi Branding */}
      <div className="p-6 border-b border-stone-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-md">
            <Scale className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Chakshi</h1>
            <p className="text-xs text-gray-500">Student Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const showSection = item.section && item.section !== currentSection;
          if (showSection) {
            currentSection = item.section;
          }

          return (
            <React.Fragment key={item.id}>
              {showSection && (
                <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {item.section}
                </div>
              )}
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  item.active
                    ? 'bg-amber-100 text-amber-700 font-semibold shadow-sm'
                    : 'text-gray-600 hover:bg-stone-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </nav>
    </aside>
  );
};

export default React.memo(Sidebar);
