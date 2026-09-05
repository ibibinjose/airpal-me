import React from "react";
import { useAirPal } from "../../contexts/AirPalContext";
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  X,
  Hospital,
  Shield,
  Building,
  AlertTriangle,
  LifeBuoy,
} from "lucide-react";
import { SAFETY_AND_EMERGENCY_DATA } from "../../../../shared/airpal-data";
import { CompanionSheet } from "./CompanionSheet";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { property } = useAirPal();

  if (!isOpen) return null;

  return (
    <CompanionSheet isOpen={isOpen}>
      <div className="relative flex flex-col h-full min-h-0 bg-[#fffdf8] text-[#16211c] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dde3db] bg-[#fde8e6]">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center w-10 h-10 rounded-2xl bg-red-500 text-[#16211c] font-bold shadow-md shadow-red-500/30">
              <ShieldAlert size={22} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-red-400">
                Safety & Emergency
              </span>
              <h3 className="text-lg font-bold text-[#16211c]">Emergency Assistance</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close safety modal"
            className="grid place-items-center w-8 h-8 rounded-full bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#5a6b62]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Hotel Emergency Card */}
          <div className="rounded-2xl bg-[#fde8e6] border border-red-500/20 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#b42318] uppercase tracking-wide flex items-center gap-1.5">
                <Building size={14} /> In-Hotel Emergency
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#fadad6] text-[#b42318]">
                Available 24/7
              </span>
            </div>
            <p className="text-xs text-[#5a6b62]">
              For any urgent in-house security, medical, or fire issue:
            </p>
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <a
                href={`tel:${SAFETY_AND_EMERGENCY_DATA.hotelEmergency.directEmergencyNumber}`}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-[#16211c] font-semibold text-xs transition-all active:scale-95 shadow"
              >
                <PhoneCall size={14} />
                <span>Duty Manager Emergency</span>
              </a>
              <div className="flex items-center justify-center py-2 px-3 rounded-xl bg-white text-[#5a6b62] font-mono text-xs">
                {SAFETY_AND_EMERGENCY_DATA.hotelEmergency.frontDeskInternal}
              </div>
            </div>
          </div>

          {/* Assembly Point */}
          <div className="rounded-2xl bg-white border border-[#dde3db] p-4 space-y-1.5">
            <span className="text-xs font-semibold text-[#c57a32] flex items-center gap-1.5">
              <MapPin size={14} /> Evacuation Assembly Point
            </span>
            <p className="text-xs text-[#5a6b62]">
              {SAFETY_AND_EMERGENCY_DATA.hotelEmergency.assemblyPoint}
            </p>
            <span className="block text-[11px] text-stone-400">
              Defibrillator available at: {SAFETY_AND_EMERGENCY_DATA.hotelEmergency.defibrillatorLocation}
            </span>
          </div>

          {/* Destination Emergency Numbers */}
          <div>
            <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2.5">
              Destination Australian Emergency Services
            </h4>
            <div className="space-y-2">
              {SAFETY_AND_EMERGENCY_DATA.destinationEmergency.map((srv, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-[#dde3db] text-xs"
                >
                  <div className="space-y-0.5">
                    <strong className="block text-[#16211c] font-medium">{srv.name}</strong>
                    <span className="text-[11px] text-stone-400">{srv.desc}</span>
                  </div>
                  <a
                    href={`tel:${srv.phone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f1f5f0] hover:bg-[#e7eee8] text-[#c57a32] font-mono font-bold whitespace-nowrap transition-all active:scale-95"
                  >
                    <PhoneCall size={12} />
                    <span>{srv.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CompanionSheet>
  );
};
