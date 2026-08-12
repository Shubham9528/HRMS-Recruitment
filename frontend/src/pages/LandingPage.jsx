import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Button from '../components/ui/Button';

export default function LandingPage() {
  const { token } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Navbar */}
      <header className="border-b border-border bg-surface-elevated/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-display font-bold text-text-primary tracking-tight">HRMS Pro</span>
          </div>
          <div>
            {token ? (
              <Link to="/jobs">
                <Button variant="primary">Go to Dashboard</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="primary">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-20 lg:py-32 bg-gradient-to-b from-surface to-surface-elevated overflow-hidden relative">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-primary/10 text-primary border-primary/20 mb-8 animate-fade-in-up">
          Introducing HRMS Pro 2.0
        </span>
        
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-text-primary tracking-tight max-w-4xl leading-tight mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Recruitment made <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">effortless.</span>
        </h1>
        
        <p className="mt-4 max-w-2xl text-base md:text-lg text-text-secondary mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Streamline your hiring process, manage job postings, and track candidates with our modern, blazing-fast platform. Built for the future of HR.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          {token ? (
             <Link to="/jobs">
               <Button size="lg" className="w-full sm:w-auto shadow-md shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                 Open Dashboard
                 <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
               </Button>
             </Link>
          ) : (
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto shadow-md shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                Get Started
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Button>
            </Link>
          )}
          <a href="#features">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Learn More
            </Button>
          </a>
        </div>

        {/* Mockup Illustration */}
        <div className="mt-24 w-full max-w-5xl rounded-xl border border-border shadow-2xl overflow-hidden relative animate-fade-in-up" style={{ animationDelay: '400ms' }}>
           <div className="absolute inset-0 bg-gradient-to-t from-surface-elevated via-transparent to-transparent z-10" />
           <div className="bg-surface-elevated w-full aspect-[16/9] flex items-center justify-center text-text-muted">
             <div className="w-full h-full p-6 flex flex-col gap-6 opacity-40">
                {/* Mock Topbar */}
                <div className="h-14 w-full bg-surface rounded-md border border-border" />
                <div className="flex gap-6 flex-1">
                  {/* Mock Sidebar */}
                  <div className="w-64 h-full bg-surface rounded-md border border-border hidden md:block" />
                  {/* Mock Content */}
                  <div className="flex-1 flex flex-col gap-6">
                     <div className="h-32 w-full bg-surface rounded-md border border-border" />
                     <div className="flex-1 w-full bg-surface rounded-md border border-border" />
                  </div>
                </div>
             </div>
           </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-32 bg-surface px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-text-primary">Everything you need to scale</h2>
            <p className="mt-4 text-base text-text-secondary max-w-2xl mx-auto">A complete toolkit designed to help you find, track, and hire the best talent without the spreadsheet chaos.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-surface-elevated rounded-xl border border-border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-display font-bold text-text-primary mb-2">Job Management</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Create, edit, and track job postings with ease. Keep your entire team aligned on exactly what roles are currently open.</p>
            </div>
            
            <div className="p-6 bg-surface-elevated rounded-xl border border-border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-lg font-display font-bold text-text-primary mb-2">Candidate Tracking</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Seamlessly move candidates through fully customizable pipeline stages. Never lose track of a great applicant again.</p>
            </div>
            
            <div className="p-6 bg-surface-elevated rounded-xl border border-border hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h3 className="text-lg font-display font-bold text-text-primary mb-2">Powerful Analytics</h3>
              <p className="text-sm text-text-secondary leading-relaxed">Make data-driven decisions with real-time insights into your hiring pipeline, time-to-hire, and recruiter efficiency.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border bg-surface-elevated py-12 text-center text-text-secondary">
        <p>© {new Date().getFullYear()} HRMS Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
