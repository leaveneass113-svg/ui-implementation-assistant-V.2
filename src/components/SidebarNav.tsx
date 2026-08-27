import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  Calendar,
  ClipboardCheck,
  FileSpreadsheet,
  CalendarDays,
  Layers,
  TrendingUp,
  Printer,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

export type ViewState =
  | 'upload'
  | 'contract-info'
  | 'weekly-log'
  | 'daily-log'
  | 'monthly-memo'
  | 'project-details'
  | 'monthly-log'
  | 'milestones-materials'
  | 'executive-summary'
  | 'export';

interface NavSection {
  title: string;
  items: NavItem[];
}

interface NavItem {
  id: ViewState;
  step: string;
  label: string;
  shortLabel: string;
  icon: React.FC<{ className?: string }>;
}

interface Props {
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

const navSections: NavSection[] = [
  {
    title: 'เตรียมข้อมูล',
    items: [
      { id: 'upload', step: '๐', label: 'อัปโหลด & สแกน', shortLabel: 'อัปโหลด', icon: UploadCloud },
    ],
  },
  {
    title: 'เอกสารรายงาน',
    items: [
      { id: 'contract-info', step: '๑', label: 'ข้อมูลสัญญา', shortLabel: 'สัญญา', icon: FileText },
      { id: 'weekly-log', step: '๒', label: 'บันทึกสัปดาห์', shortLabel: 'สัปดาห์', icon: Calendar },
      { id: 'daily-log', step: '๓', label: 'บันทึกรายวัน', shortLabel: 'รายวัน', icon: ClipboardCheck },
      { id: 'monthly-memo', step: '๔', label: 'รายงานรายเดือน', shortLabel: 'รายเดือน', icon: FileText },
      { id: 'project-details', step: '๕', label: 'ข้อมูลโครงการ', shortLabel: 'โครงการ', icon: FileSpreadsheet },
      { id: 'monthly-log', step: '๖', label: 'สรุปสะสมรายเดือน', shortLabel: 'สะสม', icon: CalendarDays },
      { id: 'milestones-materials', step: '๗', label: 'งวดงาน/วัสดุ', shortLabel: 'งวดงาน', icon: Layers },
      { id: 'executive-summary', step: '๘', label: 'สรุปโครงการ', shortLabel: 'สรุป', icon: TrendingUp },
    ],
  },
  {
    title: 'ส่งออก',
    items: [
      { id: 'export', step: '๙', label: 'ดาวน์โหลด / พิมพ์', shortLabel: 'พิมพ์', icon: Printer },
    ],
  },
];

export const SidebarNav: React.FC<Props> = ({
  activeView,
  onViewChange,
  isMobileOpen,
  onMobileClose,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Auto-collapse on medium screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (view: ViewState) => {
    onViewChange(view);
    if (window.innerWidth < 768) {
      onMobileClose();
    }
  };

  const getActiveItemGlobalIndex = () => {
    let idx = 0;
    for (const section of navSections) {
      for (const item of section.items) {
        if (item.id === activeView) return idx;
        idx++;
      }
    }
    return 0;
  };

  const totalItems = navSections.reduce((sum, s) => sum + s.items.length, 0);
  const activeIdx = getActiveItemGlobalIndex();
  const progressPercent = Math.round(((activeIdx) / (totalItems - 1)) * 100);

  const sidebarContent = (
    <div className={`sidebar-nav-inner flex flex-col h-full ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Sidebar Header / Collapse Toggle */}
      <div className={`flex items-center px-4 py-4 border-b border-white/5 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">เมนูเอกสาร</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex p-1.5 rounded-xl text-gray-400 hover:text-orange-400 hover:bg-white/5 transition-all cursor-pointer"
          title={isCollapsed ? 'ขยาย sidebar' : 'ย่อ sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Progress Bar */}
      {!isCollapsed && (
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5">
            <span>ความคืบหน้า</span>
            <span className="text-orange-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto sidebar-scrollbar py-2 px-2 space-y-1">
        {navSections.map((section, sIdx) => (
          <div key={section.title} className={sIdx > 0 ? 'mt-3' : ''}>
            {/* Section Title */}
            {!isCollapsed ? (
              <div className="px-2 py-1.5 mb-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </span>
              </div>
            ) : (
              <div className="flex justify-center py-2">
                <div className="w-5 h-px bg-white/10 rounded-full" />
              </div>
            )}

            {/* Nav Items */}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`sidebar-nav-item group w-full flex items-center gap-3 rounded-xl transition-all duration-200 cursor-pointer relative
                    ${isCollapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
                    ${isActive
                      ? 'sidebar-nav-active text-white font-bold'
                      : 'text-gray-400 hover:text-gray-100 hover:bg-white/[0.04]'
                    }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                  )}

                  <div className={`sidebar-nav-icon flex items-center justify-center shrink-0 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'w-8 h-8 bg-orange-500/20 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]'
                      : 'w-8 h-8 text-gray-500 group-hover:text-gray-300'
                    }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {!isCollapsed && (
                    <>
                      <span className={`flex-1 text-left text-[13px] leading-tight truncate transition-colors
                        ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {item.label}
                      </span>
                      <span className={`text-[10px] font-bold rounded-md px-1.5 py-0.5 shrink-0 transition-all
                        ${isActive
                          ? 'bg-orange-500/20 text-orange-300'
                          : 'bg-white/[0.03] text-gray-600 group-hover:text-gray-400'
                        }`}>
                        {item.step}
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-t border-white/5">
          <div className="text-[10px] text-gray-600 text-center">
            หน้า {activeIdx + 1} / {totalItems}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop / Tablet Sidebar */}
      <aside
        className={`sidebar-desktop hidden md:flex flex-col bg-[#161616]/95 backdrop-blur-xl border-r border-white/5 shrink-0 print:hidden
          transition-all duration-300 ease-in-out overflow-hidden sticky top-[52px] z-30
          ${isCollapsed ? 'w-[64px]' : 'w-[260px]'}`}
        style={{ height: 'calc(100vh - 52px)' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Overlay Backdrop */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 bottom-0 w-[280px] bg-[#161616]/98 backdrop-blur-xl border-r border-white/5 z-50 print:hidden
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Mobile Header with Close */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl neu-pressed border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-[10px]">
              CS
            </div>
            <span className="text-xs font-bold text-white">ContractScan AI</span>
          </div>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {sidebarContent}
      </aside>
    </>
  );
};
