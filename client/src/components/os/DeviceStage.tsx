import React from "react";
import type { DeviceMode } from "../../contexts/AirPalContext";

export function DeviceStage({ mode, children }: { mode: DeviceMode; children: React.ReactNode }) {
  const stage = (frame: React.ReactNode) => (
    <div className="h-full min-h-0 overflow-hidden bg-[#e8eee8] flex items-center justify-center p-3 sm:p-4">
      {frame}
    </div>
  );

  if (mode === "iphone") {
    return stage(
      <div className="relative w-[min(385px,100%)] h-full max-h-[810px] rounded-[52px] border-[10px] border-[#202d26] bg-[#f9f8f4] shadow-[20px_28px_70px_#5d765b2c] overflow-hidden flex flex-col">
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#111] rounded-full z-50 pointer-events-none" />
        <div className="flex-1 min-h-0 overflow-hidden pt-7">{children}</div>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#16211c]/20 rounded-full z-50 pointer-events-none" />
      </div>,
    );
  }
  if (mode === "android") {
    return stage(
      <div className="relative w-[min(380px,100%)] h-full max-h-[810px] rounded-[40px] border-[8px] border-[#252f28] bg-[#f9f8f4] shadow-[20px_28px_70px_#5d765b2c] overflow-hidden flex flex-col">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-[#111] rounded-full z-50 pointer-events-none" />
        <div className="flex-1 min-h-0 overflow-hidden pt-6">{children}</div>
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#16211c]/25 rounded-full z-50 pointer-events-none" />
      </div>,
    );
  }
  if (mode === "tablet") {
    return stage(
      <div className="relative w-[min(680px,100%)] h-full max-h-[850px] rounded-[36px] border-[14px] border-[#1e2621] bg-[#f9f8f4] shadow-[20px_28px_70px_#5d765b2c] overflow-hidden flex flex-col">
        <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
      </div>,
    );
  }
  return (
    <div className="h-full min-h-0 bg-[#e8eee8] flex justify-center">
      <div className="w-full max-w-[440px] h-full min-h-0 bg-[#f9f8f4] shadow-2xl">{children}</div>
    </div>
  );
}
