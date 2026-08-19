import React, { useState } from "react";
import { Lock, Key, X, ArrowRight } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const enteredPassword = typeof password === "string" ? password.trim() : String(password || "").trim();

    if (enteredPassword === "bhagwan") {
      setIsLoading(false);
      setPassword("");
      onSuccess();
    } else {
      setIsLoading(false);
      setErrorMsg("Invalid Admin Password");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-[#152C22] text-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-white/10 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setPassword("");
            setErrorMsg(null);
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-[#FF5500] text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Badge */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FF5500]/20 border border-[#FF5500]/40 text-[#FF5500] flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-['Montserrat',sans-serif] tracking-tight">
            Admin Portal Login
          </h3>
          <p className="text-xs text-white/70">
            Enter administrator master password to access dashboard controls.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {errorMsg && (
            <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs p-3 rounded-xl">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-white/80 mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                className="w-full bg-black/40 border border-white/15 focus:border-[#FF5500] focus:ring-1 focus:ring-[#FF5500] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-colors"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FF5500] hover:bg-[#e04b00] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-orange-500/30 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
