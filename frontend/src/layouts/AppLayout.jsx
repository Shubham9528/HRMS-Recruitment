import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Jobs', path: '/jobs' },
  { label: 'Candidates', path: '/candidates' },
  { label: 'Pipeline', path: '/pipeline' },
];

export default function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Basic logout logic until Redux is wired up
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-surface-elevated border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center h-16 px-6 border-b border-border">
          <Link to="/" className="text-xl font-display font-bold text-primary">
            HRMS Pro
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center px-4 py-2.5 rounded-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-text-secondary hover:bg-gray-50 hover:text-text-primary'
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between h-16 px-4 bg-surface-elevated border-b border-border md:px-6">
          <button 
            className="md:hidden p-2 text-text-secondary hover:text-text-primary rounded-sm focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-text-secondary hover:text-danger transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-surface">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
