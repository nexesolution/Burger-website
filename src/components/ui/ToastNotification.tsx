import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useBuzzStore } from '../../store/useBuzzStore';

export const ToastNotification: React.FC = () => {
  const toastMessage = useBuzzStore((state) => state.toastMessage);
  const clearToast = useBuzzStore((state) => state.clearToast);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl glass-panel shadow-buzz-glow text-white border border-buzz-yellow/40 max-w-md"
        >
          {toastMessage.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-buzz-yellow flex-shrink-0" />
          )}
          {toastMessage.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          {toastMessage.type === 'info' && (
            <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />
          )}
          
          <span className="text-sm font-medium pr-2">{toastMessage.text}</span>

          <button
            onClick={clearToast}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors ml-auto"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
