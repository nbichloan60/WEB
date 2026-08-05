import React, { useState, useEffect } from 'react';
import { Header, TabType } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { CvSection } from './components/CvSection';
import { PortfolioSection } from './components/PortfolioSection';
import { BlogSection } from './components/BlogSection';
import { ContactSection } from './components/ContactSection';
import { AiTutorPanel } from './components/AiTutorPanel';
import { InfoSection } from './components/InfoSection';
import { FloatingContact } from './components/FloatingContact';
import { MaterialsSection } from './components/MaterialsSection';
import { MindmapSection } from './components/MindmapSection';
import { VideoSection } from './components/VideoSection';
import { SubjectCards } from './components/QuizHub/SubjectCards';
import { QuizRunner } from './components/QuizHub/QuizRunner';
import { ScoreBoard } from './components/QuizHub/ScoreBoard';
import { ProgressDashboard } from './components/QuizHub/ProgressDashboard';
import { AiGeneratorModal } from './components/QuizHub/AiGeneratorModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ToastContainer } from './components/Toast';

import { AppData, Subject, Question, Session } from './types';
import { loadAppData, saveAppData, getStoredApiKey } from './utils/storage';
import { INITIAL_APP_DATA } from './data/initialData';
import { BookOpen, GraduationCap, BarChart3, Sparkles, Network, Video } from 'lucide-react';

export function App() {
  // Global Application State
  const [appData, setAppData] = useState<AppData>(() => loadAppData());
  const [activeTab, setActiveTab] = useState<TabType>('info');
  
  // Quiz Hub Inner Navigation
  const [quizSubTab, setQuizSubTab] = useState<'subjects' | 'runner' | 'scoreboard' | 'dashboard'>('subjects');
  
  // Active Quiz Execution State
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [quizMode, setQuizMode] = useState<'practice' | 'exam'>('practice');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [quizTimeSpent, setQuizTimeSpent] = useState<number>(0);

  // Modals & Floating UI
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [aiGenSubject, setAiGenSubject] = useState<Subject | null>(null);
  const [toast, setToast] = useState<{ title: string; message?: string; type?: 'success' | 'error' | 'warning' | 'info' } | null>(null);

  // Sync dark mode class with state
  useEffect(() => {
    if (appData.settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [appData.settings.theme]);

  const showToast = (title: string, message?: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToast({ title, message, type });
  };

  const handleToggleSound = () => {
    const updated = {
      ...appData,
      settings: { ...appData.settings, soundEnabled: !appData.settings.soundEnabled }
    };
    setAppData(updated);
    saveAppData(updated);
    showToast('Cài đặt âm thanh', updated.settings.soundEnabled ? 'Đã BẬT hiệu ứng âm thanh.' : 'Đã TẮT hiệu ứng âm thanh.', 'info');
  };

  const handleToggleTheme = () => {
    const nextTheme = appData.settings.theme === 'light' ? 'dark' : 'light';
    const updated = {
      ...appData,
      settings: { ...appData.settings, theme: nextTheme }
    };
    setAppData(updated);
    saveAppData(updated);
  };

  // Start a Quiz
  const handleStartQuiz = (subject: Subject, mode: 'practice' | 'exam') => {
    const subQuestions = appData.questions.filter((q) => q.subjectId === subject.id);
    
    if (subQuestions.length === 0) {
      showToast('Chưa có câu hỏi', `Môn "${subject.name}" hiện chưa có câu hỏi nào. Hãy bấm "Tạo câu hỏi bằng AI" để tự động sinh đề!`, 'warning');
      return;
    }

    setActiveSubject(subject);
    setActiveQuestions(subQuestions);
    setQuizMode(mode);
    setUserAnswers({});
    setQuizTimeSpent(0);
    setQuizSubTab('runner');
  };

  // Finish a Quiz
  const handleFinishQuiz = (answers: Record<string, number>, timeSpentSeconds: number) => {
    if (!activeSubject) return;

    setUserAnswers(answers);
    setQuizTimeSpent(timeSpentSeconds);

    // Calculate score
    let correct = 0;
    activeQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) correct++;
    });

    const scorePct = Math.round((correct / activeQuestions.length) * 100);

    // Save session
    const newSession: Session = {
      id: `sess-${Date.now()}`,
      subjectId: activeSubject.id,
      subjectName: activeSubject.name,
      score: scorePct,
      totalQuestions: activeQuestions.length,
      correctAnswers: correct,
      timeSpent: timeSpentSeconds,
      date: new Date().toISOString()
    };

    const newSessions = [newSession, ...appData.sessions];
    const totalAtt = appData.progress.totalAttempts + 1;
    const avgScore = Math.round(
      newSessions.reduce((acc, curr) => acc + curr.score, 0) / newSessions.length
    );

    const updatedAppData: AppData = {
      ...appData,
      sessions: newSessions,
      progress: {
        ...appData.progress,
        totalAttempts: totalAtt,
        averageScore: avgScore
      }
    };

    setAppData(updatedAppData);
    saveAppData(updatedAppData);

    setQuizSubTab('scoreboard');
    showToast('Đã hoàn thành bài test!', `Bạn đạt điểm số ${scorePct}% (${correct}/${activeQuestions.length} câu đúng).`, 'success');
  };

  // Handle AI Generated Questions append
  const handleQuestionsGenerated = (subjectId: string, newQuestions: Question[]) => {
    const updatedQuestions = [...appData.questions, ...newQuestions];
    
    // Update subject question count
    const updatedSubjects = appData.subjects.map((s) => {
      if (s.id === subjectId) {
        return { ...s, questionsCount: s.questionsCount + newQuestions.length };
      }
      return s;
    });

    const updatedAppData = {
      ...appData,
      questions: updatedQuestions,
      subjects: updatedSubjects
    };

    setAppData(updatedAppData);
    saveAppData(updatedAppData);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 selection:bg-blue-500 selection:text-white relative">
      
      {/* Background Layer */}
      <div className="fixed inset-0 z-[-1] mesh-bg opacity-70"></div>

      {/* Toast Notification Container */}
      <ToastContainer toasts={toast ? [{ id: '1', title: toast.title, message: toast.message, type: toast.type || 'info' }] : []} onClose={() => setToast(null)} />

      {/* Floating Contact Widget */}
      <FloatingContact />

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        appData={appData}
        onDataUpdate={(newData) => {
          setAppData(newData);
          saveAppData(newData);
        }}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasServerKey={false}
        onShowToast={showToast}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Tab 1: Hero & Overview */}
        {activeTab === 'portfolio' && (
          <HeroSection onTabChange={setActiveTab} />
        )}

        {/* Tab Info */}
        {activeTab === 'info' && (
          <InfoSection />
        )}

        {/* Tab Materials */}
        {activeTab === 'materials' && (
          <MaterialsSection />
        )}

        {/* Tab Mindmap */}
        {activeTab === 'mindmap' && (
          <MindmapSection />
        )}

        {/* Tab Video */}
        {activeTab === 'video' && (
          <VideoSection />
        )}

        {/* Tab 2: Online Interactive CV */}
        {activeTab === 'cv' && (
          <CvSection />
        )}

        {/* Tab 3: Featured Projects Portfolio */}
        {activeTab === 'projects' && (
          <PortfolioSection />
        )}

        {/* Tab 4: Interactive Quiz & Skill Hub */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            
            {/* Quiz Hub Inner Sub-Navigation */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuizSubTab('subjects')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    quizSubTab === 'subjects'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <BookOpen className="w-4 h-4" /> Danh Sách Môn Học
                </button>

                <button
                  onClick={() => setQuizSubTab('dashboard')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                    quizSubTab === 'dashboard'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" /> Tiến Độ & Lịch Sử
                </button>
              </div>

              {quizSubTab === 'runner' && (
                <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-xs font-bold animate-pulse">
                  Đang làm bài test: {activeSubject?.name}
                </span>
              )}
            </div>

            {/* Sub View 1: Subject Cards */}
            {quizSubTab === 'subjects' && (
              <SubjectCards
                subjects={appData.subjects}
                onSelectSubject={handleStartQuiz}
                onOpenAiGenerator={(sub) => setAiGenSubject(sub)}
              />
            )}

            {/* Sub View 2: Active Quiz Runner */}
            {quizSubTab === 'runner' && activeSubject && (
              <QuizRunner
                subject={activeSubject}
                questions={activeQuestions}
                mode={quizMode}
                soundEnabled={appData.settings.soundEnabled}
                onFinishQuiz={handleFinishQuiz}
                onCancelQuiz={() => setQuizSubTab('subjects')}
              />
            )}

            {/* Sub View 3: Quiz Score Board */}
            {quizSubTab === 'scoreboard' && activeSubject && (
              <ScoreBoard
                subject={activeSubject}
                questions={activeQuestions}
                userAnswers={userAnswers}
                timeSpentSeconds={quizTimeSpent}
                soundEnabled={appData.settings.soundEnabled}
                onRetryQuiz={() => handleStartQuiz(activeSubject, quizMode)}
                onBackToSubjects={() => setQuizSubTab('subjects')}
              />
            )}

            {/* Sub View 4: Learning Progress Dashboard */}
            {quizSubTab === 'dashboard' && (
              <ProgressDashboard appData={appData} />
            )}

          </div>
        )}

        {/* Tab 5: AI Tutor Panel */}
        {activeTab === 'tutor' && (
          <AiTutorPanel />
        )}

        {/* Tab 6: Tech Blog */}
        {activeTab === 'blog' && (
          <BlogSection />
        )}

        {/* Tab 7: Contact Form */}
        {activeTab === 'contact' && (
          <ContactSection onShowToast={showToast} />
        )}

      </main>

      {/* Global AI Question Generator Modal */}
      <AiGeneratorModal
        isOpen={!!aiGenSubject}
        subject={aiGenSubject}
        onClose={() => setAiGenSubject(null)}
        onQuestionsGenerated={handleQuestionsGenerated}
        onShowToast={showToast}
      />

      {/* Global API Key Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onShowToast={showToast}
      />

    </div>
  );
}

export default App;
