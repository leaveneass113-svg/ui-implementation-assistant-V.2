import React, { useState, useRef } from 'react';
import { Project } from '../types';
import { X, Plus, Trash2, Folder, Check, Search, Building2, Calendar, FileText, Download, Upload } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onAddProject: () => void;
  onDeleteProject: (id: string) => void;
  onLoadSampleContract?: () => void;
  onExportJson?: () => void;
  onImportJson?: (file: File) => void;
}

export const ProjectDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  projects,
  activeProjectId,
  onSelectProject,
  onAddProject,
  onDeleteProject,
  onLoadSampleContract,
  onExportJson,
  onImportJson,
}) => {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.data.projectName && p.data.projectName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.data.contractNo && p.data.contractNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteConfirm = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deletingId === id) {
      onDeleteProject(id);
      setDeletingId(null);
    } else {
      setDeletingId(id);
      setTimeout(() => setDeletingId(null), 3000); // Auto reset confirm state after 3s
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity print:hidden"
        onClick={onClose}
      />

      {/* Slide-out Left Drawer */}
      <aside
        className="fixed top-0 left-0 bottom-0 w-64 sm:w-72 max-w-[50vw] bg-[#181818] border-r border-white/10 z-50 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.7)] transform transition-transform duration-300 ease-out print:hidden"
        aria-label="การจัดการโครงการ"
      >
        {/* Header */}
        <div className="p-3 sm:p-3.5 border-b border-white/10 flex items-center justify-between bg-[#1f1f1f]/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl neu-pressed flex items-center justify-center text-orange-400 border border-orange-500/20 shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="font-bold text-sm text-white flex items-center gap-1.5 truncate">
                จัดการโครงการ
                <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.2 rounded-full font-semibold border border-orange-500/30">
                  {projects.length}
                </span>
              </h2>
              <p className="text-[10px] text-gray-400 truncate">เลือก หรือสร้างโครงการใหม่</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title="ปิดเมนู"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add Project Action & Search */}
        <div className="p-3 border-b border-white/5 space-y-2 bg-[#151515]">
          <button
            onClick={() => {
              onAddProject();
            }}
            className="w-full py-2.5 px-3 neu-orange-btn rounded-xl font-bold text-xs text-white flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>เพิ่มโครงการใหม่ (+)</span>
          </button>

          {onLoadSampleContract && (
            <button
              onClick={() => {
                onLoadSampleContract();
              }}
              className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 border border-orange-500/30 rounded-xl font-semibold text-[11px] text-orange-300 flex items-center justify-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-orange-400" />
              <span>โหลดสัญญา ๓๐/๒๕๖๙ (อบต.ใหม่พัฒนา)</span>
            </button>
          )}

          {/* Search Bar */}
          {projects.length > 3 && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหาโครงการ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full neu-pressed border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Scrollable Project List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scrollbar">
          {filteredProjects.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs flex flex-col items-center justify-center space-y-2">
              <Folder className="w-8 h-8 opacity-40 text-gray-400" />
              <p>{searchTerm ? 'ไม่พบโครงการที่ตรงกับคำค้นหา' : 'ยังไม่มีโครงการในระบบ'}</p>
            </div>
          ) : (
            filteredProjects.map((project, idx) => {
              const isActive = project.id === activeProjectId;
              const title = project.name || project.data.projectName || `โครงการที่ ${idx + 1}`;
              const contractNo = project.data.contractNo || 'ไม่ระบุเลขที่สัญญา';

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    onSelectProject(project.id);
                  }}
                  className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500/15 to-orange-600/5 border-orange-500/50 shadow-[0_4px_20px_rgba(249,115,22,0.15)] text-white'
                      : 'bg-[#1e1e1e] border-white/5 hover:border-white/20 text-gray-300 hover:text-white hover:bg-[#232323]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                          isActive
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-white/5 text-gray-400 group-hover:text-white'
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className={`font-semibold text-xs leading-snug line-clamp-2 ${isActive ? 'text-orange-200 font-bold' : 'text-gray-200'}`}>
                          {title}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1.5 truncate">
                          <FileText className="w-3 h-3 text-orange-400/80 shrink-0" />
                          <span>สัญญา: {contractNo}</span>
                        </p>
                      </div>
                    </div>

                    {/* Active Check Badge */}
                    {isActive && (
                      <span className="shrink-0 p-1 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40" title="โครงการปัจจุบัน">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Card Bottom / Actions */}
                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1.5 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-500" />
                      {project.updatedAt || 'อัปเดตล่าสุด'}
                    </span>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDeleteConfirm(project.id, e)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-all ${
                        deletingId === project.id
                          ? 'bg-red-500 text-white font-bold animate-pulse'
                          : 'text-gray-400 hover:text-red-400 hover:bg-red-500/10'
                      }`}
                      title={deletingId === project.id ? 'คลิกอีกครั้งเพื่อยืนยันการลบ' : 'ลบโครงการนี้'}
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>{deletingId === project.id ? 'ยืนยันลบ?' : 'ลบ'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer: Export/Import + Info */}
        <div className="p-3 border-t border-white/10 bg-[#151515] space-y-2">
          {/* Export / Import JSON Backup */}
          <div className="flex items-center gap-2">
            {onExportJson && (
              <button
                onClick={onExportJson}
                className="flex-1 py-2 px-2.5 bg-white/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl font-semibold text-[10px] text-emerald-300 flex items-center justify-center gap-1.5 transition-all"
                title="ส่งออกข้อมูลโครงการทั้งหมดเป็นไฟล์ JSON"
              >
                <Download className="w-3 h-3" />
                <span>Export</span>
              </button>
            )}
            {onImportJson && (
              <>
                <input
                  ref={importInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onImportJson(file);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  onClick={() => importInputRef.current?.click()}
                  className="flex-1 py-2 px-2.5 bg-white/5 hover:bg-blue-500/10 border border-blue-500/20 rounded-xl font-semibold text-[10px] text-blue-300 flex items-center justify-center gap-1.5 transition-all"
                  title="นำเข้าข้อมูลโครงการจากไฟล์ JSON"
                >
                  <Upload className="w-3 h-3" />
                  <span>Import</span>
                </button>
              </>
            )}
          </div>
          <p className="text-[10px] text-gray-500 text-center">
            ระบบจัดการหลายโครงการ (Multi-Project Support)
          </p>
        </div>
      </aside>
    </>
  );
};
