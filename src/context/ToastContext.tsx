import { createContext, useContext, useState } from "react";

const ToastContext = createContext<(msg: string) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 1500);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded shadow-lg text-sm animate-fade-in-out z-50">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
