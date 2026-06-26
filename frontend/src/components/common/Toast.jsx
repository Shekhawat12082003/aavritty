import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

export default function Toast({ message, onClose, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-xl bg-green-600 px-4 py-3 text-white shadow-lg transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
      }`}
    >
      <CheckCircle className="h-5 w-5" />
      <span className="font-medium">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-2 hover:bg-green-700 rounded-full p-1"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
