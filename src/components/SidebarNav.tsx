import type { FC } from 'react';
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
  FolderOpen,
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

interface NavItem {
  id: ViewState;
  step: string;
  label: string;
  shortLabel: string;
  icon: FC<{ className?: string }>;
}

interface Props {
  activeView: ViewState;
  onViewChange: (view: ViewState) => void;
  onOpenProjects: () => void;
  isCollapsed?: boolean;
}

const navItems: NavItem[] = [
  { id: 'upload', step: '๐', label: 'อัปโหลด & สแกน', shortLabel: 'อัปโหลด', icon: UploadCloud },
  { id: 'contract-info', step: '๑', label: 'ข้อมูลสัญญา', shortLabel: 'สัญญา', icon: FileText },
  { id: 'weekly-log', step: '๒', label: 'บันทึกสัปดาห์', shortLabel: 'สัปดาห์', icon: Calendar },
  { id: 'daily-log', step: '๓', label: 'บันทึกรายวัน', shortLabel: 'รายวัน', icon: ClipboardCheck },
  { id: 'monthly-memo', step: '๔', label: 'รายงานรายเดือน', shortLabel: 'รายเดือน', icon: FileText },
  { id: 'project-details', step: '๕', label: 'ข้อมูลโครงการ', shortLabel: 'โครงการ', icon: FileSpreadsheet },
  { id: 'monthly-log', step: '๖', label: 'สรุปสะสมรายเดือน', shortLabel: 'สะสม', icon: CalendarDays },
  { id: 'milestones-materials', step: '๗', label: 'งวดงาน/วัสดุ', shortLabel: 'งวดงาน', icon: Layers },
  { id: 'executive-summary', step: '๘', label: 'สรุปโครงการ', shortLabel: 'สรุป', icon: TrendingUp },
  { id: 'export', step: '๙', label: 'ดาวน์โหลด / พิมพ์', shortLabel: 'พิมพ์', icon: Printer },
];

const getProgress = (activeView: ViewState) => {
  const activeIndex = Math.max(0, navItems.findIndex((item) => item.id === activeView));
  return {
    activeIndex,
    percent: Math.round((activeIndex / (navItems.length - 1)) * 100),
  };
};

export const SidebarNav: FC<Props> = ({ activeView, onViewChange, onOpenProjects, isCollapsed = false }) => {
  const { activeIndex, percent } = getProgress(activeView);

  const renderProjectButton = (mobile = false) => (
    <button
      type="button"
      onClick={onOpenProjects}
      className={`nav-project-button group flex shrink-0 items-center gap-2 rounded-2xl transition-all cursor-pointer ${
        mobile ? 'min-w-[76px] flex-col justify-center gap-1 px-3 py-2' : 'px-4 py-2.5'
      }`}
      aria-label="เปิดศูนย์จัดการโครงการ"
      title="จัดการโครงการ"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/15 text-orange-300 transition-transform group-hover:scale-105">
        <FolderOpen className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className={mobile ? 'text-[10px] font-bold leading-none' : 'text-xs font-bold'}>
        โครงการ
      </span>
    </button>
  );

  const renderNavItem = (item: NavItem, mobile = false) => {
    const Icon = item.icon;
    const isActive = activeView === item.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onViewChange(item.id)}
        className={`nav-document-item group relative flex shrink-0 items-center rounded-2xl transition-all cursor-pointer ${
          mobile
            ? 'min-w-[76px] flex-col justify-center gap-1 px-3 py-2'
            : 'gap-2 px-3 py-2.5'
        } ${isActive ? 'nav-document-item--active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
        aria-label={`${item.step} ${item.label}`}
        title={item.label}
      >
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${isActive ? 'bg-orange-500 text-white shadow-[0_4px_14px_rgba(249,115,22,0.35)]' : 'bg-[#292d32] text-gray-400 group-hover:text-orange-300'}`}>
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className={`${mobile ? 'text-[10px]' : 'text-xs'} max-w-[104px] truncate font-semibold leading-none ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-100'}`}>
          {mobile ? item.shortLabel : item.label}
        </span>
        {!mobile && (
          <span className={`rounded-lg px-1.5 py-0.5 text-[10px] font-bold ${isActive ? 'bg-orange-500/20 text-orange-200' : 'bg-white/[0.04] text-gray-500'}`}>
            {item.step}
          </span>
        )}
      </button>
    );
  };

  return (
    <>
      <nav className={`desktop-document-nav hidden md:block print:hidden ${isCollapsed ? 'desktop-document-nav--collapsed' : ''}`} aria-label="เมนูเอกสาร">
        <div className="desktop-document-nav__inner">
          <div className="desktop-document-nav__meta">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-500">เมนูเอกสาร</span>
              <span className="ml-2 text-[11px] font-semibold text-orange-300">หน้า {activeIndex + 1} / {navItems.length}</span>
            </div>
            <div className="desktop-document-nav__progress" aria-label={`ความคืบหน้า ${percent}%`}>
              <span style={{ width: `${percent}%` }} />
            </div>
          </div>
          <div className="desktop-document-nav__scroller">
            {renderProjectButton()}
            <span className="desktop-document-nav__divider" aria-hidden="true" />
            {navItems.map((item) => renderNavItem(item))}
          </div>
        </div>
      </nav>

      <nav className="bottom-navigation md:hidden print:hidden" aria-label="เมนูเอกสารบนมือถือ">
        <div className="bottom-navigation__scroller">
          {renderProjectButton(true)}
          {navItems.map((item) => renderNavItem(item, true))}
        </div>
        <div className="bottom-navigation__progress" aria-hidden="true">
          <span style={{ width: `${percent}%` }} />
        </div>
      </nav>
    </>
  );
};
