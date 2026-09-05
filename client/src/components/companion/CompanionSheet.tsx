import React from "react";

interface Props {
  isOpen: boolean;
  children: React.ReactNode;
  variant?: "sheet" | "card";
}

export function CompanionSheet({ isOpen, children, variant = "sheet" }: Props) {
  if (!isOpen) return null;

  if (variant === "card") {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#15241c]/45 backdrop-blur-sm animate-in fade-in">
        {children}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex min-h-0 flex-col overflow-hidden bg-[#f9f8f4] animate-in fade-in">
      {children}
    </div>
  );
}
