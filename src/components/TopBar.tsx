import React from 'react';
import {
  FileText,
  Printer,
  RefreshCw,
  Menu,
  UploadCloud,
  Calendar,
  ClipboardCheck,
  Save,
  Check,
  FileSpreadsheet,
  CalendarDays,
  Layers,
  TrendingUp,
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

interface Props {
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
  isPlaceholderMode: boolean;
  onTogglePreset: () => void;
  onOpenDrawer: () => void;
  activeProjectName?: string;
  onSaveProject?: () => void;
  isSaveSuccess?: boolean;
  lastSavedTime?: string;
}

export const TopBar: React.FC<Props> = ({
  activeView,
  onViewChange,
  isPlaceholderMode,
  onTogglePreset,
  onOpenDrawer,
  activeProjectName,
  onSaveProject,
  isSaveSuccess,
  lastSavedTime,
}) => {
  const navItems: { id: ViewState; step: string; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'upload', step: '๐', label: 'อัปโหลด & สแกน', icon: UploadCloud },
    { id: 'contract-info', step: '๑', label: 'ข้อมูลสัญญา (หน้า ๑)', icon: FileText },
    { id: 'weekly-log', step: '๒', label: 'บันทึกสัปดาห์ (หน้า ๒)', icon: Calendar },
    { id: 'daily-log', step: '๓', label: 'บันทึกรายวัน (หน้า ๓)', icon: ClipboardCheck },
    { id: 'monthly-memo', step: '๔', label: 'รายงานรายเดือน (หน้า ๔)', icon: FileText },
    { id: 'project-details', step: '๕', label: 'ข้อมูลโครงการ (หน้า ๕)', icon: FileSpreadsheet },
    { id: 'monthly-log', step: '๖', label: 'สรุปสะสมรายเดือน (หน้า ๖)', icon: CalendarDays },
    { id: 'milestones-materials', step: '๗', label: 'งวดงาน/วัสดุ (หน้า ๗)', icon: Layers },
    { id: 'executive-summary', step: '๘', label: 'สรุปโครงการ (หน้า ๘)', icon: TrendingUp },
    { id: 'export', step: '๙', label: 'ดาวน์โหลด / พิมพ์', icon: Printer },
  ];

  return (
    <header className="bg-[#161616]/95 border-b border-white/5 text-gray-100 sticky top-0 z-50 shadow-[0_10px_30px_rgba(0,0,0,0.6)] print:hidden backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 space-y-2">
        
        {/* Row 1: Brand Logo, Project Name, Status & Quick Action Buttons */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          
          {/* Left: Hamburger, CS Logo & Project Name */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={onOpenDrawer}
              className="p-2 sm:p-2.5 rounded-2xl neu-button text-gray-200 hover:text-orange-400 border border-white/5 transition-all flex items-center justify-center group active:scale-95 shrink-0 cursor-pointer"
              title="เปิดเมนูจัดการโครงการ"
              aria-label="เปิดเมนูจัดการโครงการ"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            </button>

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl neu-pressed border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-xs sm:text-sm shadow-inner shrink-0">
              CS
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-white leading-tight tracking-wide truncate">
                  ContractScan AI
                </span>
                <span className="hidden md:inline-block text-[10px] bg-orange-500/15 text-orange-400 px-2 py-0.2 rounded-full border border-orange-500/30 font-medium shrink-0">
                  ระบบราชการ (เลขไทย)
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 truncate max-w-[160px] sm:max-w-xs md:max-w-md">
                {activeProjectName || 'ยังไม่ได้ระบุโครงการ'}
              </p>
            </div>
          </div>

          {/* Right: Quick Actions Group */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Auto-save status */}
            {lastSavedTime && (
              <div
                id="autosave_indicator"
                className="hidden xl:flex items-center gap-1.5 text-[11px] text-zinc-400 bg-[#141517] px-2.5 py-1.5 rounded-xl border border-white/5 select-none"
                title={`บันทึกอัตโนมัติล่าสุดเมื่อ ${lastSavedTime}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{lastSavedTime}</span>
              </div>
            )}

            {/* Manual Save Button */}
            {onSaveProject && (
              <button
                id="btn_save_project"
                onClick={onSaveProject}
                className={`px-3 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
                  isSaveSuccess
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'neu-button text-gray-200 hover:text-orange-400 border border-white/5'
                }`}
                title="บันทึกข้อมูลโครงการทั้งหมด"
              >
                {isSaveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                    <span className="text-xs text-emerald-300">บันทึกแล้ว</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-orange-400" />
                    <span className="hidden sm:inline">บันทึก</span>
                  </>
                )}
              </button>
            )}

            {/* Preset / Sample Toggle */}
            <button
              onClick={onTogglePreset}
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 neu-button text-gray-200 rounded-xl sm:rounded-2xl text-xs font-medium border border-white/5 flex items-center gap-1.5 transition-all hover:text-orange-400 active:scale-95 cursor-pointer"
              title="สลับระหว่างข้อมูลตัวอย่างและแบบฟอร์มว่าง"
            >
              <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden lg:inline">{isPlaceholderMode ? 'ตัวอย่างสัญญา' : 'ฟอร์มว่าง'}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Workflow Step Navigation Bar (Centered, Spacious & Clean) */}
        <nav className="flex items-center justify-start md:justify-center neu-pressed p-1 rounded-2xl border border-white/5 text-xs overflow-x-auto no-scrollbar scroll-smooth w-full gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`px-3 sm:px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'neu-orange-btn text-white font-bold shadow-md ring-1 ring-orange-400/40 scale-[1.02]'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-white/5'
                }`}
                title={`สลับไปที่ ${item.label}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
