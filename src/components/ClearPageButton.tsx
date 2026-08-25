import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, X, Check } from 'lucide-react';
import { PAGE_NAMES_TH } from '../utils/pageResetHelpers';

interface ClearPageButtonProps {
  pageNumber: number;
  onClear: () => void;
  className?: string;
  variant?: 'compact' | 'normal';
}

export const ClearPageButton: React.FC<ClearPageButtonProps> = ({
  pageNumber,
  onClear,
  className = '',
  variant = 'normal',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [justCleared, setJustCleared] = useState(false);

  const pageTitle = PAGE_NAMES_TH[pageNumber] || `หน้า ${pageNumber}`;

  const handleConfirm = () => {
    onClear();
    setIsOpen(false);
    setJustCleared(true);
    setTimeout(() => {
      setJustCleared(false);
    }, 2500);
  };

  return (
    <>
      <button
        id={`btn-clear-page-${pageNumber}`}
        type="button"
        onClick={() => setIsOpen(true)}
        className={`neu-button px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer ${
          justCleared
            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
            : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
        } ${className}`}
        title={`ล้างข้อมูลเฉพาะ ${pageTitle}`}
      >
        {justCleared ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>ล้างข้อมูลแล้ว</span>
          </>
        ) : (
          <>
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>{variant === 'compact' ? 'ล้างหน้านี้' : 'ล้างข้อมูลหน้านี้'}</span>
          </>
        )}
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div
          id={`modal-confirm-clear-page-${pageNumber}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="neu-flat p-6 rounded-3xl max-w-md w-full border border-rose-500/20 shadow-2xl space-y-5 bg-[#1a1b1e]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0 border border-rose-500/20">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-100">
                    ยืนยันล้างข้อมูลหน้านี้
                  </h3>
                  <span className="neu-pill-inset inline-block text-xs font-semibold text-rose-400 px-2.5 py-0.5 mt-0.5 border border-rose-500/20">
                    {pageTitle}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="neu-button p-1.5 rounded-full text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              คุณต้องการล้างข้อมูลและช่องกรอกทั้งหมดใน <strong className="text-white">{pageTitle}</strong> ให้กลับเป็นค่าเริ่มต้นว่างเปล่าหรือไม่?
            </p>
            <div className="neu-pill-inset p-3 text-orange-300 text-xs border border-orange-500/20">
              💡 <strong>หมายเหตุ:</strong> ข้อมูลในหน้าอื่นๆ และข้อมูลโครงการหลักจะไม่ได้รับผลกระทบ
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="neu-button px-4 py-2 rounded-full text-xs font-bold text-slate-300 hover:bg-white/5 active:scale-95 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-4 py-2 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                ยืนยันล้างข้อมูลหน้านี้
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
