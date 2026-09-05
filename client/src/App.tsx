import React, { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { AirPalProvider, useAirPal, type QrType } from "./contexts/AirPalContext";
import { DeviceFrameSwitcher } from "./components/DeviceFrameSwitcher";
import { GuestCompanion } from "./pages/GuestCompanion";
import { HostDashboard } from "./pages/HostDashboard";
import Home from "./pages/Home";
import { isNativeShell } from "./lib/platform";

function parseQrType(value: string | null): QrType | null {
  if (value === "room" || value === "property" || value === "dining" || value === "experience" || value === "emergency") {
    return value;
  }
  return null;
}

function GuestRoute() {
  const { setQrType, setRoomNumber, setDeviceMode } = useAirPal();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const qr = parseQrType(params.get("type"));
    const room = params.get("room");
    if (qr) setQrType(qr);
    if (room) setRoomNumber(room);
    if (isNativeShell()) setDeviceMode("responsive");
  }, [setQrType, setRoomNumber, setDeviceMode]);

  return <GuestCompanion />;
}

function MainApp() {
  const [location, setLocation] = useLocation();
  const native = isNativeShell();
  const showChrome = !native;

  const activeView = location.startsWith("/host")
    ? "dashboard"
    : location.startsWith("/stay") || location.startsWith("/g/")
      ? "companion"
      : native
        ? "companion"
        : "landing";

  useEffect(() => {
    if (native && location === "/") setLocation("/stay");
  }, [native, location, setLocation]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f8f4] text-[#16211c] font-sans antialiased">
      {showChrome && (
        <DeviceFrameSwitcher
          activeView={activeView}
          onViewChange={(view) => {
            if (view === "companion") setLocation("/stay");
            else if (view === "dashboard") setLocation("/host");
            else setLocation("/");
          }}
        />
      )}
      <div className="flex-1">
        <Switch>
          <Route path="/host" component={HostDashboard} />
          <Route path="/stay" component={GuestRoute} />
          <Route path="/g/:propertyId" component={GuestRoute} />
          <Route path="/">{native ? <GuestRoute /> : <Home />}</Route>
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AirPalProvider>
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <MainApp />
        </TooltipProvider>
      </AirPalProvider>
    </ErrorBoundary>
  );
}

export default App;
