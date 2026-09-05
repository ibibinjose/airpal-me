import React from "react";

interface MarkProps {
  size?: number;
  className?: string;
}

export function AirPalMark({ size = 28, className = "" }: MarkProps) {
  return (
    <img
      src="/logo-mark.png"
      alt=""
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}

export function AirPalLogo({
  size = 28,
  wordmark = true,
  inverse = false,
  compact = false,
  className = "",
}: MarkProps & { wordmark?: boolean; inverse?: boolean; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 min-w-0 ${className}`}>
      <span className="grid place-items-center shrink-0 overflow-hidden rounded-xl bg-white">
        <AirPalMark size={size} />
      </span>
      {wordmark && (
        <span className={`font-bold tracking-tight leading-none ${compact ? "hidden sm:inline" : ""} ${inverse ? "text-[#f7f5eb]" : "text-[#16211c]"}`}>
          AirPal<span className={inverse ? "text-white/70" : "text-[#0050d8]"}>.me</span>
        </span>
      )}
    </span>
  );
}

export function AirPalLockup({ className = "", alt = "AirPal.me — Travel smarter together" }: { className?: string; alt?: string }) {
  return <img src="/logo.jpg" alt={alt} className={`object-contain ${className}`} />;
}
