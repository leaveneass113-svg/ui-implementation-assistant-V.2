import React from 'react';
import {
  RefreshCw,
  Menu,
  Save,
  Check,
} from 'lucide-react';

// Re-export ViewState from SidebarNav (single source of truth)
export type { ViewState } from './SidebarNav';

interface Props {
  isPlaceholderMode: boolean;
  onTogglePreset: () => void;
  onOpenDrawer: () => void;
  onOpenSidebar: () => void;
  activeProjectName?: string;
  onSaveProject?: () => void;
  isSaveSuccess?: boolean;
  lastSavedTime?: string;
}

export const TopBar: React.FC<Props> = ({
  isPlaceholderMode,
  onTogglePreset,
  onOpenDrawer,
  onOpenSidebar,
  activeProjectName,
  onSaveProject,
  isSaveSuccess,
  lastSavedTime,
}) => {
  return (
    <header className="bg-[#161616]/95 border-b border-white/5 text-gray-100 sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)] print:hidden backdrop-blur-xl transition-all">
      <div className="px-3 sm:px-5 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-3 min-w-0">

          {/* Left: Hamburger(s), CS Logo & Project Name */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {/* Mobile sidebar toggle */}
            <button
              onClick={onOpenSidebar}
              className="md:hidden p-2 rounded-xl neu-button text-gray-200 hover:text-orange-400 border border-white/5 transition-all flex items-center justify-center group active:scale-95 shrink-0 cursor-pointer"
              title="เปิดเมนูเอกสาร"
              aria-label="เปิดเมนูเอกสาร"
            >
              <Menu className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Project drawer toggle */}
            <button
              onClick={onOpenDrawer}
              className="hidden md:flex p-2 sm:p-2.5 rounded-xl neu-button text-gray-200 hover:text-orange-400 border border-white/5 transition-all items-center justify-center group active:scale-95 shrink-0 cursor-pointer"
              title="เปิดเมนูจัดการโครงการ"
              aria-label="เปิดเมนูจัดการโครงการ"
            >
              <Menu className="w-4 h-4 sm:w-[18px] sm:h-[18px] group-hover:scale-110 transition-transform" />
            </button>

            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl neu-pressed border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-xs sm:text-sm shadow-inner shrink-0">
              CS
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-white leading-tight tracking-wide truncate">
                  ContractScan AI
                </span>
                <span className="hidden lg:inline-block text-[10px] bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30 font-medium shrink-0">
                  ระบบราชการ
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 truncate max-w-[140px] sm:max-w-xs md:max-w-md leading-tight">
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
                className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
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
              className="px-2.5 sm:px-3 py-1.5 sm:py-2 neu-button text-gray-200 rounded-xl text-xs font-medium border border-white/5 flex items-center gap-1.5 transition-all hover:text-orange-400 active:scale-95 cursor-pointer"
              title="สลับระหว่างข้อมูลตัวอย่างและแบบฟอร์มว่าง"
            >
              <RefreshCw className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden lg:inline">{isPlaceholderMode ? 'ตัวอย่างสัญญา' : 'ฟอร์มว่าง'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
