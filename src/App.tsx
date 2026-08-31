import React, { useState, useEffect } from 'react';
import { placeholderReportData, filledSampleReportData } from './data/presets';
import { ReportData, Project, WeekData } from './types';
import { TopBar, ViewState } from './components/TopBar';
import { SidebarNav } from './components/SidebarNav';
import { ProjectDrawer } from './components/ProjectDrawer';
import { DocumentPage1 } from './components/DocumentPage1';
import { DocumentPage2 } from './components/DocumentPage2';
import { DocumentPage3 } from './components/DocumentPage3';
import { DocumentPage4Monthly } from './components/DocumentPage4Monthly';
import { DocumentPage5Details } from './components/DocumentPage5Details';
import { DocumentPage6MonthlyLog } from './components/DocumentPage6MonthlyLog';
import { DocumentPage7MilestonesMaterials } from './components/DocumentPage7MilestonesMaterials';
import { DocumentPage8ExecutiveSummary } from './components/DocumentPage8ExecutiveSummary';
import { ExportView } from './components/ExportView';
import { UploadContractScanner } from './components/UploadContractScanner';
import {
  createDefaultWeek,
  generateWeeksFromContract,
  recalculateWeekProgress,
  parseThaiDate,
  formatThaiDateFull,
} from './utils/weekUtils';
import { Bug, Check, Save, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { normalizePersonnelFields } from './utils/personnel';

// Navigation order for prev/next buttons
const NAV_ORDER: { id: ViewState; label: string }[] = [
  { id: 'upload', label: 'อัปโหลด & สแกน' },
  { id: 'contract-info', label: 'ข้อมูลสัญญา' },
  { id: 'weekly-log', label: 'บันทึกสัปดาห์' },
  { id: 'daily-log', label: 'บันทึกรายวัน' },
  { id: 'monthly-memo', label: 'รายงานรายเดือน' },
  { id: 'project-details', label: 'ข้อมูลโครงการ' },
  { id: 'monthly-log', label: 'สรุปสะสมรายเดือน' },
  { id: 'milestones-materials', label: 'งวดงาน/วัสดุ' },
  { id: 'executive-summary', label: 'สรุปโครงการ' },
  { id: 'export', label: 'ดาวน์โหลด / พิมพ์' },
];

const STORAGE_KEY = 'contractscan_projects_v4_cleanslate';

function sanitizeProjectData(projectList: Project[]): Project[] {
  return projectList.map((p) => {
    if (!p.data) {
      return {
        ...p,
        data: { ...placeholderReportData },
      };
    }

    let weeks = p.data.weeks;
    // Migrate legacy data if weeks is missing or empty
    if (!Array.isArray(weeks) || weeks.length === 0) {
      weeks = placeholderReportData.weeks;
    }

    // Ensure all weeks have full 7 days arrays
    const sanitizedWeeks: WeekData[] = weeks.map((w, idx) => {
      const dailyNarrative = Array.isArray(w.dailyNarrative) && w.dailyNarrative.length === 7
        ? w.dailyNarrative
        : ['', '', '', '', '', '', ''];

      const dailyWeatherM = Array.isArray(w.dailyWeatherMorning) && w.dailyWeatherMorning.length === 7
        ? w.dailyWeatherMorning
        : ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'];

      const dailyWeatherA = Array.isArray(w.dailyWeatherAfternoon) && w.dailyWeatherAfternoon.length === 7
        ? w.dailyWeatherAfternoon
        : ['แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส', 'แจ่มใส'];

      return {
        ...w,
        weekNo: String(w.weekNo || idx + 1),
        dailyNarrative,
        dailyWeatherMorning: dailyWeatherM,
        dailyWeatherAfternoon: dailyWeatherA,
        laborRows: Array.isArray(w.laborRows) ? w.laborRows : [],
        workProgress: w.workProgress || {
          weight: 100,
          prevPercent: 0,
          thisWeek: 0,
          cumulative: 0,
          rowTotal: 0,
        },
      };
    });

    const normalizedData: ReportData = {
      ...p.data,
      ...normalizePersonnelFields(p.data),
    };
    const recalculated = recalculateWeekProgress(sanitizedWeeks);
    const activeIndex = Math.min(
      Math.max(0, p.data.activeWeekIndex ?? 0),
      recalculated.length - 1
    );

    return {
      ...p,
      data: {
        ...normalizedData,
        weeks: recalculated,
        activeWeekIndex: activeIndex,
      },
    };
  });
}

export default function App() {
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return sanitizeProjectData(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
    }
    // Default initial project: Clean Slate
    return sanitizeProjectData([
      {
        id: 'proj-1',
        name: 'ยังไม่ได้ระบุโครงการ',
        updatedAt: 'สร้างใหม่',
        data: placeholderReportData,
      },
    ]);
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => projects[0]?.id || 'proj-1');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [activeView, setActiveView] = useState<ViewState>('contract-info');

  // Save State Management
  const [lastSavedTime, setLastSavedTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });
  const [isSaveSuccess, setIsSaveSuccess] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);

  // Scroll listener for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const reportData = activeProject?.data || placeholderReportData;

  // Auto-sync projects to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(nowStr);
    } catch (e) {
      console.error('Failed to auto-save projects to localStorage', e);
    }
  }, [projects]);

  const handleManualSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTime(nowStr);
      setIsSaveSuccess(true);
      setToastMessage('บันทึกข้อมูลโครงการสำเร็จ! ข้อมูลถูกจัดเก็บในเครื่องของคุณเรียบร้อยแล้ว สามารถกลับมาใช้งานต่อได้ตลอดเวลา');
      setTimeout(() => {
        setIsSaveSuccess(false);
      }, 3000);
      setTimeout(() => {
        setToastMessage(null);
      }, 4500);
    } catch (e) {
      console.error('Failed manual save', e);
      alert('ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleResetForm = () => {
    handleUpdateReportData({ ...placeholderReportData });
  };

  useEffect(() => {
    (window as any).resetContractForm = handleResetForm;
    (window as any).saveContractProject = handleManualSave;
    (window as any).currentContractData = reportData;
  }, [reportData, activeProjectId, projects]);

  const handleUpdateReportData = (newData: ReportData) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === activeProjectId) {
          const formattedDate = new Date().toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });
          return {
            ...p,
            name: newData.projectName || p.name || 'ยังไม่ได้ระบุโครงการ',
            updatedAt: formattedDate,
            data: newData,
          };
        }
        return p;
      })
    );
  };

  const togglePreset = () => {
    const isCurrentlyFilled = Boolean(reportData.projectName || reportData.contractNo);
    const updated = isCurrentlyFilled ? placeholderReportData : filledSampleReportData;
    handleUpdateReportData(updated);
  };

  const handleSelectProject = (id: string) => {
    setActiveProjectId(id);
  };

  const handleAddProject = () => {
    const newId = `proj-${Date.now()}`;
    const newCount = projects.length + 1;
    const newProjectData: ReportData = {
      ...placeholderReportData,
      projectName: `โครงการใหม่ที่ ${newCount}`,
      docNo: `${String(newCount).padStart(2, '0')}/2569`,
    };

    const newProject: Project = {
      id: newId,
      name: newProjectData.projectName,
      updatedAt: new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      data: newProjectData,
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newId);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length === 0) {
        const fresh: Project = {
          id: `proj-${Date.now()}`,
          name: 'ยังไม่ได้ระบุโครงการ',
          updatedAt: new Date().toLocaleDateString('th-TH', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          data: placeholderReportData,
        };
        setActiveProjectId(fresh.id);
        return [fresh];
      }
      if (activeProjectId === id) {
        setActiveProjectId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleLoadRealContract = () => {
    handleUpdateReportData(filledSampleReportData);
  };

  // 4.7: Export all projects as JSON file for backup
  const handleExportJson = () => {
    try {
      const dataStr = JSON.stringify(projects, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contractscan-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setToastMessage('ส่งออกข้อมูลโครงการทั้งหมดสำเร็จ!');
      setTimeout(() => setToastMessage(null), 3000);
    } catch (e) {
      console.error('Failed to export JSON', e);
      setToastMessage('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  // 4.7: Import projects from JSON backup file
  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          throw new Error('Invalid project data format');
        }
        const sanitized = sanitizeProjectData(parsed);
        setProjects(sanitized);
        setActiveProjectId(sanitized[0].id);
        setToastMessage(`นำเข้าข้อมูลสำเร็จ! โหลด ${sanitized.length} โครงการ`);
        setTimeout(() => setToastMessage(null), 3000);
      } catch (err) {
        console.error('Failed to import JSON', err);
        setToastMessage('ไฟล์ JSON ไม่ถูกต้อง กรุณาตรวจสอบรูปแบบไฟล์');
        setTimeout(() => setToastMessage(null), 4000);
      }
    };
    reader.readAsText(file);
  };

  const handleContractExtracted = (extracted: Partial<ReportData>) => {
    const normalizedExtracted = normalizePersonnelFields(extracted);
    const merged: ReportData = {
      ...reportData,
      ...normalizedExtracted,
      isPlaceholderMode: false,
    };

    if (normalizedExtracted.startDate) {
      const startDateStr = normalizedExtracted.startDate;
      const totalDaysStr = normalizedExtracted.totalDays || reportData.totalDays || '60';
      const contractEndDateStr = normalizedExtracted.contractEndDate || reportData.contractEndDate;
      const generated = generateWeeksFromContract(
        startDateStr,
        totalDaysStr,
        [],
        contractEndDateStr
      );
      merged.weeks = generated;
      merged.activeWeekIndex = 0;
      merged.startDate = formatThaiDateFull(parseThaiDate(startDateStr), true);
      merged.reportDate = generated[0]?.reportDate || merged.reportDate;
    }

    handleUpdateReportData(merged);
    setActiveView('contract-info');
  };

  const handleAddWeek = () => {
    const currentWeeks = reportData.weeks || [];
    const nextWeekNum = currentWeeks.length + 1;
    let nextStart = new Date();

    if (currentWeeks.length > 0) {
      const lastWeek = currentWeeks[currentWeeks.length - 1];
      if (lastWeek.endDate) {
        const parsed = parseThaiDate(lastWeek.endDate);
        nextStart = new Date(parsed);
        nextStart.setDate(nextStart.getDate() + 1);
      }
    }

    const newWeek = createDefaultWeek(nextWeekNum, nextStart);
    const updatedWeeks = [...currentWeeks, newWeek];
    const recalculated = recalculateWeekProgress(updatedWeeks);

    handleUpdateReportData({
      ...reportData,
      weeks: recalculated,
      activeWeekIndex: updatedWeeks.length - 1,
    });
  };

  const handleDeleteWeek = (index: number) => {
    const currentWeeks = reportData.weeks || [];
    if (currentWeeks.length <= 1) return;

    const filtered = currentWeeks.filter((_, idx) => idx !== index);
    const renumbered = filtered.map((w, idx) => ({
      ...w,
      weekNo: String(idx + 1),
    }));

    const recalculated = recalculateWeekProgress(renumbered);
    const newActiveIndex = Math.min(index, recalculated.length - 1);

    handleUpdateReportData({
      ...reportData,
      weeks: recalculated,
      activeWeekIndex: newActiveIndex,
    });
  };

  const handleAutoGenerateWeeks = () => {
    if (!reportData.startDate) {
      alert('กรุณาระบุวันที่เริ่มต้นสัญญาก่อน');
      return;
    }

    const generated = generateWeeksFromContract(
      reportData.startDate,
      reportData.totalDays || '60',
      reportData.weeks || [],
      reportData.contractEndDate
    );

    const recalculated = recalculateWeekProgress(generated);
    handleUpdateReportData({
      ...reportData,
      weeks: recalculated,
      activeWeekIndex: 0,
    });
  };

  const handleSelectWeekIndex = (idx: number) => {
    handleUpdateReportData({
      ...reportData,
      activeWeekIndex: idx,
    });
  };

  return (
    <div className="min-h-screen text-gray-100 flex flex-col font-sarabun selection:bg-orange-500 selection:text-white relative">
      {/* Top Slim Header Bar */}
      <TopBar
        isPlaceholderMode={reportData.isPlaceholderMode}
        onTogglePreset={togglePreset}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onOpenSidebar={() => setIsSidebarMobileOpen(true)}
        activeProjectName={reportData.projectName}
        onSaveProject={handleManualSave}
        isSaveSuccess={isSaveSuccess}
        lastSavedTime={lastSavedTime}
      />

      {/* Slide-out Left Drawer for Project Management */}
      <ProjectDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={handleSelectProject}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        onLoadSampleContract={handleLoadRealContract}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />

      {/* Sidebar + Main Content Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar Navigation */}
        <SidebarNav
          activeView={activeView}
          onViewChange={setActiveView}
          isMobileOpen={isSidebarMobileOpen}
          onMobileClose={() => setIsSidebarMobileOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 overflow-y-auto">
          <div className="w-full max-w-[1440px] mx-auto space-y-5 sm:space-y-8">

            {/* Quick Nav Bar (Top) — prev / current page / next */}
            {(() => {
              const currentIdx = NAV_ORDER.findIndex(n => n.id === activeView);
              const prev = NAV_ORDER[(currentIdx - 1 + NAV_ORDER.length) % NAV_ORDER.length];
              const next = NAV_ORDER[(currentIdx + 1) % NAV_ORDER.length];
              const current = NAV_ORDER[currentIdx];
              return (
                <div className="neu-flat flex items-center justify-between gap-2 px-2 py-2 rounded-2xl print:hidden">
                  <button
                    onClick={() => setActiveView(prev.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-orange-400 hover:bg-white/[0.04] transition-all active:scale-95 cursor-pointer border border-white/5"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{prev.label}</span>
                    <span className="sm:hidden">ย้อนกลับ</span>
                  </button>

                  <span className="text-xs font-bold text-orange-400/80 truncate max-w-[200px]">
                    {current?.label}
                  </span>

                  <button
                    onClick={() => setActiveView(next.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-orange-400 hover:bg-white/[0.04] transition-all active:scale-95 cursor-pointer border border-white/5"
                  >
                    <span className="hidden sm:inline">{next.label}</span>
                    <span className="sm:hidden">ถัดไป</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })()}
            {/* Tab 1: Upload & Scan */}
            {activeView === 'upload' && (
              <UploadContractScanner onContractExtracted={handleContractExtracted} />
            )}

            {/* Tab 2: Contract Info (Page 1) */}
            {activeView === 'contract-info' && (
              <div className="space-y-3">
                <DocumentPage1
                  data={reportData}
                  onChange={handleUpdateReportData}
                  onNavigateToUpload={() => setActiveView('upload')}
                  onNavigateNext={() => setActiveView('weekly-log')}
                  onLoadSample={handleLoadRealContract}
                />
              </div>
            )}

            {/* Tab 3: Weekly Log (Page 2) */}
            {activeView === 'weekly-log' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400 max-w-[210mm] mx-auto print:hidden">
                  <span className="font-semibold text-orange-400/90 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    บันทึกประจำสัปดาห์ (Weekly Log — ตารางแถวเดียว)
                  </span>
                  <span className="text-gray-500">ขนาด A4 มาตรฐานราชการ</span>
                </div>
                <DocumentPage2
                  data={reportData}
                  onChange={handleUpdateReportData}
                  onAddWeek={handleAddWeek}
                  onDeleteWeek={handleDeleteWeek}
                  onAutoGenerateWeeks={handleAutoGenerateWeeks}
                  onNavigatePrev={() => setActiveView('contract-info')}
                  onNavigateNext={() => setActiveView('daily-log')}
                />
              </div>
            )}

            {/* Tab 4: Daily Log (Page 3) */}
            {activeView === 'daily-log' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400 max-w-[210mm] mx-auto print:hidden">
                  <span className="font-semibold text-orange-400/90 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    บันทึกรายวัน (Daily Log — ตาราง 7 วัน + ตารางแรงงาน loop)
                  </span>
                  <span className="text-gray-500">ขนาด A4 มาตรฐานราชการ</span>
                </div>
                <DocumentPage3
                  data={reportData}
                  onChange={handleUpdateReportData}
                  onAddWeek={handleAddWeek}
                  onDeleteWeek={handleDeleteWeek}
                  onAutoGenerateWeeks={handleAutoGenerateWeeks}
                  onNavigatePrev={() => setActiveView('weekly-log')}
                  onNavigateNext={() => setActiveView('monthly-memo')}
                />
              </div>
            )}

            {/* Tab 5: Monthly Memo (Page 4) */}
            {activeView === 'monthly-memo' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400 max-w-[210mm] mx-auto print:hidden">
                  <span className="font-semibold text-orange-400/90 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    บันทึกข้อความ (รายงานประจำเดือน)
                  </span>
                  <span className="text-gray-500">ขนาด A4 มาตรฐานราชการ</span>
                </div>
                <DocumentPage4Monthly
                  data={reportData}
                  onChange={handleUpdateReportData}
                  onNavigatePrev={() => setActiveView('daily-log')}
                  onNavigateNext={() => setActiveView('project-details')}
                />
              </div>
            )}

            {/* Tab 6: Project Details (Page 5) */}
            {activeView === 'project-details' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400 max-w-[210mm] mx-auto print:hidden">
                  <span className="font-semibold text-orange-400/90 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    ข้อมูลโครงการและสัญญาจ้างฉบับเต็ม
                  </span>
                  <span className="text-gray-500">ขนาด A4 มาตรฐานราชการ</span>
                </div>
                <DocumentPage5Details
                  data={reportData}
                  onChange={handleUpdateReportData}
                  onNavigatePrev={() => setActiveView('monthly-memo')}
                  onNavigateNext={() => setActiveView('monthly-log')}
                />
              </div>
            )}

            {/* Tab 7: Monthly Progress Log (Page 6) */}
            {activeView === 'monthly-log' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400 max-w-[210mm] mx-auto print:hidden">
                  <span className="font-semibold text-orange-400/90 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    ตารางผลการดำเนินงานสะสมรายเดือน
                  </span>
                  <span className="text-gray-500">ขนาด A4 มาตรฐานราชการ</span>
                </div>
                <DocumentPage6MonthlyLog
                  data={reportData}
                  onChange={handleUpdateReportData}
                  onNavigatePrev={() => setActiveView('project-details')}
                  onNavigateNext={() => setActiveView('milestones-materials')}
                />
              </div>
            )}

            {/* Tab 8: Milestones & Materials (Page 7) */}
            {activeView === 'milestones-materials' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400 max-w-[210mm] mx-auto print:hidden">
                  <span className="font-semibold text-orange-400/90 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    งวดงาน การตรวจรับ & ผลทดสอบวัสดุ
                  </span>
                  <span className="text-gray-500">ขนาด A4 มาตรฐานราชการ</span>
                </div>
                <DocumentPage7MilestonesMaterials
                  data={reportData}
                  onChange={handleUpdateReportData}
                  onNavigatePrev={() => setActiveView('monthly-log')}
                  onNavigateNext={() => setActiveView('executive-summary')}
                />
              </div>
            )}

            {/* Tab 9: Executive Dashboard & Obstacles (Page 8) */}
            {activeView === 'executive-summary' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400 max-w-[210mm] mx-auto print:hidden">
                  <span className="font-semibold text-orange-400/90 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    สรุปผลโครงการ
                  </span>
                  <span className="text-gray-500">ขนาด A4 มาตรฐานราชการ</span>
                </div>
                <DocumentPage8ExecutiveSummary
                  data={reportData}
                  onChange={handleUpdateReportData}
                  onNavigatePrev={() => setActiveView('milestones-materials')}
                  onNavigateToExport={() => setActiveView('export')}
                />
              </div>
            )}

            {/* Tab 10: Export View */}
            {activeView === 'export' && (
              <ExportView
                data={reportData}
                onSelectWeek={handleSelectWeekIndex}
              />
            )}
          </div>

          {/* Bottom system status / action prompt */}
          <div
            className="system-action rounded-2xl px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 print:hidden"
            role="status"
            tabIndex={0}
            aria-label="ตรวจสอบแก้ไข บัค และปรับปรุงระบบ"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-400/20 text-orange-300 flex items-center justify-center shrink-0">
              <Bug className="w-5 h-5" aria-hidden="true" />
            </div>
            <p className="text-sm sm:text-base font-bold text-white leading-tight">ตรวจสอบแก้ไข บัค และปรับปรุงระบบ</p>
          </div>
        </main>
      </div>

      {/* Floating Action Bar (Back to Top, Save) */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden flex items-center gap-2.5">
        {/* Floating Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="group p-3.5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] neu-flat bg-[#1c1d21]/95 text-gray-300 hover:text-orange-400 hover:scale-105 active:scale-95 border border-white/10 backdrop-blur-md transition-all cursor-pointer animate-fadeIn"
            title="เลื่อนกลับขึ้นบนสุด"
            aria-label="เลื่อนกลับขึ้นบนสุด"
          >
            <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        {/* Floating Manual Save Button */}
        <button
          onClick={handleManualSave}
          className={`group p-3.5 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all flex items-center gap-2 border hover:scale-105 active:scale-95 cursor-pointer ${
            isSaveSuccess
              ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_10px_25px_rgba(16,185,129,0.4)]'
              : 'neu-flat bg-[#1c1d21] text-gray-200 hover:text-orange-400 border-white/10'
          }`}
          title="บันทึกข้อมูลโครงการทั้งหมด"
        >
          {isSaveSuccess ? (
            <>
              <Check className="w-5 h-5 text-white animate-bounce" />
              <span className="text-xs font-bold text-white hidden sm:inline-block">บันทึกเรียบร้อย</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5 text-orange-400" />
              <span className="text-xs font-bold text-gray-200 hidden sm:inline-block">บันทึกข้อมูล</span>
            </>
          )}
        </button>
      </div>

      {/* Floating Save Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fadeIn">
          <div className="bg-[#1a1a1a]/95 text-white text-xs font-semibold px-4 py-3 rounded-2xl border border-emerald-500/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl flex items-center gap-2.5 max-w-md mx-auto">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="flex-1 text-slate-200">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
