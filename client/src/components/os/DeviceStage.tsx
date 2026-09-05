import React from "react";
import type { DeviceMode } from "../../contexts/AirPalContext";

export function DeviceStage({ mode, children }: { mode: DeviceMode; children: React.ReactNode }) {
  const stage = (frame: React.ReactNode) => (
    <div className="ap-stage h-full min-h-0 overflow-hidden flex items-center justify-center p-4 sm:p-6">
      {frame}
    </div>
  );

  if (mode === "iphone") {
    return stage(
      <div className="relative w-[min(390px,100%)] h-full max-h-[820px] rounded-[46px] border-[9px] border-[#1c2721] bg-[#f9f8f4] shadow-[0_30px_80px_#3d534428] overflow-hidden flex flex-col">
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-[#111] rounded-full z-50 pointer-events-none" />
        <div className="flex-1 min-h-0 overflow-hidden pt-7">{children}</div>
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-[#16211c]/18 rounded-full z-50 pointer-events-none" />
      </div>,
    );
  }
  if (mode === "android") {
    return stage(
      <div className="relative w-[min(380px,100%)] h-full max-h-[820px] rounded-[36px] border-[7px] border-[#222c26] bg-[#f9f8f4] shadow-[0_30px_80px_#3d534428] overflow-hidden flex flex-col">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#111] rounded-full z-50 pointer-events-none" />
        <div className="flex-1 min-h-0 overflow-hidden pt-6">{children}</div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#16211c]/20 rounded-full z-50 pointer-events-none" />
      </div>,
    );
  }
  if (mode === "tablet") {
    return stage(
      <div className="relative w-[min(700px,100%)] h-full max-h-[860px] rounded-[32px] border-[12px] border-[#1c2621] bg-[#f9f8f4] shadow-[0_30px_80px_#3d534428] overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      </div>,
    );
  }
  return (
    <div className="ap-stage h-full min-h-0 flex justify-center">
      <div className="w-full max-w-[440px] h-full min-h-0 bg-[#f9f8f4] shadow-[0_20px_60px_#3d53441c]">{children}</div>
    </div>
  );
}
