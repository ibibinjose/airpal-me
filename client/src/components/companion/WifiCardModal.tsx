import React from "react";
import { useAirPal } from "../../contexts/AirPalContext";
import { Wifi, Copy, Check, X, QrCode, ShieldCheck, Zap } from "lucide-react";
import { toast } from "sonner";
import { CompanionSheet } from "./CompanionSheet";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const WifiCardModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { property, t } = useAirPal();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(property.wifi.password);
    setCopied(true);
    toast.success("Wi-Fi Password Copied", {
      description: "Password copied to clipboard. Ready to paste in device settings.",
    });
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <CompanionSheet isOpen={isOpen} variant="card">
      <div className="relative w-full max-w-sm rounded-3xl bg-[#fffdf9] border border-[#dde3db] p-6 text-[#16211c] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#5a6b62]"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-400/20">
            <Wifi size={24} />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-400">
              High-Speed Fibre
            </span>
            <h3 className="text-xl font-bold text-[#16211c]">Hotel Wi-Fi</h3>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="rounded-2xl bg-white border border-[#dde3db] p-3.5">
            <span className="block text-[11px] text-stone-400">Network Name (SSID)</span>
            <strong className="text-sm font-semibold tracking-wide text-[#16211c] font-mono">
              {property.wifi.network}
            </strong>
          </div>

          <div className="rounded-2xl bg-white border border-[#dde3db] p-3.5 flex items-center justify-between">
            <div>
              <span className="block text-[11px] text-stone-400">{t("wifiPassword")}</span>
              <strong className="text-base font-semibold tracking-wider text-[#c57a32] font-mono">
                {property.wifi.password}
              </strong>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-xs transition-all active:scale-95 shadow-sm"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? t("copied") : t("copy")}</span>
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-[#e8ece4] p-3 flex items-center gap-3 text-xs text-[#5a6b62]">
          <Zap size={16} className="text-[#2d7a55] flex-shrink-0" />
          <span>{property.wifi.speed} · No captive portal or room login required</span>
        </div>

        <div className="mt-5 pt-4 border-t border-[#dde3db] flex items-center justify-between text-[11px] text-stone-400">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-amber-400" /> WPA3 Secure Network
          </span>
          <span className="flex items-center gap-1">
            <QrCode size={13} /> Auto-Configured
          </span>
        </div>
      </div>
    </CompanionSheet>
  );
};
