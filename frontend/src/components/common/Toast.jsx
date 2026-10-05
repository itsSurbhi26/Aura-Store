import React from 'react';
import { useCart } from '../../context/CartContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast } = useCart();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
  };

  const borderColors = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-900',
    error: 'border-rose-200 bg-rose-50/90 text-rose-900',
    info: 'border-sky-200 bg-sky-50/90 text-sky-900',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all transform animate-bounce-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-md ${
          borderColors[toast.type] || borderColors.success
        }`}
      >
        {icons[toast.type] || icons.success}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
