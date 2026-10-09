import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import NavigationTabs from './components/NavigationTabs';
import AuthModal from './components/AuthModal';
import ArchitectureModal from './components/ArchitectureModal';
import RecruiterAuditModal from './components/RecruiterAuditModal';

// 12 Full-Stack Views
import DashboardView from './views/DashboardView';
import ProfileView from './views/ProfileView';
import AcademicsView from './views/AcademicsView';
import CertificationsView from './views/CertificationsView';
import CodingProfilesView from './views/CodingProfilesView';
import ProjectsView from './views/ProjectsView';
import TargetRoleView from './views/TargetRoleView';
import SkillGapView from './views/SkillGapView';
import AssessmentsView from './views/AssessmentsView';
import InterviewView from './views/InterviewView';
import ReadinessView from './views/ReadinessView';
import PortfolioView from './views/PortfolioView';
import PublicPortfolioStandaloneView from './views/PublicPortfolioStandaloneView';

function MainApp() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [diagramModalOpen, setDiagramModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);

  // Handle direct standalone portfolio routing (/portfolio/:slug or /p/:slug)
  const pathname = window.location.pathname;
  if (pathname.startsWith('/portfolio/') || pathname.startsWith('/p/')) {
    const slug = pathname.replace(/^\/(portfolio|p)\//, '').split('/')[0];
    return <PublicPortfolioStandaloneView slug={slug} />;
  }

  const handleDataChanged = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col cyber-grid relative selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[350px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenDiagramModal={() => setDiagramModalOpen(true)}
        onOpenAuditModal={() => setAuditModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs (12 Full-Stack Views) */}
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic View Switcher */}
        <div className="transition-all duration-200">
          {activeTab === 'dashboard' && (
            <DashboardView 
              key={`dashboard-${refreshTrigger}`}
              onNavigate={(tab) => setActiveTab(tab)} 
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView 
              onProfileUpdated={handleDataChanged} 
            />
          )}

          {activeTab === 'academics' && (
            <AcademicsView 
              key={`academics-${refreshTrigger}`}
              onDataChanged={handleDataChanged} 
            />
          )}

          {activeTab === 'certifications' && (
            <CertificationsView 
              key={`certs-${refreshTrigger}`}
              onDataChanged={handleDataChanged} 
            />
          )}

          {activeTab === 'coding' && (
            <CodingProfilesView 
              key={`coding-${refreshTrigger}`}
              onDataChanged={handleDataChanged} 
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView 
              key={`projects-${refreshTrigger}`}
              onDataChanged={handleDataChanged} 
            />
          )}



          {activeTab === 'roles' && (
            <TargetRoleView 
              onRoleSelected={handleDataChanged}
              onNavigateToGap={() => setActiveTab('skill-gap')} 
            />
          )}

          {activeTab === 'skill-gap' && (
            <SkillGapView 
              key={`gap-${refreshTrigger}`}
              onNavigateToAssessments={() => setActiveTab('assessments')} 
            />
          )}

          {activeTab === 'assessments' && (
            <AssessmentsView 
              key={`assess-${refreshTrigger}`}
              onDataChanged={handleDataChanged} 
            />
          )}

          {activeTab === 'interview' && (
            <InterviewView 
              key={`interview-${refreshTrigger}`}
              onDataChanged={handleDataChanged} 
            />
          )}

          {activeTab === 'readiness' && (
            <ReadinessView 
              key={`readiness-${refreshTrigger}`}
              onNavigateToPortfolio={() => setActiveTab('portfolio')} 
            />
          )}

          {activeTab === 'portfolio' && (
            <PortfolioView 
              key={`portfolio-${refreshTrigger}`}
            />
          )}


        </div>

      </main>

      {/* System Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-4 px-6 text-center text-xs text-slate-500 font-mono flex flex-col md:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Portfolio Compiler — AI-Powered Employability Assessment System</span>
        </div>
        <div>
          50-MCQ Adaptive Engine • Acoustic AI Mock Interview • Multi-Modal Verification
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <ArchitectureModal
        isOpen={diagramModalOpen}
        onClose={() => setDiagramModalOpen(false)}
      />

      <RecruiterAuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        candidateData={profile}
        selectedRole={{ title: profile?.targetRole || 'UI/UX Designer' }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
